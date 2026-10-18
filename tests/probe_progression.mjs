// Does the engine ever actually add weight to the bar?
//
// This is the check that did not exist, which is why the answer was "no" for
// 61 of the 84 loadable exercises in the plans and nobody noticed for months.
// `prescribe()` had no test of any kind: the audits read the catalogue, the
// unit tests read calcNutrition, and the render probes only asked whether a
// day drew itself.
//
// The failure it guards is not a crash and not a wrong number on screen — it
// is a plan that quietly stops progressing. The only way to see that is to
// play a block forward, so this drives the real engine in a real browser off
// real pf_setlog2 history. Each simulated week: ask prescribe() what to do,
// have a modelled trainee do it, write the session back to the log, advance a
// week. The trainee is cooperative — on every set they do the lesser of what
// the card asked for and what their strength allows (Epley) — so if they never
// reach a heavier bar, that is the engine's doing and not theirs.
import { launch, available } from './pw.mjs';
import { serve } from './serve.mjs';

const WEEKS = 20;
const GROWTH = 0.007;   // 1RM per week for the improving trainee

// key, starting load, starting 1RM, weekly strength gain.
// The loads are chosen to sit under each exercise's old refusal threshold
// (step × 20 — 100kg for the squat and deadlift, 50kg for most of the
// catalogue, 40kg for dumbbells), because that is where the engine used to
// stop. A trainee already above it never saw the bug.
const IMPROVING = [
  ['squat', 80, 110], ['benchPress', 60, 82], ['deadlift', 100, 140],
  ['ohp', 40, 55], ['lateralRaise', 10, 18], ['legExt', 45, 70],
  ['triPushdown', 30, 48], ['bentRow', 60, 85], ['legPress', 120, 170],
  ['cableRow', 50, 72], ['inclineBench', 50, 70], ['legCurl', 35, 52],
];
// Not getting stronger. These must be backed off, not pushed — the backoff
// rule is the thing most easily broken by unblocking the jump.
const FLAT = [['squat', 90, 108], ['triPushdown', 35, 47]];

export async function progressionProbe() {
  if (!await available()) return { skipped: true, checks: 0, problems: [], errors: [] };
  const server = await serve();
  const port = server.address().port;
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errors = [], problems = [];
  page.on('pageerror', e => errors.push('PAGE: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

  try {
    await page.goto('http://localhost:' + port + '/index.html', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('pf_users', JSON.stringify([{
        id: 'u1', name: 'sim', weight: 78, height: 178, age: 31, gender: 'm', activity: 1.55,
        goal: 'lean_bulk', workout_freq: 4, workout_split: '4ant', workout_location: 'gym', meal_count: 5,
      }]));
      localStorage.setItem('pf_active_user_id', 'u1');
      localStorage.setItem('pf_onboarded', '1');
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    const run = subjects => page.evaluate(async ([subjects, weeks, growth]) => {
      const repsAt = (oneRM, kg) => Math.max(0, Math.min(30, Math.floor(30 * (oneRM / kg - 1))));
      const dayKey = back => {
        const d = new Date(); d.setDate(d.getDate() - back);
        const p = x => String(x).padStart(2, '0');
        return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
      };
      const out = [];
      for (const [key, kg0, rm0] of subjects) {
        const ex = window.EX[key] || {};
        const range = window._repRange(ex);
        let oneRM = rm0, kg = kg0, states = {};
        const log = {};
        log[key] = [{ date: dayKey(7), sets: Array.from({ length: 3 }, () => ({ kg: kg0, reps: range.max })) }];
        localStorage.setItem('pf_setlog2', JSON.stringify(log));
        for (let w = 1; w <= weeks; w++) {
          const p = window.prescribe(key);
          const askKg = p.kg == null ? kg : p.kg;
          const did = Math.max(1, Math.min(p.repHigh || range.max, repsAt(oneRM, askKg)));
          states[p.state] = 1;
          kg = askKg;
          const cur = JSON.parse(localStorage.getItem('pf_setlog2') || '{}');
          const arr = (cur[key] || []).slice();
          arr.unshift({ date: dayKey(0), sets: Array.from({ length: 3 }, () => ({ kg: askKg, reps: did })) });
          cur[key] = arr.slice(0, 12).map((e, i) => ({ ...e, date: dayKey(i * 7 + 1) }));
          localStorage.setItem('pf_setlog2', JSON.stringify(cur));
          oneRM *= 1 + growth;
        }
        out.push({ key, step: window._loadStep(ex), kg0, kgEnd: kg, states: Object.keys(states) });
      }
      return out;
    }, [subjects, WEEKS, subjects === FLAT ? 0 : GROWTH]);

    // ── a trainee who gets stronger must end up lifting more ────────────────
    const up = await run(IMPROVING);
    for (const r of up) {
      if (!r.step) continue;   // bodyweight and bands progress on reps by design
      if (r.kgEnd <= r.kg0)
        problems.push(r.key + ': ' + WEEKS + ' weeks of a trainee gaining ' +
          (GROWTH * 100).toFixed(1) + '%/week and the bar never moved off ' + r.kg0 + 'kg' +
          (r.states.includes('addreps') ? ' — stuck in addreps, the widened range has no exit' : ''));
    }

    // ── and a trainee who does not must not be pushed ───────────────────────
    const flat = await run(FLAT);
    for (const r of flat) {
      if (r.kgEnd > r.kg0)
        problems.push(r.key + ' (no strength gain): the engine still added weight, ' +
          r.kg0 + ' → ' + r.kgEnd + 'kg. The backoff rule is not firing.');
      if (!r.states.includes('backoff'))
        problems.push(r.key + ' (no strength gain): never backed off in ' + WEEKS +
          ' weeks — states seen: ' + r.states.join(','));
    }
    return { skipped: false, checks: up.length + flat.length, problems, errors, up, flat };
  } finally {
    await browser.close();
    server.close();
  }
}
