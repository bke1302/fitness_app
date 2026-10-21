// Is each exercise's prescription right for the exercise?
//
// Volume and order are checked elsewhere. This asks a narrower question about a
// single catalogue entry: does the rep range suit this movement's resistance
// curve, does the rest match the load, and do the fields agree with each other.
// A heavy multi-joint lift at fifteen reps and sixty seconds' rest is not a
// programming preference, it is a typo with a plausible face.
import { EX, restSec, repMin, FAM, EX_ALTERNATIVES } from './catalogue.mjs';

// The vocabulary the catalogue's array-form `muscles` field already uses
// correctly. A name outside this list is either a typo with a plausible face
// ('מכייס' is not a word) or a phrase that reads like a muscle but names
// none ('עקמוניים ירכיים'), and the only way to catch either is a positive
// list rather than a pattern — there is no regex for "not a real muscle".
const KNOWN_MUSCLES = new Set([
  'אדקטורים', 'ארבע ראשי', 'בטן אלכסוני', 'בטן אמצעי', 'בטן עליונה', 'בטן שטוחה',
  'בטן תחתונה', 'ביצפס', 'ביצפס ראש קצר', 'ברכיאליס', 'ברכיו-ראדיאליס',
  'גב עמוד אמצעי', 'גב רחב', 'גב תחתון', 'גלוטאוס מדיוס', 'היפ פלקסור', 'חזה',
  'חזה עליון', 'חזה תחתון', 'טריצפס', 'טריצפס ראש ארוך', 'ירך אחורי',
  'ירך פנימית', 'ירכיים', 'ישבן', 'ישבן צידי', 'כתף', 'כתף אמצעי', 'כתף קדמית',
  'כתפיים', 'ליבה', 'עגל', 'ראמ"ן', 'שרירי אמה קדמי',
]);

const repMax = ex => {
  const s = String(ex?.sets || '');
  if (/כישלון|שנ׳|שניות/.test(s)) return 0;
  const m = s.match(/\d+\s*[×xX]\s*\d+\s*[–\-]\s*(\d+)/);
  if (m) return +m[1];
  const one = s.match(/\d+\s*[×xX]\s*(\d+)/);
  return one ? +one[1] : 0;
};
const sets = ex => { const m = String(ex?.sets || '').match(/^\s*(\d+)/); return m ? +m[1] : 0; };
const timed = ex => /שנ׳|שניות/.test(String(ex?.sets || ''));

// Multi-joint by name, which is the only honest signal here: lvl carries two
// different conventions across the catalogue and cannot be trusted for this.
//
// Word boundaries matter more than they look. Without them "Hip Abductor
// Machine" matches `chin` inside "Machine" and gets audited as a chin-up.
const MULTI = /\b(press|squat|deadlift|rows?|pull-?ups?|chin-?ups?|pulldown|lunges?|dips?|thrust|clean|push-?ups?|good morning|romanian)\b/i;
const ISO = /\b(curls?|raises?|extensions?|fly|flyes?|pushdown|pec deck|crunch(es)?|abductor|adductor|abduction|adduction|calf|shrugs?|pullover)\b/i;
const isMulti = ex => MULTI.test(ex.en || '') && !ISO.test(ex.en || '');
const isIso = ex => ISO.test(ex.en || '') && !MULTI.test(ex.en || '');
// Bodyweight and bands cannot be loaded, so a high rep range is the only range
// available — judging them by a barbell's standards flags correct programming.
const loadable = ex => !['none', 'band'].includes(ex.eq || '');
// One side rests while the other works, so the stated rest is effectively
// doubled per limb.
const unilateral = ex => /\b(single|one)[- ](arm|leg)|לצד|bulgarian|split squat|pistol/i.test((ex.en || '') + ' ' + (ex.sets || ''));
const amrap = ex => /כישלון/.test(String(ex?.sets || ''));

export function auditExercises() {
  const out = [];
  const add = (key, sev, rule, text) => out.push({ key, sev, rule, text });

  for (const key in EX) {
    const ex = EX[key];
    const r = restSec(ex.rest), lo = repMin(ex), hi = repMax(ex), n = sets(ex);

    if (!timed(ex) && !amrap(ex)) {
      // A loadable multi-joint lift prescribed at fifteen reps is either
      // mislabelled or under-loaded. Bodyweight and bands are exempt: there is
      // nothing to add, so high reps is the only range they have.
      if (isMulti(ex) && loadable(ex) && lo >= 15)
        add(key, 'high', 'טווח קל מדי לתרגיל מורכב', ex.en + ' — ' + ex.sets);
      // An isolation taken below six reps asks a small muscle to handle a load
      // its joints, not its fibres, will limit.
      if (isIso(ex) && hi && hi <= 6)
        add(key, 'high', 'טווח כבד מדי לבידוד', ex.en + ' — ' + ex.sets);
      // Under ninety seconds, the second set of a heavy compound is a different,
      // lighter exercise than the first. A unilateral lift is exempt — the
      // other side is resting through the working set.
      if (isMulti(ex) && lo <= 8 && r < 90 && !unilateral(ex))
        add(key, 'high', 'מנוחה קצרה מדי לתרגיל כבד', ex.en + ' — ' + lo + ' חזרות, ' + r + ' שנ׳');
      // Three minutes between sets of a lateral raise is time, not stimulus.
      if (isIso(ex) && r >= 150)
        add(key, 'med', 'מנוחה ארוכה מיותרת לבידוד', ex.en + ' — ' + r + ' שנ׳');
      if (lo && hi && lo > hi)
        add(key, 'high', 'טווח הפוך', ex.sets);
      if (hi && hi - lo > 12)
        add(key, 'med', 'טווח רחב מדי לכוון אליו', ex.sets);
    }

    if (n && (n < 2 || n > 5))
      add(key, 'med', 'מספר סטים חריג', ex.sets);
    if (!String(ex.rest || '').trim())
      add(key, 'high', 'אין זמן מנוחה', key);

    // The fields have to agree: a card that says "isolation" over a two-minute
    // rest and a six-rep range is telling the lifter two different things.
    const lvl = typeof ex.lvl === 'number' ? '' : String(ex.lvl || '');
    if (/בידוד/.test(lvl) && r >= 120 && lo <= 8)
      add(key, 'med', 'מסומן בידוד אבל מתוכנת ככבד', ex.en + ' — ' + ex.sets + ', ' + ex.rest);
    if (/כבד/.test(lvl) && r < 90)
      add(key, 'med', 'מסומן כבד אבל נח כמו בידוד', ex.en + ' — ' + ex.rest);

    // What the lifter reads before the first set.
    if (!Array.isArray(ex.tips) || ex.tips.length < 3)
      add(key, 'med', 'פחות משלושה טיפים', key);
    if (String(ex.desc || '').length < 40)
      add(key, 'med', 'תיאור קצר מדי', key);
    if (!String(ex.muscles || '').trim() && !Array.isArray(ex.muscles))
      add(key, 'high', 'אין שרירים מעורבים', key);
    if (Array.isArray(ex.muscles))
      for (const m of ex.muscles)
        if (!KNOWN_MUSCLES.has(m))
          add(key, 'high', 'שם שריר שגוי או לא קיים', m);

    // A card's own numbers have to agree: a prescription of 4 sets whose
    // description insists on 5 ("ולא פחות") sends the lifter two instructions.
    const descSets = (ex.desc || '').match(/(\d+)\s*סטים/);
    if (descSets && n && +descSets[1] !== n)
      add(key, 'high', 'התיאור סותר את מספר הסטים', ex.sets + ' — ' + descSets[0]);

    // "אין לו תחליף" is only true until the app lists one. If EX_ALTERNATIVES
    // carries alternatives for this exact exercise, the claim is false on the
    // same screen that would offer them.
    if (/לא ניתן להחליפו|אין (לו )?תחליף/.test(ex.desc || '') && (EX_ALTERNATIVES[key] || []).length)
      add(key, 'high', 'התיאור טוען שאין תחליף אבל יש חלופות רשומות', (ex.desc || '').slice(0, 60));
    if (FAM(ex.cat) === ex.cat && !/ליבה|שוק|חזה|גב|כתפיים|טריצפס|יד קדמית|אמות|מקרבים|ארבע ראשי|ירך אחורי|ישבן/.test(FAM(ex.cat)))
      add(key, 'low', 'קטגוריה שלא ממופה לשריר', ex.cat);

    // "Incline" in the English name is the ground truth for the angle; the
    // Hebrew has to say so too, not call it "lying" (flat).
    //
    // The description is checked as well as the name, because they sit on the
    // same card and both tell the lifter how to set the bench. Renaming the
    // three entries left inclineDB's desc reading "בשכיבה 30-45 מעלות" and
    // inclineCurlDB's reading "בשכיבה להתמתחות מרבית" — directly under a name
    // that now said בנטייה, so the card contradicted itself in two lines.
    if (/\bincline\b/i.test(ex.en || '')) {
      if (!/נטייה/.test(ex.name || '') || /שכיבה/.test(ex.name || ''))
        add(key, 'high', 'שם אומר שכיבה אבל התרגיל בנטייה', ex.name + ' — ' + ex.en);
      if (/בשכיבה|שכיבה של/.test(ex.desc || ''))
        add(key, 'high', 'התיאור אומר שכיבה אבל התרגיל בנטייה', (ex.desc || '').slice(0, 70));
    }
    // And the inverse: a flat movement whose Hebrew claims an incline.
    if (/\bflat\b|\bbench press\b/i.test(ex.en || '') && !/\bincline\b|\bdecline\b/i.test(ex.en || '')
        && /נטייה/.test(ex.name || ''))
      add(key, 'high', 'שם אומר נטייה אבל התרגיל בשכיבה', ex.name + ' — ' + ex.en);
  }
  return out;
}
