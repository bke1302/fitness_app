// The rendered checks: for every plan the settings can produce, every
// scheduled day must render its table and every exercise modal must be whole.
//
// This is the coarse net. It does not know what a good workout looks like —
// the data audits do that — but it catches the class of failure that only
// appears once the page is built: a day that resolves to nothing, a modal
// missing its figures, a script error on one plan and not another.
import { launch, available } from './pw.mjs';
import { serve } from './serve.mjs';

const CONFIGS = [
  [4, '4ant'], [4, '4ab'], [4, null], [3, '3ss'], [3, '3ab'], [3, null],
  [2, null], [1, null], [5, null], [6, null], [7, null],
];

export async function smoke() {
  // Without a browser there is nothing to render. Say so and let the data
  // audits stand on their own rather than failing the whole run.
  if (!await available()) return { skipped: true, configs: 0, problems: [], errors: [] };
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
    for (const [freq, split] of CONFIGS) {
      await page.evaluate(([f, s]) => {
        localStorage.setItem('pf_users', JSON.stringify([{
          id: 'u1', name: 'בדיקה', weight: 78, height: 178, age: 31, calories: 3052,
          goal: 'lean_bulk', activity: 1.55, gender: 'm', workout_time: '18:00',
          meal_count: 5, workout_freq: f, workout_split: s, workout_location: 'gym',
        }]));
        localStorage.setItem('pf_active_user_id', 'u1');
        localStorage.setItem('pf_onboarded', '1');
      }, [freq, split]);
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(700);

      const r = await page.evaluate(async () => {
        const out = { empty: [], modals: [] };
        const u = window.getActiveUser();
        const plan = window._resolvePlan(u), cfg = window._buildDayCfg(u);
        for (const dow of Object.keys(cfg)) {
          const pid = cfg[dow].panel;
          window.showPanel(pid, null);
          await new Promise(r => setTimeout(r, 120));
          if (!document.querySelectorAll('#panel-' + pid + ' .ex-table tbody tr').length) out.empty.push(pid);
        }
        for (const d of plan.days) for (const k of d.exercises) {
          window.openModal(k);
          await new Promise(r => setTimeout(r, 5));
          const figs = document.querySelectorAll('#m-muscles svg').length;
          const cards = document.querySelectorAll('#m-demo .demo-card').length;
          if (figs !== 2 || cards !== 3) out.modals.push(k + ' (figures ' + figs + ', cards ' + cards + ')');
          window.closeModal();
        }
        return out;
      });
      const tag = 'freq ' + freq + '/' + (split || 'default');
      r.empty.forEach(p => problems.push(tag + ': היום ' + p + ' מרנדר ריק'));
      r.modals.forEach(m => problems.push(tag + ': חלון התרגיל לא שלם — ' + m));
    }
  } finally {
    await browser.close();
    server.close();
  }
  return { configs: CONFIGS.length, problems, errors };
}
