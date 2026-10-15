// Weekly volume, duplicates, A/B variance and referential integrity.
//
// Fractional counting: a category naming two muscles gives 1.0 to the first and
// 0.5 to the second. Chest presses credit half a set to triceps and front
// delts — crediting rows with half a biceps set while not doing the same on the
// pressing side understates one half of the body.
import { EX, PLANS, setCount, weekFreq } from './catalogue.mjs';

const MAP = {
  'חזה': { chest: 1 }, 'חזה עליון': { chest: 1 }, 'חזה תחתון': { chest: 1 },
  'גב רחב': { back: 1, biceps: .5 }, 'גב אמצעי': { back: 1, biceps: .5 },
  'גב עבה': { back: 1, biceps: .5 }, 'גב עליון + עובי': { back: 1, biceps: .5 },
  'גב תחתון + ירך אחורי': { back: .5, hams: 1 },
  'כתפיים': { sideDelt: .5, frontDelt: 1, triceps: .5 },
  'כל הכתף': { sideDelt: .5, frontDelt: 1, triceps: .5 },
  'כתף אמצעית': { sideDelt: 1 }, 'כתף קדמית': { frontDelt: 1 }, 'כתף אחורית': { rearDelt: 1 },
  'טריצפס': { triceps: 1 }, 'טריצפס — ראש ארוך': { triceps: 1 },
  'בייסס': { biceps: 1 }, 'בייסס — ראש ארוך': { biceps: 1 },
  'בראכיאליס': { biceps: 1, forearms: .5 }, 'אמות': { forearms: 1 },
  'ארבע ראשי': { quads: 1 }, 'ירכיים': { quads: 1, glutes: .5 },
  'ירכיים + ישבן': { quads: 1, glutes: .5 }, 'ישבן + ירכיים': { glutes: 1, quads: .5 },
  'ישבן': { glutes: 1 }, 'ירך אחורי': { hams: 1 },
  'כל הרגל': { quads: 1, glutes: .5, hams: .5 }, 'כל הגוף': { hams: 1, glutes: .5, back: .5 },
  'מקרבים': { adductors: 1 }, 'שוק': { calves: 1 }, 'שוק — סוליאוס': { calves: 1 },
  'ליבה': { core: 1 }, 'אחיזה + ליבה': { forearms: 1, core: .5 },
};
// Weekly direct sets: under the first a muscle does not grow, over the second
// the volume costs more recovery than it buys.
export const LAND = {
  chest: [10, 22], back: [10, 25], quads: [8, 20], hams: [6, 20], glutes: [4, 16],
  sideDelt: [8, 26], frontDelt: [0, 16], rearDelt: [6, 24], biceps: [8, 26],
  triceps: [6, 24], calves: [8, 20], core: [0, 25], forearms: [0, 20], adductors: [0, 12],
};
export const HE = {
  chest: 'חזה', back: 'גב', quads: 'ארבע ראשי', hams: 'ירך אחורי', glutes: 'ישבן',
  sideDelt: 'כתף אמצעית', frontDelt: 'כתף קדמית', rearDelt: 'כתף אחורית',
  biceps: 'יד קדמית', triceps: 'יד אחורית', calves: 'שוק', core: 'ליבה',
  forearms: 'אמות', adductors: 'מקרבים',
};
// Shortfalls that the equipment makes unavoidable, named one by one so the
// check still fires on anything new. Bodyweight-only has no lateral raise
// and no curl; adding one would mean adding equipment, not reordering.
const ALLOWED = { home_bw3: ['כתף אמצעית', 'יד קדמית'] };

const isPress = ex => /press|push|dip/i.test(ex.en || '') && !/fly|flye|pec deck/i.test(ex.en || '');
const muscles = ex => {
  const m = MAP[ex.cat];
  if (!m) return null;
  return /^חזה/.test(ex.cat) && isPress(ex) ? Object.assign({}, m, { triceps: .5, frontDelt: .5 }) : m;
};

export function auditVolume() {
  const rows = [], unmapped = new Set();
  for (const pk in PLANS) {
    const plan = PLANS[pk], freq = weekFreq(plan), vol = {};
    (plan.days || []).forEach((d, i) => {
      if (!freq[i]) return;
      (d.exercises || []).forEach(k => {
        const ex = EX[k]; if (!ex) return;
        const m = muscles(ex);
        if (!m) { unmapped.add(ex.cat); return; }
        const n = setCount(ex);
        for (const mus in m) vol[mus] = (vol[mus] || 0) + n * m[mus] * freq[i];
      });
    });
    const under = [], over = [];
    for (const mus in LAND) {
      const v = vol[mus] || 0, mev = LAND[mus][0], mrv = LAND[mus][1];
      if (mev > 0 && v < mev) under.push(HE[mus] + ' ' + v + '/' + mev);
      if (v > mrv) over.push(HE[mus] + ' ' + v + '/' + mrv);
    }
    // One or two sessions a week cannot reach MEV for most muscles. That is the
    // frequency the lifter chose, not a fault in the plan.
    const days = (plan.dows || []).length;
    // Bodyweight-only has no lateral raise and no curl, so side delts and
    // biceps cannot reach MEV in that plan however it is written. Accepted by
    // name rather than by loosening the landmark, so the check still fires if
    // anything else in that plan drops below the line.
    const accepted = ALLOWED[pk] || [];
    rows.push({
      plan: pk, days, vol, over,
      under: under.filter(u => !accepted.some(a => u.startsWith(a))),
      inherent: days <= 2,
      accepted: under.filter(u => accepted.some(a => u.startsWith(a))),
    });
  }
  return { rows, unmapped: [...unmapped] };
}

/** Redundancy, which is not the same thing as repetition.
 *
 *  The same exercise on two different days is frequency, and frequency is the
 *  point — a muscle trained twice a week beats once at matched volume. The
 *  defects are an exercise listed twice in a single session, and two catalogue
 *  keys for one movement inside the same week, which reads as variety and is
 *  not. The second is how triPushdown and ropePushdown — both "Rope Tricep
 *  Pushdown" — once ended up in one week. */
export function auditDuplicates() {
  const out = [];
  for (const pk in PLANS) {
    const seenEn = {};
    (PLANS[pk].days || []).forEach(d => {
      const inDay = {};
      (d.exercises || []).forEach(k => {
        const ex = EX[k]; if (!ex) return;
        if (inDay[k]) out.push(pk + '/' + d.shortLabel + ': ' + ex.name + ' מופיע פעמיים באותו אימון');
        inDay[k] = 1;
        const en = (ex.en || '').toLowerCase();
        if (en && seenEn[en] && seenEn[en] !== k)
          out.push(pk + ': ' + seenEn[en] + ' ו-' + k + ' הם אותו תרגיל ("' + ex.en + '")');
        if (en) seenEn[en] = k;
      });
    });
  }
  return out;
}

/** Days labelled as variants of each other must not be the same workout twice.
 *  A template that runs more than once a week is 100% identical by definition. */
// Overlaps that are open work rather than regressions, listed pair by pair so a
// new overlap anywhere — including a new one in these same plans — still fails.
// Empty: the home plans' bodyweight/band/db catalogue grew enough to give every
// variant day its own identity.
const KNOWN_OVERLAP = {};

export function auditVariants(limit = 50) {
  const out = [];
  out.known = [];
  const base = l => String(l || '').replace(/[אבג]׳/g, '').replace(/—.*/, '').trim();
  for (const pk in PLANS) {
    const d = PLANS[pk].days || [], freq = weekFreq(PLANS[pk]);
    d.forEach((x, i) => {
      if (freq[i] > 1) out.push(pk + ': ' + (x.shortLabel || x.label) +
        ' רץ ' + freq[i] + ' פעמים בשבוע — אותו אימון בדיוק');
    });
    for (let i = 0; i < d.length; i++) for (let j = i + 1; j < d.length; j++) {
      if (base(d[i].label) !== base(d[j].label)) continue;
      const A = new Set(d[i].exercises), B = new Set(d[j].exercises);
      const same = [...A].filter(k => B.has(k));
      const pct = Math.round(same.length / Math.max(A.size, B.size) * 100);
      if (pct < limit) continue;
      const known = (KNOWN_OVERLAP[pk] || []).includes(d[i].shortLabel + '|' + d[j].shortLabel);
      (known ? out.known : out).push(pk + ': ' + d[i].shortLabel + ' ו-' + d[j].shortLabel +
        ' חולקים ' + pct + '% מהתרגילים');
    }
  }
  return out;
}

/** Every exercise a plan names must exist and carry the fields the UI reads. */
export function auditIntegrity() {
  const out = [];
  const REQUIRED = ['name', 'en', 'cat', 'sets', 'rest', 'lvl', 'desc', 'muscles', 'tips'];
  for (const pk in PLANS) (PLANS[pk].days || []).forEach(d => (d.exercises || []).forEach(k => {
    if (!EX[k]) out.push(pk + '/' + d.shortLabel + ': אין תרגיל בשם ' + k);
  }));
  for (const k in EX)
    REQUIRED.filter(f => EX[k][f] === undefined).forEach(f => out.push(k + ': חסר השדה ' + f));
  return out;
}
