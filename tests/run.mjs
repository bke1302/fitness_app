// One command for the whole safety net: node tests/run.mjs
//
// Data audits first, because they need no browser and catch the cheapest
// mistakes. Then the rendered checks, which start their own server so nothing
// outside this repo has to be running.
import { auditOrder } from './audit_order.mjs';
import { auditExercises } from './audit_exercises.mjs';
import { auditVolume, auditDuplicates, auditVariants, auditIntegrity, HE } from './audit_plans.mjs';
import { EX, PLANS } from './catalogue.mjs';
import { smoke } from './probe_smoke.mjs';

let failed = 0;
const pass = m => console.log('  PASS  ' + m);
const fail = (m, lines) => { failed++; console.log('  FAIL  ' + m); (lines || []).forEach(l => console.log('        ' + l)); };

console.log('\n── הקטלוג ──');
const days = Object.values(PLANS).reduce((n, p) => n + (p.days || []).length, 0);
const refs = Object.values(PLANS).reduce((n, p) =>
  n + (p.days || []).reduce((m, d) => m + (d.exercises || []).length, 0), 0);
console.log('  ' + Object.keys(EX).length + ' תרגילים · ' + Object.keys(PLANS).length +
            ' תוכניות · ' + days + ' ימי אימון · ' + refs + ' הפניות');

const integrity = auditIntegrity();
integrity.length ? fail('שלמות הקטלוג', integrity) : pass('שלמות הקטלוג — אין הפניה שבורה, אין שדה חסר');

console.log('\n── מרשם התרגילים ──');
const rx = auditExercises();
rx.length
  ? fail(rx.length + ' ממצאי מרשם', rx.map(f => '[' + f.key + '] ' + f.rule + ': ' + f.text))
  : pass('טווח חזרות, מנוחה ותיאור מתאימים לכל ' + Object.keys(EX).length + ' התרגילים');

console.log('\n── סדר התרגילים ──');
const order = auditOrder();
order.length
  ? fail(order.length + ' ממצאי סדר', order.map(f => '[' + f.plan + '/' + f.day + '] ' + f.rule + ': ' + f.text))
  : pass('כל ' + days + ' ימי האימון נקיים');

console.log('\n── תרגילים כפולים ──');
const dups = auditDuplicates();
dups.length ? fail(dups.length + ' כפילויות', dups) : pass('אין תרגיל שחוזר פעמיים באותו שבוע');

console.log('\n── ימי א׳ מול ב׳ ──');
const variants = auditVariants();
variants.length
  ? fail(variants.length + ' ימים שמתיימרים להיות שונים', variants)
  : pass('כל זוג וריאציות חולק פחות מחצי מהתרגילים');
(variants.known || []).forEach(k => console.log('        (פתוח ומתוכנן: ' + k + ')'));

console.log('\n── נפח שבועי ──');
const { rows, unmapped } = auditVolume();
if (unmapped.length) fail('קטגוריות שלא נספרות', unmapped);
const bad = rows.filter(r => !r.inherent && (r.under.length || r.over.length));
bad.length
  ? fail(bad.length + ' תוכניות מחוץ לטווח',
         bad.map(r => r.plan + ': ' + (r.under.length ? 'מתחת ל-MEV ' + r.under.join(', ') : '') +
                      (r.over.length ? '  מעל MRV ' + r.over.join(', ') : '')))
  : pass('כל תוכנית עם 3 ימים ומעלה בטווח לכל שריר');
rows.filter(r => r.inherent).forEach(r =>
  console.log('        (' + r.plan + ' — ' + r.days + ' ימים בשבוע, מתחת ל-MEV מעצם התדירות)'));
rows.filter(r => (r.accepted || []).length).forEach(r =>
  console.log('        (' + r.plan + ' — מגבלת ציוד מוכרת: ' + r.accepted.join(', ') + ')'));

console.log('\n── רינדור ──');
const sm = await smoke();
sm.problems.length || sm.errors.length
  ? fail('בעיות רינדור', sm.problems.concat(sm.errors))
  : pass(sm.configs + ' תצורות תוכנית · כל יום מרנדר · כל חלון תרגיל שלם');

console.log('\n' + (failed ? '✗ ' + failed + ' קבוצות נכשלו' : '✓ הכל עבר') + '\n');
process.exit(failed ? 1 : 0);
