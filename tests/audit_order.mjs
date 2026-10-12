// Exercise order inside each training day.
//
// Two earlier rules were deleted rather than tuned, because they flagged good
// programming: "muscle scattered" fired on shoulders at positions 2, 5 and 6 of
// a push day — press first, raises after, which is correct — and "two heavy
// lifts in a row" fired on squat into bench press, which contend for nothing.
// Together they produced 39 of 51 flags. What remains fires only on real cost.
import { EX, PLANS, FAM, isHeavy, isCompound } from './catalogue.mjs';

const SPINAL = /squat|deadlift|romanian|bent-over|bent over|good morning|overhead press/i;
const isSpinal = ex => SPINAL.test(ex.en || '') && isHeavy(ex);

export function auditOrder() {
  const out = [];
  const add = (plan, day, sev, rule, text) => out.push({ plan, day, sev, rule, text });

  for (const pk in PLANS) for (const d of PLANS[pk].days || []) {
    const ex = (d.exercises || []).map(k => EX[k]).filter(Boolean);
    if (ex.length < 2) continue;
    const label = d.shortLabel || d.label;

    // the day opens with its most demanding lift, while the lifter is fresh
    const heavy = ex.map((x, i) => isHeavy(x) ? i : -1).filter(i => i >= 0);
    if (heavy.length && heavy[0] > 1)
      add(pk, label, 'high', 'כבד לא ראשון',
        ex[heavy[0]].name + ' הוא הכבד ביותר ומגיע במקום ' + (heavy[0] + 1));

    // an isolation that tires a muscle before the compound that needs it
    for (let i = 0; i < ex.length; i++) {
      if (isCompound(ex[i])) continue;
      for (let j = i + 1; j < ex.length; j++)
        if (isCompound(ex[j]) && FAM(ex[j].cat) === FAM(ex[i].cat))
          add(pk, label, 'high', 'בידוד לפני מורכב',
            ex[i].name + ' (' + (i + 1) + ') לפני ' + ex[j].name + ' (' + (j + 1) + ')');
    }

    // two heavy lifts adjacent that actually contend
    for (let i = 0; i + 1 < ex.length; i++) {
      const a = ex[i], b = ex[i + 1];
      if (!isHeavy(a) || !isHeavy(b)) continue;
      const sameMuscle = FAM(a.cat) === FAM(b.cat);
      if (!sameMuscle && !(isSpinal(a) && isSpinal(b))) continue;
      add(pk, label, 'med', sameMuscle ? 'שני כבדים לאותו שריר' : 'שני כבדים על הגב',
        a.name + ' ואז ' + b.name);
    }

    // a braced trunk is the limit on these; tiring it first is a safety matter
    ex.forEach((x, ci) => {
      if (FAM(x.cat) !== 'ליבה') return;
      for (let j = ci + 1; j < ex.length; j++)
        if (isSpinal(ex[j]))
          add(pk, label, 'high', 'ליבה לפני עומס על הגב',
            x.name + ' (' + (ci + 1) + ') לפני ' + ex[j].name + ' (' + (j + 1) + ')');
    });

    // load trends down across a session; it should not climb back up
    const climb = ex.findIndex((x, i) =>
      i > 0 && isHeavy(x) && ex.slice(0, i).some(y => !isCompound(y)));
    if (climb > 0)
      add(pk, label, 'med', 'כבד אחרי בידוד',
        ex[climb].name + ' (' + (climb + 1) + ') אחרי תרגילי בידוד');
  }
  return out;
}
