// Migrate API key from sessionStorage to localStorage (persist across refresh)
(function(){
  const k='proFit_apiKey';
  const old=sessionStorage.getItem(k);
  if(old){localStorage.setItem(k,old);sessionStorage.removeItem(k);}
})();

// HTML escape utility — wrap user-supplied strings before injecting into innerHTML
function _esc(str){ return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function _ic(n){ return '<svg class="ico" aria-hidden="true"><use href="#i-'+n+'"/></svg>'; }

// ─── DOM helpers (reduce querySelector/getElementById repetition) ─────────────
function _el(id){ return document.getElementById(id); }
function _setText(id,val){ const e=_el(id); if(e) e.textContent=val; }
function _setHTML(id,html){ const e=_el(id); if(e) e.innerHTML=html; }
function _show(id){ const e=_el(id); if(e) e.style.display=''; }
function _hide(id){ const e=_el(id); if(e) e.style.display='none'; }
// ─── localStorage helpers ─────────────────────────────────────────────────────
function _getJSON(key,fallback=null){ try{ return JSON.parse(localStorage.getItem(key)??'null')??fallback; }catch(e){ return fallback; } }
function _setJSON(key,val){ _safeSet(key,JSON.stringify(val)); }

// Audio context singleton
let _audioCtx=null;
function _getAudioCtx(){
  if(!_audioCtx||_audioCtx.state==='closed'){
    try{ _audioCtx=new(window.AudioContext||window.webkitAudioContext)(); }catch(e){ return null; }
  }
  if(_audioCtx.state==='suspended') _audioCtx.resume();
  return _audioCtx;
}

// localStorage quota guard
function _safeSet(key,val){
  try{ localStorage.setItem(key,val); }
  catch(e){
    if(e.name==='QuotaExceededError'||e.code===22){
      _logError('localStorage quota exceeded for key: '+key,'storage-quota',0);
      showToast('אחסון מלא — ייתכן שנתונים ישנים נמחקו');
    }
  }
}

const CONFIG = {
  WATER_GOAL: 10,
  MAX_ELOG_ENTRIES: 100,
  SPARKLINE_SESSIONS: 6,
  COACH_STAGNATION: 4,
  COACH_INCREASE_MIN: 2,
  GYM_TIMER_CIRC: 2 * Math.PI * 38,
  TIMER_DEFAULT_SEC: 90,
  CONFETTI_PARTICLES: 90,
  CONFETTI_DURATION: 3200,
};

// ─── GLOBAL ERROR LOGGER ────────────────────────────────────────────────────
const ERR_KEY='pf_errors';
function _logError(msg,src,line){
  try{
    const log=_getJSON(ERR_KEY,[]);
    log.unshift({ts:new Date().toISOString(),msg:String(msg).slice(0,200),src:String(src||'').slice(0,100),line});
    localStorage.setItem(ERR_KEY,JSON.stringify(log.slice(0,20)));
  }catch(e){}
}
window.onerror=function(msg,src,line){ _logError(msg,src,line); return false; };
window.addEventListener('unhandledrejection',function(e){ _logError(e.reason?.message||String(e.reason),'promise',0); });

// ─── ACHIEVEMENT BADGES ──────────────────────────────────────────────────────
const ACHIEVEMENTS=[
  {id:'first_workout', icon:'target',   name:'פרוטוקול ראשון', desc:'השלמת אימון ראשון', check:(s)=>s.totalWorkouts>=1},
  {id:'streak_3',      icon:'flame',    name:'3 ימים ברצף',    desc:'3 אימונים ברצף',    check:(s)=>s.streak>=3},
  {id:'streak_7',      icon:'zap',      name:'שבוע שלם',        desc:'7 ימים ברצף',       check:(s)=>s.streak>=7},
  {id:'streak_30',     icon:'trend',    name:'חודש מכונה',      desc:'30 ימים ברצף',      check:(s)=>s.streak>=30},
  {id:'pr_first',      icon:'trophy',   name:'שיא ראשון',       desc:'שיא אישי ראשון',    check:(s)=>s.totalPRs>=1},
  {id:'pr_10',         icon:'star',     name:'10 שיאים',        desc:'10 שיאים אישיים',   check:(s)=>s.totalPRs>=10},
  {id:'pr_50',         icon:'medal',    name:'50 שיאים',        desc:'50 שיאים אישיים',   check:(s)=>s.totalPRs>=50},
  {id:'workouts_10',   icon:'dumbbell', name:'10 אימונים',      desc:'10 אימונים סה"כ',   check:(s)=>s.totalWorkouts>=10},
  {id:'workouts_50',   icon:'dumbbell', name:'50 אימונים',      desc:'50 אימונים סה"כ',   check:(s)=>s.totalWorkouts>=50},
  {id:'workouts_100',  icon:'medal',    name:'100 אימונים',     desc:'100 אימונים סה"כ',  check:(s)=>s.totalWorkouts>=100},
];

const EX = {
  benchPress:{name:'לחיצת חזה בשכיבה',en:'Flat Bench Press',e:'',cat:'חזה',sets:'4×6–8',rest:'2–3 דק׳',lvl:'כבד',
    desc:'תרגיל הבסיס לחזה. שוכב על ספסל, מוט מוריד לחזה התחתון-אמצעי ודוחף למעלה.',
    muscles:'חזה הגדול (ראשי), כתפיים קדמיות, טריצפס.',
    tips:['גב קל בקשת — לא שטוח לגמרי','המוט יורד לחזה תחתון-אמצעי, לא לסנטר','לחץ שכמות לספסל לאורך כל התרגיל','אל תנעל מרפקים בחזרה','נשוף בעלייה, שאף בירידה']},
  inclineBench:{name:'לחיצת חזה בנטייה',en:'Incline DB/BB Press',e:'',cat:'חזה עליון',sets:'3×10–12',rest:'90 שנ׳',lvl:'בינוני',
    desc:'ספסל ב-30–45°. מדגיש חזה עליון — נטייה לחולשה אצל רוב האנשים.',
    muscles:'חזה עליון (clavicular head), כתפיים קדמיות, טריצפס.',
    tips:['30° עדיף על 45° — פחות עומס על כתפיים','ירידה איטית 2–3 שניות','אפשר עם משקולות להרחיב טווח תנועה','כוון שכמות אחורה ומטה לאורך כל התרגיל']},
  cableFlye:{name:'פשיטות פולי',en:'Cable Crossover / Flye',e:'',cat:'חזה',sets:'3×12–15',rest:'60 שנ׳',lvl:'בידוד',
    desc:'כבל שומר מתח לאורך כל הטווח — עדיף על משקולות לבידוד חזה.',
    muscles:'חזה הגדול — בידוד.',
    tips:['מרפקים כפופים קלות בצורת קשת — לא ישרים','הרגש מתיחה בחלק הפתוח','האט בחזרה — אל תזרוק','פולי נמוך = חזה עליון. פולי גבוה = חזה תחתון']},
  ohp:{name:'לחיצת כתפיים עמידה',en:'Standing Overhead Press',e:'',cat:'כתפיים',sets:'4×8–10',rest:'90 שנ׳',lvl:'כבד',
    desc:'מלך תרגילי הכתפיים. מגייס גם שרירי ליבה לייצוב.',
    muscles:'דלטואיד קדמי + אמצעי, טריצפס, ליבה.',
    tips:['התחל עם המוט מתחת לסנטר','הראש נע מעט אחורה בדחיפה לפנות מקום למוט','גוף ישר לחלוטין — אל תכופף גב','נשוף בעלייה','בהתחלה — ישיבה (Seated) ליציבות']},
  lateralRaise:{name:'הרמות צד',en:'Cable / DB Lateral Raise',e:'↔',cat:'כתף אמצעית',sets:'3×15–20',rest:'45 שנ׳',lvl:'בידוד',
    desc:'בידוד לכתף האמצעית — אחראי על "רוחב" הכתפיים. עדיף כבל על משקולות.',
    muscles:'Medial Deltoid — בידוד.',
    tips:['עד גובה כתפיים בלבד','מרפקים כפופים קלות','אל תשתמש בתנופה — תנועה שולטת','כף יד מעט כלפי מטה בחלק העליון','כבל = מתח קבוע > משקולות']},
  triPushdown:{name:'לחיצת טריצפס — חבל',en:'Rope Tricep Pushdown',e:'',cat:'טריצפס',sets:'3×12–15',rest:'60 שנ׳',lvl:'בינוני',
    desc:'חבל עדיף על ידית ישרה — מאפשר פיצול בסוף התנועה לבידוד מלא.',
    muscles:'Triceps Brachii — lateral head ראשי.',
    tips:['מרפקים קבועים לצדי הגוף','פצל את החבל בסוף התנועה','פשיטה מלאה — הרגש כיווץ','האט בחזרה']},
  skullCrusher:{name:'מחאות טריצפס',en:'Lying EZ Bar Tricep Extension',e:'',cat:'טריצפס',sets:'3×10–12',rest:'75 שנ׳',lvl:'בינוני',
    desc:'שכיבה על ספסל, מוט EZ מוריד לטיפת ראש. מצוין ל-long head.',
    muscles:'Triceps Brachii — long head ראשי.',
    tips:['מוריד לאמצע הראש — לא לפנים','מרפקים קרובים זה לזה','מוט EZ נוח יותר לשורש כף יד','ירידה איטית']},
  pullup:{name:'מתח / לט פולדאון',en:'Pull-up / Lat Pulldown',e:'',cat:'גב רחב',sets:'4×6–10',rest:'2–3 דק׳',lvl:'כבד',
    desc:'תרגיל הגב המלך. כשמגיע ל-12 מתחים בסט — הוסף משקל עם חגורה.',
    muscles:'Latissimus Dorsi, בייסס, כתף אחורית.',
    tips:['אחיזה רחבה = גב רחב. אחיזה צרה = יותר בייסס','הפעל גב — לא ידיים — להרמה','השב שכמות אחורה ומטה בעלייה','האט בירידה — lowering חשוב כמו העלייה','אם Lat Pulldown — לא להטות גוף אחורה']},
  bentRow:{name:'חתירה כפופה — מוט',en:'Barbell Bent-over Row',e:'',cat:'גב עליון + עובי',sets:'4×8–10',rest:'2 דק׳',lvl:'כבד',
    desc:'מוסיף עובי לגב בנוסף לרוחב. כיפוף 45° קדימה ומשיכת מוט לבטן.',
    muscles:'Rhomboids, Trapezius, Lat, Rear Delt, בייסס.',
    tips:['גב ישר לחלוטין — לא כפוף','עיניים קדימה-מטה (לא למעלה)','המוט מגיע לבטן תחתונה','ברכיים כפופות קלות']},
  cableRow:{name:'חתירה ישיבה — כבל',en:'Seated Cable Row',e:'',cat:'גב אמצעי',sets:'3×10–12',rest:'90 שנ׳',lvl:'בינוני',
    desc:'כבל שומר מתח גם בנקודת ההתחלה — עדיף לבידוד גב אמצעי.',
    muscles:'Rhomboids, Middle Trapezius, Lat, Rear Delt.',
    tips:['שב זקוף — לא כפוף קדימה','שכמות מתקרבות בסוף המשיכה','אל תסחב בתנופה','מרפקים מאחורי הגוף בסיום']},
  reverseFly:{name:'פרפר הפוך — מכונה',en:'Reverse Pec Deck',e:'',cat:'כתף אחורית',sets:'4×12–15',rest:'45 שנ׳',lvl:'בידוד',
    desc:'פתיחת זרועות לאחור במכונת פק-דק הפוכה. בידוד נקי לכתף האחורית כמעט ללא מעורבות בייסס — משלים למשיכת הפנים ומחליף אותה בסבב הגיוון.',
    muscles:'Posterior Deltoid (ראשי), Rhomboids, Middle Trapezius.',
    tips:['כוון את הידיות לגובה הכתפיים בדיוק','מרפקים כפופים קלות וקבועים — זו לא פשיטת מרפק','משוך מהמרפק ולא מכף היד — אם הבייסס עובד, המשקל כבד מדי','עצור שנייה מלאה בכיווץ','משקל קל וחזרות גבוהות — הכתף האחורית קטנה ומתעייפת מהר']},
  facePull:{name:'משיכת פנים — כבל',en:'Cable Face Pull',e:'',cat:'כתף אחורית',sets:'4×15–20',rest:'45 שנ׳',lvl:'בידוד',
    desc:'קריטי לבריאות הכתף ולמניעת פציעות. עשה אותו כמעט כל אימון.',
    muscles:'Rear Deltoid, Rotator Cuff, Trapezius.',
    tips:['כבל בגובה ראש, אחיזה חבל','מושך לפנים הפנים — לא לסנטר','מרפקים גבוהים ופתוחים','חזרות גבוהות — 15–20','הכרחי לבריאות כתפיים לאורך זמן']},
  rdl:{name:'דד-ליפט רומני',en:'Romanian Deadlift',e:'',cat:'גב תחתון + ירך אחורי',sets:'3×8–10',rest:'2 דק׳',lvl:'כבד',
    desc:'כיפוף מהאגן בלבד. הטריגר הטוב ביותר לגב תחתון וירך אחורי.',
    muscles:'Hamstrings, Glutes, גב תחתון (Erector Spinae).',
    tips:['הורד מוט לאורך הרגל — ממש ליד העור','כופף מהאגן (hip hinge) — לא מהגב','הפסק כשמרגיש מתיחה, לא כאב','גב ישר לחלוטין — קריטי','משקל שמרני בהתחלה']},
  bbCurl:{name:'כפיפות מוט ישר',en:'Barbell Curl',e:'',cat:'בייסס',sets:'4×8–10',rest:'75 שנ׳',lvl:'בינוני',
    desc:'מוט ישר = supination מלאה של האמה — מגרה את הביצפס בצורה מיטבית.',
    muscles:'Biceps Brachii, Brachialis.',
    tips:['מרפקים קבועים בצדי הגוף','תנועה מלאה — מתח עד כיפוף מלא','האט בירידה','לא להשתמש בתנופה — גוף ישר']},
  hammerCurl:{name:'כפיפות פטיש',en:'Hammer Curl',e:'',cat:'בראכיאליס',sets:'3×12',rest:'60 שנ׳',lvl:'בידוד',
    desc:'אחיזה ניטרלית. מחזק Brachialis שנמצא מתחת לבייסס ומרים אותה ויזואלית.',
    muscles:'Brachialis, Brachioradialis, Biceps.',
    tips:['כף יד פונה פנימה לאורך כל התרגיל','אפשר חילופין ימין-שמאל','גוף ישר, אל תשתמש בתנופה','כבל = מתח קבוע יותר ממשקולות']},
  squat:{name:'סקוואט — מוט גבוה',en:'High Bar Barbell Squat',e:'',cat:'כל הרגל',sets:'4×6–8',rest:'3 דק׳',lvl:'כבד מאוד',
    desc:'מלך כל התרגילים. לא ניתן להחליפו. גם מגרה שחרור הורמוני גדילה וטסטוסטרון.',
    muscles:'Quadriceps, Glutes, Hamstrings, ליבה, גב תחתון.',
    tips:['רוחב רגליים מעט מעבר לכתפיים','אצבעות 30° כלפי חוץ','ברכיים עוקבות כיוון אצבעות','חזה גבוה, גב ישר, מבט קדימה','רד לפחות ל-90° — ועדיף מתחת','מוט על Trapezius — לא על צוואר']},
  legPress:{name:'לחיצת רגליים',en:'Leg Press',e:'',cat:'ירכיים + ישבן',sets:'3×10–12',rest:'2 דק׳',lvl:'בינוני',
    desc:'פלטה גבוהה על המכונה = יותר ישבן וירך אחורי. פלטה נמוכה = יותר quad.',
    muscles:'Quadriceps, Glutes, Hamstrings.',
    tips:['פלטה גבוהה לדגש על ישבן','אל תנעל ברכיים','רד עמוק — לפחות 90° בברך','אל תרד כל כך עמוק שגב מתגלגל']},
  legExt:{name:'פשיטות רגליים',en:'Leg Extension',e:'〽',cat:'ארבע ראשי',sets:'3×12–15',rest:'60 שנ׳',lvl:'בידוד',
    desc:'בידוד ל-Quad. בסוף כל סט — החזק 2 שניות בפשיטה מלאה.',
    muscles:'Quadriceps — בידוד מלא.',
    tips:['ציר הברך מיושר עם ציר המכונה','תנועה שלמה מלאה','החזק 2 שנ׳ בחלק העליון','האט בהורדה']},
  legCurl:{name:'כפיפות רגליים — שכיבה',en:'Lying Leg Curl',e:'',cat:'ירך אחורי',sets:'3×12',rest:'60 שנ׳',lvl:'בידוד',
    desc:'בידוד לירך האחורי — חיוני לאיזון ולמניעת פציעות ברכיים.',
    muscles:'Biceps Femoris, Semitendinosus.',
    tips:['שכב שטוח — רק הרגל זזה','תנועה מלאה','האט בהורדה','לפחות 3 סטים — שריר מוזנח לעיתים']},
  lunges:{name:'פסיעות בולגריות',en:'Bulgarian Split Squat',e:'',cat:'ישבן + ירכיים',sets:'3×10 לצד',rest:'90 שנ׳',lvl:'קשה',
    desc:'הרגל האחורית על ספסל, הקדמית צועדת קדימה. הכי כואב ביום רגליים — והכי אפקטיבי.',
    muscles:'Glutes, Quadriceps, Hamstrings, שרירי איזון.',
    tips:['כסא או ספסל גובה 40–50 ס"מ','ירידה אנכית — לא קדימה','ברך קדמית לא חורגת מהאצבעות','גוף ישר, לא כפוף','בהתחלה בלי משקל — תלמד את התנועה']},
  calfRaise:{name:'עריסת עגל עמידה',en:'Standing Calf Raise',e:'',cat:'שוק',sets:'4×15–20',rest:'45 שנ׳',lvl:'בידוד',
    desc:'שוק = שריר עיקש. צריך נפח, מתיחה מלאה, וכאב. 5 סטים ולא פחות.',
    muscles:'Gastrocnemius, Soleus.',
    tips:['על קצה מדרגה — מתיחה מלאה למטה','עלייה עד גובה מקסימלי','החזק שנייה בחלק העליון','לא לקצר טווח תנועה']},
  arnoldPress:{name:'Arnold Press',en:'Seated Arnold Press',e:'',cat:'כל הכתף',sets:'3×12',rest:'75 שנ׳',lvl:'בינוני',
    desc:'לחיצה מסתובבת. מעבד את כל 3 חלקי הכתף בתנועה אחת.',
    muscles:'דלטואיד קדמי + אמצעי + אחורי, טריצפס.',
    tips:['מתחיל עם כפות ידיים פנימה','בדחיפה — כף יד מסתובבת החוצה','האט בסיבוב ההורדה','ישיבה = יציבות + יותר בידוד לכתף']},
  inclineCurl:{name:'כפיפות בנטייה',en:'Incline Dumbbell Curl',e:'↗',cat:'בייסס long head',sets:'3×10–12',rest:'75 שנ׳',lvl:'בינוני',
    desc:'ספסל ב-45°. מתיחה מלאה של הבייסס בנקודת ההתחלה — מחזק את ה-long head.',
    muscles:'Biceps Brachii — long head בדגש.',
    tips:['ידיים תלויות ישר כלפי מטה בהתחלה','אל תרים כתפיים','תנועה מלאה ואיטית','הרגש מתיחה בחלק התחתון']},
  ohTricep:{name:'טריצפס מעל הראש',en:'Overhead Tricep Extension',e:'',cat:'טריצפס long head',sets:'3×10–12',rest:'75 שנ׳',lvl:'בינוני',
    desc:'Long head נמתח מעל הראש. הטריגר הכי טוב ל-long head שנותן נפח לזרוע.',
    muscles:'Triceps Brachii — long head בדגש.',
    tips:['מרפקים קרובים לראש — לא פתוחים','פשיטה מלאה למעלה','תחתון — מתח מקסימלי','אפשר משקולת אחת עם שתי ידיים או כבל']},
  frontRaise:{name:'הרמות קדמיות',en:'Front Raise',e:'',cat:'כתף קדמית',sets:'3×12',rest:'60 שנ׳',lvl:'בידוד',
    desc:'בידוד לכתף הקדמית.',
    muscles:'Anterior Deltoid.',
    tips:['עד גובה עיניים','כף יד כלפי מטה','אל תשתמש בתנופה','חילופין ידיים']},
  diamondPushup:{name:'שכיבות יהלום',en:'Diamond Push-ups',e:'',cat:'טריצפס',sets:'2×כישלון',rest:'60 שנ׳',lvl:'בינוני',
    desc:'שכיבות עם ידיים צמודות בצורת יהלום — מדגישות טריצפס.',
    muscles:'Triceps Brachii, חזה פנימי.',
    tips:['ידיים צמודות — אצבעות נוגעות','גוף ישר לחלוטין','מרפקים כלפי מאחור בירידה','עד כישלון מוחלט']},
  // ── תרגילים נוספים ──────────────────────────────
  deadlift:{name:'דד-ליפט קונבנציונלי',en:'Conventional Deadlift',e:'',cat:'כל הגוף',sets:'4×4–6',rest:'3–4 דק׳',lvl:'כבד מאוד',
    desc:'המלך האמיתי של חדר הכושר. מגייס 70%+ מהגוף בתנועה אחת. לא להחמיץ.',
    muscles:'Hamstrings, Glutes, גב תחתון (Erector Spinae), Trapezius, ליבה, אחיזה.',
    tips:['המוט ממש ליד השוקיים — לאורך כל הדרך','ירך מאחורה, חזה קדימה לפני שמרים','גב ישר לחלוטין — לא כפוף','אל תנעל ברכיים בסיום — הגוף ישר','נשוף בעלייה, שאף בירידה','מותניים יישרים — לא היפרלורדוזיס']},
  tBarRow:{name:'חתירה T-Bar',en:'T-Bar Row',e:'',cat:'גב עבה',sets:'4×8–10',rest:'2 דק׳',lvl:'כבד',
    desc:'טריגר מצוין לעובי הגב האמצעי. כיפוף 45° ומשיכת הידית אל הבטן.',
    muscles:'Rhomboids, Middle Trapezius, Latissimus Dorsi, בייסס.',
    tips:['גוף ב-45° — לא זקוף ולא שכוב','ידית V-grip = יותר גב אמצעי','ידית רחבה = יותר Lat','שכמות מתקרבות בסיום — הרגש כיווץ','הסר אגו — גב ישר חשוב ממשקל']},
  hipThrust:{name:'Hip Thrust — מוט',en:'Barbell Hip Thrust',e:'',cat:'ישבן',sets:'4×10–12',rest:'90 שנ׳',lvl:'כבד',
    desc:'תרגיל הגלוטאוס הכי אפקטיבי שנחקר. כל מי שרוצה ישבן עגול — חייב את זה.',
    muscles:'Gluteus Maximus (ראשי), Hamstrings, גב תחתון.',
    tips:['שכמות על ספסל גובה 40–45 ס"מ','המוט מעל האגן עם כרית','כנס סנטר ופשוט את האגן למעלה','בחלק העליון — גוף מקביל לרצפה','לחץ עקבים לרצפה לאורך כל התרגיל','הרגש כיווץ חזק בגלוטאוס בחלק העליון']},
  seatedCalfRaise:{name:'עריסת עגל ישיבה',en:'Seated Calf Raise',e:'',cat:'שוק — Soleus',sets:'4×15–20',rest:'45 שנ׳',lvl:'בידוד',
    desc:'ישיבה מדגישה את ה-Soleus שנמצא מתחת ל-Gastrocnemius. שניהם יחד = שוק מלאה.',
    muscles:'Soleus (ראשי), Gastrocnemius (משני).',
    tips:['ברכיים כפופות ב-90°','מתיחה מלאה למטה בכל חזרה','עלייה עד גובה מקסימלי','5 שניות ירידה איטית — Soleus מגיב לטמפו','לפחות 15 חזרות — שריר איטי']},
  wristCurl:{name:'כפיפת פרק — מוט',en:'Barbell Wrist Curl',e:'',cat:'אמות',sets:'3×15–20',rest:'30 שנ׳',lvl:'בידוד',
    desc:'מחזק את שרירי האמה הקדמיים — חיוני לאחיזה ולמניעת Tennis Elbow.',
    muscles:'Flexor Carpi Radialis, Flexor Carpi Ulnaris.',
    tips:['ישיבה, אמות על ירכיים','תנועה קטנה — רק פרק כף יד','טווח מלא — פתח ב-stretch','חזרות גבוהות עם משקל קל','אל תכאב — תחפש את Burn']},
  reverseWristCurl:{name:'כפיפת פרק הפוכה',en:'Reverse Wrist Curl',e:'',cat:'אמות',sets:'3×15–20',rest:'30 שנ׳',lvl:'בידוד',
    desc:'מחזק שרירי האמה האחוריים — מאזן את הלחץ ומונע פציעות פרק.',
    muscles:'Extensor Carpi Radialis, Extensor Carpi Ulnaris.',
    tips:['כפות ידיים כלפי מטה','תנועה קטנה — רק פרק כף יד','חזרות גבוהות','הגן על המרפקים — אל תכפף יותר מדי','מומלץ: אחרי wrist curl רגיל']},
  farmerWalk:{name:'Farmer\'s Carry',en:'Farmer\'s Walk',e:'',cat:'אחיזה + ליבה',sets:'3×30–45 שנ׳',rest:'60 שנ׳',lvl:'פונקציונלי',
    desc:'הליכה עם משקולות כבדות. מחזק אחיזה, ליבה, שכמות ושרירי יציבה.',
    muscles:'Grip strength, Trapezius, Core, Erector Spinae.',
    tips:['גב ישר, כתפיים מאחורה','צעדים קצרים ומהירים','עד קצה האולם וחזרה','המשקולות לא נוגעות בגוף','כשהאחיזה נשברת — עצור']},
  bulgSplit:{name:'סקוואט בולגרי',en:'Bulgarian Split Squat',e:'',cat:'ירכיים',
    sets:'3×10 לצד',rest:'90 שנ׳',lvl:'בינוני',
    desc:'מלך תרגילי הרגל החד-צדדיים — מבדיל בין הרגליים ומחזק יציבות.',
    muscles:'קוואדריצפס, גלוטאוס, המסטרינג, שרירי יציבה.',
    tips:['שים רגל אחורית על ספסל בגובה הברך','ברך קדמית לא עוברת את האצבעות','גב ישר לאורך כל התנועה','ירד לאט — 2–3 שניות']},
  closeGripBench:{name:'לחיצת חזה אחיזה צרה',en:'Close Grip Bench Press',e:'',cat:'טריצפס',
    sets:'4×8–10',rest:'90 שנ׳',lvl:'כבד',
    desc:'תרגיל הבסיס לטריצפס — עומס גבוה, טווח תנועה מלא.',
    muscles:'טריצפס (ראשי), חזה תיכוני, כתפיים קדמיות.',
    tips:['ידיים ברוחב כתפיים — לא צר מדי','מרפקים קרוב לגוף','הורד לחזה בשליטה','אל תנעל מרפקים בפסגה']},
  ezCurl:{name:'כפיפות מוט EZ',en:'EZ Bar Curl',e:'',cat:'בייסס',
    sets:'4×10–12',rest:'75 שנ׳',lvl:'בינוני',
    desc:'EZ bar מפחית עומס על המפרק ומאפשר כיווץ מלא יותר של הביצפס.',
    muscles:'ביצפס (שני ראשים), ברכיאליס.',
    tips:['אחיזה ב-45 מעלות על המוט','מרפקים קבועים לצד הגוף','עלה מהר, ירד לאט (2 שנ)','כיווץ מלא בפסגה']},
  cableCurl:{name:'כפיפות כבל עמידה',en:'Standing Cable Curl',e:'',cat:'בייסס',
    sets:'3×15',rest:'60 שנ׳',lvl:'בידוד',
    desc:'כבל שומר על מתח קבוע לאורך כל טווח התנועה — שאב דם מושלם לסיום.',
    muscles:'ביצפס, ברכיאליס.',
    tips:['זרוע ישרה לגמרי בתחתית','כיווץ מלא בפסגה','תנועה איטית ומבוקרת','אפשר לעשות חד-צדדי']},
  inclineDB:{name:'לחיצת דמבל שכיבה',en:'Incline Dumbbell Press',e:'',cat:'push',sets:'4×8–12',rest:90,lvl:2,desc:'לחיצת חזה עם דמבלים בשכיבה 30-45 מעלות לדגש על חלק עליון',muscles:['חזה עליון','כתף קדמית','טריצפס'],tips:['כוון 30-45 מעלות — לא יותר','מרפקים 45 מעלות מהגוף','הורד לאט ואל תנעל למעלה']},
  declineBench:{name:'לחיצת חזה ירידה',en:'Decline Bench Press',e:'',cat:'push',sets:'4×8–12',rest:90,lvl:2,desc:'לחיצת חזה בשכיבה יורדת לדגש על חלק תחתון',muscles:['חזה תחתון','טריצפס','כתף קדמית'],tips:['קבע רגליים היטב','קשת טבעית בגב','הורד לאט — 2-3 שניות']},
  closeGripBenchDB:{name:'לחיצת מוט אחיזה צרה',en:'Close Grip Bench Press',e:'',cat:'push',sets:'4×6–10',rest:90,lvl:2,desc:'לחיצת מוט עם אחיזה צרה לדגש על טריצפס',muscles:['טריצפס','חזה','כתף קדמית'],tips:['אחיזה רוחב כתפיים','מרפקים קרובים לגוף','שליטה מלאה בירידה']},
  pecDeck:{name:'פק דק',en:'Pec Deck Machine',e:'',cat:'push',sets:'3×12–15',rest:60,lvl:1,desc:'כיווץ חזה במכונה לטווח תנועה מלא',muscles:['חזה','כתף קדמית'],tips:['הרגש כיווץ בפסגה','אל תנעל מרפקים','טווח תנועה מלא']},
  cableChestFly:{name:'פרפר חזה בכבל',en:'Cable Chest Fly',e:'',cat:'push',sets:'3×12–15',rest:60,lvl:2,desc:'פרפר בכבל בגובה בינוני לטנשן קבוע',muscles:['חזה','כתף קדמית'],tips:['עמוד באמצע המכשיר','תנועת חבוק','שמור על כפיפה קלה במרפק']},
  arnoldPressDB:{name:'לחיצת ארנולד',en:'Arnold Press',e:'',cat:'push',sets:'3×10–12',rest:75,lvl:2,desc:'לחיצת כתפיים עם סיבוב לכיסוי כל ראשי הדלתא',muscles:['כתף','טריצפס','כתף קדמית'],tips:['התחל עם כפות ידיים פנים','סובב בעלייה','תנועה איטית ושליטה']},
  seatedDBPress:{name:'לחיצת כתפיים ישיבה',en:'Seated Dumbbell Press',e:'',cat:'push',sets:'4×8–12',rest:90,lvl:1,desc:'לחיצת כתפיים עם דמבלים בישיבה לייצוב מקסימלי',muscles:['כתף','טריצפס','כתף קדמית'],tips:['גב ישר על משענת','מרפקים ב-90 מעלות בתחתית','אל תנעל למעלה']},
  cableLateral:{name:'הרמה לצד בכבל',en:'Cable Lateral Raise',e:'',cat:'push',sets:'3×12–15',rest:60,lvl:2,desc:'הרמה לצד בכבל לטנשן קבוע לאורך כל התנועה',muscles:['כתף אמצעי'],tips:['כבל מתחת לגוף','תנועה איטית','מרפק מעט כפוף']},
  machineShoulderPress:{name:'לחיצת כתפיים מכונה',en:'Machine Shoulder Press',e:'',cat:'push',sets:'3×10–15',rest:75,lvl:1,desc:'לחיצת כתפיים במכונה לתנועה בטוחה',muscles:['כתף','טריצפס'],tips:['כוון מושב לגובה הנכון','תנועה מלאה','אל תנעל למעלה']},
  inclineChestPress:{name:'לחיצת חזה שכיבה מכונה',en:'Incline Chest Press Machine',e:'',cat:'push',sets:'4×10–12',rest:75,lvl:1,desc:'לחיצת חזה עליון במכונה',muscles:['חזה עליון','כתף קדמית','טריצפס'],tips:['כוון גובה מושב','גב על מושב','תנועה מבוקרת']},
  singleArmRow:{name:'חתירה חד-צדדית',en:'Single Arm Dumbbell Row',e:'',cat:'pull',sets:'4×8–12',rest:75,lvl:1,desc:'חתירה עם דמבל יחיד על ספסל לגב חד-צדדי',muscles:['גב רחב','ראמ"ן','ביצפס'],tips:['יד תמיכה על ספסל','משוך למותניים','שלוט בחזרה']},
  tBarRowV2:{name:'חתירת T-BAR',en:'T-Bar Row',e:'',cat:'pull',sets:'4×8–10',rest:90,lvl:2,desc:'חתירה עם מוט T לעובי גב מרבי',muscles:['גב עמוד אמצעי','ראמ"ן','ביצפס'],tips:['כפוף 45 מעלות','חזה על הריפוד','משוך לחזה התחתון']},
  cableRowSeat:{name:'חתירה בכבל ישיבה',en:'Seated Cable Row',e:'',cat:'pull',sets:'4×10–12',rest:75,lvl:1,desc:'חתירה בכבל בישיבה לעובי גב',muscles:['גב עמוד אמצעי','ראמ"ן','ביצפס'],tips:['גב ישר לא כפוף','משוך לטבור','שלוט בחזרה']},
  chinUp:{name:'מתח אחיזה מחודדת',en:'Chin Up',e:'',cat:'pull',sets:'4×6–10',rest:90,lvl:2,desc:'מתח אחיזה מחודדת להדגשת ביצפס',muscles:['גב רחב','ביצפס'],tips:['אחיזה פנים','משוך חזה לבר','ירידה איטית — 3 שניות']},
  concentrationCurl:{name:'כפיפת ריכוז',en:'Concentration Curl',e:'',cat:'pull',sets:'3×10–12',rest:60,lvl:1,desc:'כפיפת ביצפס ישיבה לאיזוציה מרבית',muscles:['ביצפס ראש קצר'],tips:['מרפק על ירך פנימית','תנועה מלאה','כיווץ בפסגה 1 שניה']},
  reverseGripCurl:{name:'כפיפה אחיזה הפוכה',en:'Reverse Grip Curl',e:'',cat:'pull',sets:'3×10–12',rest:60,lvl:2,desc:'כפיפת ביצפס עם כפות ידיים כלפי מטה לברכיאליס',muscles:['ברכיאליס','ברכיו-ראדיאליס'],tips:['אחיזה רוחב כתפיים','מרפקים קרובים לגוף','תנועה שלוטה']},
  underhandPulldown:{name:'לאת אחיזה מחודדת',en:'Underhand Lat Pulldown',e:'',cat:'pull',sets:'3×10–12',rest:75,lvl:1,desc:'לאת בכבל עם אחיזה מחודדת לדגש ביצפס',muscles:['גב רחב','ביצפס'],tips:['אחיזה רוחב כתפיים','גב ישר','משוך לחזה התחתון']},
  machineRow:{name:'חתירה במכונה',en:'Machine Row',e:'',cat:'pull',sets:'3×12–15',rest:60,lvl:1,desc:'חתירת גב במכונה לתנועה בטוחה',muscles:['גב עמוד אמצעי','ראמ"ן'],tips:['כוון גובה ידיות','גב ישר','משוך ועצור שניה']},
  inclineCurlDB:{name:'כפיפת דמבל שכיבה',en:'Incline Dumbbell Curl',e:'',cat:'pull',sets:'3×10–12',rest:60,lvl:2,desc:'כפיפת ביצפס עם דמבלים בשכיבה להתמתחות מרבית',muscles:['ביצפס','ברכיאליס'],tips:['ספסל 45-60 מעלות','ידיים תלויות','כפוף לאט']},
  bulgarianSplit:{name:'סקוואט בולגרי',en:'Bulgarian Split Squat',e:'',cat:'legs',sets:'4×8–10',rest:90,lvl:2,desc:'סקוואט חד-רגלי עם רגל אחורית על ספסל',muscles:['ארבע ראשי','ישבן','ירכיים'],tips:['רגל אחורית על ספסל','ברך קדמית מעל אצבעות','יסוד אנכי']},
  walkingLunge:{name:'צעדות',en:'Walking Lunges',e:'',cat:'legs',sets:'3×12–16',rest:75,lvl:1,desc:'צעדות קדימה לאימון מלא של הרגל',muscles:['ארבע ראשי','ישבן','ירכיים'],tips:['צעד גדול','ברך אחורית לא נוגעת ברצפה','גב ישר']},
  sumoSquat:{name:'סקוואט סומו',en:'Sumo Squat',e:'',cat:'legs',sets:'4×10–12',rest:75,lvl:1,desc:'סקוואט פתיחה רחבה לדגש מכייסים',muscles:['מכייס','אדקטורים','ישבן'],tips:['פתיחה 45 מעלות לחוץ','ברכיים בכיוון האצבעות','ירך עד מקביל']},
  gobletSquat:{name:'סקוואט גביע',en:'Goblet Squat',e:'',cat:'legs',sets:'3×12–15',rest:60,lvl:1,desc:'סקוואט עם דמבל לקידמה — מושלם לטכניקה',muscles:['ארבע ראשי','ישבן','ליבה'],tips:['דמבל ליד חזה','עקבים על הרצפה','ישב עמוק']},
  singleLegRDL:{name:'RDL חד-רגלי',en:'Single Leg RDL',e:'',cat:'legs',sets:'3×8–10',rest:75,lvl:2,desc:'RDL על רגל אחת לאיזון ועקמוניים',muscles:['עקמוניים ירכיים','ישבן','עגל'],tips:['עמוד יציב','גב שטוח','הורד עד שמרגיש מתיחה']},
  gluteBridge:{name:'גשר ישבן',en:'Glute Bridge',e:'',cat:'legs',sets:'4×12–15',rest:60,lvl:1,desc:'גשר על הגב לאקטיבציה מרבית של הישבן',muscles:['ישבן','עקמוניים ירכיים'],tips:['כפות רגליים קרובות לישבן','דחוף ישבן למעלה','כיווץ בפסגה 1 שניה']},
  abductorMachine:{name:'אבדקטור',en:'Hip Abductor Machine',e:'↗',cat:'legs',sets:'3×15–20',rest:60,lvl:1,desc:'מכונת אבדקטור לפיתוח ישבן צידי',muscles:['ישבן צידי','גלוטאוס מדיוס'],tips:['כוון גובה מושב','תנועה איטית','עצור בנקודה הרחוקה']},
  adductorMachine:{name:'אדדקטור',en:'Hip Adductor Machine',e:'↙',cat:'legs',sets:'3×15–20',rest:60,lvl:1,desc:'מכונת אדדקטור לירכיים פנימיות',muscles:['ירך פנימית','אדקטורים'],tips:['כוון זווית מושב','תנועה שלוטה','אל תגלוש']},
  boxJump:{name:'קפיצת בוקס',en:'Box Jump',e:'',cat:'legs',sets:'4×6–8',rest:90,lvl:2,desc:'קפיצה אתלטית לעוצמה ומהירות',muscles:['ארבע ראשי','עגל','ישבן'],tips:['נחת רך עם ברכיים כפופות','קפוץ בשתי רגליים','ירד בזהירות']},
  legPressNarrow:{name:'לג פרס אחיזה צרה',en:'Leg Press Narrow Stance',e:'',cat:'legs',sets:'4×10–12',rest:90,lvl:1,desc:'לחיצת רגל צרה לדגש ארבע ראשי קדמי',muscles:['ארבע ראשי'],tips:['פתיחה עד רוחב כתפיים','ירד עמוק','אל תנעל ברכיים']},
  dbSkullCrusher:{name:'שוברי גולגולת דמבל',en:'DB Skull Crusher',e:'',cat:'arms',sets:'3×10–12',rest:75,lvl:2,desc:'שוברי גולגולת עם דמבלים לטווח תנועה טוב',muscles:['טריצפס ראש ארוך'],tips:['מרפקים מעל הפנים','הורד לאט בשליטה','אל תיתן מרפקים לפרוח']},
  cableTricepOverhead:{name:'טריצפס כבל מעל ראש',en:'Cable Overhead Tricep Ext',e:'',cat:'arms',sets:'3×12–15',rest:60,lvl:2,desc:'הרחבת טריצפס בכבל מעל הראש לראש ארוך',muscles:['טריצפס ראש ארוך'],tips:['עמוד גב לכבל','מרפקים קרובים לאוזניים','תנועה מלאה']},
  benchDipsArms:{name:'שכיבות סמיכה על ספסל',en:'Bench Dips',e:'',cat:'arms',sets:'3×12–15',rest:60,lvl:1,desc:'שכיבות סמיכה עם ידיים על ספסל לטריצפס',muscles:['טריצפס','כתף קדמית'],tips:['ידיים קרובות לגוף','ירד עד מתיחה','רגליים מוארכות לקושי']},
  ropePushdown:{name:'פשיטת טריצפס חבל',en:'Rope Tricep Pushdown',e:'',cat:'arms',sets:'3×12–15',rest:60,lvl:1,desc:'פשיטת טריצפס בכבל עם חבל לכיסוי מלא',muscles:['טריצפס'],tips:['פצל החבל בתחתית','מרפקים קבועים','כיווץ מלא']},
  spiderCurl:{name:'ספיידר קרל',en:'Spider Curl',e:'',cat:'arms',sets:'3×10–12',rest:60,lvl:2,desc:'כפיפת ביצפס על ספסל נטוי קדימה לאיזוציה',muscles:['ביצפס'],tips:['שכב עם חזה על ספסל נטוי','ידיים תלויות','כפוף לאט ושלוט']},
  zottmanCurl:{name:'זוטמן קרל',en:'Zottman Curl',e:'',cat:'arms',sets:'3×10–12',rest:60,lvl:2,desc:'כפיפה עם סיבוב לביצפס וברכיאליס',muscles:['ביצפס','ברכיאליס','ברכיו-ראדיאליס'],tips:['כפוף עם כפות ידיים למעלה','סובב בפסגה','הורד עם כפות ידיים למטה']},
  reverseCurl:{name:'כפיפה הפוכה',en:'Reverse Curl',e:'↩',cat:'arms',sets:'3×10–12',rest:60,lvl:2,desc:'כפיפה עם אחיזה הפוכה לברכיו-ראדיאליס',muscles:['ברכיו-ראדיאליס','ברכיאליס'],tips:['אחיזה הפוכה רוחב כתפיים','מרפקים קרובים לגוף','תנועה שלוטה']},
  wristCurlDB:{name:'כפיפת פרק יד',en:'Wrist Curl',e:'',cat:'arms',sets:'3×15–20',rest:45,lvl:1,desc:'חיזוק שרירי האמה עם כפיפת פרק יד',muscles:['שרירי אמה קדמי'],tips:['אמות על ברכיים','תנועה מלאה','משקל קל']},
  plank:{name:'פלאנק',en:'Plank',e:'',cat:'core',sets:'3×45-60 שניות',rest:45,lvl:1,desc:'החזקת גוף ישר על אמות לחיזוק הליבה',muscles:['ליבה','כתפיים','ישבן'],tips:['גוף קו ישר','טבור פנים','נשום בקביעות']},
  hangingLegRaise:{name:'הרמת רגליים תלוי',en:'Hanging Leg Raise',e:'',cat:'core',sets:'4×10–15',rest:60,lvl:2,desc:'הרמת רגליים בתלייה על בר לבטן תחתונה',muscles:['בטן תחתונה','היפ פלקסור'],tips:['תנופה אפסית','הרם עד מקביל','הורד לאט']},
  cableCrunch:{name:'כפיפת בטן בכבל',en:'Cable Crunch',e:'',cat:'core',sets:'4×12–15',rest:60,lvl:2,desc:'כפיפת בטן בכבל לבטן עליונה',muscles:['בטן עליונה'],tips:['ברכיים על הרצפה','כפוף מהצלעות','כיווץ בפסגה']},
  russianTwist:{name:'סיבוב רוסי',en:'Russian Twist',e:'',cat:'core',sets:'3×20',rest:45,lvl:1,desc:'סיבוב ישיבה לאלכסוניים',muscles:['בטן אלכסוני','בטן שטוחה'],tips:['הרם רגליים מהרצפה','סובב מהמותניים','משקל קל']},
  abWheel:{name:'גלגל בטן',en:'Ab Wheel Rollout',e:'',cat:'core',sets:'3×8–12',rest:60,lvl:3,desc:'גלגול גלגל בטן לליבה מתקדמת',muscles:['בטן שטוחה','ליבה','כתפיים'],tips:['ברכיים על הרצפה','גב שטוח','חזור לאט']},
  sidePlank:{name:'פלאנק צד',en:'Side Plank',e:'↗',cat:'core',sets:'3×30-45 שניות',rest:30,lvl:1,desc:'פלאנק צידי לאלכסוניים ויציבות',muscles:['בטן אלכסוני','ליבה','כתף'],tips:['גוף קו ישר','ירך מורמת','נשום בקביעות']},
  vUp:{name:'V-UP',en:'V-Up',e:'',cat:'core',sets:'3×12–15',rest:45,lvl:2,desc:'כפיפה מלאה לרגליים ופלג עליון',muscles:['בטן שטוחה','היפ פלקסור'],tips:['שמור גב ישר','גע ידיים ברגליים','הורד לאט']},
  toeTouch:{name:'נגיעת אצבעות',en:'Toe Touch Crunch',e:'',cat:'core',sets:'3×15–20',rest:45,lvl:1,desc:'כפיפת בטן עם רגליים אנכיות',muscles:['בטן עליונה'],tips:['רגליים אנכיות לרצפה','גע ידיים לאצבעות','כתפיים מהרצפה']},
  crunchMachine:{name:'כפיפת בטן מכונה',en:'Crunch Machine',e:'',cat:'core',sets:'3×15–20',rest:45,lvl:1,desc:'כפיפת בטן עם עמסה מכנית',muscles:['בטן עליונה','בטן אמצעי'],tips:['כוון גובה מושב','כפוף מהצלעות','כיווץ מלא']},
  dragonFlag:{name:'דרגון פלאג',en:'Dragon Flag',e:'',cat:'core',sets:'3×5–8',rest:90,lvl:3,desc:'תרגיל ליבה מתקדם — גוף שלם',muscles:['בטן שטוחה','ליבה','גב תחתון'],tips:['אחוז ספסל מאחורי הראש','גוף קשיח','הורד לאט בשליטה']},

  // ═══ HOME — משקל גוף (eq:'none') ═══
  pushup:{name:'שכיבות סמיכה',en:'Push-up',e:'',cat:'חזה',sets:'4×8–20',rest:'90 שנ׳',lvl:'בינוני',eq:'none',
    desc:'תרגיל הדחיפה הביתי הבסיסי. כשמגיע ל-20 חזרות — עבור לגרסה קשה יותר, לא ליותר חזרות.',
    muscles:'חזה הגדול, כתפיים קדמיות, טריצפס, ליבה.',
    tips:['גוף ישר כקרש — אל תשמוט אגן','ידיים מעט רחבות מכתפיים','חזה נוגע ברצפה בכל חזרה','ירידה איטית 2 שנ׳','קשה מדי? ידיים על שולחן. קל מדי? רגליים מוגבהות']},
  declinePushup:{name:'שכיבות סמיכה רגליים מוגבהות',en:'Decline Push-up',e:'',cat:'חזה עליון',sets:'3×8–15',rest:'90 שנ׳',lvl:'קשה',eq:'none',
    desc:'רגליים על כיסא/ספה — מעביר עומס לחזה העליון ולכתפיים. המקבילה הביתית ללחיצה בנטייה.',
    muscles:'חזה עליון, כתפיים קדמיות, טריצפס.',
    tips:['גובה כיסא 40–50 ס"מ','אל תיתן לגב להתקשת','ראש בהמשך לגוף — לא שמוט','ככל שהרגליים גבוהות יותר — קשה יותר']},
  pikePushup:{name:'שכיבות פייק',en:'Pike Push-up',e:'',cat:'כתפיים',sets:'3×6–12',rest:'90 שנ׳',lvl:'קשה',eq:'none',
    desc:'אגן גבוה בצורת V הפוך — הדחיפה אנכית ומדמה לחיצת כתפיים. התחליף הביתי ללחיצת כתפיים.',
    muscles:'דלטואיד קדמי + אמצעי, טריצפס, טרפז עליון.',
    tips:['אגן גבוה ככל האפשר','הראש יורד לכיוון הרצפה בין הידיים','מרפקים אחורה — לא לצדדים','שדרוג: רגליים על כיסא']},
  doorRow:{name:'חתירה אופקית — שולחן/סדין',en:'Inverted Row (Table/Sheet)',e:'',cat:'גב אמצעי',sets:'4×8–15',rest:'90 שנ׳',lvl:'בינוני',eq:'none',
    desc:'שכיבה מתחת לשולחן יציב ומשיכת החזה אליו, או סדין כרוך בדלת. תרגיל המשיכה הביתי החשוב ביותר.',
    muscles:'Rhomboids, Lat, Trapezius, בייסס, כתף אחורית.',
    tips:['גוף ישר — אגן לא שמוט','משוך שכמות יחד לפני שהידיים מושכות','רגליים ישרות = קשה, ברכיים כפופות = קל','ודא שהשולחן יציב לחלוטין']},
  chinupHome:{name:'מתח על משקוף',en:'Doorframe Pull-up / Chin-up',e:'',cat:'גב רחב',sets:'4×3–10',rest:'2–3 דק׳',lvl:'כבד',eq:'none',
    desc:'דורש מוט מתח לדלת (עלות זניחה, שווה כל שקל). אין לו תחליף אמיתי לרוחב הגב בבית.',
    muscles:'Latissimus Dorsi, בייסס, כתף אחורית.',
    tips:['לא מצליח חזרה? עשה רק ירידות איטיות 5 שנ׳','אחיזה הפוכה קלה יותר למתחילים','טווח מלא — תלייה מלאה למטה','12 חזרות בסט? הוסף משקל בתיק גב']},
  bwSquat:{name:'סקוואט משקל גוף',en:'Bodyweight Squat',e:'',cat:'כל הרגל',sets:'4×15–25',rest:'90 שנ׳',lvl:'קל',eq:'none',
    desc:'הבסיס. כשמגיע ל-25 חזרות נקיות — עבור לגרסאות חד-רגליות, לא ליותר חזרות.',
    muscles:'Quadriceps, Glutes, Hamstrings, ליבה.',
    tips:['עקבים על הרצפה כל הזמן','רד עמוק — מתחת ל-90°','טמפו 3 שנ׳ ירידה = קושי כפול','שדרוג: פאוזה 2 שנ׳ למטה']},
  bulgSplitHome:{name:'פסיעות בולגריות — ביתי',en:'Bulgarian Split Squat (Chair)',e:'',cat:'ישבן + ירכיים',sets:'3×8–15 לצד',rest:'90 שנ׳',lvl:'קשה',eq:'none',
    desc:'רגל אחורית על כיסא/ספה. תרגיל הרגליים הביתי האפקטיבי ביותר — גם בלי משקל.',
    muscles:'Glutes, Quadriceps, Hamstrings, שרירי איזון.',
    tips:['ירידה אנכית — לא קדימה','ברך קדמית בכיוון האצבעות','קל מדי? החזק בקבוקי מים/תיק','ירידה איטית 3 שנ׳']},
  pistolBox:{name:'סקוואט רגל אחת לכיסא',en:'Box Pistol Squat',e:'',cat:'כל הרגל',sets:'3×5–10 לצד',rest:'2 דק׳',lvl:'כבד',eq:'none',
    desc:'ירידה על רגל אחת עד ישיבה קלה על כיסא וחזרה. שיא הפרוגרסיה החד-רגלית.',
    muscles:'Quadriceps, Glutes, ליבה, שיווי משקל.',
    tips:['שב באיטיות — אל תיפול על הכיסא','ידיים קדימה לאיזון','הנמך את משטח הישיבה ככל שמתחזק','גע-וקום בלי מנוחה למטה']},
  gluteBridgeSL:{name:'גשר ישבן רגל אחת',en:'Single-Leg Glute Bridge',e:'',cat:'ישבן',sets:'3×10–15 לצד',rest:'60 שנ׳',lvl:'בינוני',eq:'none',
    desc:'המקבילה הביתית ל-Hip Thrust. רגל אחת באוויר מכפילה את העומס.',
    muscles:'Gluteus Maximus, Hamstrings, גב תחתון.',
    tips:['דחוף מהעקב','כווץ ישבן חזק בחלק העליון — החזק שנייה','אגן לא מתעקם הצידה','שדרוג: שכמות על ספה = טווח גדול יותר']},
  nordicHome:{name:'כפיפת ברך נורדית — ביתי',en:'Nordic Curl (Feet Anchored)',e:'',cat:'ירך אחורי',sets:'3×3–8',rest:'2 דק׳',lvl:'כבד',eq:'none',
    desc:'עקבים נעוצים מתחת לספה, ירידה איטית קדימה מהברכיים. תרגיל הירך האחורי הקשה ביותר ללא ציוד.',
    muscles:'Hamstrings — בידוד עצום, גם מונע פציעות.',
    tips:['רד לאט ככל שאתה יכול — הירידה היא התרגיל','עזור בידיים בדחיפה חזרה','כרית מתחת לברכיים','גוף ישר מברך עד ראש']},
  calfRaiseHome:{name:'עריסת עגל על מדרגה',en:'Single-Leg Calf Raise',e:'',cat:'שוק',sets:'4×12–20 לצד',rest:'45 שנ׳',lvl:'בידוד',eq:'none',
    desc:'רגל אחת על קצה מדרגה — משקל גוף מלא על שוק אחת מספיק בהחלט.',
    muscles:'Gastrocnemius, Soleus.',
    tips:['מתיחה מלאה למטה','החזק שנייה למעלה','יד על קיר לאיזון בלבד','ירידה איטית 3 שנ׳']},
  plankReach:{name:'פלאנק עם נגיעה בכתף',en:'Plank Shoulder Tap',e:'',cat:'ליבה',sets:'3×30–60 שנ׳',rest:'60 שנ׳',lvl:'בינוני',eq:'none',
    desc:'פלאנק עם נגיעה בכתף הנגדית — אנטי-רוטציה, שדרוג משמעותי על פלאנק רגיל.',
    muscles:'ליבה עמוקה, אלכסונים, כתפיים.',
    tips:['רגליים רחבות = קל, צמודות = קשה','האגן לא זז כשהיד עוזבת','נשום — אל תעצור נשימה','גב ניטרלי']},
  hollowHold:{name:'הולו הולד',en:'Hollow Body Hold',e:'',cat:'ליבה',sets:'3×20–45 שנ׳',rest:'60 שנ׳',lvl:'קשה',eq:'none',
    desc:'שכיבה על הגב, גב תחתון צמוד לרצפה, ידיים ורגליים באוויר. תרגיל הליבה של מתעמלים.',
    muscles:'Rectus Abdominis, ליבה עמוקה.',
    tips:['גב תחתון חייב להישאר צמוד לרצפה','קשה מדי? כופף ברכיים','ידיים מעל הראש = קשה','איכות לפני זמן']},

  // ═══ HOME — גומיות התנגדות (eq:'band') ═══
  bandRow:{name:'חתירה עם גומייה',en:'Band Seated Row',e:'',cat:'גב אמצעי',sets:'4×12–20',rest:'75 שנ׳',lvl:'בינוני',eq:'band',
    desc:'ישיבה על הרצפה, גומייה סביב כפות הרגליים. התחליף הביתי לחתירת כבל.',
    muscles:'Rhomboids, Lat, Trapezius, בייסס.',
    tips:['גב זקוף — אל תתגלגל אחורה','שכמות מתקרבות בסוף המשיכה','החזק שנייה בכיווץ','קצר את האחיזה להגברת התנגדות']},
  bandPulldown:{name:'פולדאון עם גומייה',en:'Band Lat Pulldown',e:'',cat:'גב רחב',sets:'3×12–20',rest:'75 שנ׳',lvl:'בינוני',eq:'band',
    desc:'גומייה מעוגנת בחלק העליון של הדלת, משיכה בכריעה. תחליף לט פולדאון למי שאין מוט מתח.',
    muscles:'Latissimus Dorsi, בייסס.',
    tips:['משוך מרפקים לכיוון הכיסים','חזה גבוה','האט בחזרה — אל תיתן לגומייה לזרוק','עיגון בטוח לפני שמתחילים']},
  bandChestPress:{name:'לחיצת חזה עם גומייה',en:'Band Chest Press',e:'',cat:'חזה',sets:'3×12–20',rest:'75 שנ׳',lvl:'בינוני',eq:'band',
    desc:'גומייה מאחורי הגב או מעוגנת בדלת בגובה חזה. מתח עולה בסוף התנועה — משלים מצוין לשכיבות סמיכה.',
    muscles:'חזה הגדול, כתפיים קדמיות, טריצפס.',
    tips:['צעד קדימה ליצירת מתח התחלתי','דחוף עד יישור מלא','ליבה אסופה','שלב עם שכיבות סמיכה באותו אימון']},
  bandFacePull:{name:'משיכת פנים — גומייה',en:'Band Face Pull',e:'',cat:'כתף אחורית',sets:'4×15–25',rest:'45 שנ׳',lvl:'בידוד',eq:'band',
    desc:'זהה לגרסת הכבל — קריטי לבריאות הכתף.',
    muscles:'Rear Deltoid, Rotator Cuff, Trapezius.',
    tips:['עיגון בגובה פנים','מרפקים גבוהים ופתוחים','משוך לפנים הפנים','חובה בכל אימון ביתי']},
  bandLateral:{name:'הרמות צד עם גומייה',en:'Band Lateral Raise',e:'↔',cat:'כתף אמצעית',sets:'3×15–25',rest:'45 שנ׳',lvl:'בידוד',eq:'band',
    desc:'דריכה על הגומייה והרמה לצד. ההתנגדות בשיא בדיוק בנקודת הכיווץ.',
    muscles:'Medial Deltoid.',
    tips:['עד גובה כתפיים','מרפק כפוף קלות','ללא תנופה','חד-צדדי = בקרה טובה יותר']},
  bandCurl:{name:'כפיפות מרפק עם גומייה',en:'Band Biceps Curl',e:'',cat:'בייסס',sets:'3×12–20',rest:'60 שנ׳',lvl:'בידוד',eq:'band',
    desc:'דריכה על הגומייה. שיא ההתנגדות בכיווץ המלא.',
    muscles:'Biceps Brachii, Brachialis.',
    tips:['מרפקים קבועים בצדי הגוף','ירידה איטית — הגומייה מושכת, אתה מתנגד','דריכה רחבה = קשה יותר','אחיזת פטיש = בראכיאליס']},
  bandTricep:{name:'פשיטת טריצפס עם גומייה',en:'Band Tricep Extension',e:'',cat:'טריצפס',sets:'3×12–20',rest:'60 שנ׳',lvl:'בידוד',eq:'band',
    desc:'עיגון גבוה בדלת — Pushdown, או מאחורי הגב — פשיטה מעל הראש.',
    muscles:'Triceps Brachii.',
    tips:['מרפקים קבועים','פשיטה מלאה + כיווץ','מעל הראש = הראש הארוך','האט בחזרה']},
  bandGoodMorning:{name:'גוד מורנינג עם גומייה',en:'Band Good Morning',e:'',cat:'גב תחתון + ירך אחורי',sets:'3×15–20',rest:'75 שנ׳',lvl:'בינוני',eq:'band',
    desc:'גומייה סביב הצוואר-כתפיים ומתחת לרגליים. תבנית ציר הירך הביתית — תחליף RDL קל.',
    muscles:'Hamstrings, Glutes, Erector Spinae.',
    tips:['כיפוף מהאגן — לא מהגב','גב ישר לחלוטין','דחוף אגן קדימה בסיום','הרגש מתיחה בירך אחורי']},

  // ═══ HOME — משקולות מתכווננות (eq:'db') ═══
  dbFloorPress:{name:'לחיצת חזה מהרצפה',en:'Dumbbell Floor Press',e:'',cat:'חזה',sets:'4×8–12',rest:'90 שנ׳',lvl:'כבד',eq:'db',
    desc:'שכיבה על הרצפה במקום ספסל. טווח מעט קצר יותר אך בטוח לחלוטין וכבד.',
    muscles:'חזה הגדול, כתפיים קדמיות, טריצפס.',
    tips:['מרפקים נוגעים ברצפה בעדינות — לא נוחתים','פאוזה קצרה למטה','שכמות צמודות לרצפה','ברכיים כפופות ליציבות']},
  dbRow:{name:'חתירת משקולת ביד אחת',en:'One-Arm Dumbbell Row',e:'',cat:'גב עליון + עובי',sets:'4×8–12 לצד',rest:'90 שנ׳',lvl:'כבד',eq:'db',
    desc:'יד וברך על כיסא/ספה, משיכת המשקולת לאגן. תרגיל הגב הביתי הכבד ביותר.',
    muscles:'Lat, Rhomboids, Trapezius, בייסס.',
    tips:['גב ישר — מקביל לרצפה','משוך לכיוון האגן, לא לחזה','אל תסובב את הגו','ירידה איטית ומתיחה מלאה למטה']},
  dbGobletSquat:{name:'גובלט סקוואט',en:'Goblet Squat',e:'',cat:'כל הרגל',sets:'4×10–15',rest:'2 דק׳',lvl:'בינוני',eq:'db',
    desc:'משקולת אחת צמודה לחזה. מלמד טכניקת סקוואט מושלמת ומעמיס יפה בבית.',
    muscles:'Quadriceps, Glutes, ליבה.',
    tips:['משקולת צמודה לחזה — מרפקים למטה','רד עמוק בין הברכיים','חזה גבוה כל הדרך','כשנגמר המשקל — עבור לבולגריות עם משקולות']},
  dbRdl:{name:'דד-ליפט רומני — משקולות',en:'Dumbbell Romanian Deadlift',e:'',cat:'גב תחתון + ירך אחורי',sets:'3×10–12',rest:'2 דק׳',lvl:'כבד',eq:'db',
    desc:'זהה לגרסת המוט — המשקולות צמודות לרגליים. תרגיל השרשרת האחורית הביתי המרכזי.',
    muscles:'Hamstrings, Glutes, Erector Spinae.',
    tips:['כיפוף מהאגן בלבד','משקולות מחליקות לאורך הרגל','גב ישר — קריטי','עצור במתיחה, לא בכאב']},
  dbShoulderPress:{name:'לחיצת כתפיים משקולות',en:'DB Shoulder Press',e:'',cat:'כתפיים',sets:'3×8–12',rest:'90 שנ׳',lvl:'בינוני',eq:'db',
    desc:'עמידה או ישיבה על כיסא עם גב. תחליף מלא ללחיצת כתפיים במוט.',
    muscles:'דלטואיד קדמי + אמצעי, טריצפס.',
    tips:['ליבה אסופה — אל תקשת גב','דחוף עד יישור בלי לנעול','אפשר Arnold Press לגיוון','ירידה עד גובה אוזניים לפחות']}
};

const EX_YT={
  benchPress:'bench press proper form tutorial',
  inclineBench:'incline bench press form tutorial',
  cableFlye:'cable chest fly exercise tutorial form',
  ohp:'overhead press military press form tutorial',
  lateralRaise:'lateral raise shoulder proper form tutorial',
  triPushdown:'tricep pushdown cable exercise form',
  skullCrusher:'skull crusher EZ bar tricep tutorial',
  pullup:'pull up chin up proper form tutorial',
  bentRow:'barbell bent over row form tutorial',
  cableRow:'seated cable row exercise tutorial',
  facePull:'face pull cable rear delt exercise tutorial',
  rdl:'romanian deadlift RDL proper form tutorial',
  bbCurl:'barbell curl bicep exercise form tutorial',
  hammerCurl:'hammer curl dumbbell proper form tutorial',
  squat:'barbell squat proper form tutorial',
  legPress:'leg press machine proper form tutorial',
  legExt:'leg extension machine quad exercise tutorial',
  legCurl:'lying leg curl hamstring exercise tutorial',
  lunges:'bulgarian split squat form tutorial',
  calfRaise:'standing calf raise exercise form tutorial',
  inclineCurl:'incline dumbbell curl bicep tutorial',
  ohTricep:'overhead tricep extension cable long head tutorial',
  arnoldPress:'arnold press shoulder proper form tutorial',
  frontRaise:'front raise shoulder anterior deltoid proper form tutorial',
  diamondPushup:'diamond push ups tricep exercise proper form tutorial',
  hipThrust:'barbell hip thrust glute exercise proper form tutorial',
  bulgSplit:'bulgarian split squat proper form tutorial',
  closeGripBench:'close grip bench press tricep proper form tutorial',
  ezCurl:'ez bar curl bicep proper form tutorial',
  deadlift:'conventional deadlift proper form tutorial',
  tBarRow:'t-bar row back exercise proper form tutorial',
  seatedCalfRaise:'seated calf raise soleus exercise tutorial',
  wristCurl:'barbell wrist curl forearm exercise proper form',
  reverseWristCurl:'reverse wrist curl forearm extensor proper form tutorial',
  farmerWalk:'farmers carry walk exercise proper form tutorial',
  cableCurl:'standing cable curl bicep exercise proper form tutorial',
};

const CAT_STYLE={
  PUSH:{grad:'linear-gradient(135deg,rgba(232,168,124,.28),rgba(232,168,124,.08))',color:'#CCFF00'},
  PULL:{grad:'linear-gradient(135deg,rgba(201,178,126,.28),rgba(201,178,126,.08))',color:'#00D9FF'},
  LEGS:{grad:'linear-gradient(135deg,rgba(185,156,107,.28),rgba(185,156,107,.06))',color:'#B47CFF'},
  ARMS:{grad:'linear-gradient(135deg,rgba(204,255,0,.28),rgba(255,122,69,.06))',color:'#FF7A45'},
  CORE:{grad:'linear-gradient(135deg,rgba(126,242,154,.28),rgba(126,242,154,.06))',color:'#7EF29A'},
};

let _currentExKey = null;
let _modalTrapFn = null;
// Normalize exercise fields — supports both legacy schema (Hebrew cat, string muscles,
// string rest/lvl) and the expanded schema (English cat, array muscles, numeric rest/lvl)
function _exMuscles(e){ return Array.isArray(e.muscles)?e.muscles.join(', '):(e.muscles||''); }
function _exRest(e){ return typeof e.rest==='number'?(e.rest>=120?(e.rest/60).toFixed(e.rest%60?1:0)+' דק׳':e.rest+' שנ׳'):(e.rest||''); }
function _exLvl(e){ const m={1:'קל',2:'בינוני',3:'כבד'}; return typeof e.lvl==='number'?(m[e.lvl]||'בינוני'):(e.lvl||''); }
// _CAT_KEY indexes CAT_STYLE; _CAT_HE is what the user reads. These were
// one map, and translating it silently broke every category lookup.
const _CAT_KEY={push:'PUSH',pull:'PULL',legs:'LEGS',arms:'ARMS',core:'CORE'};
const _CAT_HE={push:'דחיפה',pull:'משיכה',legs:'רגליים',arms:'ידיים',core:'ליבה'};
function _exCatLabel(e){ return _CAT_HE[e.cat]||e.cat||''; }

function openModal(key){
  const e=EX[key]; if(!e)return;
  _currentExKey = key;
  // cinematic hero
  // EX categories are mostly specific muscle names ("גב רחב", "כל הרגל"), so
  // an exact-match table missed most of them and everything fell to PUSH.
  // Match on the first word that identifies a group instead.
  const _catWords=[[['ירכי','ישבן','קוואדס','המסטרינג','רגל','שוק','ארבע ראשי','ירך'],'LEGS'],
                   [['גב','בייסס','ביצפס','בראכיאליס','אמות','אחיזה'],'PULL'],
                   [['טריצפס','כתף','כתפיים','חזה'],'PUSH'],
                   [['ליבה','בטן'],'CORE']];
  const _catUC=_CAT_KEY[e.cat]||(()=>{
    const t=String(e.cat||'');
    for(const [words,g] of _catWords) if(words.some(w=>t.includes(w))) return g;
    return '';
  })();
  const cs=CAT_STYLE[_catUC]||CAT_STYLE.PUSH;
  document.getElementById('m-hero-bg').style.background=cs.grad;
  document.getElementById('m-hero-wm').innerHTML='<svg class="ico hero-wm-ico"><use href="#i-dumbbell"/></svg>';
  document.getElementById('m-hero-cat').textContent='יום '+_exCatLabel(e);
  document.getElementById('m-hero-name').textContent=e.name;
  document.getElementById('m-hero-en').textContent=e.en;
  document.getElementById('m-title').textContent=e.name;
  document.getElementById('m-desc').textContent=e.desc;
  document.getElementById('m-muscles').textContent=_exMuscles(e);
  document.getElementById('m-info').innerHTML=
    `<div class="info-pill">סטים: <strong>${e.sets}</strong></div>
     <div class="info-pill">מנוחה: <strong>${_exRest(e)}</strong></div>
     <div class="info-pill">עצימות: <strong>${_exLvl(e)}</strong></div>`;
  document.getElementById('m-tips').innerHTML=e.tips.map(t=>`<li><span class="m-tips-check">✓</span><span>${_esc(t)}</span></li>`).join('');
  // Demo video card
  const demoEl=document.getElementById('m-demo');
  if(demoEl){
    const q=EX_YT[key]||(e.en+' exercise tutorial form');
    const ytUrl='https://www.youtube.com/results?search_query='+encodeURIComponent(q);
    demoEl.innerHTML=`<a class="demo-card" href="${ytUrl}" target="_blank" rel="noopener noreferrer">
      <div class="demo-thumb">
        <svg class="ico demo-bg-ico"><use href="#i-dumbbell"/></svg>
        <div class="demo-play-ring"><svg viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg></div>
        <span class="demo-ex-tag">${_esc(e.en)}</span>
      </div>
      <div class="demo-bar">
        <span class="demo-bar-text">הדגמת ביצוע נכון — לחץ לצפייה</span>
        <span class="demo-yt-pill">YouTube</span>
      </div>
    </a>`;
  }
  renderSetLogInModal(key);
  // Alternatives used to be a button on every table row; it belongs here,
  // next to the exercise it would replace.
  const altWrap=document.getElementById('m-alt-wrap');
  if(altWrap){
    altWrap.innerHTML=EX_ALTERNATIVES[key]
      ? `<button class="m-alt-btn" onclick="showAlternatives('${key}',${JSON.stringify(e.name)})">החלף תרגיל</button>`
      : '';
  }
  // Coach tip
  const coachEl=document.getElementById('m-coach-tip');
  if(coachEl){
    const tip=getCoachTip(key);
    coachEl.innerHTML=tip
      ? `<div class="coach-tip coach-tip--${tip.type}"><span class="ct-icon">${_ic(tip.icon)}</span><span class="ct-msg">${tip.msg}</span></div>`
      : '';
  }
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow='hidden';
  // Focus trap — לכלוא focus בתוך המודל
  const FOCUSABLE='button,input,select,textarea,[tabindex]:not([tabindex="-1"])';
  if(_modalTrapFn){document.removeEventListener('keydown',_modalTrapFn);_modalTrapFn=null;}
  _modalTrapFn=function(e){
    const modal=document.querySelector('.modal');
    if(!modal) return;
    const els=[...modal.querySelectorAll(FOCUSABLE)].filter(el=>!el.disabled&&el.offsetParent!==null);
    if(!els.length) return;
    if(e.key==='Tab'){
      const first=els[0],last=els[els.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  };
  document.addEventListener('keydown',_modalTrapFn);
  document.querySelector('.modal .modal-close')?.focus();
}
function closeModal(){
  if(_modalTrapFn){document.removeEventListener('keydown',_modalTrapFn);_modalTrapFn=null;}
  const overlay=document.getElementById('modal-overlay');
  if(!overlay) return;
  overlay.classList.add('closing');
  setTimeout(()=>{overlay.classList.remove('open','closing');document.body.style.overflow='';},220);
}
function closeModalBg(ev){if(ev.target.id==='modal-overlay')closeModal();}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();},{passive:true});

// ─── TOAST ────────────────────────────────────────────────────────────────
function showToast(msg,duration=2800){
  const t=document.getElementById('app-toast');
  if(!t) return;
  t.textContent=msg;
  t.style.opacity='1';
  clearTimeout(t._tid);
  t._tid=setTimeout(()=>{t.style.opacity='0';},duration);
}

const TITLES={dashboard:'לוח בקרה',schedule:'לוח שבועי',push:'ראשון — דחיפה',pull:'שני — משיכה',legs:'רביעי — רגליים',arms:'חמישי — ידיים',crossfit:'CrossFit — WOD',nutrition:'תוכנית תזונה',supplements:'תוספי תזונה',tips:'טיפים מהמאמן',timeline:'ציר זמן',elog:'יומן משקלים',food:'מעקב תזונה יומי',chat:'יועץ תזונה AI',progress:'גרף משקל גוף',settings:'הגדרות אישיות'};
// ─── EXERCISE SEARCH + LIBRARY BROWSE ──────────────────────────────────────
// Classify any exercise (legacy Hebrew cat OR new English cat) into a muscle group
function _exGroup(ex){
  const c=ex.cat||'';
  if(['push','pull','legs','arms','core'].includes(c)) return c;
  if(/חזה|כתפ|כתף|טריצפס|לחיצ/.test(c)) return 'push';
  if(/גב|בייסס|ביצפס|בראכ|לאט|חתיר/.test(c)) return 'pull';
  if(/רגל|ירכ|ירך|ישבן|שוק|עגל|ארבע|המסטר|אדקט/.test(c)) return 'legs';
  if(/אמות|פרק|אצבע|ליבה|בטן/.test(c)) return c.match(/ליבה|בטן/)?'core':'arms';
  return 'arms';
}
const _GROUP_CHIPS=[['push','דחיפה'],['pull','משיכה'],['legs','רגליים'],['arms','ידיים'],['core','ליבה']];

function _exItemHTML(key,ex){
  return `<div class="ex-search-item" onclick="openModal('${key}');closeExSearch()">
      <span class="ex-dot ${_exGroup(ex)}"></span>
      <div class="ex-search-info">
        <div class="ex-search-name">${_esc(ex.name)}</div>
        <div class="ex-search-meta">${_esc(_exCatLabel(ex))} · ${_esc(ex.sets||'')}</div>
      </div>
    </div>`;
}

/** Browse all exercises in a muscle group (called from category chips) */
function browseExCategory(group){
  const resultsEl=document.getElementById('ex-search-results'); if(!resultsEl) return;
  const list=Object.entries(EX).filter(([,ex])=>_exGroup(ex)===group);
  const label=(_GROUP_CHIPS.find(c=>c[0]===group)||[,group])[1];
  resultsEl.innerHTML=`<div class="ex-browse-head">${label} · ${list.length} תרגילים</div>`+
    _chipsHTML(group)+list.map(([key,ex])=>_exItemHTML(key,ex)).join('');
  resultsEl.style.display='block';
}
function _chipsHTML(active){
  return `<div class="ex-chips">`+_GROUP_CHIPS.map(([g,lbl])=>
    `<button class="ex-chip${g===active?' active':''}" onclick="browseExCategory('${g}')">${lbl}</button>`
  ).join('')+`</div>`;
}

function renderExSearch(query){
  const q=(query||'').trim().toLowerCase();
  const resultsEl=document.getElementById('ex-search-results');
  if(!resultsEl) return;
  // Empty query → show category chips so the full library is browsable
  if(!q){
    resultsEl.innerHTML=`<div class="ex-browse-head">עיין בספריית התרגילים</div>`+_chipsHTML(null);
    resultsEl.style.display='block';
    return;
  }

  const matches=Object.entries(EX).filter(([key,ex])=>{
    const musc=Array.isArray(ex.muscles)?ex.muscles.join(' '):(ex.muscles||'');
    return (ex.name||'').includes(q)||
           (ex.en||'').toLowerCase().includes(q)||
           (ex.cat||'').toLowerCase().includes(q)||
           musc.toLowerCase().includes(q);
  }).slice(0,10);

  if(matches.length===0){
    resultsEl.innerHTML=`<div class="ex-search-empty">לא נמצאו תרגילים עבור "${_esc(query)}"</div>`+_chipsHTML(null);
    resultsEl.style.display='block';
    return;
  }

  resultsEl.innerHTML=matches.map(([key,ex])=>_exItemHTML(key,ex)).join('');
  resultsEl.style.display='block';
}

function closeExSearch(){
  const r=document.getElementById('ex-search-results');
  const i=document.getElementById('ex-search-input');
  if(r){r.innerHTML='';r.style.display='none';}
  if(i) i.value='';
}

document.addEventListener('click', function(e){
  if(!e.target.closest('#ex-search-wrap')) closeExSearch();
});

function goDay(panelId){ showPanel(panelId,null); }
function showPanel(name,btn){
  const _p=document.getElementById('panel-'+name);
  if(!_p) return;
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  _p.classList.add('active');
  // The rest timer is only meaningful mid-workout; CSS keys off this.
  document.body.dataset.panel=name;
  document.getElementById('ex-search-wrap')?.classList.remove('open');
  document.getElementById('ex-search-toggle')?.classList.remove('active');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  const pt=document.getElementById('page-title');
  if(pt){pt.classList.add('switching');setTimeout(()=>{pt.textContent=TITLES[name]||name;pt.classList.remove('switching');},100);}
  window.scrollTo(0,0);
  // Sync bottom-nav highlight
  if(typeof setMobileNav==='function'){
    const navMap={push:'push',pull:'push',legs:'push',arms:'push',schedule:'push',
      dashboard:'dashboard',nutrition:'nutrition',food:'nutrition',supplements:'nutrition',
      progress:'progress',elog:'progress',timeline:'progress',settings:'settings',
      chat:'nutrition',crossfit:'push',tips:'settings'};
    setMobileNav(navMap[name]||'dashboard');
  }
  // Lazy-render panels that build their UI dynamically
  renderSubNav(name);
  setTimeout(initCollapsibles,0);
  // after the lazy renderers below, not before them on the same tick
  setTimeout(()=>fixNumericRanges(document.getElementById('panel-'+name)),80);
  if(name==='settings') setTimeout(prefillSettingsForm,0);
  if(name==='elog') setTimeout(renderElogPanel,0);
  if(name==='food') setTimeout(renderFoodPanel,0);
  if(name==='chat') setTimeout(renderChatPanel,0);
  if(name==='crossfit') setTimeout(renderCrossfitPanel,0);
  if(['push','pull','legs','arms','day-a','day-b','day-c'].includes(name)) setTimeout(injectSparklines,0);
}
// Sidebar was removed from the HTML — keep safe no-ops for any leftover callers
function openSidebar(){}
function closeSidebar(){}
function toggleSidebar(){}
// Bottom-nav active state
function setMobileNav(id){
  document.querySelectorAll('.mbn-item').forEach(b=>b.classList.remove('active'));
  const el=document.getElementById('mbn-'+id);
  if(el) el.classList.add('active');
}

// ── URL PARAMS: open panel from shortcut ──
(function(){
  const p = new URLSearchParams(location.search).get('panel');
  if(p) showPanel(p);
})();

// ── SERVICE WORKER ──
if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(() => {})
      .catch(() => {});
  });
  navigator.serviceWorker.addEventListener('message', e => {
    if(e.data && e.data.type === 'SW_UPDATED'){
      // Show update toast with reload option
      const toastEl = document.createElement('div');
      toastEl.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--gold,#CCFF00);color:#000;padding:12px 20px;border-radius:12px;font-size:.85rem;font-weight:600;z-index:9999;display:flex;gap:12px;align-items:center;box-shadow:0 8px 32px rgba(0,0,0,.4);';
      toastEl.innerHTML = '<span>גרסה חדשה זמינה!</span><button onclick="location.reload()" style="background:rgba(0,0,0,.15);border:none;color:#000;padding:4px 12px;border-radius:8px;cursor:pointer;font-weight:700;">רענן</button>';
      document.body.appendChild(toastEl);
      setTimeout(() => toastEl.remove(), 8000);
    }
  });
}

// ── INSTALL PROMPT ──
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  if(!localStorage.getItem('pf_installDismissed')){
    const banner=document.getElementById('install-banner');
    if(banner) banner.style.display='flex';
    const btn=document.getElementById('install-banner-btn');
    if(btn) btn.onclick=async()=>{
      if(!deferredPrompt) return;
      deferredPrompt.prompt();
      const {outcome}=await deferredPrompt.userChoice;
      if(outcome==='accepted') dismissInstallBanner();
      deferredPrompt=null;
    };
  }
});

window.addEventListener('appinstalled', () => {
  const banner = document.getElementById('install-banner');
  if(banner) banner.style.display = 'none';
});

// ═══════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════
const SETTINGS_KEY = 'proFit_settings';
const DEFAULT_S = {name:'המשתמש שלי',weight:60,height:170,age:31,calories:2750};
function getSettings(){ try{return{...DEFAULT_S,...JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')};}catch(e){return{...DEFAULT_S};} }
function saveSettings(s){ localStorage.setItem(SETTINGS_KEY,JSON.stringify(s)); applySettings(s); }
function applySettings(s){
  // Topbar chips
  const tcw=document.getElementById('tc-weight'); if(tcw) tcw.textContent=s.weight+' ק"ג';
  const tcc=document.getElementById('tc-cal'); if(tcc) tcc.textContent=(s.calories||2750).toLocaleString('he-IL')+' קל׳';
  // Footer
  const fsub=document.getElementById('footer-sub'); if(fsub) fsub.textContent=s.weight+' ק"ג · '+s.height+' ס"מ · '+s.age;
  const fnm=document.getElementById('footer-name'); if(fnm) fnm.textContent=s.name;
  // Legacy selectors for older code
  const sub=document.querySelector('.user-sub'); if(sub&&sub.id!=='footer-sub') sub.textContent=s.weight+' ק"ג · '+s.height+' ס"מ · '+s.age;
  const nm=document.querySelector('.user-name'); if(nm&&nm.id!=='footer-name') nm.textContent=s.name;
  const av=document.querySelector('.user-avatar'); if(av) av.textContent=(s.name||'מ').charAt(0);
  const calEl=document.getElementById('dash-cals'); if(calEl) calEl.textContent=s.calories.toLocaleString('he-IL');
  // Update full dashboard stats from active user
  const _au=getActiveUser&&getActiveUser(); if(_au) renderDashboardStats(_au);
}
function updateBMRPreview(){
  const w=parseFloat(document.getElementById('sf-weight')?.value)||0;
  const h=parseFloat(document.getElementById('sf-height')?.value)||0;
  const a=parseInt(document.getElementById('sf-age')?.value)||0;
  const prev=document.getElementById('bmr-preview');
  if(!prev||!w||!h||!a){if(prev)prev.innerHTML='הזן נתונים כדי לחשב את היעד היומי';return;}
  const _g=(getActiveUser()?.gender||'m')==='f'?-161:5;
  const bmr=Math.round(10*w+6.25*h-5*a+_g);
  const actVal=parseFloat(document.getElementById('sf-activity')?.value)||1.55;
  const tdee=Math.round(bmr*actVal);
  const goalVal=document.getElementById('sf-goal')?.value||'lean_bulk';
  const surp={lean_bulk:350,bulk:600,cut:-400,maintain:0}[goalVal]??350;
  const target=tdee+surp;
  const surpLabel=surp>0?'+'+surp:String(surp);
  prev.innerHTML=`היעד שלך: <strong style="color:var(--lime)">${target.toLocaleString()}</strong> קל׳ ליום `
    +`<span style="color:var(--muted2)">· ${surpLabel} · שריפה יומית ${tdee.toLocaleString()}</span>`;
  const calIn=document.getElementById('sf-calories');
  if(calIn && !calIn.dataset.touched) calIn.value = target;
}
function saveSettingsForm(){
  const name=(document.getElementById('sf-name')?.value||'').trim();
  if(!name||name.length<2){showToast('שם חובה — לפחות 2 תווים');return;}
  const weight=parseFloat(document.getElementById('sf-weight')?.value)||60;
  const height=parseFloat(document.getElementById('sf-height')?.value)||170;
  const age=parseInt(document.getElementById('sf-age')?.value)||31;
  const calories=parseInt(document.getElementById('sf-calories')?.value)||2750;
  if(isNaN(weight)||weight<20||weight>300){showToast('ערך לא תקין');return;}
  if(isNaN(height)||height<100||height>250){showToast('ערך לא תקין');return;}
  if(isNaN(age)||age<13||age>100){showToast('ערך לא תקין');return;}
  saveSettings({name,weight,height,age,calories});
  const apiKey=(document.getElementById('sf-apikey')?.value||'').trim();
  if(apiKey) localStorage.setItem('proFit_apiKey',apiKey);
  // Read new profile fields
  const goal=document.getElementById('sf-goal')?.value||'lean_bulk';
  const activity=parseFloat(document.getElementById('sf-activity')?.value)||1.55;
  const workout_time=document.getElementById('sf-workout-time')?.value||'18:00';
  const gender=document.getElementById('sf-gender')?.value||'m';
  const meal_count=_sfMealCount||5;
  const cholesterol=_sfCholesterol;
  // Sync active user record
  const users=getUsers(); const aid=getActiveUser()?.id||getActiveUserId();
  const idx=users.findIndex(u=>u.id===aid);
  const workout_freq=parseInt(document.getElementById('sf-workout-freq')?.value)||4;
  let workout_split=null;
  if(workout_freq===3) workout_split=document.getElementById('sf-workout-split-3')?.value||'3abc';
  if(workout_freq===4){const s=document.getElementById('sf-workout-split-4')?.value;workout_split=s||null;}
  const freqWarn=workout_freq===7?'נשמר — אבל 7 ימים ברצף לא מומלץ, הגוף חייב מנוחה':'';
  const workout_location=document.getElementById('sf-workout-location')?.value||'gym';
  const home_equipment=document.getElementById('sf-home-equipment')?.value||'none';
  if(idx>=0){
    users[idx]={...users[idx],name,weight,height,age,calories,goal,activity,workout_time,gender,meal_count,cholesterol,workout_freq,workout_split,workout_location,home_equipment};
    saveUsers(users);
    renderUserList();
    renderNutritionPanel();
    applyUserConditions(users[idx]);
    renderDashboardStats(users[idx]);
    renderAdaptivePanels();
    injectSwapButtons();
    injectSetLogRows();
    initCheckboxes();   // renderWorkoutDay wiped the tbody — rebuild the set checkboxes
    initTodayHero();    // hero + week bar + day chips must reflect the new plan
    updateStreak();
  } else {
    showToast('שגיאה: לא נמצא משתמש פעיל — ההגדרות לא נשמרו');
    return;
  }
  showToast(freqWarn||'הגדרות נשמרו');
  const btn=document.querySelector('#settings-form .settings-save');
  if(btn){
    const o=btn.textContent;btn.textContent='נשמר!';
    btn.style.animation='none';btn.offsetHeight;btn.style.animation='settingsSavePulse .5s var(--ease-spring) both';
    setTimeout(()=>{btn.textContent=o;btn.style.animation='';},2000);
  }
}

// ═══════════════════════════════════════════════════
// MULTI-USER SYSTEM
// ═══════════════════════════════════════════════════
const USERS_KEY = 'pf_users';
const ACTIVE_USER_KEY = 'pf_active_user_id';

function getUsers(){ try{return JSON.parse(localStorage.getItem(USERS_KEY)||'[]')}catch(e){return[];} }
function saveUsers(u){ localStorage.setItem(USERS_KEY,JSON.stringify(u)); invalidateUserCache(); }
function getActiveUserId(){ return localStorage.getItem(ACTIVE_USER_KEY)||null; }
function setActiveUserId(id){ localStorage.setItem(ACTIVE_USER_KEY,id); }
let _cachedUser=null,_cachedUserId=null;
function getActiveUser(){
  const id=getActiveUserId();
  if(id===_cachedUserId&&_cachedUser) return _cachedUser;
  _cachedUserId=id;
  const users=getUsers();
  _cachedUser=users.find(u=>u.id===id)||users[0]||null;
  return _cachedUser;
}
function invalidateUserCache(){_cachedUser=null;_cachedUserId=null;}

/** @param {{weight:number,height:number,age:number,gender:string,goal:string}} u @returns {{target:number,protein:number,carbs:number,fat:number,bmr:number,tdee:number}} */
function calcNutrition(u){
  const sex=(u.gender||'m')==='f'?-161:5;
  const bmr=Math.round(10*(u.weight||75)+6.25*(u.height||175)-5*(u.age||30)+sex);
  const tdee=Math.round(bmr*(u.activity||1.55));
  const surplusMap={lean_bulk:350,bulk:600,cut:-400,maintain:0};
  const surplus=surplusMap[u.goal||'lean_bulk']??350;
  const target=Math.max(1200,u.calories||Math.round(tdee+surplus));
  const protein=Math.round((u.weight||75)*2.5);
  const fat=Math.round(target*0.27/9);
  const carbs=Math.max(0,Math.round((target-protein*4-fat*9)/4));
  return{bmr,tdee,target,protein,fat,carbs};
}

const GOAL_LABELS={lean_bulk:'עלייה נקייה',bulk:'מסה מקסימלית',cut:'הורדת שומן',maintain:'שמירה'};

// ═══════════════════════════════════════════════════
// EXERCISE ALTERNATIVES
// ═══════════════════════════════════════════════════
const EX_ALTERNATIVES = {
  // ── חזה ──
  benchPress:[{name:'לחיצת משקולות שכיבה',tag:'Dumbbell Bench Press — ריינג׳ של תנועה גדול יותר'},{name:'פוש-אפ בחגורה',tag:'Weighted Push-up — בית / ללא מכשיר'},{name:'פק דק / Chest Press מכונה',tag:'Machine Chest Press — מתחילים / שיקום'}],
  inclineBench:[{name:'Incline Dumbbell Press',tag:'אותה קבוצת שריר, יותר יציבות'},{name:'Incline Push-up',tag:'ללא ציוד — שנה זווית הרצפה'},{name:'Low to High Cable Fly',tag:'כבל — מתח קבוע בחזה עליון'}],
  cableFlye:[{name:'פרפר עם משקולות',tag:'Dumbbell Fly — שכיבה'},{name:'Pec Deck מכונה',tag:'בידוד מושלם לחזה'},{name:'Push-up רחב',tag:'ללא ציוד'}],
  // ── כתפיים ──
  ohp:[{name:'Arnold Press',tag:'סיבוב פנימי/חיצוני — כיסוי מלא של כתף'},{name:'Machine Shoulder Press',tag:'בטוח יותר לגב תחתון'},{name:'DB Shoulder Press ישיבה',tag:'Seated DB Press — יציבות גבוהה'}],
  lateralRaise:[{name:'הרמות צד עם משקולות',tag:'Dumbbell Lateral Raise — אותו בידוד'},{name:'Lateral Raise כבל חד-צדדי',tag:'Cable One-Arm Lateral — מתח קבוע'},{name:'Machine Lateral Raise',tag:'בידוד מדויק ללא תנופה'}],
  facePull:[{name:'Reverse Fly עם משקולות',tag:'Rear Delt Fly — שכיבה נוטה קדימה'},{name:'Band Face Pull',tag:'ריצועית — לכל מקום, ללא ציוד'},{name:'Rear Delt Machine',tag:'מכונה — בידוד מושלם'}],
  // ── גב ──
  pullup:[{name:'לט פולדאון',tag:'Lat Pulldown — אותו תנועה בישיבה'},{name:'Assisted Pull-up',tag:'מכונה עם עזר — לפיתוח כוח'},{name:'TRX Row',tag:'ישיבה נוטה — קל יותר'}],
  bentRow:[{name:'חתירה עם משקולות',tag:'Dumbbell Row — גב ישר, יש הדגמות בכל מכון'},{name:'Machine Row',tag:'ללא שיווי משקל — טוב למתחילים'},{name:'TRX Row',tag:'ניתן לכוונן עצימות'}],
  cableRow:[{name:'חתירה עם מוט',tag:'Barbell Row — כבד יותר'},{name:'חתירה עם משקולות',tag:'Dumbbell Row — כל יד בנפרד'},{name:'T-Bar Row',tag:'זווית שונה לגב אמצעי'}],
  tBarRow:[{name:'One-Arm Dumbbell Row',tag:'כל יד בנפרד — טווח תנועה גדול'},{name:'Seated Cable Row',tag:'כבל — מתח קבוע לאורך כל התנועה'},{name:'Machine Row',tag:'בטוח יותר לגב תחתון'}],
  deadlift:[{name:'Trap Bar Deadlift',tag:'עמוד השדרה ניטרלי יותר — טוב למתחילים'},{name:'Rack Pull',tag:'מתנקודת הברך — פחות טווח, יותר משקל'},{name:'Romanian Deadlift',tag:'RDL — הדגשה על Hamstrings'}],
  // ── רגליים ──
  squat:[{name:'לחיצת רגליים',tag:'Leg Press — ללא עומס על עמוד השדרה'},{name:'Goblet Squat',tag:'משקולת אחת — טוב לטכניקה'},{name:'Bulgarian Split Squat',tag:'חד-רגלי — פחות משקל, יותר עבודה'}],
  legPress:[{name:'סקוואט',tag:'Squat — כוח מלא'},{name:'Hack Squat',tag:'פחות עומס על גב תחתון'},{name:'Sissy Squat',tag:'בודד Quads — ללא ציוד'}],
  rdl:[{name:'Rack Pull מגובה הברך',tag:'Rack Pull — פחות טווח, יותר גב תחתון'},{name:'Nordic Curl',tag:'Hamstrings ללא ציוד — הכי קשה'},{name:'Leg Curl מכונה',tag:'בידוד Hamstrings — בטוח לגב'}],
  legExt:[{name:'Sissy Squat',tag:'ללא ציוד — בידוד Quad מלא'},{name:'Wall Sit',tag:'איזומטרי — 60 שנ׳ בלבד'},{name:'Step-up על ספסל',tag:'פונקציונלי — מגייס גם ישבן'}],
  legCurl:[{name:'Nordic Curl',tag:'הכי קשה ללא ציוד — Hamstrings 100%'},{name:'Swiss Ball Leg Curl',tag:'כדור — אתגר שיווי משקל'},{name:'Good Morning',tag:'מוט על כתפיים — Hamstrings + גב תחתון'}],
  lunges:[{name:'Step-up על ספסל',tag:'פחות עומס על ברך — נוח יותר'},{name:'Walking Lunges',tag:'תנועה — שורף יותר קלוריות'},{name:'Reverse Lunge',tag:'פחות לחץ על ברך קדמית'}],
  hipThrust:[{name:'Glute Bridge',tag:'ללא ספסל — אותה תנועה על הרצפה'},{name:'Cable Kickback',tag:'כבל — בידוד ישבן ללא עומס על גב'},{name:'Donkey Kick',tag:'ללא ציוד — 15–20 חזרות לצד'}],
  calfRaise:[{name:'Donkey Calf Raise',tag:'נוטה קדימה — מתיחה עמוקה ל-Gastrocnemius'},{name:'Seated Calf Raise',tag:'ישיבה = דגש על Soleus (שריר עמוק)'},{name:'Single-Leg Calf Raise',tag:'חד-רגלי ללא ציוד — כפל עומס'}],
  // ── ידיים ──
  bbCurl:[{name:'כפיפות משקולות',tag:'Dumbbell Curl — כל יד בנפרד'},{name:'Preacher Curl',tag:'מקנה גם ראש קצר בלבד — עיצוב'},{name:'כבל — כפיפות',tag:'Cable Curl — מתח קבוע'}],
  hammerCurl:[{name:'Incline Dumbbell Curl',tag:'נוטה אחורה — מתיחה מלאה ל-Long Head'},{name:'Cross-Body Hammer',tag:'חוצה גוף — דגש על Brachialis'},{name:'Cable Rope Curl',tag:'כבל חבל — מתח קבוע'}],
  skullCrusher:[{name:'Overhead EZ Extension',tag:'Long Head — אותה תנועה מעל הראש'},{name:'Overhead Dumbbell Extension',tag:'Long Head — משקולת בשתי ידיים'},{name:'Close-Grip Push-up',tag:'ללא ציוד — טריצפס בידוד'}],
  triPushdown:[{name:'Overhead Cable Extension',tag:'Long Head — מתיחה מלאה בכבל'},{name:'Kickbacks משקולות',tag:'בידוד טהור — ללא עומס אחר'},{name:'Close-Grip Push-up',tag:'ללא ציוד — טריצפס'}],
  // ── אמות ──
  wristCurl:[{name:'כפיפת פרק עם ריצועית',tag:'Resistance Band Wrist Curl'},{name:'אחיזת בקבוק מים',tag:'ללא ציוד — 3×60 שנ׳'},{name:'Farmer Hold',tag:'אחיזה סטטית — ניהול עומס'}],
  closeGripBench:[{name:'Diamond Push-up',tag:'ללא ציוד — טריצפס פנימי'},{name:'Dips במקביל',tag:'משקל גוף — כל ראשי הטריצפס'},{name:'Close-Grip Machine Press',tag:'מכונה — בטוח לפרקים'}],
  ezCurl:[{name:'Barbell Curl',tag:'מוט ישר — Supination מלאה'},{name:'Dumbbell Curl',tag:'כפיפות משקולות — כל יד בנפרד'},{name:'Scott Curl / Preacher',tag:'בידוד מלא — ללא תנופה'}],
  inclineCurl:[{name:'Concentration Curl',tag:'ריכוז — Long Head בידוד מלא'},{name:'Spider Curl',tag:'נוטה קדימה — Peak Bicep'},{name:'Cable Curl',tag:'כבל — מתח קבוע לאורך כל התנועה'}],
  ohTricep:[{name:'Overhead DB Extension',tag:'משקולת — Long Head'},{name:'French Press / EZ Overhead',tag:'מוט EZ — מתח בשיא'},{name:'Rope Overhead Extension',tag:'כבל חבל — מתח קבוע'}],
  bulgSplit:[{name:'Lunge עם משקולות',tag:'Dumbbell Lunge — פחות לחץ על גב'},{name:'Step-up על ספסל',tag:'פונקציונלי — נח יותר על ברך'},{name:'Single-Leg Press',tag:'חד-רגלי במכונה — בטוח למתחילים'}],
  arnoldPress:[{name:'DB Shoulder Press ישיבה',tag:'Seated Dumbbell Press — כיסוי מלא ללא סיבוב'},{name:'Machine Shoulder Press',tag:'מכונה — בטוח לגב תחתון ולכתפיים'},{name:'OHP בישיבה',tag:'Seated Barbell Press — עומס גבוה יותר'}],
  frontRaise:[{name:'Front Raise כבל נמוך',tag:'Cable Front Raise — מתח קבוע לאורך הטווח'},{name:'Plate Front Raise',tag:'דיסקית — אחיזה ניטרלית, קל יותר לשורש'},{name:'Incline Bench Front Raise',tag:'תמיכת גוף — מבטל תנופה לחלוטין'}],
  diamondPushup:[{name:'Tricep Dips בין שני ספסלים',tag:'Bench Dips — נח יותר לשורשי כף יד'},{name:'Close-Grip Machine Press',tag:'מכונה — בידוד טריצפס בלי עומס כתפיים'},{name:'Overhead DB Tricep Extension',tag:'Long Head — מגייס גם ראש ארוך'}],
  seatedCalfRaise:[{name:'Standing Calf Raise עם ברכיים כפופות',tag:'ברך כפופה = מדגיש Soleus כמו ישיבה'},{name:'Smith Machine Calf Raise בישיבה',tag:'יציב יותר, עמס גבוה יותר'},{name:'Resistance Band Calf Raise — ישיבה',tag:'ללא ציוד — ריצועית מתחת לברך'}],
  reverseWristCurl:[{name:'Reverse Curl עם מוט EZ',tag:'EZ Bar — פחות עומס על המרפקים'},{name:'Hammer Curl',tag:'אחיזה ניטרלית — מגייס גם Extensor'},{name:'Resistance Band Reverse Curl',tag:'ריצועית — ללא ציוד, מתח עקבי'}],
  farmerWalk:[{name:'Suitcase Carry',tag:'חד-צדדי — אתגר ליבה גדול יותר'},{name:'Plate Pinch Carry',tag:'אחיזת דיסקית — בידוד אצבעות'},{name:'Trap Bar Carry',tag:'Hex Bar — עמוד שדרה ניטרלי יותר'}],
  cableCurl:[{name:'EZ Bar Curl',tag:'מוט EZ — יותר עומס, פחות עומס מרפק'},{name:'Preacher Curl',tag:'Scott Bench — בידוד מלא, ללא תנופה'},{name:'Concentration Curl',tag:'ריכוז — בידוד Long Head, ללא ציוד כבל'}],
};

function showAlternatives(exKey, exName){
  const alts=EX_ALTERNATIVES[exKey];
  if(!alts||!alts.length){ showToast('אין חלופות מוגדרות לתרגיל זה'); return; }
  document.getElementById('alt-title').textContent='חלופות ל: '+exName;
  const list=document.getElementById('alt-list');
  list.innerHTML=alts.map(a=>`
    <div class="alt-item">
      <div><div class="alt-item-name">${_esc(a.name)}</div><div class="alt-item-tag">${_esc(a.tag)}</div></div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted2)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </div>`).join('');
  document.getElementById('alt-modal').classList.add('open');
}
function closeAltModal(){ document.getElementById('alt-modal').classList.remove('open'); }

function renderDashboardStats(u){
  if(!u) return;
  const n=calcNutrition(u);
  const w=u.weight||75;
  const g=u.goal||'lean_bulk';
  const act=u.activity||1.55;
  const surplusMap={lean_bulk:350,bulk:600,cut:-400,maintain:0};
  const surplus=surplusMap[g]??350;
  const surpLabel=surplus>0?'(+'+surplus+')':surplus<0?'('+surplus+')':'';
  const goalHe={lean_bulk:'עלייה נקייה',bulk:'מסה',cut:'הורדת שומן',maintain:'שמירה'};

  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
  const setW=(id,w)=>{const el=document.getElementById(id);if(el)el.style.width=w;};

  // goal badge color
  const badge=document.getElementById('dash-goal-badge');
  if(badge){
    badge.textContent=GOAL_LABELS[g]||g;
    const cls={lean_bulk:'badge-red',bulk:'badge-purple',cut:'badge-blue',maintain:'badge-green'};
    badge.className='badge '+(cls[g]||'badge-red');
  }

  // calories hero
  set('dash-cals', n.target.toLocaleString('he-IL'));

  // macros
  set('dash-protein', n.protein+'g');
  set('dash-carbs',   n.carbs+'g');
  set('dash-fat',     n.fat+'g');

  // BMR bar (BMR / target)
  set('dash-bmr-val', n.bmr.toLocaleString('he-IL')+' קל׳');
  setW('dash-bmr-bar', Math.min(100,Math.round(n.bmr/n.target*100))+'%');

  // TDEE bar
  set('dash-tdee-lbl', 'TDEE (×'+act+')');
  set('dash-tdee-val', n.tdee.toLocaleString('he-IL')+' קל׳');
  setW('dash-tdee-bar', Math.min(100,Math.round(n.tdee/n.target*100))+'%');

  // Target label
  set('dash-target-lbl', 'יעד '+goalHe[g]+' '+surpLabel);
  set('dash-target-val', n.target.toLocaleString('he-IL')+' קל׳');

  // Rings card
  set('ring-cals-label', n.target.toLocaleString('he-IL'));
  set('ring-cals-val',   n.target.toLocaleString('he-IL')+' קל׳');
  set('ring-protein-val', n.protein+'g');
  set('ring-carbs-val',   n.carbs+'g');
  set('ring-fat-val',     n.fat+'g');
  // Animate rings (outer=target display 70%, inner=protein pct 55%)
  const outerEl=document.getElementById('ring-cals-outer');
  const innerEl=document.getElementById('ring-protein-inner');
  if(outerEl) setTimeout(()=>{ outerEl.style.strokeDashoffset='95'; },150);
  if(innerEl) setTimeout(()=>{ innerEl.style.strokeDashoffset='110'; },300);

  // Timeline — strength goals based on bodyweight
  const bench=Math.round(w*1.3), squat=Math.round(w*1.6), dead=Math.round(w*2);
  const m5=document.getElementById('tl-m5');
  if(m5) m5.innerHTML=`שינוי דרמטי. <strong>+${Math.round(w*0.06)}–${Math.round(w*0.1)} ק״ג שריר נטו.</strong> לחיצת חזה ${bench} ק״ג, סקוואט ${squat} ק״ג. גוף מוצק.`;
  const m9=document.getElementById('tl-m9');
  if(m9) m9.innerHTML=`<strong>+${Math.round(w*0.1)}–${Math.round(w*0.15)} ק״ג שריר נטו</strong> — דדליפט ${dead} ק״ג. גוף שנבנה מחדש. שקול לעבור לחיטוב.`;

  // Dashboard nutrition preview — dynamic meal title + first 2 meals
  const goalHeName=goalHe[g]||g;
  set('dash-meal-title','ארוחות ל-'+goalHeName);
  try{
    const meals=getMealPlan(u,n);
    if(meals[0]){
      set('dash-meal-1-name', meals[0].name);
      set('dash-meal-1-macro', Math.round(n.protein*meals[0].pRat)+'g חלבון · '+Math.round(n.target*meals[0].pct)+' קל׳');
    }
    if(meals[1]){
      set('dash-meal-2-name', meals[1].name);
      set('dash-meal-2-macro', Math.round(n.protein*meals[1].pRat)+'g חלבון · '+Math.round(n.target*meals[1].pct)+' קל׳');
    }
  }catch(e){}
  // Achievements row in dashboard
  const achEl=document.getElementById('achievements-row');
  if(achEl){
    const unlocked=getUnlockedAchievements();
    achEl.innerHTML=unlocked.length===0
      ? '<span style="color:var(--muted);font-size:.8rem">השלם אימונים כדי לפתוח הישגים</span>'
      : unlocked.map(a=>`<div class="ach-badge" title="${a.desc}"><span class="ach-icon">${_ic(a.icon)}</span><span class="ach-name">${_esc(a.name)}</span></div>`).join('');
  }
}

// 6 possible meal slots per goal (index 0-5)
// slot: [name, time, basePct, pRat, cRat, fRat, foods[], tip, ?accent]
const MEAL_SLOT_POOL = {
  lean_bulk:[
    ['בוקר','07:30',0.22,0.24,0.27,0.22,['100g שיבולת שועל','ביצה + 2 חלבונים','200g קוטג׳ 1%','אוכמניות'],'Beta-Glucan בשיבולת שועל מוריד LDL'],
    ['ביניים','10:30',0.10,0.12,0.10,0.14,['200g יוגורט יווני 0%','20g אגוזי מלך','פירות יער'],'ביניים קל — מונע אכילת יתר בצהריים'],
    ['צהריים','13:00',0.28,0.30,0.28,0.26,['200g סלמון / עוף','150g אורז מלא','ירקות','כף שמן זית'],'EPA+DHA בסלמון מעלים HDL'],
    ['לפני אימון','(60–90 דק׳ לפני)',0.14,0.13,0.19,0.07,['2 פרוסות לחם שיפון','75g גבינה 1%','בננה','קפה שחור'],'פחמימות מהירות + מורכבות לאנרגיה מיטבית'],
    ['אחרי אימון','תוך 30–45 דק׳',0.17,0.24,0.20,0.05,['Whey Isolate','בננה','100g בטטה'],'Whey Isolate — ספיגה מהירה לחלון האנאבוליזם','red'],
    ['ערב','21:00',0.09,0.11,0.06,0.14,['150g דג לבן / הודו','סלט ירקות + לימון','¼ אבוקדו'],'אבוקדו — שומן חד-בלתי-רווי מוריד LDL'],
  ],
  bulk:[
    ['בוקר','07:30',0.24,0.23,0.28,0.24,['150g שיבולת שועל','3 ביצים שלמות','בננה','200ml חלב 3%'],'ארוחת בוקר כבדה = דלק להיום כולו'],
    ['ביניים','10:30',0.10,0.11,0.12,0.10,['200g קוטג׳','דבש','25g בוטנים'],'ביניים — קלוריות קלות לשמירה על עודף'],
    ['צהריים','13:00',0.30,0.32,0.29,0.27,['300g חזה עוף / בשר רזה','200g אורז לבן','ירקות','כף שמן זית'],'הארוחה הכי חשובה ביום — אל תדלג!'],
    ['לפני אימון','(60–90 דק׳ לפני)',0.14,0.13,0.21,0.07,['3 פרוסות לחם','3 ביצים קשות','תפוח'],'פחמימות מקסימליות לאנרגיה'],
    ['אחרי אימון','תוך 30 דק׳',0.15,0.22,0.18,0.05,['Whey + 200ml חלב','150g בטטה','כף דבש'],'חלון האנאבוליזם — ספיגה מיידית','red'],
    ['ערב','21:00',0.07,0.10,0.06,0.13,['200g הודו / דג','80g אורז','סלט'],'ערב — חלבון + פחמימות לשיקום שריר'],
  ],
  cut:[
    ['בוקר','07:30',0.24,0.28,0.24,0.18,['3 ביצים שלמות + 2 חלבונים','60g שיבולת שועל','ירקות'],'חלבון גבוה בבוקר = פחות רעב לאורך היום'],
    ['ביניים','10:30',0.10,0.14,0.06,0.08,['150g קוטג׳ 0%','ירקות חיים'],'ביניים חלבוני — שומר על מסת שריר תוך גירעון'],
    ['צהריים','13:00',0.33,0.36,0.30,0.24,['220g חזה עוף','סלט ירקות גדול','1.5 כף שמן זית','לימון'],'הארוחה הגדולה ביום — נפח מסלט מונע רעב'],
    ['לפני אימון','(60–90 דק׳ לפני)',0.12,0.13,0.16,0.07,['תפוח','2 ביצים קשות','קפה שחור'],'קפה לפני אימון = שריפת שומן משופרת'],
    ['אחרי אימון','תוך 30 דק׳',0.14,0.24,0.18,0.05,['Whey Isolate + מים','בננה קטנה'],'Whey Isolate = שיקום מינימלי קלורי','red'],
    ['ערב','21:00',0.07,0.15,0.03,0.10,['200g קוטג׳ 1%','ירקות חתוכים'],'קוטג׳ = קזאין איטי + שובע גבוה'],
  ],
  maintain:[
    ['בוקר','07:30',0.24,0.26,0.27,0.22,['80g שיבולת שועל','2 ביצים שלמות','150g קוטג׳','פירות'],'ארוחת בוקר מאוזנת = אנרגיה יציבה'],
    ['ביניים','10:30',0.10,0.12,0.10,0.12,['180g יוגורט יווני','פרי','15g שקדים'],'ביניים — מונע אכילת יתר בצהריים'],
    ['צהריים','13:00',0.30,0.31,0.30,0.25,['180g סלמון / עוף','130g אורז מלא','ירקות','שמן זית'],'הארוחה הכי חשובה — חלבון + פחמימות'],
    ['לפני אימון','(60–90 דק׳ לפני)',0.13,0.13,0.18,0.07,['2 פרוסות לחם','גבינה לבנה','בננה'],'ארוחה קלה לפני = ביצועים טובים יותר'],
    ['אחרי אימון','תוך 45 דק׳',0.15,0.22,0.20,0.05,['Whey + מים','100g בטטה'],'חלבון אחרי אימון = שמירה על מסת שריר','red'],
    ['ערב','21:00',0.08,0.12,0.06,0.13,['130g הודו / דג','סלט + לימון'],'ערב קל = שינה טובה יותר'],
  ],
};

// Which slots to use per meal count
const MEAL_SLOTS_BY_COUNT = {3:[0,2,5], 4:[0,2,4,5], 5:[0,2,3,4,5], 6:[0,1,2,3,4,5]};

/* ── Meal alternative foods (per slot index 0-5) ── */
// Each alternative array entry: [foods_array, tag_emoji]
// tag: 'לב' כולסטרול, 'צמחוני', 'חלבון' עתיר חלבון, '' — רגיל
const MEAL_FOOD_ALTS = {
  0:[
    [['שקשוקה 3 ביצים','עגבניות','עשבי תיבול','קפה שחור'],'חלבון'],
    [['2 פרוסות לחם שיפון','אבוקדו','גבינה לבנה 5%','ביצה'],''],
    [['פנקייק חלבון','דבש','אוכמניות','קפה לאטה'],'חלבון'],
    [['שיבולת שועל 50g','אוכמניות','שמן פשתן','קפה שחור'],'לב'],
    [['טופו מקושקש 150g','פלפל','עגבניה','שמרים תזונתיים'],'צמחוני'],
  ],
  1:[
    [['תפוח + 20g שקדים'],''],
    [['ירקות חיים + 100g חומוס'],'צמחוני'],
    [['25g אגוזי מלך + תפוז'],'לב'],
    [['100g גבינה 5% + עגבניות שרי'],'חלבון'],
    [['100g אדממה + לימון + מלח'],'צמחוני'],
  ],
  2:[
    [['200g הודו','150g קינואה','ירקות','שמן זית'],'חלבון'],
    [['200g טונה','סלט ירקות גדול','לחם מלא'],'לב'],
    [['4 ביצים','100g עדשים','סלט + לימון'],'צמחוני'],
    [['150g סלמון','ברוקולי','בטטה','שמן זית'],'לב'],
    [['150g חומוס','100g אורז מלא','ירקות','טחינה'],'צמחוני'],
  ],
  3:[
    [['בננה + 200g קוטג׳ 1%'],'חלבון'],
    [['תפוח + 2 ביצים קשות + קפה'],''],
    [['50g שיבולת שועל + דבש'],'לב'],
    [['20g צימוקים + 20g שקדים + קוטג׳'],''],
    [['30g אגוזי מלך + תפוז גדול'],'לב'],
  ],
  4:[
    [['Whey Isolate + מים + בננה'],'חלבון'],
    [['4 ביצים קשות + בננה'],'חלבון'],
    [['200g קוטג׳ 1% + דבש'],'חלבון'],
    [['בננה + 30g חמאת בוטנים טבעית'],'צמחוני'],
    [['200ml חלב דל שומן + 50g שיבולת שועל'],'לב'],
  ],
  5:[
    [['150g טונה + סלט ירקות + לימון'],'לב'],
    [['130g חזה עוף + ברוקולי מאודה'],'חלבון'],
    [['3 ביצים + גבינה + ירקות חיים'],''],
    [['150g סלמון אפוי + עלים + אבוקדו'],'לב'],
    [['150g עדשים + רוטב עגבניות + עשבים'],'צמחוני'],
  ],
};

function swapMeal(mealIdx){
  const key='pf_meal_swaps';
  const swaps=_getJSON(key,{});
  const alts=MEAL_FOOD_ALTS[mealIdx]||[];
  if(!alts.length) return;
  const cur=swaps[mealIdx]||0;
  swaps[mealIdx]=(cur+1)%(alts.length+1);
  localStorage.setItem(key,JSON.stringify(swaps));
  renderNutritionPanel();
}
// Helper: get foods array + tag from MEAL_FOOD_ALTS entry (supports old string[] and new [string[],tag] format)
function _getMealAltFoods(entry){ return Array.isArray(entry[0])?entry[0]:entry; }
function _getMealAltTag(entry){ return Array.isArray(entry[0])?(entry[1]||''):''; }

function getMealPlan(u,n){
  const g=u.goal||'lean_bulk';
  const count=u.meal_count||5;
  const pool=MEAL_SLOT_POOL[g]||MEAL_SLOT_POOL['lean_bulk'];
  const indices=MEAL_SLOTS_BY_COUNT[count]||MEAL_SLOTS_BY_COUNT[5];
  const selected=indices.map(i=>pool[i]);
  // Renormalize all ratios so daily totals always = 100%
  const totalPct =selected.reduce((s,t)=>s+t[2],0)||1;
  const totalPRat=selected.reduce((s,t)=>s+t[3],0)||1;
  const totalCRat=selected.reduce((s,t)=>s+t[4],0)||1;
  const totalFRat=selected.reduce((s,t)=>s+t[5],0)||1;
  return selected.map(t=>({
    name:t[0],time:t[1],
    pct:  t[2]/totalPct,
    pRat: t[3]/totalPRat,
    cRat: t[4]/totalCRat,
    fRat: t[5]/totalFRat,
    foods:t[6],tip:t[7],accent:t[8]
  }));
}

function _buildMealCard(m, i, n, swaps){
  const kcal=Math.round(n.target*m.pct);
  const p=Math.round(n.protein*m.pRat);
  const c=Math.round(n.carbs*m.cRat);
  const f=Math.round(n.fat*m.fRat);
  const borderStyle=m.accent==='red'?' style="border-color:rgba(232,168,124,.35);"':'';
  const timeStyle=m.accent==='red'?' style="color:var(--red)"':'';
  const tipColor='var(--muted2)';
  const alts=MEAL_FOOD_ALTS[i]||[];
  const swapIdx=swaps[i]||0;
  const activeAlt=swapIdx>0?alts[swapIdx-1]:null;
  const foods=activeAlt?_getMealAltFoods(activeAlt):m.foods;
  const activeTag=activeAlt?_getMealAltTag(activeAlt):'';
  const swapLabel=swapIdx>0?`${activeTag?activeTag+' · ':''}החלף (${swapIdx}/${alts.length})`:'החלף';
  const swapBtn=alts.length?`<button class="meal-swap-btn" onclick="swapMeal(${i})">${swapLabel}</button>`:'';
  return `<div class="meal-row"${borderStyle}>
    <div class="meal-top">
      <div><div class="meal-name">${m.name}</div><div class="meal-time"${timeStyle}>${m.time}</div></div>
      <div class="meal-cals-wrap"><div class="meal-cals">${kcal}</div><div class="meal-cals-unit">קל׳</div></div>
    </div>
    <div class="meal-foods">${foods.join(' · ')}</div>
    <div class="meal-tip-row">
      <div class="meal-tip" style="color:${tipColor}">${m.tip}</div>
      ${swapBtn}
    </div>
    <div class="meal-macros"><span class="mp mp-p">חלבון ${p}g</span><span class="mp mp-c">פחמימות ${c}g</span><span class="mp mp-f">שומן ${f}g</span></div>
  </div>`;
}
function renderNutritionPanel(){
  const u=getActiveUser();
  if(!u){
    const g=document.getElementById('macro-stats-grid');
    if(g) g.innerHTML='<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon"><svg class="ico"><use href="#i-utensils"/></svg></div><div class="empty-state-title">אין פרופיל פעיל</div><div class="empty-state-sub">הגדר פרופיל בהגדרות כדי לקבל תפריט תזונה אישי</div></div>';
    return;
  }
  const n=calcNutrition(u);
  const g=u.goal||'lean_bulk';

  // Macro stats
  const grid=document.getElementById('macro-stats-grid');
  const badge=document.getElementById('macro-goal-badge');
  const fatNote=document.getElementById('macro-fat-note');
  if(grid){
    grid.innerHTML=`
      <div class="stat-box red"><div class="val">${n.target.toLocaleString('he-IL')}</div><div class="lbl">קלוריות</div></div>
      <div class="stat-box blue"><div class="val">${n.protein}g</div><div class="lbl">חלבון (${(n.protein/u.weight).toFixed(1)}g/kg)</div></div>
      <div class="stat-box yellow"><div class="val">${n.carbs}g</div><div class="lbl">פחמימות</div></div>
      <div class="stat-box green"><div class="val">${n.fat}g</div><div class="lbl">שומן בריא</div></div>`;
  }
  if(badge) badge.textContent=GOAL_LABELS[g]||g;
  if(fatNote) fatNote.innerHTML=`הגוף שלך שורף בערך <strong>${n.tdee.toLocaleString()}</strong> קל׳ ביום. `
    +`היעד שלך: <strong style="color:var(--lime)">${n.target.toLocaleString()}</strong> קל׳`;

  const mealBadge=document.getElementById('meal-count-badge');
  if(mealBadge) mealBadge.textContent=(u.meal_count||5)+' ארוחות';

  const meals=getMealPlan(u,n);
  const cont=document.getElementById('meals-container');
  if(!cont) return;
  const swaps=_getJSON('pf_meal_swaps',{});
  cont.innerHTML=meals.map((m,i)=>_buildMealCard(m,i,n,swaps)).join('');

  applySettings({...getSettings(),calories:n.target,weight:u.weight});
}

function renderUserList(){
  const users=getUsers();
  const activeId=getActiveUserId();
  const ul=document.getElementById('user-list-ui');
  if(!ul) return;
  ul.innerHTML=users.map(u=>{
    const n=calcNutrition(u);
    const isActive=u.id===activeId;
    return `<div class="user-item${isActive?' active':''}" onclick="switchUser('${u.id}')">
      <div class="user-avatar-sm">${_esc((u.name||'?').charAt(0))}</div>
      <div class="user-item-info">
        <div class="user-item-name">${_esc(u.name)}</div>
        <div class="user-item-sub">${u.weight} ק״ג · ${u.height} ס״מ · ${GOAL_LABELS[u.goal]||u.goal} · ${n.target.toLocaleString()} קל׳</div>
      </div>
      ${isActive?'<div class="user-item-active-badge">פעיל</div>':''}
    </div>`;
  }).join('');
}

function switchUser(id){
  setActiveUserId(id);
  const u=getUsers().find(x=>x.id===id);
  if(!u) return;
  // Sync settings form and settings key
  const n=calcNutrition(u);
  saveSettings({name:u.name,weight:u.weight,height:u.height,age:u.age,calories:n.target});
  if(u.apiKey) localStorage.setItem('proFit_apiKey',u.apiKey);
  renderUserList();
  renderNutritionPanel();
  applyUserConditions(u);
  applySettings(getSettings());
  prefillSettingsForm();
  renderAdaptivePanels();
  initTodayHero();
  showToast('עברת ל-'+u.name+'');
}

let _sfCholesterol=false;
let _sfMealCount=5;

function selectSettingsMC(btn){
  document.querySelectorAll('[data-smc]').forEach(b=>b.classList.remove('sel'));
  btn.classList.add('sel');
  _sfMealCount=parseInt(btn.dataset.smc);
}
function toggleSettingsChol(){
  _sfCholesterol=!_sfCholesterol;
  document.getElementById('sf-chol-pill')?.classList.toggle('on',_sfCholesterol);
}

function prefillSettingsForm(){
  const s=getSettings();
  const u=getActiveUser()||{};
  const sf=document.getElementById('sf-name'); if(sf) sf.value=s.name;
  const sw=document.getElementById('sf-weight'); if(sw) sw.value=s.weight;
  const sh=document.getElementById('sf-height'); if(sh) sh.value=s.height;
  const sa=document.getElementById('sf-age'); if(sa) sa.value=s.age;
  const sc2=document.getElementById('sf-calories'); if(sc2) sc2.value=s.calories;
  const sk=document.getElementById('sf-apikey'); if(sk) sk.value=localStorage.getItem('proFit_apiKey')||'';
  // New fields from user record
  const sg=document.getElementById('sf-goal'); if(sg) sg.value=u.goal||'lean_bulk';
  const act=document.getElementById('sf-activity'); if(act) act.value=String(u.activity||1.55);
  const wt=document.getElementById('sf-workout-time'); if(wt) wt.value=u.workout_time||'18:00';
  const sgen=document.getElementById('sf-gender'); if(sgen) sgen.value=u.gender||'m';
  _sfMealCount=u.meal_count||5; _sfCholesterol=!!u.cholesterol;
  document.querySelectorAll('[data-smc]').forEach(b=>b.classList.toggle('sel',b.dataset.smc===String(_sfMealCount)));
  document.getElementById('sf-chol-pill')?.classList.toggle('on',_sfCholesterol);
  const sffreq=document.getElementById('sf-workout-freq'); if(sffreq) sffreq.value=String(u.workout_freq||4);
  const sfwrap=document.querySelector('.sf-split-wrap');
  const sfsplit3=document.getElementById('sf-workout-split-3');
  const sfsplit4=document.getElementById('sf-workout-split-4');
  const _f=parseInt(u.workout_freq)||4;
  if(sfwrap) sfwrap.style.display=(_f===3||_f===4)?'block':'none';
  if(sfsplit3){sfsplit3.value=['3ab','3abc','3ss'].includes(u.workout_split)?u.workout_split:'3abc';sfsplit3.style.display=_f===3?'block':'none';}
  if(sfsplit4){sfsplit4.value=u.workout_split==='4ab'?'4ab':'';sfsplit4.style.display=_f===4?'block':'none';}
  const sfloc=document.getElementById('sf-workout-location'); if(sfloc) sfloc.value=u.workout_location||'gym';
  const sfeq=document.getElementById('sf-home-equipment'); if(sfeq) sfeq.value=u.home_equipment||'none';
  const sfeqwrap=document.querySelector('.sf-homeeq-wrap');
  if(sfeqwrap) sfeqwrap.style.display=(u.workout_location==='home')?'block':'none';

}

// ─── Apply user-specific content visibility ───
function applyUserConditions(u){
  if(!u) return;
  const chol=!!u.cholesterol;
  // Cholesterol sections
  ['cholesterol-banner','cholesterol-dont-card'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.style.display=chol?'':'none';
  });
  // Omega-3 supplement — adjust text based on cholesterol
  const o3=document.getElementById('omega3-text');
  const o3card=document.getElementById('omega3-card');
  if(o3){
    if(chol){
      o3.innerHTML='מינון: <strong style="color:var(--green);">3–4g EPA+DHA ביום</strong><br>מפחית טריגליצרידים עד 30%<br>מעלה HDL (כולסטרול טוב)<br><span style="color:var(--green);">חשוב במיוחד עבורך</span>';
      if(o3card) o3card.style.borderColor='rgba(204,255,0,.4)';
      if(o3card) o3card.querySelector('div').textContent='אומגה 3 — עדיפות גבוהה!';
    } else {
      o3.innerHTML='מינון: <strong style="color:var(--green);">1–2g EPA+DHA ביום</strong><br>תומך בלב, מוח וירידת דלקת<br><span style="color:var(--green);">מומלץ לכולם</span>';
      if(o3card) o3card.style.borderColor='';
    }
  }
  // Workout time sync
  const wt=document.getElementById('workout-time-input');
  if(wt && u.workout_time) wt.value=u.workout_time;
}

// ─── Onboarding Wizard ───
let _obStep=1;
let _obGoal=null;
let _obActivity=null;
let _obCholesterol=false;
let _obMealCount=5;
let _isNewUserFlow=false;
let _obFreq=4;
let _obSplit=null;

function showOnboarding(){
  _obStep=1;_obGoal=null;_obActivity=null;
  document.querySelectorAll('.onboard-step').forEach(s=>s.classList.remove('active'));
  document.getElementById('ob-step-1')?.classList.add('active');
  document.querySelectorAll('.onboard-dot').forEach((d,i)=>{d.classList.toggle('active',i===0);});
  document.getElementById('ob-back').style.display='none';
  document.getElementById('ob-next').textContent='הבא ←';
  document.getElementById('onboard-overlay').style.display='flex';
}
function showOnboardingForNew(){
  _isNewUserFlow=true;
  _obMealCount=5; _obCholesterol=false; _obFreq=4; _obSplit=null;
  ['ob-name','ob-age','ob-weight','ob-height'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  document.getElementById('ob-gender').value='m';
  document.getElementById('ob-workout-time').value='18:00';
  document.querySelectorAll('.goal-btn,.act-btn').forEach(b=>b.classList.remove('sel'));
  // Reset meal count buttons
  document.querySelectorAll('.mc-btn').forEach(b=>b.classList.toggle('sel',b.dataset.mc==='5'));
  document.getElementById('ob-chol-pill')?.classList.remove('on');
  showOnboarding();
}
function selectGoal(btn){
  document.querySelectorAll('.goal-btn').forEach(b=>b.classList.remove('sel'));
  btn.classList.add('sel');
  _obGoal=btn.dataset.goal;
}
function selectMealCount(btn){
  document.querySelectorAll('.mc-btn').forEach(b=>b.classList.remove('sel'));
  btn.classList.add('sel');
  _obMealCount=parseInt(btn.dataset.mc);
}
function toggleChol(row){
  _obCholesterol=!_obCholesterol;
  document.getElementById('ob-chol-pill')?.classList.toggle('on',_obCholesterol);
}
function selectActivity(btn){
  document.querySelectorAll('.act-btn').forEach(b=>b.classList.remove('sel'));
  btn.classList.add('sel');
  _obActivity=parseFloat(btn.dataset.act);
}
function _updateObDots(step){
  for(let i=1;i<=4;i++){
    const d=document.getElementById('ob-dot-'+i);
    if(!d) continue;
    d.classList.remove('active','done');
    if(i<step) d.classList.add('done');
    else if(i===step) d.classList.add('active');
  }
}
function obNext(){
  if(_obStep===1){
    const name=(document.getElementById('ob-name')?.value||'').trim();
    const age=parseInt(document.getElementById('ob-age')?.value)||0;
    const weight=parseFloat(document.getElementById('ob-weight')?.value)||0;
    const height=parseFloat(document.getElementById('ob-height')?.value)||0;
    if(!name||!age||!weight||!height){showToast('מלא את כל השדות');return;}
    _obStep=2;
  } else if(_obStep===2){
    if(!_obGoal){showToast('בחר מטרה');return;}
    _obStep=3;
  } else if(_obStep===3){
    if(!_obActivity){showToast('בחר רמת פעילות');return;}
    _obStep=4;
  } else if(_obStep===4){
    obFinish();
    return;
  }
  document.querySelectorAll('.onboard-step').forEach(s=>s.classList.remove('active'));
  document.getElementById('ob-step-'+_obStep)?.classList.add('active');
  document.querySelectorAll('.onboard-dot').forEach((d,i)=>{d.classList.toggle('active',i===_obStep-1);});
  _updateObDots(_obStep);
  document.getElementById('ob-back').style.display='block';
  document.getElementById('ob-next').textContent=_obStep===4?'צור פרופיל ✓':'הבא ←';
  // Show/hide split selector in step 4
  if(_obStep===4) _updateSplitSelector();
}
function obBack(){
  if(_obStep<=1) return;
  _obStep--;
  document.querySelectorAll('.onboard-step').forEach(s=>s.classList.remove('active'));
  document.getElementById('ob-step-'+_obStep)?.classList.add('active');
  document.querySelectorAll('.onboard-dot').forEach((d,i)=>{d.classList.toggle('active',i===_obStep-1);});
  _updateObDots(_obStep);
  document.getElementById('ob-back').style.display=_obStep===1?'none':'block';
  document.getElementById('ob-next').textContent=_obStep===4?'צור פרופיל ✓':'הבא ←';
}
function selectObFreq(btn){
  document.querySelectorAll('.ob-freq-btn').forEach(b=>b.classList.remove('sel'));
  btn.classList.add('sel');
  _obFreq=parseInt(btn.dataset.freq);
  if(_obFreq!==3&&_obFreq!==4) _obSplit=null;
  if(_obFreq===7) showToast('7 ימים ברצף לא מומלץ — הגוף חייב מנוחה!');
  _updateSplitSelector();
}
function selectObSplit(btn){
  document.querySelectorAll('.ob-split-btn').forEach(b=>b.classList.remove('sel'));
  btn.classList.add('sel');
  _obSplit=btn.dataset.split;
}
function _updateSplitSelector(){
  const wrap=document.getElementById('ob-split-wrap');
  if(!wrap) return;
  const show=_obFreq===3||_obFreq===4;
  wrap.style.display=show?'block':'none';
  const s3=document.getElementById('ob-split-3');
  const s4=document.getElementById('ob-split-4');
  if(s3) s3.style.display=_obFreq===3?'grid':'none';
  if(s4) s4.style.display=_obFreq===4?'grid':'none';
  if(_obFreq===3&&!_obSplit){
    _obSplit='3abc';
    document.querySelectorAll('.ob-split-btn').forEach(b=>b.classList.toggle('sel',b.dataset.split==='3abc'));
  }
  if(_obFreq===4&&!_obSplit){
    _obSplit=null;
    document.querySelectorAll('.ob-split-btn').forEach(b=>b.classList.toggle('sel',b.dataset.split==='4'));
  }
}
function obFinish(){
  const name=(document.getElementById('ob-name')?.value||'').trim();
  const age=parseInt(document.getElementById('ob-age')?.value)||30;
  const weight=parseFloat(document.getElementById('ob-weight')?.value)||75;
  const height=parseFloat(document.getElementById('ob-height')?.value)||175;
  const gender=document.getElementById('ob-gender')?.value||'m';
  const workout_time=document.getElementById('ob-workout-time')?.value||'18:00';
  const user={
    id:'u_'+Date.now(),
    name,age,weight,height,gender,
    goal:_obGoal,activity:_obActivity,
    cholesterol:_obCholesterol,
    workout_time,
    meal_count:_obMealCount||5,
    workout_freq:_obFreq||4,
    workout_split:_obFreq===3?(_obSplit||'3abc'):_obFreq===4?(_obSplit||null):null,
  };
  const n=calcNutrition(user);
  user.calories=n.target;
  const users=getUsers();
  users.push(user);
  saveUsers(users);
  setActiveUserId(user.id);
  saveSettings({name,weight,height,age,calories:n.target});
  document.getElementById('onboard-overlay').style.display='none';
  renderUserList();
  renderNutritionPanel();
  applyUserConditions(user);
  applySettings(getSettings());
  renderDashboardStats(user);
  prefillSettingsForm();
  // Run full init if this was the first user
  if(!_isNewUserFlow){
    const dEl=document.getElementById('wl-date');
    if(dEl) dEl.value=todayStr();
    initTodayHero();
    initCheckboxes();
    updateStreak();
    renderHabits();
    renderWater();
    animateStats();
    renderWLog();
    renderWChart();
    if(localStorage.getItem('pf_installDismissed')){
      const b=document.getElementById('install-banner'); if(b) b.style.display='none';
    }
  }
  _isNewUserFlow=false;
  showToast('ברוך הבא, '+name+'!');
}

// ═══════════════════════════════════════════════════
// PERSONAL RECORDS
// ═══════════════════════════════════════════════════
const PR_KEY='proFit_pr';
function getPRs(){ try{return JSON.parse(localStorage.getItem(PR_KEY)||'{}')}catch(e){return{};} }
function savePRFromModal(){
  const key=_currentExKey; if(!key) return;
  const kg=parseFloat(document.getElementById('pr-kg')?.value);
  const reps=parseInt(document.getElementById('pr-reps')?.value);
  const disp=document.getElementById('pr-display');
  if(isNaN(kg)||isNaN(reps)||kg<=0||reps<=0){if(disp){disp.textContent='הזן ק"ג וחזרות';disp.style.color='var(--red)';}return;}
  const prs=getPRs(); const prev=prs[key];
  const isNew=!prev||kg>prev.kg||(kg===prev.kg&&reps>prev.reps);
  prs[key]={kg,reps,date:new Date().toISOString().slice(0,10)};
  localStorage.setItem(PR_KEY,JSON.stringify(prs));
  if(disp){
    disp.textContent=isNew?'שיא חדש! '+kg+'ק"ג × '+reps:'נשמר: '+kg+'ק"ג × '+reps;
    disp.style.color=isNew?'var(--yellow)':'var(--cyan)';
    disp.classList.remove('saved-flash');disp.offsetHeight;disp.classList.add('saved-flash');
    setTimeout(()=>disp.classList.remove('saved-flash'),450);
  }
  const saveBtn=document.querySelector('.pr-save-btn');
  if(saveBtn){saveBtn.style.animation='none';saveBtn.offsetHeight;saveBtn.style.animation='prSaveFlash .5s var(--ease-spring) both';setTimeout(()=>{saveBtn.style.animation='';},550);}
  if(isNew&&navigator.vibrate) navigator.vibrate([200,100,200,100,400]);
  if(isNew) showToast('שיא אישי חדש! '+kg+'ק"ג × '+reps+'');
  if(typeof addXP==='function') addXP(isNew?25:0);
  if(typeof updateORMDisplay==='function') updateORMDisplay(kg,reps);
}

// ═══════════════════════════════════════════════════
// MODAL SET LOG — per-set tracking with history
// ═══════════════════════════════════════════════════
const SETLOG_KEY='pf_setlog2';

function parseSetsCount(setsStr){
  const m=(setsStr||'').match(/^(\d+)/);
  return m?parseInt(m[1]):3;
}

function getModalSetHistory(key){
  try{return JSON.parse(localStorage.getItem(SETLOG_KEY)||'{}')[key]||[];}catch(e){return[];}
}

function renderSetLogInModal(key){
  const ex=EX[key]; if(!ex) return;
  const nSets=parseSetsCount(ex.sets||'3');
  const history=getModalSetHistory(key);
  const last=history[0];
  const today=todayStr();

  // Set rows
  let setRows='';
  for(let i=1;i<=nSets;i++){
    const prev=last?.sets?.[i-1];
    const prevHint=prev&&prev.kg?`${prev.kg}×${prev.reps}`:'';
    const todayVal=last?.date===today&&prev;
    setRows+=`<div class="msl-set-row">
      <span class="msl-set-num">סט ${i}</span>
      <div class="msl-inputs">
        <input class="msl-kg" id="msl-${key}-kg-${i}" type="number" min="0" step="0.5" placeholder="ק״ג" inputmode="decimal"${todayVal?` value="${prev.kg}"`:''}/>
        <span class="msl-x">×</span>
        <input class="msl-reps" id="msl-${key}-reps-${i}" type="number" min="0" step="1" placeholder="חז׳" inputmode="numeric"${todayVal?` value="${prev.reps}"`:''}/>
      </div>
      <span class="msl-prev-hint">${prevHint}</span>
    </div>`;
  }

  // History rows (past sessions, not today) — only new-format entries
  const past=history.filter(s=>s.date&&Array.isArray(s.sets)&&s.date!==today).slice(0,3);
  let histHTML='';
  if(past.length){
    const rows=past.map(s=>{
      const d=s.date.slice(5).replace('-','.');
      const line=s.sets.map(st=>st.kg?`${st.kg}×${st.reps}`:'—').join(' · ');
      return `<div class="msl-hist-row"><span class="msl-hist-date">${d}</span><span class="msl-hist-data">${line}</span></div>`;
    }).join('');
    histHTML=`<div class="msl-history"><div class="msl-hist-label">אימונים קודמים</div>${rows}</div>`;
  }

  const section=document.getElementById('m-setlog-section');
  if(!section) return;
  section.innerHTML=`<div class="msl-section">
    <div class="msl-header">
      <span class="msl-title">רשום את האימון</span>
      <span class="msl-subtitle">${ex.sets} · ${_exRest(ex)}</span>
    </div>
    <div class="msl-sets">${setRows}</div>
    <button class="msl-save-btn" onclick="saveModalSetLog('${key}',${nSets})">✓ שמור אימון</button>
    <div class="msl-saved-msg" id="msl-saved-${key}"></div>
    ${histHTML}
    <div class="orm-box" id="orm-box" style="display:none;">
      מקסימום תיאורטי (Epley): <strong id="orm-val">—</strong>
      <span style="font-size:.72rem;color:var(--muted);margin-right:6px;">= משקל × (1 + חזרות/30)</span>
    </div>
    <button id="pr-share-btn" onclick="openPRShareCard(this.dataset.key,+this.dataset.kg,+this.dataset.reps)" style="display:none;margin-top:10px;width:100%;background:linear-gradient(160deg,#FFD666,#CCFF00);border:none;border-radius:10px;padding:10px;color:#060608;font-weight:800;font-size:.9rem;cursor:pointer;font-family:var(--font);align-items:center;justify-content:center;gap:6px;">
      שתף את השיא שלך
    </button>
  </div>`;
}

function saveModalSetLog(key,nSets){
  const sets=[];
  let bestKg=0,bestReps=0;
  for(let i=1;i<=nSets;i++){
    const kg=parseFloat(document.getElementById(`msl-${key}-kg-${i}`)?.value)||0;
    const reps=parseInt(document.getElementById(`msl-${key}-reps-${i}`)?.value)||0;
    sets.push({kg,reps});
    if(kg>bestKg||(kg===bestKg&&reps>bestReps)){bestKg=kg;bestReps=reps;}
  }
  if(!sets.some(s=>s.kg>0)){
    const msg=document.getElementById(`msl-saved-${key}`);
    if(msg){msg.textContent='הזן לפחות סט אחד';msg.className='msl-saved-msg msl-saved-err';}
    return;
  }
  // Save to historical log
  const all=_getJSON(SETLOG_KEY,{});
  const arr=all[key]||[];
  const today=todayStr();
  const filtered=arr.filter(s=>s.date!==today);
  filtered.unshift({date:today,sets});
  all[key]=filtered.slice(0,20);
  _safeSet(SETLOG_KEY,JSON.stringify(all));
  // PR + elog
  if(bestKg>0){
    savePREntry(key,bestKg,bestReps);
    saveElogEntry(key,bestKg,bestReps);
    const orm=bestKg*(1+bestReps/30);
    const ormBox=document.getElementById('orm-box');
    const ormVal=document.getElementById('orm-val');
    if(ormBox&&ormVal){ormVal.textContent=orm.toFixed(1)+'ק״ג';ormBox.style.display='block';}
  }
  // Feedback
  const msg=document.getElementById(`msl-saved-${key}`);
  if(msg){
    const pr=(getPRs())[key];
    const isNew=pr&&bestKg>=pr.kg;
    msg.textContent=isNew?`שיא חדש! ${bestKg}ק״ג × ${bestReps}`:`✓ נשמר — ${bestKg}ק״ג × ${bestReps}`;
    msg.className='msl-saved-msg '+(isNew?'msl-saved-pr':'msl-saved-ok');
    if(isNew&&navigator.vibrate) navigator.vibrate([200,100,200,100,400]);
    if(isNew){
      launchConfetti();
      showToast('שיא אישי חדש! '+bestKg+'ק״ג × '+bestReps+'');
      // Add share PR button
      setTimeout(()=>{
        const shareBtn=document.getElementById('pr-share-btn');
        if(shareBtn){shareBtn.dataset.key=key;shareBtn.dataset.kg=bestKg;shareBtn.dataset.reps=bestReps;shareBtn.style.display='inline-flex';}
      },400);
    } else {
      setTimeout(()=>checkProgressiveSuggestion(key,bestKg,bestReps),600);
    }
    if(typeof addXP==='function') addXP(isNew?25:5);
    setTimeout(()=>renderSetLogInModal(key),350);
  }
  checkNewAchievements();
}

/** @param {string} key @param {number} kg @param {number} reps @returns {boolean} isNew */
function savePREntry(key,kg,reps){
  const prs=getPRs();
  const prev=prs[key];
  if(!prev||kg>prev.kg||(kg===prev.kg&&reps>prev.reps)){
    prs[key]={kg,reps,date:todayStr()};
    localStorage.setItem(PR_KEY,JSON.stringify(prs));
  }
  checkNewAchievements();
}

// ═══════════════════════════════════════════════════
// WORKOUT LOGGER (set checkboxes)
// ═══════════════════════════════════════════════════
const LOG_KEY='proFit_log';
function getLog(){ try{return JSON.parse(localStorage.getItem(LOG_KEY)||'{}')}catch(e){return{};} }
function saveLog(log){ _safeSet(LOG_KEY,JSON.stringify(log)); }
function todayStr(){ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }

function initCheckboxes(){
  const today=todayStr(); const log=getLog();
  document.querySelectorAll('.ex-table tbody tr[onclick]').forEach(tr=>{
    const m=tr.getAttribute('onclick').match(/openModal\('(\w+)'\)/);
    if(!m) return;
    const key=m[1];
    const ex=EX[key];
    const sc=Math.min(parseInt((ex?.sets||'3×10').split('×')[0])||3,6);
    const cell=tr.querySelector('.sets-cell');
    if(!cell||cell.querySelector('.set-checks')) return;
    const div=document.createElement('div');
    div.className='set-checks';
    for(let i=0;i<sc;i++){
      const box=document.createElement('div');
      box.className='set-check';
      const saved=log[today]?.[key]?.[i];
      if(saved){box.classList.add('done');box.textContent='✓';}
      box.addEventListener('click',function(e){
        e.stopPropagation();
        const done=!box.classList.contains('done');
        // Force spring animation re-trigger
        if(done){box.style.animation='none';box.offsetHeight;box.style.animation='';}
        box.classList.toggle('done',done);
        box.textContent=done?'✓':'';
        const l=getLog();
        if(!l[today]) l[today]={};
        if(!l[today][key]) l[today][key]={};
        l[today][key][i]=done;
        saveLog(l);
        if(navigator.vibrate) navigator.vibrate(25);
        updateExRow(tr,key);
        checkPanelDone(tr.closest('.panel'));
      });
      div.appendChild(box);
    }
    cell.appendChild(div);
    updateExRow(tr,key);
  });
}

function updateExRow(tr,key){
  const checks=[...tr.querySelectorAll('.set-check')];
  const all=checks.length>0&&checks.every(c=>c.classList.contains('done'));
  const nm=tr.querySelector('.ex-name-main');
  const en=tr.querySelector('.ex-name-en');
  if(nm) nm.classList.toggle('ex-done-text',all);
  if(en) en.classList.toggle('ex-done-en',all);
  tr.style.opacity=all?'0.55':'';
}

function checkPanelDone(panel){
  if(!panel) return;
  const rows=[...panel.querySelectorAll('.ex-table tbody tr[onclick]')];
  if(!rows.length) return;
  const all=rows.every(tr=>{
    const c=[...tr.querySelectorAll('.set-check')];
    return c.length>0&&c.every(b=>b.classList.contains('done'));
  });
  if(!all) return;
  const today=todayStr(); const log=getLog();
  if(log[today]?.__complete) return;
  if(!log[today]) log[today]={};
  log[today].__complete=true;
  saveLog(log);
  if(navigator.vibrate) navigator.vibrate([100,50,200]);
  updateStreak();
  if(typeof addXP==='function') addXP(50);
  checkNewAchievements();
  // confetti-ish message
  const ct=document.getElementById('celebrate-text');
  const day=panel.id.replace('panel-','').toUpperCase();
  if(ct) ct.innerHTML=`כל הכבוד! סיימת את יום ה-${day}.<br>הגוף שלך מתחזק מאימון לאימון.`;
  document.getElementById('celebrate-overlay').classList.add('show');
  document.body.style.overflow='hidden';
  setTimeout(fireConfetti,200);
}

function closeCelebration(){
  document.getElementById('celebrate-overlay').classList.remove('show');
  document.body.style.overflow='';
}

// ═══════════════════════════════════════════════════
// STREAK
// ═══════════════════════════════════════════════════
const TRAIN_DAYS=[0,1,3,4]; // fallback default (4×/week PPL+Arms)
const HEB_DAYS2=['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];

// Optimal day-of-week spread per weekly frequency — used when a plan is
// re-timed to a frequency it wasn't authored for (home plans ship fixed at 3/4 days)
const DOWS_BY_FREQ={1:[3],2:[1,4],3:[0,2,4],4:[0,1,3,4],5:[0,1,3,4,5],6:[0,1,2,3,4,5],7:[0,1,2,3,4,5,6]};

// Resolves the active plan key: home mode (by equipment) > gym freq/split
function _getPlanKey(u){
  if((u?.workout_location||'gym')==='home'){
    const eq=u?.home_equipment||'none';
    return eq==='db'?'home_db4':eq==='band'?'home_band3':'home_bw3';
  }
  const freq=parseInt(u?.workout_freq)||4;
  const split=u?.workout_split||null;
  return freq===3?(split||'3abc'):freq===4?(split||4):freq;
}

// Returns the plan object, re-timed to the user's chosen frequency when the
// stock plan's day count doesn't match it
function _resolvePlan(u){
  const plan=WORKOUT_PLANS[_getPlanKey(u)];
  if(!plan) return null;
  const dows=plan.dows||TRAIN_DAYS;
  const freq=parseInt(u?.workout_freq)||dows.length;
  if(freq===dows.length||!DOWS_BY_FREQ[freq]) return plan;
  const nd=DOWS_BY_FREQ[freq];
  const HD=['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','שבת'];
  return {...plan,dows:nd,
    schedule:nd.map((d,i)=>HD[d]+' '+(plan.days[i%plan.days.length].shortLabel||'')).join(' · ')+' — '+freq+' אימונים בשבוע'};
}

// Returns train days (day-of-week indexes) for the user's active plan
function _getTrainDays(u){
  return _resolvePlan(u)?.dows||TRAIN_DAYS;
}

function computeStreak(){
  const log=getLog();
  const trainDays=_getTrainDays(getActiveUser&&getActiveUser());
  let streak=0;
  const today=new Date();
  for(let i=1;i<90;i++){
    const d=new Date(today); d.setDate(today.getDate()-i);
    const dow=d.getDay();
    if(!trainDays.includes(dow)) continue;
    const ds=d.toISOString().slice(0,10);
    if(log[ds]?.__complete) streak++;
    else break;
  }
  return streak;
}

function getAchievementStats(){
  const log=getLog(); const prs=getPRs();
  const totalWorkouts=Object.values(log).filter(d=>d&&Object.values(d).some(v=>v===true||v===1)).length;
  const totalPRs=Object.keys(prs).length;
  const streak=computeStreak();
  return {totalWorkouts,totalPRs,streak};
}

function getUnlockedAchievements(){
  const s=getAchievementStats();
  return ACHIEVEMENTS.filter(a=>a.check(s));
}

function checkNewAchievements(){
  const ACH_KEY='pf_achievements_seen';
  const seen=new Set(_getJSON(ACH_KEY,[]));
  const unlocked=getUnlockedAchievements();
  const newOnes=unlocked.filter(a=>!seen.has(a.id));
  if(newOnes.length>0){
    newOnes.forEach(a=>{
      seen.add(a.id);
      setTimeout(()=>{
        showToast('הישג חדש: '+a.name+'!');
        if(navigator.vibrate) navigator.vibrate([100,50,100,50,200]);
      }, newOnes.indexOf(a)*1200);
    });
    localStorage.setItem(ACH_KEY,JSON.stringify([...seen]));
  }
}

/** Weekly summary widget — workouts done, PRs, total volume over last 7 days */
function renderWeeklySummary(){
  const el=document.getElementById('weekly-summary'); if(!el) return;
  const log=getLog();
  const setlog=_getJSON(SETLOG_KEY,{});
  const today=new Date();
  let workouts=0, volume=0, prs=0;
  const weekDates=[];
  for(let i=0;i<7;i++){
    const d=new Date(today); d.setDate(today.getDate()-i);
    weekDates.push(d.toISOString().slice(0,10));
  }
  // workouts completed this week
  weekDates.forEach(ds=>{ if(log[ds]&&Object.values(log[ds]).some(v=>v===true||v===1)) workouts++; });
  // volume + PRs this week from set log
  Object.values(setlog).forEach(arr=>{
    if(!Array.isArray(arr)) return;
    arr.forEach(entry=>{
      if(entry.date&&weekDates.includes(entry.date)&&Array.isArray(entry.sets)){
        entry.sets.forEach(s=>{ volume+=(s.kg||0)*(s.reps||0); });
      }
    });
  });
  // PRs set this week
  Object.values(getPRs()).forEach(pr=>{ if(pr.date&&weekDates.includes(pr.date)) prs++; });

  if(workouts===0&&volume===0){
    el.innerHTML=`<div class="empty-state" style="padding:24px 16px;">
      <div class="empty-state-icon"><svg class="ico"><use href="#i-dumbbell"/></svg></div>
      <div class="empty-state-title">בוא נתחיל</div>
      <div class="empty-state-sub">השלם את האימון הראשון שלך השבוע — ${(_resolvePlan(getActiveUser())?.days||[]).map(d=>d.shortLabel).filter(Boolean).join(' · ')||'בחר אימון'} למעלה</div>
    </div>`;
    return;
  }
  const volK=volume>=1000?(volume/1000).toFixed(1)+' טון':Math.round(volume)+' ק"ג';
  const title=workouts>=4?'שבוע מעולה!':workouts>=2?'בדרך הנכונה':'התחלה טובה';
  el.innerHTML=`<div class="weekly-summary">
    <div class="row-between mb-4">
      <span class="text-h3">${title}</span>
      <span class="text-meta text-muted">7 ימים אחרונים</span>
    </div>
    <div class="weekly-stats">
      <div style="text-align:center;flex:1;">
        <div class="weekly-stat-val">${workouts}</div>
        <div class="weekly-stat-label">אימונים</div>
      </div>
      <div style="text-align:center;flex:1;">
        <div class="weekly-stat-val">${volK}</div>
        <div class="weekly-stat-label">נפח כולל</div>
      </div>
      <div style="text-align:center;flex:1;">
        <div class="weekly-stat-val">${prs}</div>
        <div class="weekly-stat-label">שיאים</div>
      </div>
    </div>
  </div>`;
}

function updateStreak(){
  renderWeeklySummary();
  const n=computeStreak();
  ['streak-num','streak-num2'].forEach(id=>{const el=document.getElementById(id);if(el){countUp(el,n);}});
  const msgs=[[0,0,'מתחילים'],[1,3,'התחלה טובה'],[4,7,'אחלה קצב'],[8,14,'מכונה'],[15,999,'אגדה']];
  const msg=(msgs.find(([lo,hi])=>n>=lo&&n<=hi)||msgs[0])[2];
  ['streak-msg','streak-msg2'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=msg;});
  // Motivational micro-copy based on streak
  const streak=n;
  const microCopy=[
    [0,0,''],
    [1,2,'כל מסע מתחיל בצעד הראשון'],
    [3,4,'הרגל מתגבש — אל תפסיק עכשיו!'],
    [5,6,'שבוע אימונים — אתה בנוי אחרת'],
    [7,9,'שבוע שלם! הגוף שלך מודה לך'],
    [10,14,'הרמה הבאה — אתה מכונה'],
    [15,20,'ביצועים של ספורטאי אמיתי'],
    [21,999,'אגדה חיה — ${streak} ימים ברצף'],
  ];
  const micro=(microCopy.find(([lo,hi])=>streak>=lo&&streak<=hi)||microCopy[0])[2];
  const microEl=document.getElementById('streak-micro');
  if(microEl&&micro) microEl.textContent=micro.replace('${streak}',streak);
  // week workouts count
  const log=getLog();
  const today=new Date();
  const trainDays=_getTrainDays(getActiveUser&&getActiveUser());
  let done=0;
  for(let i=0;i<7;i++){
    const d=new Date(today);d.setDate(today.getDate()-i);
    const ds=d.toISOString().slice(0,10);
    if(trainDays.includes(d.getDay())&&log[ds]?.__complete) done++;
  }
  const el=document.getElementById('week-workouts-display');
  if(el) el.textContent=done+' / '+trainDays.length+' אימונים';
}

// ─── HABITS ──────────────────────────────────────────────────────────────
const HABIT_KEY='pf_habits';
function getHabitsToday(){
  const stored=_getJSON(HABIT_KEY,{});
  if(stored.date===todayStr()) return stored.checked||[false,false,false,false,false];
  return [false,false,false,false,false];
}
function saveHabitsToday(arr){
  localStorage.setItem(HABIT_KEY,JSON.stringify({date:todayStr(),checked:arr}));
}
function renderHabits(){
  const checked=getHabitsToday();
  const count=checked.filter(Boolean).length;
  const badge=document.getElementById('habit-count-badge');
  if(badge) badge.textContent=count+'/5';
  checked.forEach((v,i)=>{
    const cb=document.getElementById('habit-cb-'+i);
    const lbl=document.getElementById('habit-lbl-'+i);
    if(!cb) return;
    cb.checked=v;
    if(lbl){
      lbl.style.textDecoration=v?'line-through':'none';
      lbl.style.opacity=v?'0.5':'1';
    }
  });
}
function toggleHabit(i){
  const arr=getHabitsToday();
  arr[i]=!arr[i];
  saveHabitsToday(arr);
  renderHabits();
}

// ─── WATER TRACKER ───────────────────────────────────────────────────────
const WATER_KEY='pf_water';
function getWaterToday(){
  try{
    const stored=JSON.parse(localStorage.getItem(WATER_KEY)||'{}');
    return stored.date===todayStr()?stored.cups||0:0;
  }catch(e){return 0;}
}
function saveWaterToday(cups){
  localStorage.setItem(WATER_KEY,JSON.stringify({date:todayStr(),cups}));
}
function addWaterCup(){
  const cups=Math.min(CONFIG.WATER_GOAL*2,getWaterToday()+1);
  saveWaterToday(cups);renderWater();
}
function removeWaterCup(){
  const cups=Math.max(0,getWaterToday()-1);
  saveWaterToday(cups);renderWater();
}
function renderWater(){
  const cups=getWaterToday();
  const el=document.getElementById('water-display');
  const bar=document.getElementById('water-bar');
  if(el) el.textContent=cups;
  const wd=document.getElementById('water-dash-display');
  if(wd) wd.textContent=cups;
  if(bar) bar.style.width=Math.min(100,Math.round((cups/CONFIG.WATER_GOAL)*100))+'%';
}

// ═══════════════════════════════════════════════════
// TODAY HERO BANNER
// ═══════════════════════════════════════════════════
/* Per-workout label badge — shown instead of emoji */
const DAY_CFG={
  0:{panel:'push',badge:'דחיפה',color:'#FF6B6B',label:'חזה · כתפיים · טריצפס',sub:'יום דחיפה',meta:'כ־55 דק׳ · 7 תרגילים'},
  1:{panel:'pull',badge:'משיכה',color:'#00D9FF',label:'גב · בייסס · כתף אחורית',sub:'יום משיכה',meta:'כ־55 דק׳ · 7 תרגילים'},
  3:{panel:'legs',badge:'רגליים',color:'#B47CFF',label:'ירכיים · ירך אחורי · שוק',sub:'יום רגליים',meta:'כ־65 דק׳ · 7 תרגילים'},
  4:{panel:'arms',badge:'ידיים',color:'#FF7A45',label:'בייסס · טריצפס · כתפיים',sub:'יום ידיים',meta:'כ־50 דק׳ · 7 תרגילים'}
};
// Builds a day-of-week→config map from the user's active plan.
// Days rotate across the plan's dows, so a 2-day plan can fill 3 training days.
function _buildDayCfg(u){
  const plan=_resolvePlan(u);
  if(!plan||!plan.days||!plan.days.length) return DAY_CFG;
  const dows=plan.dows||[0,1,3,4];
  const result={};
  dows.forEach((dow,i)=>{
    const day=plan.days[i%plan.days.length];
    const n=day.exercises?day.exercises.length:6;
    const mins=day.estMin||45+n*5;
    result[dow]={
      panel:day.id,
      badge:day.shortLabel||day.label.slice(0,6),
      color:day.color||'#CCFF00',
      label:day.label,
      sub:(day.label||'').split('—').slice(1).join('—').trim()||day.shortLabel||'',
      meta:`כ־${mins} דק׳ · ${n} תרגילים`
    };
  });
  return result;
}
const HEB_DAYS3=['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
const HEB_DAYS_SHORT=['א׳','ב׳','ג׳','ד׳','ה׳','ו׳',''];

function _renderDashChips(activeDayCfg){
  const row=document.getElementById('dash-week-row');
  if(!row) return;
  const HEB_SHORT=['א׳','ב׳','ג׳','ד׳','ה׳','ו׳'];
  row.innerHTML=HEB_SHORT.map((ltr,i)=>{
    const cfg=activeDayCfg[i];
    if(cfg){
      const short=cfg.badge||cfg.sub;
      return `<div class="dash-day-chip">
        <span class="ddc-dot" style="background:${cfg.color}"></span>
        <span class="ddc-name">${ltr}</span>
        <span class="ddc-type" style="color:${cfg.color}">${short}</span>
      </div>`;
    }
    return `<div class="dash-day-chip ddc-rest">
      <span class="ddc-dot ddc-dot-rest"></span>
      <span class="ddc-name">${ltr}</span>
      <span class="ddc-type">מנוחה</span>
    </div>`;
  }).join('');
}

function _renderWeekBar(activeDayCfg){
  const bar=document.querySelector('.week-bar');
  if(!bar) return;
  bar.innerHTML=HEB_DAYS3.map((name,i)=>{
    const cfg=activeDayCfg[i];
    const letter=HEB_DAYS_SHORT[i];
    if(cfg){
      const label=cfg.label.split(' — ').pop().split(' · ').slice(0,2).join(' · ');
      return `<button class="day-cell" onclick="goDay('${cfg.panel}')" data-type="${cfg.panel}" aria-label="${name}: ${cfg.label}">
        <div class="dc-name">${name} ${letter}</div>
        <div class="dc-icon"><span class="dc-dot" style="background:${cfg.color}"></span></div>
        <div class="dc-type" style="color:${cfg.color}">${cfg.badge}</div>
        <div class="dc-label">${label}</div>
      </button>`;
    }
    return `<button class="day-cell rest-day" disabled aria-label="${name}: מנוחה">
      <div class="dc-name">${name} ${letter}</div>
      <div class="dc-icon"><span class="dc-dot" style="background:transparent;border:1.5px solid var(--muted2)"></span></div>
      <div class="dc-type" style="color:var(--muted2)">מנוחה</div>
      <div class="dc-label">שיקום</div>
    </button>`;
  }).join('');
}

function initTodayHero(){
  const d=new Date().getDay();
  const hero=document.getElementById('today-hero');
  if(!hero) return;
  const u=getActiveUser();
  const activeDayCfg=u?_buildDayCfg(u):DAY_CFG;
  const cfg=activeDayCfg[d];
  const log=getLog(); const today=todayStr();
  const done=log[today]?.__complete;
  if(cfg){
    hero.style.cssText='';
    hero.style.setProperty('--hero-glow', cfg.color+'55');
    hero.style.cursor='pointer';
    const timeSvg=`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
    const exSvg=`<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
    hero.innerHTML=`
      <div class="hero-top-row">
        <span class="hero-badge">היום · יום ${HEB_DAYS3[d]}${done?' ✓':''}</span>
        <button class="hero-play" onclick="event.stopPropagation();showPanel('${cfg.panel}',null);">
          <svg viewBox="0 0 24 24" fill="#000"><polygon points="5,3 19,12 5,21"/></svg>
        </button>
      </div>
      <div class="hero-bottom">
        <div class="today-hero-info">
          <div class="today-hero-title">${cfg.badge}</div>
          <div class="today-hero-day">${cfg.sub}</div>
        </div>
        <div class="hero-wk-meta">
          <span class="hero-meta-chip">${timeSvg}${cfg.meta.split(' · ')[0]}</span>
          <span class="hero-meta-chip">${exSvg}${cfg.meta.split(' · ')[1]}</span>
          ${done?'<span class="today-hero-hint">✓ הושלם היום!</span>':''}
        </div>
      </div>`;
    hero.onclick=()=>{ showPanel(cfg.panel,null); };
  } else {
    hero.style.cssText='';
    hero.style.background='linear-gradient(135deg,rgba(126,242,154,.12),rgba(126,242,154,.04))';
    hero.style.border='1px solid rgba(126,242,154,.25)';
    hero.style.cursor='default';
    hero.innerHTML=`
      <div class="hero-top-row">
        <span class="hero-badge" style="background:rgba(126,242,154,.15);color:var(--green);">יום מנוחה</span>
      </div>
      <div class="hero-bottom">
        <div class="today-hero-info">
          <div class="today-hero-day">יום ${HEB_DAYS3[d]}</div>
          <div class="today-hero-title" style="color:#fff;">שיקום ושינה</div>
          <div class="today-hero-sub">הגוף גדל כשאתה נח. תזונה, שינה, ריפוי.</div>
        </div>
      </div>`;
  }
  // Rebuild week bar + dash chips from user's plan
  _renderWeekBar(activeDayCfg);
  _renderDashChips(activeDayCfg);
  // Highlight today + mark completed days this week + count
  const fullLog=getLog();
  const DAY_PANEL={};
  Object.entries(activeDayCfg).forEach(([dow,cfg])=>{DAY_PANEL[parseInt(dow)]=cfg.panel;});
  const totalWorkoutDays=Object.keys(activeDayCfg).length;
  const now=new Date();
  const mon=new Date(now);mon.setDate(now.getDate()-((now.getDay()+6)%7));
  let weekDone=0;
  document.querySelectorAll('.week-bar .day-cell').forEach((c,i)=>{
    c.classList.toggle('active-day',i===d);
    const panel=DAY_PANEL[i];
    if(panel){
      for(let j=0;j<7;j++){
        const dt=new Date(mon);dt.setDate(mon.getDate()+j);
        const key=dt.toISOString().slice(0,10);
        if(fullLog[key]?.__complete){
          const dow=dt.getDay();
          if(dow===i){c.classList.add('done-day');weekDone++;break;}
        }
      }
    }
  });
  // Sync dash-week-row active state
  const dashChips=document.querySelectorAll('#dash-week-row .dash-day-chip');
  dashChips.forEach((c,i)=>{
    c.classList.remove('ddc-active','ddc-done');
    if(i===d) c.classList.add('ddc-active');
  });
  // mark done days in dash carousel too
  document.querySelectorAll('.week-bar .day-cell.done-day').forEach((c,i)=>{
    const idx=[...c.parentElement.children].indexOf(c);
    if(dashChips[idx]) dashChips[idx].classList.add('ddc-done');
  });
  // Update week counter
  const wc=document.getElementById('week-counter');
  if(wc){
    const color=weekDone>=totalWorkoutDays?'var(--green)':weekDone>=Math.ceil(totalWorkoutDays/2)?'var(--yellow)':'var(--muted)';
    wc.innerHTML=`<span class="wk-frac" style="color:${color}">${weekDone} / ${totalWorkoutDays}</span>`
                +`<span style="color:var(--muted);font-size:.72rem;font-weight:600;"> אימונים</span>`;
  }
}

// ═══════════════════════════════════════════════════
// ANIMATED STATS
// ═══════════════════════════════════════════════════
function animateStats(){
  const targets=[
    ...document.querySelectorAll('#panel-dashboard .stat-box .val'),
    ...document.querySelectorAll('.cals-hero-num')
  ];
  targets.forEach(el=>{
    const raw=el.textContent.replace(/,/g,'');
    const num=parseFloat(raw);
    if(isNaN(num)) return;
    const suffix=el.textContent.replace(/[\d,\.]/g,'');
    const start=performance.now();
    const dur=900;
    (function step(now){
      const t=Math.min((now-start)/dur,1);
      const ease=1-Math.pow(1-t,3);
      el.textContent=Math.round(ease*num).toLocaleString('he-IL')+suffix;
      if(t<1) requestAnimationFrame(step);
    })(start);
  });
}

// ═══════════════════════════════════════════════════
// REST TIMER
// ═══════════════════════════════════════════════════
let _timerIv=null, _timerTotal=0, _timerRemain=0, _timerEndAt=0;
let _lastTimerSec=parseInt(localStorage.getItem('pf_lastTimer')||'90');
const CIRC=2*Math.PI*24; // r=24

// Background timer — resume when page becomes visible again
document.addEventListener('visibilitychange',()=>{
  if(!document.hidden && _timerIv && _timerEndAt){
    const remain=Math.max(0,Math.round((_timerEndAt-Date.now())/1000));
    _timerRemain=remain;
    if(remain<=0){ clearInterval(_timerIv); _timerIv=null;
      document.getElementById('timer-btn')?.classList.remove('running');
      document.getElementById('timer-ring')?.classList.remove('show');
      document.getElementById('timer-btn').textContent='מנוחה';
    } else tickTimer();
  }
});

// ESC key closes gym mode
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if(document.getElementById('gym-overlay')?.classList.contains('open')) confirmCloseGymMode();
    if(document.getElementById('gym-set-popup')?.classList.contains('show'))
      document.getElementById('gym-set-popup').classList.remove('show');
  }
});

function onTimerBtnClick(){
  if(_timerIv){ cancelTimer(); }
  else {
    // Show presets panel — highlight last used
    const presets=document.getElementById('timer-presets');
    presets?.classList.toggle('show');
    presets?.querySelectorAll('button').forEach(b=>{
      b.style.fontWeight=parseInt(b.dataset.sec)===_lastTimerSec?'900':'';
      b.style.borderColor=parseInt(b.dataset.sec)===_lastTimerSec?'var(--blue)':'';
    });
  }
}
function pickTimer(sec){
  document.getElementById('timer-presets').classList.remove('show');
  if(_timerIv){ clearInterval(_timerIv); _timerIv=null; }
  _lastTimerSec=sec; localStorage.setItem('pf_lastTimer',String(sec));
  _timerTotal=sec; _timerRemain=sec; _timerEndAt=Date.now()+sec*1000;
  const btn=document.getElementById('timer-btn');
  const ring=document.getElementById('timer-ring');
  btn.classList.add('running');
  ring.classList.add('show');
  tickTimer();
  _timerIv=setInterval(()=>{
    _timerRemain--;
    tickTimer();
    if(_timerRemain<=0){
      clearInterval(_timerIv); _timerIv=null;
      btn.classList.remove('running');
      ring.classList.remove('show');
      btn.textContent='מנוחה';
      if(navigator.vibrate) navigator.vibrate([200,100,200]);
    }
  },1000);
}
function cancelTimer(){
  if(_timerIv){clearInterval(_timerIv);_timerIv=null;}
  document.getElementById('timer-btn').classList.remove('running');
  document.getElementById('timer-ring').classList.remove('show');
  document.getElementById('timer-btn').textContent='מנוחה';
}
function tickTimer(){
  const m=Math.floor(_timerRemain/60), s=_timerRemain%60;
  document.getElementById('timer-btn').textContent=m+':'+(s<10?'0':'')+s;
  document.getElementById('ring-text').textContent=m+':'+(s<10?'0':'')+s;
  const prog=document.getElementById('ring-prog');
  if(prog&&_timerTotal>0) prog.style.strokeDashoffset=CIRC*(1-_timerRemain/_timerTotal);
}

// ═══════════════════════════════════════════════════
// WEIGHT CHART
// ═══════════════════════════════════════════════════
const WLOG_KEY='proFit_weight';
function getWLog(){ try{return JSON.parse(localStorage.getItem(WLOG_KEY)||'[]')}catch(e){return[];} }
function addWeightForm(){
  const dEl=document.getElementById('wl-date');
  const kEl=document.getElementById('wl-kg');
  const date=dEl?.value; const kg=parseFloat(kEl?.value);
  if(!date||isNaN(kg)||kg<20||kg>350) return;
  const log=getWLog();
  const idx=log.findIndex(e=>e.date===date);
  if(idx>=0) log[idx].kg=kg; else log.push({date,kg});
  log.sort((a,b)=>a.date.localeCompare(b.date));
  localStorage.setItem(WLOG_KEY,JSON.stringify(log));
  if(kEl) kEl.value='';
  // Sync latest weight to active user profile so BMR stays current
  const _au=getActiveUser();
  if(_au){ _au.weight=kg; const us=getUsers(); const idx2=us.findIndex(u=>u.id===_au.id); if(idx2>=0){us[idx2]=_au; localStorage.setItem(USERS_KEY,JSON.stringify(us)); invalidateUserCache();} }
  showToast('משקל נשמר — '+kg+' ק"ג');
  renderWLog(); renderWChart();
}
function deleteWEntry(date){
  const log=getWLog().filter(e=>e.date!==date);
  localStorage.setItem(WLOG_KEY,JSON.stringify(log));
  renderWLog(); renderWChart();
}
function renderWLog(){
  const el=document.getElementById('weight-log-list'); if(!el) return;
  const log=getWLog();
  if(!log.length){el.innerHTML='<div style="color:var(--muted);font-size:.85rem;padding:6px 0;">אין רשומות עדיין — הוסף מדידה ראשונה!</div>';return;}
  const sorted=log.slice().sort((a,b)=>a.date.localeCompare(b.date));
  const first=sorted[0].kg, latest=sorted[sorted.length-1].kg;
  const pct=first>0?((latest-first)/first*100):0;
  const pctStr=(pct>=0?'+':'')+pct.toFixed(1)+'%';
  const pctColor=pct>0?'var(--red)':pct<0?'var(--lime)':'var(--muted)';
  const u=getActiveUser();
  const h=(u&&u.height)||0;
  const bmiHtml=h>0?`<div style="text-align:center;">
    <div style="font-size:1.1rem;font-weight:800;color:var(--cyan);">${(latest/((h/100)**2)).toFixed(1)}</div>
    <div style="font-size:.65rem;color:var(--muted);margin-top:2px;">BMI</div>
  </div>`:'';
  const statsHtml=`<div style="display:flex;gap:12px;justify-content:space-around;background:var(--glass);border:1px solid var(--border);border-radius:12px;padding:12px 8px;margin-bottom:10px;">
    <div style="text-align:center;">
      <div style="font-size:1.1rem;font-weight:800;color:var(--cyan);">${latest} ק"ג</div>
      <div style="font-size:.65rem;color:var(--muted);margin-top:2px;">עכשיו</div>
    </div>
    <div style="text-align:center;">
      <div style="font-size:1.1rem;font-weight:800;color:${pctColor};">${pctStr}</div>
      <div style="font-size:.65rem;color:var(--muted);margin-top:2px;">שינוי</div>
    </div>
    ${bmiHtml}
  </div>`;
  el.innerHTML=statsHtml+log.slice().reverse().map(e=>`<div class="wlog-entry">
    <span>${e.date.split('-').reverse().join('/')}</span>
    <strong style="color:var(--cyan)">${e.kg} ק"ג</strong>
    <button class="wlog-del" onclick="deleteWEntry('${e.date}')">✕</button>
  </div>`).join('');
}
function renderWChart(){
  const svg=document.getElementById('weight-svg'); if(!svg) return;
  const log=getWLog();
  if(log.length<2){svg.innerHTML='<text x="50%" y="50%" text-anchor="middle" fill="var(--muted)" font-family="Segoe UI,sans-serif" font-size="13">הוסף לפחות 2 מדידות לגרף</text>';return;}
  const W=600,H=200,P={t:24,r:52,b:36,l:46};
  const n=log.length;
  const xs=i=>P.l+(i/(n-1))*(W-P.l-P.r);

  // ── Weight (blue, left Y) ──
  const kgs=log.map(e=>e.kg);
  const minK=Math.min(...kgs)-0.5, maxK=Math.max(...kgs)+0.5;
  const ysK=k=>P.t+(1-(k-minK)/(maxK-minK))*(H-P.t-P.b);

  // ── Weekly Volume from elog (red, right Y) ──
  function getWeekKey(dateStr){const d=new Date(dateStr);const day=d.getDay();const diff=d.getDate()-(day||7)+1;const mon=new Date(d);mon.setDate(diff);return mon.toISOString().slice(0,10);}
  const elog=(() => { try{return JSON.parse(localStorage.getItem(ELOG_KEY)||'{}')}catch(e){return{};} })();
  const volByWeek={};
  Object.values(elog).forEach(arr=>{
    if(!Array.isArray(arr)) return;
    arr.forEach(entry=>{
      if(!entry.date||!entry.kg||!entry.reps) return;
      const wk=getWeekKey(entry.date);
      volByWeek[wk]=(volByWeek[wk]||0)+Math.round(entry.kg*entry.reps*(entry.sets||1));
    });
  });
  const vols=log.map(e=>volByWeek[getWeekKey(e.date)]||0);
  const hasVol=vols.some(v=>v>0);
  const maxV=hasVol?Math.max(...vols)+100:1;
  const ysV=v=>P.t+(1-(v/maxV))*(H-P.t-P.b);

  let h=`<defs>
    
    <linearGradient id="ca" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#CCFF00" stop-opacity=".25"/><stop offset="100%" stop-color="#CCFF00" stop-opacity="0"/></linearGradient>
  </defs>`;

  // Grid lines (left axis — weight)
  for(let r=0;r<4;r++){
    const y=P.t+r*(H-P.t-P.b)/3;
    const v=(maxK-(maxK-minK)*r/3).toFixed(1);
    h+=`<line x1="${P.l}" y1="${y}" x2="${W-P.r}" y2="${y}" stroke="#1e2433" stroke-width="1"/>`;
    // skip an axis label that would land on top of the last point's label
    const lastY=ysK(log[n-1].kg);
    if(Math.abs(y-lastY)>20)
      h+=`<text x="${W-P.r+6}" y="${y+4}" text-anchor="start" fill="#8d97a5" font-size="11" font-family="Barlow,sans-serif">${v}</text>`;
    if(hasVol){const vv=Math.round(maxV*(1-r/3));h+=`<text x="${P.l-6}" y="${y+4}" text-anchor="end" fill="#FF7A45" font-size="10" font-family="Barlow,sans-serif" opacity=".7">${vv}</text>`;}
  }

  // Volume area + line (red) — behind weight
  if(hasVol){
    const vPts=vols.map((v,i)=>`${xs(i)},${ysV(v)}`).join(' ');
    h+=`<polygon points="${xs(0)},${H-P.b} ${vPts} ${xs(n-1)},${H-P.b}" fill="rgba(255,122,69,.08)"/>`;
    h+=`<polyline points="${vPts}" fill="none" stroke="#FF7A45" stroke-width="1.5" stroke-dasharray="4,3" stroke-linejoin="round" stroke-linecap="round" opacity=".7"/>`;
    vols.forEach((v,i)=>{if(v>0)h+=`<circle cx="${xs(i)}" cy="${ysV(v)}" r="3" fill="#FF7A45" opacity=".7"/>`;});
  }

  // Weight area + line (blue) — on top
  const pts=log.map((e,i)=>`${xs(i)},${ysK(e.kg)}`).join(' ');
  h+=`<polygon points="${xs(0)},${H-P.b} ${pts} ${xs(n-1)},${H-P.b}" fill="url(#ca)"/>`;
  h+=`<polyline points="${pts}" fill="none" stroke="#CCFF00" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  log.forEach((e,i)=>{
    h+=`<circle cx="${xs(i)}" cy="${ysK(e.kg)}" r="4" fill="#CCFF00" stroke="#000" stroke-width="2"/>`;
    // the last point sits against the value axis, so its label leans inward
    // instead of landing on top of the axis label
    if(n<=8||i===0||i===n-1){
      const last=i===n-1;
      h+=`<text x="${xs(i)+(last?-7:0)}" y="${ysK(e.kg)-9}" text-anchor="${last?'end':'middle'}" fill="#eaf0fb" font-size="10" font-weight="700" font-family="Barlow,sans-serif">${e.kg}</text>`;
    }
  });

  // X-axis date labels
  const step=Math.max(1,Math.floor(n/6));
  log.forEach((e,i)=>{if(i%step===0||i===n-1)h+=`<text x="${xs(i)}" y="${H-P.b+15}" text-anchor="middle" fill="#8d97a5" font-size="11" font-family="Barlow,sans-serif">${e.date.slice(8)+'.'+e.date.slice(5,7)}</text>`;});

  // One visible series needs no legend; a second one does. The old legend sat
  // at H-P.b+28, which is inside the x-axis label band at H-P.b+14.
  if(hasVol){
    h+=`<circle cx="${P.l+4}" cy="${H-P.b+30}" r="3.5" fill="#CCFF00"/>`;
    h+=`<text x="${P.l+11}" y="${H-P.b+34}" fill="#6b7a99" font-size="10" font-family="Barlow,sans-serif">משקל</text>`;
    h+=`<line x1="${P.l+58}" y1="${H-P.b+30}" x2="${P.l+70}" y2="${H-P.b+30}" stroke="#FF7A45" stroke-width="1.5" stroke-dasharray="4,2"/>`;
    h+=`<text x="${P.l+74}" y="${H-P.b+34}" fill="#FF7A45" font-size="10" font-family="Barlow,sans-serif" opacity=".8">נפח שבועי</text>`;
  }

  // the extra 36 units were reserved for the legend; without one they are
  // just blank canvas below the plot
  svg.setAttribute('viewBox',`0 0 ${W} ${H+(hasVol?36:8)}`);
  // an empty string is not a valid SVG length; to let CSS size the chart the
  // attribute has to be removed, not blanked
  svg.removeAttribute('height');
  svg.innerHTML=h;
}

// ═══════════════════════════════════════════════════
// INSTALL BANNER
// ═══════════════════════════════════════════════════
function dismissInstallBanner(){
  localStorage.setItem('pf_installDismissed','1');
  document.getElementById('install-banner').style.display='none';
}

// ═══════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════
window.addEventListener('load',()=>{
  // ── Migrate old single-user settings → multi-user ──
  if(!localStorage.getItem(USERS_KEY)){
    const old=localStorage.getItem(SETTINGS_KEY);
    if(old){
      try{
        const s=JSON.parse(old);
        const migrated={id:'u_0',name:s.name||'המשתמש שלי',age:s.age||31,weight:s.weight||60,height:s.height||170,gender:'m',goal:'lean_bulk',activity:1.55,calories:s.calories||2750};
        const apiKey=localStorage.getItem('proFit_apiKey');
        if(apiKey) migrated.apiKey=apiKey;
        saveUsers([migrated]);
        setActiveUserId('u_0');
      }catch(e){}
    }
  }
  // ── Show onboarding if no users ──
  if(getUsers().length===0){
    setTimeout(()=>{
      const sp=document.getElementById('splash');
      if(sp){sp.classList.add('out');setTimeout(()=>sp.remove(),600);}
    },1300);
    showOnboarding();
    return; // defer rest of init until onboarding complete
  }

  const s=getSettings();
  applySettings(s);
  renderNutritionPanel();
  renderUserList();
  applyUserConditions(getActiveUser());
  // Pre-fill settings form
  prefillSettingsForm();
  // Set today's date in weight log form
  const dEl=document.getElementById('wl-date');
  if(dEl) dEl.value=todayStr();
  initTodayHero();
  initCheckboxes();
  updateStreak();
  renderHabits();
  renderWater();
  animateStats();
  renderWLog();
  renderWChart();
  // Install banner
  if(localStorage.getItem('pf_installDismissed')){
    const b=document.getElementById('install-banner'); if(b) b.style.display='none';
  }
  // Splash fade-out
  setTimeout(()=>{
    const sp=document.getElementById('splash');
    if(sp){sp.classList.add('out');setTimeout(()=>sp.remove(),600);}
  },1300);
  // Render adaptive workout panels based on user frequency
  renderAdaptivePanels();
  // Inject swap buttons into exercise rows that have alternatives
  injectSwapButtons();
  // Inject set-log rows into all exercise tables
  injectSetLogRows();
});

// Rows are data. The two controls that used to live here (alternatives, set
// log) are both in the modal that a row tap opens, so injecting them into the
// muscle cell only made every row louder than the exercise it described.
function injectSwapButtons(){ /* superseded by the modal's "החלף תרגיל" */ }
function _injectSwapButtons_unused(){
  // Map onclick attr to key
  document.querySelectorAll('.ex-table tbody tr[onclick]').forEach(tr=>{
    const m=tr.getAttribute('onclick')?.match(/openModal\('(\w+)'\)/);
    if(!m) return;
    const key=m[1];
    if(!EX_ALTERNATIVES[key]) return;
    const nameCell=tr.querySelector('.ex-name-main');
    const actionCell=tr.querySelector('td:nth-child(3)')||nameCell;
    if(!nameCell||actionCell.querySelector('.ex-swap-btn')) return;
    const btn=document.createElement('button');
    btn.className='ex-swap-btn';
    btn.textContent='חלופות';
    btn.title='הצג תרגילים חלופיים';
    btn.onclick=(e)=>{e.stopPropagation();showAlternatives(key,(EX[key]?.name||nameCell.textContent).trim());};
    actionCell.appendChild(btn);
  });
}

function injectSetLogRows(){ /* superseded by renderSetLogInModal */ }
function _injectSetLogRows_unused(){
  document.querySelectorAll('.ex-table tbody tr[onclick]').forEach(tr=>{
    const m=tr.getAttribute('onclick')?.match(/openModal\('(\w+)'\)/);
    if(!m) return;
    const key=m[1];
    const setsCell=tr.querySelector('td:nth-child(4)');
    const setsText=setsCell?.textContent||'3';
    const nSets=parseInt(setsText)||3;
    const nameCell=tr.querySelector('.ex-name-main');
    const actionCell=tr.querySelector('td:nth-child(3)')||nameCell;
    if(!nameCell||actionCell.querySelector('.sl-btn')) return;
    const btn=document.createElement('button');
    btn.className='sl-btn';
    btn.textContent='סטים';
    btn.setAttribute('data-key',key);
    btn.onclick=(e)=>{
      e.stopPropagation();
      const logRow=document.getElementById('slr-'+key);
      if(!logRow) return;
      const open=logRow.style.display==='table-row';
      logRow.style.display=open?'none':'table-row';
      btn.classList.toggle('open',!open);
      if(!open) prefillSetLog(key,nSets);
    };
    actionCell.appendChild(btn);
    const logTr=document.createElement('tr');
    logTr.className='set-log-row';
    logTr.id='slr-'+key;
    logTr.style.display='none';
    const td=document.createElement('td');
    td.colSpan=6;
    td.innerHTML=buildSetLogHTML(key,nSets);
    logTr.appendChild(td);
    tr.insertAdjacentElement('afterend',logTr);
  });
}

function buildSetLogHTML(key,nSets){
  let rows='';
  for(let i=1;i<=nSets;i++){
    rows+=`<div class="sl-set-row">
      <span class="sl-set-label">סט ${i}</span>
      <input class="sl-kg" id="sl-${key}-kg-${i}" type="number" min="0" step="0.5" placeholder="ק״ג">
      <span class="sl-x">×</span>
      <input class="sl-reps" id="sl-${key}-reps-${i}" type="number" min="0" step="1" placeholder="חז׳">
    </div>`;
  }
  return `<div class="set-log-box">
    ${rows}
    <div style="display:flex;align-items:center;gap:12px;margin-top:4px;">
      <button class="sl-save-btn" onclick="saveSetLog('${key}',${nSets})">שמור</button>
      <span class="sl-saved" id="sl-saved-${key}">✓ נשמר</span>
    </div>
  </div>`;
}

function prefillSetLog(key,nSets){
  const history=(_getJSON(SETLOG_KEY,{}))[key]||[];
  const last=Array.isArray(history)&&history[0];
  // Support both formats: new [{date,sets:[{kg,reps}]}] and old [{kg,reps}]
  const saved=Array.isArray(last?.sets)?last.sets:(Array.isArray(history)&&history[0]?.kg!=null?history:[]);
  for(let i=1;i<=nSets;i++){
    const s=saved[i-1]||{};
    const kgEl=document.getElementById(`sl-${key}-kg-${i}`);
    const repsEl=document.getElementById(`sl-${key}-reps-${i}`);
    if(kgEl&&s.kg) kgEl.value=s.kg;
    if(repsEl&&s.reps) repsEl.value=s.reps;
  }
}

function saveSetLog(key,nSets){
  const sets=[];
  let bestKg=0,bestReps=0;
  for(let i=1;i<=nSets;i++){
    const kg=parseFloat(document.getElementById(`sl-${key}-kg-${i}`)?.value)||0;
    const reps=parseInt(document.getElementById(`sl-${key}-reps-${i}`)?.value)||0;
    sets.push({kg,reps});
    if(kg>bestKg){bestKg=kg;bestReps=reps;}
  }
  // Save in new format {date, sets} — compatible with saveModalSetLog
  const all=_getJSON(SETLOG_KEY,{});
  const arr=(all[key]||[]).filter(s=>s.date&&s.date!==todayStr());
  arr.unshift({date:todayStr(),sets});
  all[key]=arr.slice(0,20);
  _safeSet(SETLOG_KEY,JSON.stringify(all));
  // PR detection — match modal path so both routes give identical outcomes
  let isNew=false;
  if(bestKg>0){
    const prevPR=(getPRs())[key];
    isNew=!prevPR||bestKg>prevPR.kg||(bestKg===prevPR.kg&&bestReps>prevPR.reps);
    savePREntry(key,bestKg,bestReps);
    saveElogEntry(key,bestKg,bestReps);
  }
  const saved=document.getElementById('sl-saved-'+key);
  if(saved){saved.classList.add('show');setTimeout(()=>saved.classList.remove('show'),2000);}
  if(isNew){
    if(navigator.vibrate) navigator.vibrate([200,100,200,100,400]);
    launchConfetti();
    showToast('שיא אישי חדש! '+bestKg+'ק״ג × '+bestReps+'');
    if(typeof addXP==='function') addXP(25);
  } else if(bestKg>0){
    showToast('סט נשמר — '+bestKg+'ק״ג × '+bestReps);
    if(typeof addXP==='function') addXP(5);
    setTimeout(()=>checkProgressiveSuggestion(key,bestKg,bestReps),600);
  }
  checkNewAchievements();
}

// Close timer presets if clicking elsewhere
document.addEventListener('click',e=>{
  if(!e.target.closest('.timer-float')) document.getElementById('timer-presets')?.classList.remove('show');
  if(!e.target.closest('.food-search-wrap')) document.querySelectorAll('.food-dropdown').forEach(d=>d.classList.remove('show'));
});

// ═══════════════════════════════════════════════════
// EMOJI REMOVAL — professional look
// ═══════════════════════════════════════════════════
function cleanEmojis(){
  const rx=/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}]/gu;
  // Card headers h2 — remove emoji from text nodes only
  document.querySelectorAll('.card-head h2').forEach(h2=>{
    h2.childNodes.forEach(n=>{if(n.nodeType===3) n.textContent=n.textContent.replace(rx,'').trimStart();});
  });
  // Trainer notes strong
  document.querySelectorAll('.trainer-note strong').forEach(el=>{
    el.childNodes.forEach(n=>{if(n.nodeType===3) n.textContent=n.textContent.replace(rx,'').trimStart();});
  });
  // Page title in topbar
  const pt=document.getElementById('page-title');
  if(pt) pt.textContent=pt.textContent.replace(rx,'').trimStart();
  // Today hero — handled by initTodayHero (uses cfg.icon only for rest days)
  // Week bar day types
  document.querySelectorAll('.dc-type,.dc-name').forEach(el=>{
    el.textContent=el.textContent.replace(rx,'').trimStart();
  });
}

// ═══════════════════════════════════════════════════
// TRAINING LOG (יומן משקלים)
// ═══════════════════════════════════════════════════
const ELOG_KEY='proFit_elog';
function getElog(){ try{return JSON.parse(localStorage.getItem(ELOG_KEY)||'{}')}catch(e){return{};} }
/** @param {string} key @param {number} kg @param {number} reps */
function saveElogEntry(key,kg,reps){
  if(!key||typeof kg!=='number'||kg<0||kg>500)return;
  if(typeof reps!=='number'||reps<1||reps>100)return;
  const log=getElog();
  if(!log[key]) log[key]=[];
  const today=todayStr();
  // Remove existing entry for today if any
  const idx=log[key].findIndex(e=>e.date===today);
  if(idx>=0) log[key][idx]={date:today,kg,reps};
  else log[key].unshift({date:today,kg,reps});
  // Keep last 15 entries
  log[key]=log[key].slice(0,CONFIG.MAX_ELOG_ENTRIES);
  _safeSet(ELOG_KEY,JSON.stringify(log));
}

// ─── COACH: Progressive Overload Analysis ───────────────────────────────────
/** @param {string} setsStr @returns {{min:number,max:number}} */
function _parseRepRange(setsStr){
  const m=(setsStr||'').match(/\d+[×xX](\d+)(?:[–\-](\d+))?/);
  if(!m) return {min:8,max:12};
  return {min:parseInt(m[1]),max:parseInt(m[2]||m[1])};
}
/** @param {string} exKey @returns {{icon:string,msg:string,type:string}|null} */
function getCoachTip(exKey){
  const ex=EX[exKey]; if(!ex) return null;
  const hist=(getElog()[exKey]||[]).slice(0,5);
  if(hist.length<2) return null;
  const range=_parseRepRange(ex.sets);
  const r0=hist[0];
  // Stagnation: 4+ sessions identical kg + reps
  if(hist.length>=CONFIG.COACH_STAGNATION&&hist.slice(0,CONFIG.COACH_STAGNATION).every(r=>r.kg===r0.kg&&r.reps===r0.reps))
    return {icon:'refresh',msg:`קיפאון — ${CONFIG.COACH_STAGNATION} אימונים ב-${r0.kg}ק"ג × ${r0.reps} חזרות. שנה תרגיל או עצימות.`,type:'change'};
  // Weight increase: last 2+ sessions at or above max reps, same kg
  const topSessions=hist.filter(r=>r.reps>=range.max);
  if(topSessions.length>=CONFIG.COACH_INCREASE_MIN&&hist[0].kg===hist[1].kg)
    return {icon:'arrow-up',msg:`מעולה — ${topSessions.length} אימונים ב-${r0.reps}+ חזרות. הגיע הזמן להעלות +2.5ק"ג!`,type:'increase'};
  // One more: last session hit max
  if(hist[0].reps>=range.max)
    return {icon:'dumbbell',msg:`אימון מצוין (${r0.reps} חזרות)! עוד אימון אחד כזה ותעלה משקל.`,type:'almost'};
  // Too heavy: last 2 sessions below min reps
  if(hist.slice(0,2).every(r=>r.reps<range.min))
    return {icon:'arrow-down',msg:`המשקל כבד מדי (${r0.reps} חזרות, מטרה ${range.min}+). נסה להוריד 2.5ק"ג.`,type:'decrease'};
  return null;
}

// ─── ANIMATIONS & VISUAL EFFECTS ────────────────────────────────────────────

/**
 * @param {HTMLElement} el
 * @param {number} to
 * @param {number} [duration=700]
 */
function countUp(el,to,duration=700){
  if(!el||isNaN(to)) return;
  const from=parseInt(el.textContent)||0;
  if(from===to) return;
  const start=performance.now();
  const diff=to-from;
  function frame(now){
    const t=Math.min((now-start)/duration,1);
    const ease=1-Math.pow(1-t,3);
    el.textContent=Math.round(from+diff*ease);
    if(t<1) requestAnimationFrame(frame);
    else el.textContent=to;
  }
  requestAnimationFrame(frame);
}

/** @returns {void} — delegates to fireConfetti which uses #confetti-canvas */
function launchConfetti(){ fireConfetti(); }

/**
 * @param {string} exKey
 * @returns {string} SVG HTML or ''
 */
function _buildSparkline(exKey){
  const hist=(getElog()[exKey]||[]).slice(0,CONFIG.SPARKLINE_SESSIONS).reverse();
  if(hist.length<2) return '';
  const W=60,H=20,P=2;
  const vals=hist.map(e=>e.kg||0);
  const min=Math.min(...vals),max=Math.max(...vals),range=max-min||1;
  const pts=vals.map((v,i)=>{
    const x=P+(i/(vals.length-1))*(W-P*2);
    const y=H-P-(v-min)/range*(H-P*2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const up=vals[vals.length-1]>=vals[0];
  const col=up?'var(--lime)':'var(--red)';
  const [lx,ly]=pts[pts.length-1].split(',');
  return `<svg class="ex-spark" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">
    <polyline points="${pts.join(' ')}" fill="none" stroke="${col}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>
    <circle cx="${lx}" cy="${ly}" r="2.5" fill="${col}"/>
  </svg>`;
}

/** @returns {void} */
function injectSparklines(){
  document.querySelectorAll('.ex-table tbody tr[onclick]').forEach(tr=>{
    if(tr.querySelector('.ex-spark')) return;
    const m=tr.getAttribute('onclick')?.match(/openModal\('(\w+)'\)/);
    if(!m) return;
    const spark=_buildSparkline(m[1]);
    if(!spark) return;
    tr.querySelector('.ex-name-en')?.insertAdjacentHTML('afterend',spark);
  });
}

const WORKOUT_ORDER=[
  {id:'push',label:'דחיפה — ראשון',color:'var(--push-c)'},
  {id:'pull',label:'משיכה — שני',color:'var(--pull-c)'},
  {id:'legs',label:'רגליים — רביעי',color:'var(--legs-c)'},
  {id:'arms',label:'ידיים — חמישי',color:'var(--arms-c)'}
];

function renderElogPanel(){
  const wrap=document.getElementById('elog-content');
  if(!wrap) return;
  // Show skeleton while building content
  if(wrap.children.length===0){
    wrap.innerHTML='<div class="skeleton skeleton-title"></div>'+
      Array(3).fill('<div class="skeleton skeleton-card"></div>').join('');
  }
  const elog=getElog();
  // Empty state
  const hasData=Object.values(elog).some(week=>Object.values(week).some(ex=>Object.keys(ex).length>0));
  if(!hasData){
    wrap.innerHTML=`<div class="elog-empty-state">
      <div class="elog-empty-icon"><svg class="ico"><use href="#i-book"/></svg></div>
      <div class="elog-empty-title">יומן המשקלים שלך ריק</div>
      <div class="elog-empty-sub">כאן תרשום את המשקל שאתה מרים בכל תרגיל.<br>הנתונים נשמרים מקומית — רק אצלך.</div>
      <button class="elog-empty-cta" onclick="showPanel('push')">← פתח אימון והתחל לרשום</button>
    </div>`;
    return;
  }
  let html='';
  WORKOUT_ORDER.forEach(w=>{
    const panel=document.getElementById('panel-'+w.id);
    if(!panel) return;
    const rows=[...panel.querySelectorAll('.ex-table tbody tr[onclick]')];
    if(!rows.length) return;
    html+=`<div class="elog-section">
      <div class="elog-section-title" style="background:rgba(255,255,255,.04);color:${w.color};border-right:3px solid ${w.color};">${w.label}</div>`;
    rows.forEach(tr=>{
      const m=tr.getAttribute('onclick').match(/openModal\('(\w+)'\)/);
      if(!m) return;
      const key=m[1]; const ex=EX[key]; if(!ex) return;
      const hist=elog[key]||[];
      const last=hist[0];
      // History chips (last 3 excluding today)
      const today=todayStr();
      const chips=hist.filter(e=>e.date!==today).slice(0,3)
        .map(e=>`<span class="elog-hist-chip">${e.date.slice(5)} — ${e.kg}ק"ג×${e.reps}</span>`).join('');
      const todayEntry=hist.find(e=>e.date===today);
      const spark=_buildSparkline(key);
      const tip=getCoachTip(key);
      const tipHtml=tip?`<div class="elog-coach-tip elog-tip-${tip.type}">${_ic(tip.icon)} ${tip.msg}</div>`:'';
      html+=`<div class="elog-row" id="elog-row-${key}">
        <div class="elog-ex-info">
          <div style="display:flex;align-items:center;gap:8px;">
            <div class="elog-ex-name">${ex.name}</div>
            ${spark}
          </div>
          <div class="elog-ex-en" style="font-size:.72rem;color:var(--muted);margin-top:1px;">${ex.en}</div>
          <div class="elog-history">
            ${todayEntry?`<span class="elog-hist-chip latest">היום: ${todayEntry.kg} ק״ג × ${todayEntry.reps}</span>`:''}
            ${chips}
            ${!chips&&!todayEntry?'<span style="color:var(--muted);font-size:.72rem;">אין היסטוריה עדיין</span>':''}
          </div>
          ${tipHtml}
        </div>
        <div class="elog-inputs">
          <button class="elog-inc-btn" onclick="elogAdjust('${key}',-2.5)">−</button>
          <input class="elog-input" id="elog-kg-${key}" type="number" min="0" step="0.5" placeholder="ק״ג" value="${todayEntry?todayEntry.kg:last?last.kg:''}" style="width:62px;"/>
          <span class="elog-x">×</span>
          <input class="elog-input" id="elog-reps-${key}" type="number" min="1" max="50" placeholder="חזרות" value="${todayEntry?todayEntry.reps:last?last.reps:''}" style="width:62px;"/>
          <button class="elog-inc-btn" onclick="elogAdjust('${key}',2.5)">+</button>
          <button class="elog-save" onclick="elogSave('${key}')">שמור</button>
        </div>
      </div>`;
    });
    html+='</div>';
  });
  wrap.innerHTML=html;
  // Add last-log chips inline in workout tables
  injectLastLogChips(elog);
}

function elogAdjust(key,delta){
  const el=document.getElementById('elog-kg-'+key);
  if(!el) return;
  const cur=parseFloat(el.value)||0;
  el.value=Math.max(0,(cur+delta)).toFixed(1).replace('.0','');
}

function elogSave(key){
  const kg=parseFloat(document.getElementById('elog-kg-'+key)?.value);
  const reps=parseInt(document.getElementById('elog-reps-'+key)?.value);
  if(isNaN(kg)||isNaN(reps)||kg<=0||reps<=0) return;
  saveElogEntry(key,kg,reps);
  if(navigator.vibrate) navigator.vibrate(30);
  const btn=document.querySelector(`#elog-row-${key} .elog-save`);
  if(btn){btn.textContent='נשמר!';btn.style.background='var(--green)';setTimeout(()=>{btn.textContent='שמור';btn.style.background='';},1800);}
  // Re-render to update history + chips
  renderElogPanel();
  // Also update PR if new best
  const prs=getPRs(); const prev=prs[key];
  if(!prev||kg>prev.kg||(kg===prev.kg&&reps>prev.reps)){
    prs[key]={kg,reps,date:todayStr()};
    localStorage.setItem(PR_KEY,JSON.stringify(prs));
    showToast('שיא חדש! '+kg+'ק״ג × '+reps);
    launchConfetti();
    if(navigator.vibrate) navigator.vibrate([200,100,200]);
  }
}

function injectLastLogChips(elog){
  const today=todayStr();
  document.querySelectorAll('.ex-table tbody tr[onclick]').forEach(tr=>{
    const m=tr.getAttribute('onclick').match(/openModal\('(\w+)'\)/);
    if(!m) return;
    const key=m[1];
    const hist=(elog[key]||[]).filter(e=>e.date!==today);
    const nameCell=tr.querySelector('.ex-name-main');
    if(!nameCell) return;
    // Remove existing chip
    nameCell.parentElement.querySelector('.ex-last-log')?.remove();
    if(hist.length){
      const chip=document.createElement('div');
      chip.className='ex-last-log';
      const e=hist[0];
      chip.innerHTML=`<span>פעם קודמת: <span class="ell-num">${e.kg} ק״ג × ${e.reps}</span> · ${e.date.slice(5)}</span>`;
      nameCell.after(chip);
    }
  });
}

// ═══════════════════════════════════════════════════
// FOOD TRACKER
// ═══════════════════════════════════════════════════
const FOOD_KEY='proFit_food';
const FOODS=[
  {name:'חזה עוף (100g)',cal:165,p:31,c:0,f:3.5},
  {name:'סלמון (100g)',cal:208,p:20,c:0,f:13},
  {name:'טונה בקופסה (120g)',cal:130,p:28,c:0,f:1},
  {name:'ביצה שלמה',cal:70,p:6,c:0,f:5},
  {name:'חלבון ביצה',cal:17,p:3.6,c:0,f:0},
  {name:'Whey Isolate (מנה 30g)',cal:115,p:25,c:2,f:0.5},
  {name:'שיבולת שועל (100g יבש)',cal:389,p:17,c:66,f:7},
  {name:'אורז לבן מבושל (100g)',cal:130,p:2.7,c:28,f:0.3},
  {name:'אורז מלא מבושל (100g)',cal:112,p:2.6,c:24,f:1},
  {name:'בטטה מבושלת (100g)',cal:86,p:1.6,c:20,f:0.1},
  {name:'לחם שיפון (פרוסה 30g)',cal:75,p:2.8,c:14,f:0.7},
  {name:'יוגורט יווני 0% (100g)',cal:59,p:10,c:3.6,f:0.4},
  {name:'קוטג׳ 1% (100g)',cal:72,p:11,c:3,f:1},
  {name:'גבינה לבנה 1% (100g)',cal:67,p:7,c:4,f:1.5},
  {name:'חלב 1% (200ml)',cal:86,p:6.8,c:9.8,f:2},
  {name:'אבוקדו (חצי)',cal:120,p:1.5,c:6,f:11},
  {name:'אגוזי מלך (30g)',cal:196,p:4.6,c:4,f:20},
  {name:'שקדים (30g)',cal:174,p:6,c:6,f:15},
  {name:'בננה',cal:89,p:1.1,c:23,f:0.3},
  {name:'תפוח',cal:52,p:0.3,c:14,f:0.2},
  {name:'שמן זית (כפית 5ml)',cal:44,p:0,c:0,f:5},
  {name:'קרם חלב שיבולת שועל (200ml)',cal:80,p:0.8,c:16,f:1.6},
  {name:'חומוס מבושל (100g)',cal:164,p:9,c:27,f:2.6},
  {name:'עדשים מבושלות (100g)',cal:116,p:9,c:20,f:0.4},
  {name:'קינואה מבושלת (100g)',cal:120,p:4.4,c:21,f:1.9},
];

let _selectedFood=null;
let _searchResults=[];   // current dropdown results (local + Open Food Facts)
let _offReqId=0;         // guards against out-of-order async responses

function getFoodLog(){ try{const d=localStorage.getItem(FOOD_KEY+'_'+todayStr());return d?JSON.parse(d):[]}catch(e){return[];} }
function saveFoodLog(log){ localStorage.setItem(FOOD_KEY+'_'+todayStr(),JSON.stringify(log)); }

function renderFoodPanel(){
  const wrap=document.getElementById('food-content'); if(!wrap) return;
  // Show skeleton while building content
  const foodEl=document.getElementById('panel-food');
  if(foodEl && !foodEl.querySelector('.food-loaded')){
    const existing=foodEl.querySelector('.food-content');
    if(existing && existing.children.length===0){
      existing.innerHTML='<div class="skeleton skeleton-title"></div>'+
        Array(3).fill('<div class="skeleton skeleton-card"></div>').join('');
    }
  }
  const s=getSettings();
  const log=getFoodLog();
  const totals=log.reduce((acc,e)=>({cal:acc.cal+e.cal,p:acc.p+e.p,c:acc.c+e.c,f:acc.f+e.f}),{cal:0,p:0,c:0,f:0});
  const pct=(v,g)=>Math.min(100,(v/g)*100);
  // the targets tab and this diary must not disagree about the same day
  const n=calcNutrition(Object.assign({},getActiveUser()||{},s));
  const pGoal=n.protein, cGoal=n.carbs, fGoal=n.fat;

  wrap.innerHTML=`
  <div class="card">
    <div class="card-head"><h2>מעקב תזונה יומי — ${todayStr().split('-').reverse().join('/')}</h2></div>
    <div class="card-body">
      <div class="food-macro-bars">
        ${macroBar('קלוריות','קל׳',totals.cal,s.calories,'linear-gradient(90deg,var(--red),#9333ea)')}
        ${macroBar('חלבון','גרם',totals.p,pGoal,'var(--blue)')}
        ${macroBar('פחמימות','גרם',totals.c,cGoal,'var(--yellow)')}
        ${macroBar('שומן','גרם',totals.f,fGoal,'var(--green)')}
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-head"><h2>הוסף מזון</h2></div>
    <div class="card-body">
      <div class="food-search-wrap">
        <input class="food-search" id="food-search" type="text" placeholder="חפש מזון... (לדוג׳ עוף, אורז, ביצה)" oninput="foodSearchDebounced(this.value)" autocomplete="off"/>
        <div class="food-dropdown" id="food-dropdown"></div>
      </div>
      <div id="food-selected-wrap" style="display:none;">
        <div style="font-size:.85rem;font-weight:700;margin-bottom:8px;" id="food-selected-name"></div>
        <div class="food-qty-wrap">
          <input class="food-qty-input" id="food-qty" type="number" min="0.5" step="0.5" value="1" placeholder="כמות"/>
          <span style="font-size:.82rem;color:var(--muted);" id="food-qty-label">מנות</span>
          <button class="food-add-btn" onclick="addFoodEntry()">הוסף</button>
        </div>
        <div id="food-preview" style="font-size:.78rem;color:var(--muted2);margin-top:4px;"></div>
      </div>
      <div style="margin-top:12px;">
        <button style="background:none;border:1px solid var(--border2);color:var(--muted);border-radius:8px;padding:6px 14px;cursor:pointer;font-family:var(--font);font-size:.8rem;" onclick="document.getElementById('custom-food-form').classList.toggle('show')">+ מזון מותאם אישית</button>
      </div>
      <div class="custom-food-form" id="custom-food-form">
        <div style="font-size:.78rem;color:var(--muted);margin-bottom:8px;">ערכים ל-100g / למנה</div>
        <input class="wl-input" id="cf-name" type="text" placeholder="שם המזון" style="width:100%;margin-bottom:8px;"/>
        <div class="cfg-grid">
          <input class="cfg-input" id="cf-cal" type="number" placeholder="קלוריות"/>
          <input class="cfg-input" id="cf-p" type="number" placeholder="חלבון g"/>
          <input class="cfg-input" id="cf-c" type="number" placeholder="פחמימות g"/>
          <input class="cfg-input" id="cf-f" type="number" placeholder="שומן g"/>
        </div>
        <button class="food-add-btn" onclick="addCustomFood()">הוסף מזון</button>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-head"><h2>מה אכלתי היום</h2>${log.length?`<span class="badge badge-blue">${log.length} רשומות</span>`:''}</div>
    <div class="card-body" id="food-log-list">
      ${log.length?log.map((e,i)=>`<div class="food-log-entry">
        <div style="flex:1"><div class="fle-name">${_esc(e.name)}${e.qty!==1?` ×${e.qty}`:''}${e.unit?' '+_esc(e.unit):''}</div>
        <div class="fle-amount">${Math.round(e.cal)} קל׳ | <span style="color:var(--blue)">${Math.round(e.p)}g P</span> · <span style="color:var(--yellow)">${Math.round(e.c)}g C</span> · <span style="color:var(--green)">${Math.round(e.f)}g F</span></div></div>
        <button class="fle-del" onclick="deleteFoodEntry(${i})" aria-label="מחק רשומה">✕</button>
      </div>`).join(''):`<div style="text-align:center;padding:24px 0;color:var(--muted);">
        <div style="margin-bottom:8px;color:var(--muted2);"><svg class="ico" style="width:30px;height:30px;"><use href="#i-utensils"/></svg></div>
        <div style="font-size:.88rem;font-weight:600;margin-bottom:4px;">לא תועד מזון להיום</div>
        <div style="font-size:.75rem;">השתמש בחיפוש למעלה להוספת מזון</div>
      </div>`}
    </div>
  </div>`;
}

function macroBar(label,unit,cur,goal,color){
  const pct=Math.min(100,(cur/goal)*100);
  const over=cur>goal;
  return `<div class="fmb-row">
    <div class="fmb-top"><span class="fmb-label">${label}</span><span class="fmb-vals"><span class="ell-num">${Math.round(cur)} / ${goal}</span> ${unit}${over?' <span style="color:var(--red);font-weight:700;">חרגת</span>':''}</span></div>
    <div class="fmb-track"><div class="fmb-fill${over?' fmb-over':''}" style="width:${pct}%;background:${color};"></div></div>
  </div>`;
}

/** Render the dropdown from the current _searchResults array */
function _renderFoodDropdown(loading){
  const dd=document.getElementById('food-dropdown'); if(!dd) return;
  if(!_searchResults.length&&!loading){dd.classList.remove('show');return;}
  const rows=_searchResults.map((f,i)=>`<div class="food-option" onclick="selectFoodResult(${i})">
    ${_esc(f.name)}${f._off?'<span class="fo-src"><svg class="ico"><use href="#i-globe"/></svg></span>':''}<div class="fo-macros">${Math.round(f.cal)} קל׳ · P${f.p}g · C${f.c}g · F${f.f}g</div></div>`).join('');
  dd.innerHTML=rows+(loading?'<div class="food-option fo-loading">מחפש במאגר העולמי…</div>':'');
  dd.classList.add('show');
}

/** Search local FOODS first (instant), then enrich with Open Food Facts (free, no key) */
function foodSearch(q){
  const dd=document.getElementById('food-dropdown');
  if(!q||q.trim().length<1){_searchResults=[];if(dd)dd.classList.remove('show');return;}
  q=q.trim();
  const ql=q.toLowerCase();
  // 1) local matches — instant
  _searchResults=FOODS.filter(f=>f.name.includes(q)||f.name.toLowerCase().includes(ql)).slice(0,6);
  const reqId=++_offReqId;
  _renderFoodDropdown(q.length>=2); // show loading only if we'll query OFF
  if(q.length<2) return;
  // 2) Open Food Facts — async enrichment
  fetchOpenFoodFacts(q).then(remote=>{
    if(reqId!==_offReqId) return; // a newer search superseded this one
    const seen=new Set(_searchResults.map(f=>f.name));
    remote.forEach(r=>{ if(!seen.has(r.name)){ _searchResults.push(r); seen.add(r.name); } });
    _searchResults=_searchResults.slice(0,14);
    _renderFoodDropdown(false);
  }).catch(()=>{ if(reqId===_offReqId) _renderFoodDropdown(false); });
}

/** Query Open Food Facts search API → normalized food objects (per 100g) */
async function fetchOpenFoodFacts(q){
  const url='https://world.openfoodfacts.org/cgi/search.pl?search_terms='+encodeURIComponent(q)+
    '&search_simple=1&action=process&json=1&page_size=20&fields=product_name,product_name_he,brands,nutriments';
  const ctrl=new AbortController();
  const to=setTimeout(()=>ctrl.abort(),6000);
  let res;
  try{ res=await fetch(url,{signal:ctrl.signal}); } finally { clearTimeout(to); }
  if(!res.ok) throw new Error('OFF '+res.status);
  const data=await res.json();
  const out=[];
  (data.products||[]).forEach(p=>{
    const n=p.nutriments||{};
    const cal=n['energy-kcal_100g'];
    if(cal==null||cal<=0) return; // skip products without calories
    let name=(p.product_name_he||p.product_name||'').trim();
    if(!name) return;
    if(p.brands) name+=' ('+String(p.brands).split(',')[0].trim()+')';
    name+=' (100g)';
    out.push({
      name,
      cal:Math.round(cal),
      p:Math.round((n.proteins_100g||0)*10)/10,
      c:Math.round((n.carbohydrates_100g||0)*10)/10,
      f:Math.round((n.fat_100g||0)*10)/10,
      _off:true
    });
  });
  return out.slice(0,12);
}

let _foodSearchTimer=null;
function foodSearchDebounced(q){
  clearTimeout(_foodSearchTimer);
  _foodSearchTimer=setTimeout(()=>{ foodSearch(q); }, 300);
}

/** Select from the unified _searchResults list (local or Open Food Facts) */
function selectFoodResult(i){
  const f=_searchResults[i]; if(!f) return;
  _selectedFood=f;
  document.getElementById('food-search').value=f.name;
  document.getElementById('food-dropdown').classList.remove('show');
  document.getElementById('food-selected-name').textContent=f.name;
  document.getElementById('food-selected-wrap').style.display='block';
  document.getElementById('food-qty-label').textContent='מנות';
  updateFoodPreview();
}
// Backwards-compat: select directly from the FOODS array by index
function selectFood(idx){
  const f=FOODS[idx]; if(!f) return;
  _searchResults=[f]; selectFoodResult(0);
}

function updateFoodPreview(){
  if(!_selectedFood) return;
  const qty=parseFloat(document.getElementById('food-qty')?.value)||1;
  const pr=document.getElementById('food-preview');
  if(pr) pr.textContent=`${Math.round(_selectedFood.cal*qty)} קל׳ · חלבון ${Math.round(_selectedFood.p*qty)}g · פחמימות ${Math.round(_selectedFood.c*qty)}g · שומן ${Math.round(_selectedFood.f*qty)}g`;
}
document.addEventListener('input',e=>{if(e.target.id==='food-qty') updateFoodPreview();});

function addFoodEntry(){
  if(!_selectedFood) return;
  const qty=parseFloat(document.getElementById('food-qty')?.value)||1;
  const log=getFoodLog();
  if(log.length>=30){ showToast('הגעת למגבלת 30 רשומות ביום'); return; }
  log.push({name:_selectedFood.name,qty,cal:_selectedFood.cal*qty,p:_selectedFood.p*qty,c:_selectedFood.c*qty,f:_selectedFood.f*qty});
  saveFoodLog(log);
  _selectedFood=null;
  document.getElementById('food-search').value='';
  document.getElementById('food-selected-wrap').style.display='none';
  document.getElementById('food-qty').value='1';
  renderFoodPanel();
}

function addCustomFood(){
  const name=(document.getElementById('cf-name')?.value||'').trim();
  const cal=parseFloat(document.getElementById('cf-cal')?.value)||0;
  const p=parseFloat(document.getElementById('cf-p')?.value)||0;
  const c=parseFloat(document.getElementById('cf-c')?.value)||0;
  const f=parseFloat(document.getElementById('cf-f')?.value)||0;
  if(!name||!cal){ showToast('שם וקלוריות הם שדות חובה','warn'); return; }
  const log=getFoodLog();
  if(log.length>=30){ showToast('הגעת למגבלת 30 רשומות ביום'); return; }
  log.push({name,qty:1,cal,p,c,f});
  saveFoodLog(log);
  renderFoodPanel();
}

function deleteFoodEntry(idx){
  const log=getFoodLog(); log.splice(idx,1); saveFoodLog(log); renderFoodPanel();
}

// ═══════════════════════════════════════════════════
// AI NUTRITION CHAT
// ═══════════════════════════════════════════════════
let _chatHistory=[];
let _chatRendered=false;

function renderChatPanel(){
  const wrap=document.getElementById('chat-content'); if(!wrap) return;
  if(!_chatHistory.length){
    try{_chatHistory=JSON.parse(localStorage.getItem('pf_chat')||'[]');}catch(e){_chatHistory=[];}
  }
  const s=getSettings();
  const apiKey=localStorage.getItem('proFit_apiKey')||'';
  const foodLog=getFoodLog();
  const totals=foodLog.reduce((a,e)=>({cal:a.cal+e.cal,p:a.p+e.p}),{cal:0,p:0});

  wrap.innerHTML=`
  <div class="card">
    <div class="card-head"><h2>יועץ תזונה AI — Claude</h2><span class="badge badge-neutral">מופעל ע״י Claude</span></div>
    <div class="card-body">
      ${!apiKey?`<div class="api-key-notice">
        כדי להשתמש ביועץ AI, הכנס את מפתח ה-API שלך מ-<a href="https://console.anthropic.com" target="_blank">console.anthropic.com</a> בהגדרות.<br>
        <button class="btn-quiet btn-inline" onclick="showPanel('settings')">פתח הגדרות</button>
      </div>`:''}
      <div class="chat-wrap">
        <div class="chat-msgs" id="chat-msgs">
          ${_chatHistory.length?'':renderWelcomeMsg(s,totals)}
          ${_chatHistory.map(m=>`<div class="chat-bubble ${m.role==='user'?'user':'ai'}">${m.content.replace(/\n/g,'<br>')}</div>`).join('')}
        </div>
        <div class="chat-input-wrap">
          <textarea class="chat-input" id="chat-input" rows="2" placeholder="שאל על תזונה, ארוחות, מה לאכול אחרי אימון..."></textarea>
          <button class="chat-send" id="chat-send-btn" onclick="sendChat()" ${!apiKey?'disabled':''}>שלח</button>
        </div>
      </div>
      <div style="margin-top:10px;font-size:.75rem;color:var(--muted);">AI יודע את תוכנית התזונה שלך ומה אכלת היום — תוצאות אישיות לחלוטין.</div>
    </div>
  </div>`;
  // Scroll to bottom
  const msgs=document.getElementById('chat-msgs');
  if(msgs) setTimeout(()=>msgs.scrollTop=msgs.scrollHeight,50);

  // Enter key to send
  const inp=document.getElementById('chat-input');
  if(inp) inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat();}});
}

function renderWelcomeMsg(s,totals){
  return `<div class="chat-bubble ai">שלום! אני יועץ התזונה שלך. אני מכיר את:
    <br>• יעד קלוריות: ${s.calories} קל׳ ביום
    <br>• יעד חלבון: ${Math.round(s.weight*2.5)}g ביום
    <br>• מגבלה: שומן רווי נמוך (כולסטרול)
    <br>• היום אכלת: ${Math.round(totals.cal)} קל׳ · ${Math.round(totals.p)}g חלבון
    <br><br>שאל אותי כל שאלה על תזונה!</div>`;
}

async function sendChat(){
  const apiKey=localStorage.getItem('proFit_apiKey')||'';
  if(!apiKey){showPanel('settings');return;}
  const inp=document.getElementById('chat-input');
  const msg=(inp?.value||'').trim();
  if(!msg) return;
  inp.value='';
  const s=getSettings();
  const foodLog=getFoodLog();
  const totals=foodLog.reduce((a,e)=>({cal:a.cal+e.cal,p:a.p+e.p,c:a.c+e.c,f:a.f+e.f}),{cal:0,p:0,c:0,f:0});
  _chatHistory.push({role:'user',content:msg});
  renderChatPanel();
  // Show typing
  const msgs=document.getElementById('chat-msgs');
  if(msgs){const t=document.createElement('div');t.className='chat-bubble typing';t.id='typing-ind';t.innerHTML='<span class="typing-dots"><span></span><span></span><span></span></span>';msgs.appendChild(t);msgs.scrollTop=msgs.scrollHeight;}
  const btn=document.getElementById('chat-send-btn');
  if(btn) btn.disabled=true;
  const u=getActiveUser()||{};
  const n=calcNutrition(u);
  const GOAL_HE={lean_bulk:'עלייה נקייה — עליית מסה נקייה',bulk:'מסה מקסימלית',cut:'הורדת שומן עם שמירת שריר',maintain:'שמירה על המשקל הנוכחי'};
  const cholNote=u.cholesterol?'\n- בעיית כולסטרול: הימנע משומן רווי. מקורות שומן רק מבלתי רווי (זית, אבוקדו, אגוזים, דגים שמנים). כשמציע מזון — בדוק שידידותי לכולסטרול.':'';
  const systemPrompt=`אתה יועץ תזונה מקצועי לספורטאים. המשתמש:
- שם: ${u.name||s.name} | גיל: ${u.age||s.age} | משקל: ${u.weight||s.weight}ק"ג | גובה: ${u.height||s.height}ס"מ
- מטרה: ${GOAL_HE[u.goal||'lean_bulk']}
- יעד קלוריות: ${n.target} קל׳ ביום | חלבון: ${n.protein}g | פחמימות: ${n.carbs}g | שומן: ${n.fat}g
- ארוחות ביום: ${u.meal_count||5}${cholNote}
- תוכנית אימונים: Push/Pull/Legs/Arms 4 ימים בשבוע
- היום אכל: ${foodLog.map(e=>e.name+(e.qty>1?'×'+e.qty:'')).join(', ')||'כלום עדיין'} (סה"כ ${Math.round(totals.cal)} קל׳, ${Math.round(totals.p)}g חלבון)
ענה בעברית. תשובות קצרות ומעשיות.`;
  try{
    const res=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{
        'x-api-key':apiKey,
        'anthropic-version':'2023-06-01',
        'anthropic-dangerous-direct-browser-access':'true',
        'content-type':'application/json'
      },
      body:JSON.stringify({
        model:'claude-haiku-4-5-20251001',
        max_tokens:600,
        system:systemPrompt,
        messages:_chatHistory.map(m=>({role:m.role,content:m.content}))
      })
    });
    const data=await res.json();
    if(data.error){
      const errType=data.error.type||'';
      if(errType==='authentication_error'){
        showToast('מפתח API שגוי — עדכן בהגדרות');
        _chatHistory.push({role:'assistant',content:'מפתח API לא תקין. עבור להגדרות ועדכן את המפתח.'});
      }else{
        showToast('שגיאת API: '+data.error.message.slice(0,60));
        const offline=offlineAnswer(_chatHistory[_chatHistory.length-1]?.content||'');
        _chatHistory.push({role:'assistant',content:'שגיאת API. תשובה מקומית:\n\n'+offline});
      }
    }else{
      const reply=data.content?.[0]?.text||'מצטער, לא הצלחתי לקבל תשובה.';
      _chatHistory.push({role:'assistant',content:reply});
    }
  }catch(err){
    showToast('אין חיבור — תשובה מקומית');
    const offline=offlineAnswer(_chatHistory[_chatHistory.length-1]?.content||'');
    _chatHistory.push({role:'assistant',content:'אין חיבור לרשת. תשובה מקומית:\n\n'+offline});
  }
  _safeSet('pf_chat',JSON.stringify(_chatHistory.slice(-20)));
  renderChatPanel();
}

// ═══════════════════════════════════════════════════
// F10 — OFFLINE AI FALLBACK
// ═══════════════════════════════════════════════════
const OFFLINE_QA=[
  {k:['חלבון','protein','ביצים','עוף'],a:'לבניית שריר אתה צריך 2–2.5 גרם חלבון לכל ק"ג גוף. המקורות הטובים: חזה עוף, דגים, ביצים, יוגורט יווני, קוטג׳, Whey. פזר על פני כל הארוחות — הגוף לא יכול לספוג הכל בפעם אחת.'},
  {k:['שינה','sleep','עייפות'],a:'שינה היא הסאפלמנט הכי זול ויעיל. בשינה מופרש הורמון גדילה שבונה שריר. מטרה: 7–9 שעות. גוף ישן = גוף שמתאושש. אם מתקשה לישון: הורד קפאין אחרי 14:00, שמור על טמפרטורה קרירה.'},
  {k:['כאב שריר','DOMS','כאב','כואב'],a:'כאב שריר מאוחר (DOMS) — תגובה נורמלית לגירוי חדש. נעלם אחרי 48–72 שעות. לא חייב לכאוב בשביל לגדול. אם הכאב חד ופתאומי — עצור. מה עוזר: חום, מגנזיום, מסז׳, הליכה קלה.'},
  {k:['קריאטין','creatine'],a:'קריאטין מונוהידרט — אחד מהסאפלמנטים הכי מוכחים מחקרית. 3–5 גרם ביום, לא צריך שלב העמסה. מגביר כוח ונפח שריר. בטוח לשימוש ארוך טווח. שתה הרבה מים.'},
  {k:['פחמימות','carb','קארב','אורז','לחם'],a:'פחמימות הן דלק לשרירים. לפני אימון — אורז, בטטה, שיבולת שועל. אחרי אימון — בננה + Whey. לא אויב, חלק חיוני. בגרעון: הורד פחמימות, שמור חלבון גבוה.'},
  {k:['שומן','fat','אבוקדו','שמן'],a:'שומן חיוני לייצור הורמונים כולל טסטוסטרון. מטרה: 25–30% מהקלוריות. מקורות טובים: אבוקדו, אגוזי מלך, שמן זית, סלמון. הימנע משומן טרנס (מזון מעובד).'},
  {k:['קלוריות','calories','אכילה','לאכול','כמה לאכול'],a:'לבניית שריר (עלייה נקייה): TDEE + 300–400 קלוריות. לירידת שומן (Cut): TDEE - 400 קלוריות. TDEE = BMR × רמת פעילות. הדשבורד מחשב את זה עבורך אוטומטית בהתאם לפרופיל.'},
  {k:['whey','ויי','אבקת חלבון','אבקה'],a:'Whey Isolate נספג מהר — אידיאלי 30 דק׳ אחרי אימון. Casein נספג לאט — טוב לפני שינה. לא חובה, אבל עוזר לעמוד ביעד החלבון. בחר Isolate אם יש רגישות ללקטוז.'},
  {k:['סקוואט','squat','רגליים'],a:'הסקוואט הוא מלך תרגילי הרגליים. טכניקה: גב ישר, חזה למעלה, ברכיים בכיוון בהונות, ירידה עד 90°. אם הגב סובל — נסה Goblet Squat לתיקון טכניקה.'},
  {k:['לחיצת חזה','bench','bench press','חזה'],a:'Bench Press: שכב על ספסל, מוט ברוחב כתפיים+, שכמות מקובצות. הורד לחזה התחתון (לא לצוואר), דחוף. להגדלת חזה עליון — Incline press חיוני.'},
  {k:['מנוחה','recovery','ריקוורי'],a:'שריר גדל בזמן מנוחה, לא בזמן אימון. קבוצת שריר צריכה 48–72 שעות מנוחה. לכן PPLA מחולק נכון — כל קבוצה פעם בשבוע עם מנוחה מלאה.'},
  {k:['חימום','warmup','להתחמם'],a:'חימום 5–7 דקות לפני כל אימון: קפיצות + סיבובי מפרקים + תרגיל קל בטכניקה. חימום מוריד סיכון לפציעה ב-30% ומשפר ביצועים. בכל פאנל יש כרטיס חימום מפורט.'},
  {k:['אינטרמיטנט','IF','צום','16:8'],a:'Intermittent Fasting (16:8) עובד לירידת שומן כי מקל על יצירת גרעון קלורי. לבניית מסה — פחות אידיאלי. חשוב: לאכול מספיק חלבון בחלון האכילה. לא קסם — פשוט כלי.'},
  {k:['כולסטרול','LDL','HDL'],a:'להורדת כולסטרול תוך כדי אימון: הגדל אומגה 3 (סלמון, אגוזי מלך), שיבולת שועל (Beta-Glucan), שמן זית. הפחת בשר אדום ומוצרי חלב שמנים. HDL עולה עם אירובי.'},
  {k:['השמנה','שומן בבטן','בטן','להשמין'],a:'שומן בבטן מוריד עם גרעון קלורי + אימוני כוח + שינה. אין "ממקד" — לא ניתן לאבד שומן רק מבטן. Cardio עוזר לגרעון. 80% מהתוצאה היא מהתזונה.'},
  {k:['ויטמינים','vitamin','D3','מגנזיום','zinc'],a:'ויטמינים חיוניים לספורטאי: D3 (1000–2000 IU), מגנזיום גליצינאט (200–400 מ"ג לפני שינה), Zinc (25 מ"ג), אומגה 3 (2–3 גרם EPA+DHA). בדוק ערכי דם.'},
  {k:['עלייה נקייה','לין בולק','בניית מסה','להגדיל'],a:'עלייה נקייה = עודף קטן של 300–400 קלוריות. קצב: 0.5–1 ק"ג בחודש. לאט, אך רוב העלייה הוא שריר. מיקס: 80% מזון אמיתי + 20% גמישות. הניטור הוא המפתח.'},
  {k:['Cut','קאט','לרזות','ירידה'],a:'Cut = גרעון של 400–500 קלוריות. שמור חלבון גבוה (2.5 גרם/ק"ג) לשמירת שריר. הוסף 20–30 דק׳ Cardio × 3 בשבוע. קצב אידיאלי: 0.5–1 ק"ג שבועי.'},
  {k:['Bulk','מסה','bulking'],a:'Bulk = עודף גדול של 500–700 קלוריות. גדילה מהירה יותר אבל עם יותר שומן. אחרי 3–4 חודשי Bulk — עבור ל-Cut לחשוף את השריר. מחזוריות היא המפתח.'},
  {k:['מדידות','התקדמות','progress','כמה עלה'],a:'מד התקדמות נכון: שקול עצמך שבועי (בבוקר, בצום). מדוד גם היקפי שריר (חזה, זרוע, ירך). לפעמים המשקל לא עולה אבל האחוז שומן יורד — זה בסדר. השתמש בגרף ההתקדמות.'},
  {k:['אמות','forearms','אחיזה','grip'],a:'Forearms עובדים כמה שבוע? 3–4 פעמים. תרגילים: Wrist Curl, Reverse Wrist Curl, Farmer Walk. גם מתחים ולחיצות מכשירים את האחיזה. בפאנל ARMS כבר יש חלק Forearms מפורט.'},
  {k:['בטן','core','abs','קיטוע'],a:'בטן מתאמנת 3× בשבוע בסוף Push/Legs/Arms. תרגילים: Plank, Crunches, Leg Raises, Russian Twists. בטן מתגלה כשאחוז השומן נמוך — תזונה היא 80% מהמשוואה.'},
  {k:['supplement','סאפלמנטים','תוספים'],a:'סאפלמנטים לפי עדיפות: 1) קריאטין מונוהידרט 3-5g, 2) Whey Protein (אם קשה לעמוד ביעד), 3) D3 1000IU, 4) מגנזיום גליצינאט, 5) אומגה 3. שאר — שיווק.'},
  {k:['Push','PUSH','חזה','לחיצה'],a:'Push Day: חזה → כתפיים → טריצפס. הסדר חשוב! עצב שניה כשהגוף טרי. Bench Press → Incline → Overhead Press → טריצפס. מנוחה 2–3 דק׳ בין סטים כבדים.'},
  {k:['Pull','PULL','גב','מתח'],a:'Pull Day: גב → בייסס → כתף אחורית. מתח / לט פולדאון → חתירה → Face Pull → כפיפות. גב חזק = יציבה טובה + פחות כאבי גב.'},
  {k:['Progressive Overload','העמסה מתקדמת','עומס','להתקדם'],a:'העמסה מתקדמת = הוספת עומס בהדרגה. כל שבועיים-שלושה: הוסף 2.5 ק"ג או חזרה נוספת. זה עיקרון הגדילה. בלי זה — הגוף לא מגיב. יומן המשקלים הוא הכלי.'},
  {k:['overtraining','אוברטריינינג','יתר'],a:'סימני אוברטריינינג: ירידה בביצועים, עייפות כרונית, עצבנות, נדודי שינה. הפתרון: שבוע דה-לוד — אותן תנועות, 40% פחות משקל.'},
];
function offlineAnswer(q){
  if(!q) return 'אין חיבור לאינטרנט. נסה שוב מאוחר יותר. (תשובה מקומית)';
  const lower=q.toLowerCase();
  for(const qa of OFFLINE_QA){
    if(qa.k.some(k=>lower.includes(k.toLowerCase()))) return qa.a;
  }
  return 'אני יועץ הכושר שלך גם ללא אינטרנט שאל על: חלבון, שינה, קריאטין, פחמימות, קלוריות, כאבי שרירים, חימום, עלייה נקייה, חיטוב, מנוחה, אמות, בטן, ויטמינים, העמסה מתקדמת.';
}

// ═══════════════════════════════════════════════════
// F2 — XP & LEVEL SYSTEM
// ═══════════════════════════════════════════════════
const XP_KEY='pf_xp';
const LEVELS=[
  {xp:0,max:100,name:'מתחיל',badge:'LV 1'},
  {xp:100,max:300,name:'מתקדם',badge:'LV 2'},
  {xp:300,max:600,name:'לוחם',badge:'LV 3'},
  {xp:600,max:1000,name:'אלוף',badge:'LV 4'},
  {xp:1000,max:1500,name:'מכונה',badge:'LV 5'},
  {xp:1500,max:99999,name:'אגדה',badge:'LV 6'},
];
function getXP(){return parseInt(localStorage.getItem(XP_KEY)||'0');}
function getLevelData(xp){return LEVELS.slice().reverse().find(l=>xp>=l.xp)||LEVELS[0];}
function addXP(amount){
  const old=getXP();
  const oldLvl=getLevelData(old);
  const newXP=old+amount;
  localStorage.setItem(XP_KEY,newXP);
  const newLvl=getLevelData(newXP);
  if(newLvl.badge!==oldLvl.badge) showLevelUpToast(newLvl.name,newLvl.badge);
  renderXPWidget();
}
function renderXPWidget(){
  const xp=getXP();
  const lvl=getLevelData(xp);
  const nextLvl=LEVELS[LEVELS.indexOf(lvl)+1];
  const pct=nextLvl?Math.round(((xp-lvl.xp)/(nextLvl.xp-lvl.xp))*100):100;
  const badge=document.getElementById('level-badge');
  const name=document.getElementById('level-name');
  const nums=document.getElementById('xp-nums');
  const fill=document.getElementById('xp-fill');
  if(badge) badge.textContent=lvl.badge;
  if(name) name.textContent=lvl.name;
  if(nums) nums.textContent=xp+' / '+(nextLvl?nextLvl.xp:'MAX')+' XP';
  if(fill) fill.style.width=Math.min(pct,100)+'%';
}
function showLevelUpToast(name,badge){
  const t=document.getElementById('levelup-toast');
  if(!t) return;
  t.textContent='עלית לרמה — '+badge+' '+name+'!';
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3200);
}

// ═══════════════════════════════════════════════════
// F3 — WEEKLY BOSS CHALLENGE
// ═══════════════════════════════════════════════════
const BOSS_KEY='pf_boss_';
const BOSS_CHALLENGES=[
  {id:0,title:'100 שכיבות סמיכה',desc:'צבור 100 שכיבות סמיכה מצטברות השבוע',target:100,unit:'חזרות',icon:'dumbbell',step:10},
  {id:1,title:'Volume King',desc:'הרם סה"כ 5,000 ק"ג מצטבר השבוע',target:5000,unit:'ק"ג',icon:'zap',step:250},
  {id:2,title:'4 אימונים השבוע',desc:'השלם 4 אימונים שלמים השבוע',target:4,unit:'אימונים',icon:'trophy',step:1},
  {id:3,title:'PR חדש',desc:'שבר שיא אישי באחד התרגילים',target:1,unit:'PR',icon:'target',step:1},
  {id:4,title:'100 חזרות סקוואט',desc:'צבור 100 חזרות סקוואט השבוע',target:100,unit:'חזרות',icon:'dumbbell',step:10},
  {id:5,title:'שבוע מלא תזונה',desc:'הוסף רישום תזונה 5 ימים השבוע',target:5,unit:'ימים',icon:'utensils',step:1},
  {id:6,title:'Dead-Pull Challenge',desc:'100 חזרות משיכות / Lat Pulldown מצטבר',target:100,unit:'חזרות',icon:'dumbbell',step:10},
  {id:7,title:'מנוחה 0 שכחה',desc:'השתמש בטיימר מנוחה 10 פעמים השבוע',target:10,unit:'פעמים',icon:'timer',step:1},
  {id:8,title:'Arm Day Blitz',desc:'200 חזרות כולל לבייסס + טריצפס השבוע',target:200,unit:'חזרות',icon:'flame',step:20},
  {id:9,title:'3,000 קלוריות',desc:'רשום 3 ימים עם יעד קלורי מלא',target:3,unit:'ימים',icon:'zap',step:1},
];
function getISOWeek(){
  const d=new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()+3-(d.getDay()+6)%7);
  const w=new Date(d.getFullYear(),0,4);
  return 1+Math.round(((d-w)/86400000-3+(w.getDay()+6)%7)/7);
}
function getBossKey(){return BOSS_KEY+new Date().getFullYear()+'-W'+String(getISOWeek()).padStart(2,'0');}
function getCurrentBoss(){return BOSS_CHALLENGES[getISOWeek()%BOSS_CHALLENGES.length];}
function getBossProgress(){return parseInt(localStorage.getItem(getBossKey())||'0');}
function setBossProgress(v){localStorage.setItem(getBossKey(),v);}
function renderBossCard(){
  if(!document.getElementById('boss-week-tag')) return; // boss card not in DOM
  const boss=getCurrentBoss();
  const prog=getBossProgress();
  const done=prog>=boss.target;
  const pct=Math.min(Math.round((prog/boss.target)*100),100);
  const wk=new Date().getFullYear()+' שבוע '+getISOWeek();
  document.getElementById('boss-week-tag').textContent='אתגר השבוע — '+wk;
  document.getElementById('boss-title').textContent=boss.title;
  document.getElementById('boss-desc').textContent=boss.desc;
  document.getElementById('boss-icon').innerHTML=_ic(boss.icon);
  document.getElementById('boss-fill').style.width=pct+'%';
  document.getElementById('boss-vals').textContent=Math.min(prog,boss.target)+' / '+boss.target+' '+boss.unit;
  const doneBanner=document.getElementById('boss-done-banner');
  const addBtn=document.getElementById('boss-add-btn');
  if(doneBanner) doneBanner.style.display=done?'flex':'none';
  if(addBtn) addBtn.style.display=done?'none':'inline-block';
}
function bossAddProgress(){
  const boss=getCurrentBoss();
  const current=getBossProgress();
  if(current>=boss.target) return;
  const newVal=Math.min(current+boss.step,boss.target);
  setBossProgress(newVal);
  if(newVal>=boss.target){
    addXP(75);
    if(navigator.vibrate) navigator.vibrate([100,50,200]);
  }
  renderBossCard();
}

// ═══════════════════════════════════════════════════
// F5 — SMART DELOAD ALERT
// ═══════════════════════════════════════════════════
function checkDeload(){
  const key='pf_deloadDismissed_'+new Date().getFullYear()+'-W'+getISOWeek();
  if(localStorage.getItem(key)) return;
  // Count consecutive weeks with workouts
  const log=getLog();
  const weeks=new Set(Object.keys(log).map(d=>{ const dt=new Date(d); const w=getISOWeekFromDate(dt); return dt.getFullYear()+'-W'+w; }));
  if(weeks.size>=4) document.getElementById('deload-banner')?.classList.add('show');
}
function getISOWeekFromDate(d){
  d=new Date(d); d.setHours(0,0,0,0); d.setDate(d.getDate()+3-(d.getDay()+6)%7);
  const w=new Date(d.getFullYear(),0,4);
  return 1+Math.round(((d-w)/86400000-3+(w.getDay()+6)%7)/7);
}
function dismissDeload(){
  const key='pf_deloadDismissed_'+new Date().getFullYear()+'-W'+getISOWeek();
  localStorage.setItem(key,'1');
  document.getElementById('deload-banner')?.classList.remove('show');
}

// ═══════════════════════════════════════════════════
// F4 — 1RM CALCULATOR (updates when PR is saved)
// ═══════════════════════════════════════════════════
function updateORMDisplay(kg,reps){
  const box=document.getElementById('orm-box');
  const val=document.getElementById('orm-val');
  if(!box||!val) return;
  if(kg&&reps&&!isNaN(kg)&&!isNaN(reps)&&reps>0){
    const orm=Math.round(parseFloat(kg)*(1+parseFloat(reps)/30));
    val.textContent='כ־'+orm+' ק״ג';
    box.classList.add('show');
  } else { box.classList.remove('show'); }
}

// ═══════════════════════════════════════════════════
// F7 — BODY HEATMAP
// ═══════════════════════════════════════════════════
function renderHeatmap(){
  const log=getLog();
  const today=new Date();
  const weekStart=new Date(today); weekStart.setDate(today.getDate()-today.getDay());
  // Check which workouts were done this week
  const done={push:false,pull:false,legs:false,arms:false};
  Object.keys(log).forEach(d=>{
    const dt=new Date(d); if(dt>=weekStart&&dt<=today){
      const completed=Object.keys(log[d]||{});
      if(completed.length>0){
        // Determine panel type from panel data or simply check all
        done.push=done.push||d.includes('push')||completed.some(k=>k.includes('bench')||k.includes('incline')||k.includes('fly'));
        done.pull=done.pull||d.includes('pull')||completed.some(k=>k.includes('pull')||k.includes('row')||k.includes('curl'));
        done.legs=done.legs||d.includes('legs')||completed.some(k=>k.includes('squat')||k.includes('leg')||k.includes('calf'));
        done.arms=done.arms||d.includes('arms')||completed.some(k=>k.includes('hammer')||k.includes('tricep'));
      }
    }
  });
  // Color muscles
  const clr={
    chest:done.push?'rgba(232,168,124,.55)':'rgba(255,255,255,.06)',
    shoulders:done.push||done.arms?'rgba(204,255,0,.45)':'rgba(255,255,255,.06)',
    biceps:done.pull||done.arms?'rgba(201,178,126,.5)':'rgba(255,255,255,.06)',
    triceps:done.push||done.arms?'rgba(185,156,107,.5)':'rgba(255,255,255,.06)',
    quads:done.legs?'rgba(185,156,107,.55)':'rgba(255,255,255,.06)',
    calves:done.legs?'rgba(126,242,154,.45)':'rgba(255,255,255,.06)',
  };
  const set=(id,fill)=>{ const el=document.getElementById(id); if(el) el.setAttribute('fill',fill); };
  set('hm-chest',clr.chest);
  set('hm-shoulders-l',clr.shoulders); set('hm-shoulders-r',clr.shoulders);
  set('hm-biceps-l',clr.biceps); set('hm-biceps-r',clr.biceps);
  set('hm-triceps-l',clr.triceps); set('hm-triceps-r',clr.triceps);
  set('hm-quads-l',clr.quads); set('hm-quads-r',clr.quads);
  set('hm-calves-l',clr.calves); set('hm-calves-r',clr.calves);
  // Legend
  const legend=document.getElementById('heatmap-legend');
  if(legend){
    const items=[
      {label:'חזה',color:clr.chest,status:done.push?'עמוס':'מנוח'},
      {label:'כתפיים',color:clr.shoulders,status:(done.push||done.arms)?'עמוס':'מנוח'},
      {label:'בייסס',color:clr.biceps,status:(done.pull||done.arms)?'עמוס':'מנוח'},
      {label:'טריצפס',color:clr.triceps,status:(done.push||done.arms)?'עמוס':'מנוח'},
      {label:'ירכיים',color:clr.quads,status:done.legs?'עמוס':'מנוח'},
      {label:'שוק',color:clr.calves,status:done.legs?'עמוס':'מנוח'},
    ];
    legend.innerHTML=items.map(i=>`
      <div class="hm-row">
        <div class="hm-dot" style="background:${i.color};border:1px solid rgba(255,255,255,.2)"></div>
        <span class="hm-label">${i.label}</span>
        <span class="hm-status" style="color:${i.status==='עמוס'?'var(--orange)':'var(--green)'}">${i.status}</span>
      </div>`).join('');
    const dateEl=document.getElementById('heatmap-date');
    const days=['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
    if(dateEl) dateEl.textContent=days[today.getDay()];
  }
}

// ═══════════════════════════════════════════════════
// F6 — NUTRITION TIMING ENGINE
// ═══════════════════════════════════════════════════
function updateNutritionTiming(){
  const inp=document.getElementById('workout-time-input');
  if(!inp) return;
  const val=inp.value||'18:00';
  localStorage.setItem('pf_workoutTime',val);
  const [h,m]=val.split(':').map(Number);
  const base=h*60+m;
  // Simple time arithmetic
  const addMins=(t,add)=>{let tot=(h*60+m+add+1440)%1440;return String(Math.floor(tot/60)).padStart(2,'0')+':'+String(tot%60).padStart(2,'0');};
  const rows=[
    {time:addMins(base,-120),dot:'var(--yellow)',label:'ארוחה מלאה (פחמימות + חלבון)'},
    {time:addMins(base,-30),dot:'var(--cyan)',label:'חטיף קל — בננה / לחם + ריבה'},
    {time:val,dot:'var(--red)',label:'שעת אימון'},
    {time:addMins(base,30),dot:'var(--blue)',label:'Whey Isolate + פרי מהיר'},
    {time:addMins(base,90),dot:'var(--green)',label:'ארוחה ראשית (חלבון + פחמימות)'},
  ];
  const cont=document.getElementById('timing-rows');
  if(cont) cont.innerHTML=rows.map(r=>`
    <div class="timing-row">
      <div class="timing-dot" style="background:${r.dot}"></div>
      <span class="timing-time-chip">${r.time}</span>
      <span class="timing-label">${r.label}</span>
    </div>`).join('');
}

// ═══════════════════════════════════════════════════
// F1 — LIVE WORKOUT MODE (GYM MODE)
// ═══════════════════════════════════════════════════
let _gymExercises=[];
let _gymIdx=0;
let _gymColor='var(--red)';
let _gymLabel='PUSH';
let _tempoOn=false;
let _tempoTimer=null;
let _gymStopwatchStart=0;
let _gymStopwatchIv=null;
let _gymPendingSetKey=null;
let _gymPendingSetIdx=0;
// Integrated gym rest timer
function playBeep(){
  const ctx=_getAudioCtx(); if(!ctx) return;
  [0,0.28].forEach(t=>{
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.connect(g);g.connect(ctx.destination);
    o.frequency.value=880;
    g.gain.setValueAtTime(0.35,ctx.currentTime+t);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+t+0.22);
    o.start(ctx.currentTime+t);o.stop(ctx.currentTime+t+0.25);
  });
}
let _gymTimerIv=null;
let _gymTimerRemain=0;
let _gymTimerTotal=0;
let _gymTimerEnd=0;      // absolute deadline (ms) — survives screen lock / tab throttling
let _gymWakeLock=null;   // screen wake lock while gym mode is open

async function gymRequestWakeLock(){
  try{ _gymWakeLock=await navigator.wakeLock?.request('screen'); }catch(e){ _gymWakeLock=null; }
}
function gymReleaseWakeLock(){
  try{ _gymWakeLock?.release(); }catch(e){}
  _gymWakeLock=null;
}
// On return to the app: re-acquire wake lock + resync timer from the deadline
document.addEventListener('visibilitychange',()=>{
  if(document.hidden) return;
  const gymOpen=document.getElementById('gym-overlay')?.classList.contains('open');
  if(!gymOpen) return;
  gymRequestWakeLock();
  if(_gymTimerEnd>0){
    _gymTimerRemain=Math.max(0,Math.round((_gymTimerEnd-Date.now())/1000));
    gymTickTimer();
    if(_gymTimerRemain<=0&&_gymTimerIv){ clearInterval(_gymTimerIv); _gymTimerIv=null; _gymTimerFinish(); }
  }
});
function _gymTimerFinish(){
  _gymTimerEnd=0;
  const msgEl=document.getElementById('gym-rest-msg');
  if(msgEl) msgEl.textContent='התחל סט!';
  const timeEl=document.getElementById('gym-ring-text');
  if(timeEl) timeEl.textContent='GO';
  if(navigator.vibrate) navigator.vibrate([200,100,200,100,200]);
  playBeep();
}
// GYM_TIMER_CIRC moved to CONFIG.GYM_TIMER_CIRC

function startGymMode(panelName,label,color){
  const panel=document.getElementById('panel-'+panelName);
  if(!panel) return;
  const rows=panel.querySelectorAll('.ex-table tbody tr[onclick]');
  _gymExercises=Array.from(rows).map(tr=>{
    const k=tr.getAttribute('onclick')?.match(/openModal\('(\w+)'\)/)?.[1]||null;
    return {
    name:EX[k]?.name||tr.querySelector('.ex-name-main')?.firstChild?.nodeValue?.trim()||'תרגיל',
    nameEn:EX[k]?.en||tr.querySelector('.ex-name-en')?.textContent?.trim()||'',
    sets:tr.querySelector('.sets-cell')?.textContent?.trim()||'3×10',
    muscle:tr.querySelector('.muscle-tag')?.textContent?.trim()||'',
    key:k,
    ss:tr.dataset.ss||null,
    ssPartner:tr.dataset.ssPartner||null,
    ssPos:tr.dataset.ssPos||null
  };}).filter(e=>e.name&&e.sets);
  _gymExercises=_groupGymSupersets(_gymExercises,panelName);
  if(!_gymExercises.length){ showToast('לא נמצאו תרגילים'); return; }
  _gymIdx=0; _gymColor=color.trim(); _gymLabel=label;
  const badge=document.getElementById('gym-badge');
  if(badge){badge.textContent=label;badge.style.color=_gymColor;badge.style.borderColor=_gymColor;}
  renderGymExercise();
  document.getElementById('gym-overlay').classList.add('open');
  document.body.style.overflow='hidden';
  gymRequestWakeLock();
  // Start stopwatch
  _gymStopwatchStart=Date.now();
  if(_gymStopwatchIv) clearInterval(_gymStopwatchIv);
  _gymStopwatchIv=setInterval(()=>{
    const el=document.getElementById('gym-stopwatch');
    if(!el) return;
    const s=Math.floor((Date.now()-_gymStopwatchStart)/1000);
    const m=Math.floor(s/60), sec=s%60;
    el.textContent=m+':'+(sec<10?'0':'')+sec;
  },1000);
}

function confirmCloseGymMode(){
  if(confirm('לצאת ממצב אימון?')) closeGymMode();
}
// A superset is one unit of work, so gym mode runs it as one screen with
// R rounds of two exercises rather than draining exercise A before starting B.
function _groupGymSupersets(list,panelName){
  if(!list.some(e=>e.ss)) return list;
  const plan=_resolvePlan(getActiveUser());
  const day=plan?.days?.find(d=>d.id===panelName);
  const meta={}; (day?.supersets||[]).forEach(s=>meta[s.id]=s);
  const out=[],seen={};
  list.forEach(e=>{
    if(!e.ss){ out.push(e); return; }
    if(seen[e.ss]){ seen[e.ss].b=e; return; }
    const m=meta[e.ss]||{};
    const item={pairKind:true,ss:e.ss,type:m.type,note:m.note,
      rounds:m.rounds||parseInt(e.sets)||3,
      restWithin:m.restWithin||20,restBetween:m.restBetween||90,
      a:e,b:null,name:e.name,sets:e.sets,key:e.key};
    seen[e.ss]=item; out.push(item);
  });
  // a superset whose partner row is missing degrades to a plain exercise
  return out.map(it=>it.pairKind&&!it.b?it.a:it);
}

function _renderGymPair(p){
  const today=todayStr(), log=getLog(), elog=getElog();
  const pre=e=>{ const l=e.key?elog[e.key]?.[0]:null; return {kg:l?.kg||'',reps:l?.reps||''}; };
  const pa=pre(p.a), pb=pre(p.b);
  const side=(e,r,s,fill)=>{
    const done=log[today]?.[e.name]?.[r]||false;
    return `<div class="gym-pair-side${done?' done':''}" id="gym-p-${r}-${s}">
      <div class="gym-pair-nm">${_esc(e.name)}</div>
      <div class="gym-sr-inputs">
        <input class="gym-sr-kg" id="gym-p-kg-${r}-${s}" type="number" inputmode="decimal" min="0" step="0.5" placeholder="ק״ג" value="${fill.kg}" ${done?'disabled':''}/>
        <span class="gym-sr-x">×</span>
        <input class="gym-sr-reps" id="gym-p-reps-${r}-${s}" type="number" inputmode="numeric" min="1" max="50" placeholder="חז׳" value="${fill.reps}" ${done?'disabled':''}/>
      </div>
      <button class="gym-check${done?' done':''}" id="gym-p-chk-${r}-${s}" onclick="gymPairCheck(${r},'${s}')">${done?'✓':''}</button>
    </div>`;
  };
  const rounds=Array.from({length:p.rounds},(_,r)=>`
    <div class="gym-pair-round">
      <div class="gym-pair-rn">סבב ${r+1}</div>
      ${side(p.a,r,'a',pa)}
      <div class="gym-pair-arrow">↓ ${p.restWithin} שנ׳ מעבר</div>
      ${side(p.b,r,'b',pb)}
    </div>`).join('');
  return `
    <div class="gym-counter">זוג ${_gymIdx+1} מתוך ${_gymExercises.length}</div>
    <div class="gym-ss">${p.rounds} סבבים ברצף · מנוחה ${p.restBetween>=60?(p.restBetween%60?(p.restBetween/60).toFixed(1):p.restBetween/60)+' דק׳':p.restBetween+' שנ׳'}${p.note?` <button class="ss-why" aria-label="למה" onclick="this.closest('.gym-body').querySelector('.gym-pair-note').hidden=!this.closest('.gym-body').querySelector('.gym-pair-note').hidden">?</button>`:''}</div>
    <div class="gym-name gym-name-pair" style="color:${_gymColor}">${_esc(p.a.name)} + ${_esc(p.b.name)}</div>
    <div class="gym-sets-label">${p.a.sets} / ${p.b.sets}</div>
    ${p.note?`<div class="gym-pair-note" hidden>${_esc(p.note)}</div>`:''}
    <div class="gym-pair-rounds">${rounds}</div>`;
}

function gymPairCheck(r,s){
  const p=_gymExercises[_gymIdx];
  if(!p?.pairKind) return;
  const ex=s==='a'?p.a:p.b;
  const btn=document.getElementById(`gym-p-chk-${r}-${s}`);
  const row=document.getElementById(`gym-p-${r}-${s}`);
  if(!btn) return;
  const today=todayStr(); const l=getLog();
  if(btn.classList.contains('done')){         // untick
    btn.classList.remove('done'); btn.textContent=''; btn.style.background='';
    row?.classList.remove('done');
    row?.querySelectorAll('input').forEach(i=>i.disabled=false);
    if(l[today]?.[ex.name]) { delete l[today][ex.name][r]; saveLog(l); }
    return;
  }
  const kg=parseFloat(document.getElementById(`gym-p-kg-${r}-${s}`)?.value)||0;
  const reps=parseInt(document.getElementById(`gym-p-reps-${r}-${s}`)?.value)||0;
  btn.classList.add('done'); btn.textContent='✓'; btn.style.background=_gymColor;
  row?.classList.add('done');
  row?.querySelectorAll('input').forEach(i=>i.disabled=true);
  if(navigator.vibrate) navigator.vibrate(30);
  if(ex.key&&kg>0&&reps>0){ saveElogEntry(ex.key,kg,reps); showToast(kg+'ק"ג × '+reps+' ✓'); }
  if(!l[today]) l[today]={}; if(!l[today][ex.name]) l[today][ex.name]={};
  l[today][ex.name][r]=true; saveLog(l);
  // within-pair transition is short; the real rest comes after the round closes
  gymPickTimer(s==='a'?p.restWithin:p.restBetween);
  if(_tempoOn) speakTempo();
}

function renderGymExercise(){
  const body=document.getElementById('gym-body');
  const prev=document.getElementById('gym-prev');
  const next=document.getElementById('gym-next');
  // Hide rest timer when navigating to new exercise
  cancelGymTimer();
  if(_gymIdx>=_gymExercises.length){
    body.innerHTML=`<div class="gym-done-screen">
      <div class="gym-done-title">סיימת</div>
      <div class="gym-done-sub">האימון הושלם!<br>הגוף שלך מתחזק.</div>
      <div class="gym-done-xp">+50 XP</div>
      <button class="gym-nav-btn next" onclick="closeGymMode()" style="max-width:200px;margin-top:8px;">סגור</button>
    </div>`;
    if(prev) prev.style.display='none';
    if(next) next.style.display='none';
    addXP(50);
    if(navigator.vibrate) navigator.vibrate([200,100,200]);
    return;
  }
  const ex=_gymExercises[_gymIdx];
  if(ex.pairKind){
    body.innerHTML=_renderGymPair(ex);
    if(prev) prev.disabled=_gymIdx===0;
    if(next) next.textContent=_gymIdx>=_gymExercises.length-1?'סיים האימון ✓':'הבא ←';
    return;
  }
  const setsCount=parseInt(ex.sets)||3;
  const today=todayStr(); const log=getLog();
  const checks=Array.from({length:setsCount},(_,i)=>log[today]?.[ex.name]?.[i]||false);
  // Pre-fill last saved kg/reps from elog
  const elog=getElog();
  const lastEntry=ex.key?elog[ex.key]?.[0]:null;
  const prefillKg=lastEntry?.kg||'';
  const prefillReps=lastEntry?.reps||'';
  const rowsHTML=checks.map((done,i)=>`
    <div class="gym-set-row${done?' done':''}" id="gym-sr-${i}">
      <span class="gym-sr-num">סט ${i+1}</span>
      <div class="gym-sr-inputs">
        <input class="gym-sr-kg" id="gym-sr-kg-${i}" type="number" inputmode="decimal" min="0" step="0.5" placeholder="ק״ג" value="${prefillKg}" ${done?'disabled':''}/>
        <span class="gym-sr-x">×</span>
        <input class="gym-sr-reps" id="gym-sr-reps-${i}" type="number" inputmode="numeric" min="1" max="50" placeholder="חז׳" value="${prefillReps}" ${done?'disabled':''}/>
      </div>
      <button class="gym-check${done?' done':''}" id="gym-chk-${i}" onclick="gymCheckSet(${i})">${done?'✓':''}</button>
    </div>`).join('');
  const pr=ex.key?(getPRs())[ex.key]:null;
  const prBadge=pr?`<div class="gym-pr-badge">PR: ${pr.kg}ק״ג × ${pr.reps}</div>`:'';
  body.innerHTML=`
    <div class="gym-counter">תרגיל ${_gymIdx+1} מתוך ${_gymExercises.length}</div>
    ${ex.ss?`<div class="gym-ss"><span class="gym-ss-tag">${ex.ss}</span>סופרסט — חלק ${ex.ssPos}${ex.ssPartner?` · מיד אחרי: ${_esc(ex.ssPartner)}`:''}</div>`:''}
    <div class="gym-name" style="color:${_gymColor}">${_esc(ex.name)}</div>
    ${ex.nameEn?`<div class="gym-name-en">${_esc(ex.nameEn)}</div>`:''}
    ${ex.muscle?`<div class="gym-muscle-tag">${_esc(ex.muscle)}</div>`:''}
    ${prBadge}
    <div class="gym-sets-label">${ex.sets}</div>
    <div class="gym-setrows">${rowsHTML}</div>`;
  if(prev) prev.disabled=_gymIdx===0;
  if(next) next.textContent=_gymIdx>=_gymExercises.length-1?'סיים האימון ✓':'הבא ←';
}
function gymCheckSet(i){
  const el=document.getElementById('gym-chk-'+i);
  if(!el) return;
  const alreadyDone=el.classList.contains('done');
  if(alreadyDone){
    el.classList.remove('done'); el.textContent=''; el.style.background='';
    const row=document.getElementById('gym-sr-'+i);
    if(row){ row.classList.remove('done');
      row.querySelectorAll('input').forEach(inp=>inp.disabled=false); }
    return;
  }
  // Read kg/reps from inline inputs
  const ex=_gymExercises[_gymIdx];
  const kgEl=document.getElementById('gym-sr-kg-'+i);
  const repEl=document.getElementById('gym-sr-reps-'+i);
  const kg=parseFloat(kgEl?.value)||0;
  const reps=parseInt(repEl?.value)||0;
  // Mark done visually
  el.classList.add('done'); el.textContent='✓'; el.style.background=_gymColor;
  const row=document.getElementById('gym-sr-'+i);
  if(row){ row.classList.add('done');
    row.querySelectorAll('input').forEach(inp=>inp.disabled=true); }
  if(navigator.vibrate) navigator.vibrate(30);
  // Save kg/reps to elog
  if(ex.key&&kg>0&&reps>0){
    saveElogEntry(ex.key,kg,reps);
    showToast(kg+'ק"ג × '+reps+' ✓');
  }
  // Update workout log
  const today=todayStr(); const l=getLog();
  if(!l[today]) l[today]={}; if(!l[today][ex.name]) l[today][ex.name]={};
  l[today][ex.name][i]=true; saveLog(l);
  // Start integrated rest timer
  gymPickTimer(_lastTimerSec||90);
  if(_tempoOn) speakTempo();
}
function _saveGymExToSetlog(){
  const ex=_gymExercises[_gymIdx];
  if(ex?.pairKind){
    ['a','b'].forEach(s=>{
      const e=ex[s]; if(!e?.key) return;
      const sets=[];
      for(let r=0;r<ex.rounds;r++){
        const kg=parseFloat(document.getElementById(`gym-p-kg-${r}-${s}`)?.value)||0;
        const reps=parseInt(document.getElementById(`gym-p-reps-${r}-${s}`)?.value)||0;
        if(kg>0) sets.push({kg,reps});
      }
      if(!sets.length) return;
      const all=_getJSON(SETLOG_KEY,{});
      const arr=(all[e.key]||[]).filter(x=>x.date!==todayStr());
      arr.unshift({date:todayStr(),sets});
      all[e.key]=arr.slice(0,20);
      _setJSON(SETLOG_KEY,all);
    });
    return;
  }
  if(!ex||!ex.key) return;
  const setsCount=parseInt(ex.sets)||3;
  const sets=[];
  for(let i=0;i<setsCount;i++){
    const kg=parseFloat(document.getElementById('gym-sr-kg-'+i)?.value)||0;
    const reps=parseInt(document.getElementById('gym-sr-reps-'+i)?.value)||0;
    if(kg>0) sets.push({kg,reps});
  }
  if(!sets.length) return;
  const all=_getJSON(SETLOG_KEY,{});
  const arr=all[ex.key]||[];
  const today=todayStr();
  const filtered=arr.filter(s=>s.date!==today);
  filtered.unshift({date:today,sets});
  all[ex.key]=filtered.slice(0,20);
  _setJSON(SETLOG_KEY,all);
}
function gymNext(){
  _saveGymExToSetlog();
  if(_gymIdx<_gymExercises.length) _gymIdx++;
  renderGymExercise();
}
function gymPrev(){
  _saveGymExToSetlog();
  if(_gymIdx>0) _gymIdx--;
  renderGymExercise();
}
function closeGymMode(){
  document.getElementById('gym-overlay').classList.remove('open');
  document.body.style.overflow='';
  gymReleaseWakeLock();
  if(_tempoTimer){ clearTimeout(_tempoTimer); _tempoTimer=null; }
  if(_gymStopwatchIv){ clearInterval(_gymStopwatchIv); _gymStopwatchIv=null; }
  cancelGymTimer();
  window.speechSynthesis?.cancel();
}
function gymPickTimer(sec){
  if(_gymTimerIv){ clearInterval(_gymTimerIv); _gymTimerIv=null; }
  _lastTimerSec=sec; localStorage.setItem('pf_lastTimer',String(sec));
  _gymTimerTotal=sec; _gymTimerRemain=sec;
  const zone=document.getElementById('gym-rest-timer');
  const msg=document.getElementById('gym-rest-msg');
  if(zone) zone.style.display='block';
  if(msg) msg.textContent='מנוחה';
  // Highlight active preset
  document.querySelectorAll('.grt-presets button').forEach(b=>{
    const v=parseInt(b.textContent.replace(':','').replace('0','').split(':').reduce((m,s)=>+m*60+(+s),0));
    b.classList.toggle('active', parseInt(b.getAttribute('onclick')?.match(/\d+/)?.[0]||0)===sec);
  });
  _gymTimerEnd=Date.now()+sec*1000;
  gymTickTimer();
  _gymTimerIv=setInterval(()=>{
    _gymTimerRemain=Math.max(0,Math.round((_gymTimerEnd-Date.now())/1000));
    gymTickTimer();
    if(_gymTimerRemain<=0){
      clearInterval(_gymTimerIv); _gymTimerIv=null;
      _gymTimerFinish();
    }
  },1000);
}
function gymTickTimer(){
  const m=Math.floor(_gymTimerRemain/60);
  const s=_gymTimerRemain%60;
  const timeStr=m+':'+(s<10?'0':'')+s;
  const timeEl=document.getElementById('gym-ring-text');
  const prog=document.getElementById('gym-ring-prog');
  if(timeEl) timeEl.textContent=timeStr;
  if(prog&&_gymTimerTotal>0){
    const frac=Math.max(0,_gymTimerRemain/_gymTimerTotal);
    prog.style.strokeDashoffset=CONFIG.GYM_TIMER_CIRC*(1-frac);
  }
}
function cancelGymTimer(){
  if(_gymTimerIv){ clearInterval(_gymTimerIv); _gymTimerIv=null; }
  _gymTimerRemain=0; _gymTimerTotal=0; _gymTimerEnd=0;
  const zone=document.getElementById('gym-rest-timer');
  if(zone) zone.style.display='none';
}
function openGymSetPopup(exKey,setIdx){
  _gymPendingSetKey=exKey;
  _gymPendingSetIdx=setIdx;
  const popup=document.getElementById('gym-set-popup');
  const title=document.getElementById('gym-set-popup-title');
  if(title) title.textContent='סט '+(setIdx+1)+' — הזן משקל + חזרות';
  // Pre-fill from last elog entry
  const elog=getElog();
  const last=elog[exKey]?.[0];
  const kgEl=document.getElementById('gym-set-kg');
  const repEl=document.getElementById('gym-set-reps');
  if(kgEl) kgEl.value=last?.kg||'';
  if(repEl) repEl.value=last?.reps||'';
  popup?.classList.add('show');
  kgEl?.focus();
}
function saveGymSet(){
  const kg=parseFloat(document.getElementById('gym-set-kg')?.value);
  const reps=parseInt(document.getElementById('gym-set-reps')?.value);
  if(isNaN(kg)||kg<0||kg>500){showToast('משקל לא תקין (0–500 ק"ג)');return;}
  if(isNaN(reps)||reps<1||reps>100){showToast('חזרות לא תקינות (1–100)');return;}
  if(_gymPendingSetKey && kg>0 && reps>0){
    saveElogEntry(_gymPendingSetKey,kg,reps);
    showToast(kg+'ק"ג × '+reps+' — נשמר ✓');
  }
  document.getElementById('gym-set-popup')?.classList.remove('show');
  _gymPendingSetKey=null;
}

// F11 — TEMPO COACH
function toggleTempo(){
  _tempoOn=!_tempoOn;
  const btn=document.getElementById('gym-tempo-btn');
  if(btn){ btn.textContent='קצב '+(_tempoOn?'פועל':'כבוי'); btn.classList.toggle('on',_tempoOn); }
}
function speakTempo(){
  if(!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const phrases=['שלוש','שתיים','אחת','עלה — אחת שתיים — רד — אחת שתיים שלוש ארבע'];
  let i=0;
  const speak=()=>{
    if(i>=phrases.length||!_tempoOn) return;
    const u=new SpeechSynthesisUtterance(phrases[i++]);
    u.lang='he-IL'; u.rate=0.85; u.onend=speak;
    window.speechSynthesis.speak(u);
  };
  speak();
}

// ═══════════════════════════════════════════════════
// F8 — SHARE MY STATS (Canvas API)
// ═══════════════════════════════════════════════════
function openShareModal(){
  drawShareCard();
  document.getElementById('share-overlay').classList.add('open');
  if(navigator.canShare) document.getElementById('share-native-btn').style.display='inline-block';
}
function closeShareModal(){ document.getElementById('share-overlay').classList.remove('open'); }
function drawShareCard(){
  const canvas=document.getElementById('share-canvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  const W=400,H=260;
  // Background
  ctx.fillStyle='#080808'; ctx.fillRect(0,0,W,H);
  // Gradient accent
  const g=ctx.createLinearGradient(0,0,W,H);
  g.addColorStop(0,'rgba(232,168,124,.18)'); g.addColorStop(1,'rgba(185,156,107,.12)');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  // Border
  ctx.strokeStyle='rgba(255,255,255,.1)'; ctx.lineWidth=1; ctx.strokeRect(.5,.5,W-1,H-1);
  // Logo
  ctx.font='900 32px "Barlow Condensed",sans-serif';
  ctx.fillStyle='#CCFF00'; ctx.textAlign='right'; ctx.fillText('KOACH',W-28,48);
  // Tagline
  ctx.font='400 11px Barlow,sans-serif'; ctx.fillStyle='rgba(255,255,255,.4)';
  ctx.fillText('תוכנית אימונים אישית',W-28,66);
  // User name
  const s=getSettings();
  ctx.font='700 18px Barlow,sans-serif'; ctx.fillStyle='rgba(255,255,255,.9)';
  ctx.fillText(s.name||'המשתמש שלי',W-28,100);
  // Stats
  const xp=getXP(); const lvl=getLevelData(xp);
  const streak=parseInt(document.getElementById('streak-num')?.textContent||'0');
  const stats=[
    {label:'רמה',val:lvl.badge+' '+lvl.name},
    {label:'XP',val:xp+' נקודות'},
    {label:'רצף',val:streak+' ימים'},
  ];
  ctx.textAlign='right';
  stats.forEach((st,i)=>{
    const x=W-28; const y=138+i*34;
    ctx.font='700 22px "Barlow Condensed",sans-serif'; ctx.fillStyle='#CCFF00';
    ctx.fillText(st.val,x,y);
    ctx.font='400 11px Barlow,sans-serif'; ctx.fillStyle='rgba(255,255,255,.45)';
    ctx.fillText(st.label,x,y+13);
  });
  // Left side — week grid
  ctx.textAlign='left';
  ctx.font='900 13px "Barlow Condensed",sans-serif'; ctx.fillStyle='rgba(255,255,255,.3)';
  ctx.fillText('השבוע שלך',28,138);
  const workouts=['PUSH','PULL','REST','LEGS','ARMS','REST','REST'];
  const colors=['#CCFF00','#00D9FF','#333','#B47CFF','#FF7A45','#333','#333'];
  workouts.forEach((w,i)=>{
    ctx.fillStyle=colors[i]; ctx.fillRect(28+i*22,148,18,24);
    ctx.font='700 7px "Barlow Condensed",sans-serif'; ctx.fillStyle='rgba(0,0,0,.8)';
    if(colors[i]!=='#333') ctx.fillText(w.slice(0,1),28+i*22+4,162);
  });
  // Footer
  ctx.font='400 10px Barlow,sans-serif'; ctx.fillStyle='rgba(255,255,255,.2)';
  ctx.textAlign='center'; ctx.fillText('bke1302.github.io/fitness_app',W/2,H-14);
}
function downloadShareCard(){
  const canvas=document.getElementById('share-canvas');
  const a=document.createElement('a');
  a.download='koach-stats.png'; a.href=canvas.toDataURL('image/png');
  a.click();
}
async function nativeShare(){
  const canvas=document.getElementById('share-canvas');
  canvas.toBlob(async blob=>{
    const file=new File([blob],'koach-stats.png',{type:'image/png'});
    try{ await navigator.share({files:[file],title:'KOACH Stats',text:'הסטטיסטיקות שלי ב-KOACH'}); }
    catch(e){ downloadShareCard(); }
  });
}

// ═══════════════════════════════════════════════════
// F9 — VOICE CONTROL
// ═══════════════════════════════════════════════════
let _recognition=null;
let _voiceActive=false;
const VOICE_CMDS=[
  {k:['דאשבורד','לוח בקרה','dashboard'],fn:()=>{showPanel('dashboard');speak('עובר ללוח בקרה');}},
  {k:['פוש','push','חזה'],fn:()=>{showPanel('push');speak('עובר לאימון PUSH');}},
  {k:['פול','pull','גב'],fn:()=>{showPanel('pull');speak('עובר לאימון PULL');}},
  {k:['לגס','legs','רגליים'],fn:()=>{showPanel('legs');speak('עובר לאימון LEGS');}},
  {k:['ארמס','arms','ידיים'],fn:()=>{showPanel('arms');speak('עובר לאימון ARMS');}},
  {k:['תזונה','nutrition'],fn:()=>{showPanel('nutrition');speak('עובר לתזונה');}},
  {k:['הגדרות','settings'],fn:()=>{showPanel('settings');speak('עובר להגדרות');}},
  {k:['סטריק','רצף','streak'],fn:()=>{const n=document.getElementById('streak-num')?.textContent||'0';speak('הרצף שלך הוא '+n+' ימים');}},
  {k:['XP','אקסופי','נקודות'],fn:()=>{speak('יש לך '+getXP()+' נקודות XP');}},
  {k:['טיימר','מנוחה','timer'],fn:()=>{if(typeof pickTimer==='function') pickTimer(90);speak('מתחיל טיימר מנוחה 90 שניות');}},
];
function speak(text){
  if(!window.speechSynthesis) return;
  const u=new SpeechSynthesisUtterance(text); u.lang='he-IL'; u.rate=1;
  window.speechSynthesis.speak(u);
}
function showVoiceToast(text){
  const t=document.getElementById('voice-toast'); if(!t) return;
  t.textContent=text; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2500);
}
function toggleVoice(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){ showVoiceToast('שליטה קולית לא נתמכת בדפדפן זה'); return; }
  if(_voiceActive){ stopVoice(); return; }
  _recognition=new SR(); _recognition.lang='he-IL'; _recognition.continuous=false; _recognition.interimResults=false;
  _recognition.onstart=()=>{ _voiceActive=true; document.getElementById('voice-btn')?.classList.add('listening'); showVoiceToast('מאזין...'); };
  _recognition.onend=()=>{ _voiceActive=false; document.getElementById('voice-btn')?.classList.remove('listening'); };
  _recognition.onresult=e=>{
    const text=e.results[0][0].transcript.toLowerCase(); showVoiceToast('שמעתי: '+text);
    const cmd=VOICE_CMDS.find(c=>c.k.some(k=>text.includes(k.toLowerCase())));
    if(cmd) cmd.fn(); else { speak('לא הבנתי. אמור: פוש, פול, לגס, ארמס, תזונה, סטריק, מנוחה'); }
  };
  _recognition.onerror=(ev)=>{
    _voiceActive=false;
    document.getElementById('voice-btn')?.classList.remove('listening');
    const msgs={'not-allowed':'גישה למיקרופון נדחתה — אשר הרשאה בדפדפן','no-speech':'לא זוהתה דיבור — נסה שוב','network':'שגיאת רשת — בדוק חיבור'};
    showVoiceToast(msgs[ev.error]||'שגיאת קול: '+ev.error);
  };
  _recognition.start();
}
function stopVoice(){
  _recognition?.stop(); _voiceActive=false;
  document.getElementById('voice-btn')?.classList.remove('listening');
}
function initVoiceBtn(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(SR) document.getElementById('voice-btn')?.classList.add('supported');
}

// ═══════════════════════════════════════════════════
// EXTENDED INIT — add to existing load handler
// ═══════════════════════════════════════════════════
window.addEventListener('load',()=>{
  cleanEmojis();
  renderElogPanel();
  // Pre-render elog chips in workout tables
  injectLastLogChips(getElog());
  setTimeout(()=>fixNumericRanges(),120);
  // ── New feature inits ──
  if(typeof renderXPWidget==='function') renderXPWidget();
  if(typeof renderBossCard==='function') renderBossCard();
  if(typeof renderHeatmap==='function') renderHeatmap();
  if(typeof updateNutritionTiming==='function') updateNutritionTiming();
  if(typeof checkDeload==='function') checkDeload();
  if(typeof initVoiceBtn==='function') initVoiceBtn();
  // Count-up animation for stat numbers
  setTimeout(()=>{
    document.querySelectorAll('.stat-box .val').forEach(el=>{
      // "80-90" is a range, not a quantity - counting it up yields "8,090"
      if(/[\u2013\u2014-]\s*\d/.test(el.textContent)) return;
      const raw=el.textContent.replace(/[^\d.]/g,'');
      const target=parseFloat(raw); if(!target||isNaN(target)) return;
      const suffix=el.textContent.replace(/[\d.,]/g,'').trim();
      const isInt=!el.textContent.includes('.');
      const dur=800, fps=60, steps=Math.round(dur/1000*fps);
      let step=0;
      const iv=setInterval(()=>{
        step++;
        const progress=step/steps;
        const ease=1-Math.pow(1-progress,3);
        const cur=target*ease;
        el.textContent=(isInt?Math.round(cur).toLocaleString('he-IL'):cur.toFixed(1))+suffix;
        if(step>=steps){el.textContent=el.dataset.final||el.textContent;clearInterval(iv);}
      },1000/fps);
    });
  },200);
  // new feature inits
  initTheme();
  initTopbar();
  initNotifCard();
  renderMeasurementsFull();
  renderRecoveryCard();
  renderWeeklyReport();
  setTimeout(injectOverloadBadges, 300);
});

// ═══════════════════════════════════════════════════
// ═══════════════════════════════════════════════════
// TOPBAR — dynamic greeting + profile name
// ═══════════════════════════════════════════════════
function initTopbar(){
  const h=new Date().getHours();
  const gr=h<12?'בוקר טוב':h<17?'צהריים טובים':h<21?'ערב טוב':'לילה טוב';
  const u=typeof getActiveUser==='function'?getActiveUser():null;
  const name=u?.name||'';
  const grEl=document.getElementById('tb-greeting');
  const nmEl=document.getElementById('tb-name');
  const avEl=document.getElementById('tb-avatar');
  if(grEl) grEl.textContent=gr;
  if(nmEl) nmEl.textContent=name||'KOACH';
  if(avEl) avEl.textContent=(name||'I').charAt(0).toUpperCase();
}

// Exercise search is a disclosure now — it used to sit in the header on all
// 16 panels, costing width on every screen to serve an occasional lookup.
function toggleExSearch(){
  const w=document.getElementById('ex-search-wrap');
  if(!w) return;
  const open=w.classList.toggle('open');
  document.getElementById('ex-search-toggle')?.classList.toggle('active',open);
  if(open) document.getElementById('ex-search-input')?.focus();
  else{
    const r=document.getElementById('ex-search-results');
    if(r) r.style.display='none';
  }
}

// "2,000–4,000 IU" renders as "4,000–2,000": an en-dash is bidi-neutral, so
// between two European numbers in an RTL paragraph it adopts the paragraph
// direction and the two numbers lay out right-to-left. A range is one atom.
// Isolating known containers does not scale - ranges live in dosages, the
// timeline, tips and coaching prose - so this walks text nodes instead.
const _RANGE=/[+\u2212]?\d[\d.,]*\s*[\u2013\u2014-]\s*\d[\d.,]*(?:\s*[+\/]?\s*(?=[A-Za-z0-9\u00B5]*[A-Za-z\u00B5])[A-Za-z0-9\u00B5%\u00B0.\/]+)*/;
const _NO_BDI='script,style,input,textarea,select,option,.ex-table,#gym-body,.stat-box,.wk-frac,.ell-num,.sets-cell,.ex-sets,bdi,svg';
function fixNumericRanges(root){
  const scope=root||document.getElementById('main-content');
  if(!scope) return;
  const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT,{
    acceptNode(n){
      if(!_RANGE.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
      if(n.parentElement?.closest(_NO_BDI)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const hits=[]; let n;
  while((n=walker.nextNode())) hits.push(n);
  hits.forEach(node=>{
    const frag=document.createDocumentFragment();
    let rest=node.nodeValue,m;
    const re=new RegExp(_RANGE.source,'g');
    let last=0;
    while((m=re.exec(rest))){
      if(m.index>last) frag.appendChild(document.createTextNode(rest.slice(last,m.index)));
      const bdi=document.createElement('bdi');
      bdi.setAttribute('dir','ltr');
      bdi.textContent=m[0];
      frag.appendChild(bdi);
      last=m.index+m[0].length;
    }
    if(last<rest.length) frag.appendChild(document.createTextNode(rest.slice(last)));
    node.parentNode.replaceChild(frag,node);
  });
}

// A .collapsible card shows only its heading until asked. These are the
// sections you consult occasionally - a questionnaire, a measurements form,
// a reference list - and having them all open is what made three screens
// feel like a wall.
function initCollapsibles(){
  document.querySelectorAll('.settings-group:not([data-wired])').forEach(g=>{
    g.dataset.wired='1';
    const head=g.querySelector('.settings-group-head');
    if(!head) return;
    head.setAttribute('role','button');
    head.setAttribute('tabindex','0');
    head.setAttribute('aria-expanded',g.classList.contains('open')?'true':'false');
    const toggle=()=>head.setAttribute('aria-expanded',g.classList.toggle('open')?'true':'false');
    head.addEventListener('click',toggle);
    head.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggle(); }
    });
  });
  document.querySelectorAll('.card.collapsible:not([data-collapsible])').forEach(card=>{
    card.dataset.collapsible='1';
    const head=card.querySelector('.card-head');
    if(!head) return;
    head.setAttribute('role','button');
    head.setAttribute('tabindex','0');
    const toggle=()=>{
      const open=card.classList.toggle('open');
      head.setAttribute('aria-expanded',open?'true':'false');
    };
    head.setAttribute('aria-expanded','false');
    head.addEventListener('click',toggle);
    head.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggle(); }
    });
  });
}

// Five panels were built and then left with no way in: panel-food is the food
// diary, panel-elog the weight log. showPanel already groups them onto the
// bottom-nav tabs, so the group only had to become visible.
const SUBNAV={
  nutrition:[['nutrition','יעדים'],['food','יומן אוכל'],['supplements','תוספים'],['chat','שאל AI']],
  progress:[['progress','סיכום'],['elog','משקולות'],['timeline','היסטוריה']]
};
function renderSubNav(name){
  document.querySelectorAll('.subnav').forEach(n=>n.remove());
  const group=Object.keys(SUBNAV).find(g=>SUBNAV[g].some(([id])=>id===name));
  if(!group) return;
  const panel=document.getElementById('panel-'+name);
  if(!panel) return;
  const bar=document.createElement('div');
  bar.className='subnav';
  bar.innerHTML=SUBNAV[group].map(([id,lbl])=>
    `<button class="subnav-btn${id===name?' active':''}" onclick="showPanel('${id}',null)">${lbl}</button>`).join('');
  panel.prepend(bar);
}

// LIGHT / DARK / AMOLED THEME — defined below in AMOLED section
function initTheme(){
  const t=localStorage.getItem('pf_theme')||'dark';
  applyTheme(t);
}

// ═══════════════════════════════════════════════════
// CONFETTI
// ═══════════════════════════════════════════════════
function fireConfetti(){
  const canvas=document.getElementById('confetti-canvas');
  if(!canvas) return;
  canvas.width=window.innerWidth; canvas.height=window.innerHeight;
  canvas.style.display='block';
  const ctx=canvas.getContext('2d');
  const colors=['#CCFF00','#7EF29A','#FF7A45','#B47CFF','#00D9FF','#FF7A45','#fff'];
  const ps=Array.from({length:160},()=>({
    x:Math.random()*canvas.width, y:-10-Math.random()*300,
    w:7+Math.random()*9, h:3+Math.random()*5,
    c:colors[Math.floor(Math.random()*colors.length)],
    vx:(Math.random()-.5)*4, vy:2+Math.random()*5,
    rot:Math.random()*360, vr:(Math.random()-.5)*10,
    a:1
  }));
  let raf;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let alive=false;
    ps.forEach(p=>{
      if(p.y<canvas.height+20){
        alive=true; p.x+=p.vx; p.y+=p.vy; p.vy+=0.07; p.rot+=p.vr;
        if(p.y>canvas.height*.65) p.a=Math.max(0,p.a-.025);
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
        ctx.globalAlpha=p.a; ctx.fillStyle=p.c;
        ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
        ctx.restore();
      }
    });
    if(alive) raf=requestAnimationFrame(draw);
    else{ canvas.style.display='none'; cancelAnimationFrame(raf); }
  }
  draw();
  setTimeout(()=>{ canvas.style.display='none'; cancelAnimationFrame(raf); },4500);
}

// ═══════════════════════════════════════════════════
// PROGRESSIVE OVERLOAD BADGES
// ═══════════════════════════════════════════════════
function _weekMon(dateStr){
  const d=new Date(dateStr); const day=d.getDay();
  const diff=d.getDate()-(day===0?6:day-1);
  const m=new Date(d); m.setDate(diff); return m.toISOString().slice(0,10);
}
function injectOverloadBadges(){
  const elog=getElog();
  const today=new Date();
  const thisW=_weekMon(today.toISOString().slice(0,10));
  const lastWDate=new Date(today); lastWDate.setDate(today.getDate()-7);
  const lastW=_weekMon(lastWDate.toISOString().slice(0,10));
  document.querySelectorAll('.ex-table tbody tr[onclick]').forEach(tr=>{
    const m=tr.getAttribute('onclick').match(/openModal\('(\w+)'\)/);
    if(!m) return;
    const entries=elog[m[1]]||[];
    const tw=entries.find(e=>_weekMon(e.date)===thisW);
    const lw=entries.find(e=>_weekMon(e.date)===lastW);
    tr.querySelector('.overload-badge')?.remove();
    if(!tw||!lw) return;
    const d=(tw.kg*tw.reps)-(lw.kg*lw.reps);
    const badge=document.createElement('span');
    badge.className='overload-badge '+(d>0?'overload-up':d<0?'overload-down':'overload-eq');
    badge.textContent=d>0?'↑':d<0?'↓':'=';
    const cell=tr.querySelector('.ex-name-main');
    if(cell) cell.insertAdjacentElement('afterend',badge);
  });
}

// ═══════════════════════════════════════════════════
// BODY MEASUREMENTS
// ═══════════════════════════════════════════════════
const MEAS_KEY='pf_meas';
function getMeasurements(){ try{return JSON.parse(localStorage.getItem(MEAS_KEY)||'[]')}catch(e){return[];} }
function saveMeasurement(){
  const chest=parseFloat(document.getElementById('meas-chest')?.value)||null;
  const waist=parseFloat(document.getElementById('meas-waist')?.value)||null;
  const arm=parseFloat(document.getElementById('meas-arm')?.value)||null;
  const hip=parseFloat(document.getElementById('meas-hip')?.value)||null;
  if(!chest&&!waist&&!arm&&!hip) return;
  const arr=getMeasurements();
  arr.unshift({date:todayStr(),chest,waist,arm,hip});
  localStorage.setItem(MEAS_KEY,JSON.stringify(arr.slice(0,50)));
  ['meas-chest','meas-waist','meas-arm','meas-hip'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  renderMeasurements();
  if(navigator.vibrate) navigator.vibrate(30);
}
function renderMeasurements(){
  const list=document.getElementById('meas-list'); if(!list) return;
  const arr=getMeasurements();
  if(!arr.length){ list.innerHTML='<div style="color:var(--muted);font-size:.85rem;">אין מדידות עדיין</div>'; return; }
  list.innerHTML=arr.slice(0,8).map(m=>`<div class="meas-row">
    <span class="meas-date">${_esc(m.date)}</span>
    <div class="meas-vals">
      ${m.chest?`<span class="meas-val">חזה <span>${m.chest}</span></span>`:''}
      ${m.waist?`<span class="meas-val">מותן <span>${m.waist}</span></span>`:''}
      ${m.arm?`<span class="meas-val">זרוע <span>${m.arm}</span></span>`:''}
      ${m.hip?`<span class="meas-val">ירך <span>${m.hip}</span></span>`:''}
    </div>
  </div>`).join('');
}

// ═══════════════════════════════════════════════════
// RPE TRACKER
// ═══════════════════════════════════════════════════
const RPE_KEY='pf_rpe';
function setRPE(v){
  document.querySelectorAll('.rpe-btn').forEach(b=>b.classList.toggle('sel',+b.dataset.v===v));
  // the keypad collapses again and the summary line carries the answer
  const cur=document.getElementById('rpe-current');
  if(cur) cur.textContent=v+' / 10';
  document.getElementById('rpe-wrap')?.classList.remove('open');
  const today=todayStr();
  const rpe=_getJSON(RPE_KEY,{});
  if(!rpe[today]) rpe[today]=[];
  rpe[today].push({t:new Date().toTimeString().slice(0,5),v});
  localStorage.setItem(RPE_KEY,JSON.stringify(rpe));
}

// ═══════════════════════════════════════════════════
// PUSH NOTIFICATIONS
// ═══════════════════════════════════════════════════
function initNotifCard(){
  const card=document.getElementById('notif-card');
  const btn=document.getElementById('notif-btn');
  if(!card) return;
  // Show red dot only while permission is not yet decided
  const dot=document.querySelector('.topbar-notif-dot');
  if(dot) dot.style.display=('Notification' in window&&Notification.permission==='default')?'block':'none';
  if(!('Notification' in window)){ card.style.display='none'; return; }
  if(Notification.permission==='granted'&&btn){ btn.textContent='פעיל ✓'; btn.disabled=true; }
  else if(Notification.permission==='denied'){ card.style.display='none'; }
}
async function requestWorkoutNotif(){
  if(!('Notification' in window)) return;
  const perm=await Notification.requestPermission();
  const btn=document.getElementById('notif-btn');
  if(perm==='granted'){
    if(btn){btn.textContent='פעיל ✓';btn.disabled=true;}
    const days={0:'ראשון',1:'שני',3:'רביעי',4:'חמישי'};
    const today=new Date().getDay();
    if(days[today]) new Notification('KOACH — יום אימון!',{
      body:`היום יום ${days[today]} — זמן אימון. בוא נתחיל!`,
      icon:'/fitness_app/icons/icon-192.png',
      badge:'/fitness_app/icons/icon-72.png'
    });
  } else if(perm==='denied'){
    document.getElementById('notif-card')?.style.setProperty('display','none');
  }
}

// ─── Export / Import ───────────────────────────────────────────────────────
function exportData(){
  const data={
    users: getUsers(),
    settings: getSettings(),
    log: getLog(),
    prs: getPRs(),
    elog: _getJSON(ELOG_KEY,{}),
    setlog: _getJSON(SETLOG_KEY,{}),
    wlog: _getJSON(WLOG_KEY,[]),
    measurements: _getJSON(MEAS_KEY,[]),
    exported: new Date().toISOString()
  };
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='protocolos-backup-'+todayStr()+'.json';
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),10000);
}
function importData(e){
  const file=e.target.files[0];
  if(!file) return;
  if(!confirm('ייבוא ידרוס את כל הנתונים הקיימים.\nהאם להמשיך?')){e.target.value='';return;}
  const reader=new FileReader();
  reader.onload=ev=>{
    try{
      const d=JSON.parse(ev.target.result);
      // Basic validation — must have at least one known key
      if(!d||typeof d!=='object'||(!d.users&&!d.log&&!d.prs&&!d.elog)){
        showToast('קובץ גיבוי לא תקין');return;
      }
      if(d.users)    localStorage.setItem(USERS_KEY,    JSON.stringify(d.users));
      if(d.settings) localStorage.setItem(SETTINGS_KEY, JSON.stringify(d.settings));
      if(d.log)      localStorage.setItem(LOG_KEY,      JSON.stringify(d.log));
      if(d.prs)      localStorage.setItem(PR_KEY,       JSON.stringify(d.prs));
      if(d.elog)         localStorage.setItem(ELOG_KEY,      JSON.stringify(d.elog));
      if(d.setlog)       localStorage.setItem(SETLOG_KEY,   JSON.stringify(d.setlog));
      if(d.wlog)         localStorage.setItem(WLOG_KEY,      JSON.stringify(d.wlog));
      if(d.measurements) localStorage.setItem(MEAS_KEY,      JSON.stringify(d.measurements));
      showToast('נתונים יובאו בהצלחה!');
      setTimeout(()=>location.reload(),1200);
    }catch(err){
      showToast('שגיאה בקריאת הקובץ — ודא שהקובץ תקין');
    }
  };
  reader.readAsText(file);
  e.target.value=''; // allow re-import same file
}

// ─── Test API Key ─────────────────────────────────────────────────────────
async function testApiKey(){
  const key=(document.getElementById('sf-apikey')?.value||'').trim()
           ||localStorage.getItem('proFit_apiKey')||'';
  if(!key){showToast('הכנס מפתח API קודם');return;}
  const btn=document.getElementById('test-api-btn');
  if(btn){btn.textContent='בודק…';btn.disabled=true;}
  try{
    const res=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true','content-type':'application/json'},
      body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:5,messages:[{role:'user',content:'hi'}]})
    });
    if(res.ok||res.status===200){
      showToast('מפתח תקין — AI מוכן!');
      if(btn){btn.textContent='תקין';btn.style.color='var(--lime)';}
    } else if(res.status===401){
      showToast('מפתח שגוי — בדוק שהעתקת נכון');
      if(btn){btn.textContent='שגוי';btn.style.color='var(--red)';}
    } else {
      showToast('שגיאה '+res.status+' — נסה שוב');
      if(btn){btn.textContent='בדוק מפתח';btn.disabled=false;}
    }
  }catch(err){
    showToast('שגיאת רשת — בדוק חיבור');
    if(btn){btn.textContent='בדוק מפתח';btn.disabled=false;}
  }
}

// ═══════════════════════════════════════════════════
// PLATE CALCULATOR
// ═══════════════════════════════════════════════════
const PLATE_SIZES=[25,20,15,10,5,2.5,1.25];
function openPlateCalc(){
  document.getElementById('plate-calc-modal')?.classList.add('open');
  calcPlates();
}
function closePlateCalc(){
  document.getElementById('plate-calc-modal')?.classList.remove('open');
}
function calcPlates(){
  const target=parseFloat(document.getElementById('pc-target')?.value)||0;
  const bar=parseFloat(document.getElementById('pc-bar')?.value)||20;
  const el=document.getElementById('pc-result');
  if(!el) return;
  if(!target||target<=bar){
    el.innerHTML='<div style="color:var(--muted);font-size:.85rem;text-align:center;padding:8px 0;">הכנס משקל יעד גדול מהמוט</div>';
    return;
  }
  let remaining=parseFloat(((target-bar)/2).toFixed(2));
  const used=[];
  for(const p of PLATE_SIZES){
    const n=Math.floor(remaining/p+0.001);
    if(n>0){used.push({p,n});remaining=parseFloat((remaining-n*p).toFixed(2));}
  }
  if(remaining>0.1){
    el.innerHTML='<div style="color:var(--red);font-size:.85rem;text-align:center;">לא ניתן בצלחות סטנדרטיות</div>';
    return;
  }
  const COLORS={25:'#e63946',20:'#3b82f6',15:'#8b5cf6',10:'#22c55e',5:'#f59e0b',2.5:'#06b6d4',1.25:'#64748b'};
  el.innerHTML=`<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;direction:ltr;">
    ${used.map(({p,n})=>Array(n).fill(0).map(()=>`
      <div style="background:${COLORS[p]||'#555'};color:#fff;border-radius:6px;padding:6px 10px;font-weight:800;font-size:.9rem;min-width:36px;text-align:center;">${p}</div>
    `).join('')).join('')}
  </div>
  <div style="font-size:.78rem;color:var(--muted);border-top:1px solid var(--border);padding-top:8px;">
    ${used.map(({p,n})=>`<span style="margin-inline-end:10px;">${p}ק"ג × ${n}</span>`).join('')}
    <div style="margin-top:4px;">מוט ${bar}ק"ג + צלחות × 2 = <strong style="color:var(--text);">${target}ק"ג</strong></div>
  </div>`;
}

// ═══════════════════════════════════════════════════
// 1RM CALCULATOR
// ═══════════════════════════════════════════════════
function calc1RM(kg,reps){
  if(reps===1) return kg;
  return Math.round(kg*(1+reps/30)); // Epley
}
function open1RMCalc(){
  // Populate exercise select
  const sel=document.getElementById('orm-ex-select');
  if(sel&&sel.options.length<=1){
    Object.entries(EX).forEach(([k,v])=>{
      const o=document.createElement('option');
      o.value=k; o.textContent=v.name;
      sel.appendChild(o);
    });
  }
  document.getElementById('orm-modal')?.classList.add('open');
  render1RM();
}
function close1RMCalc(){
  document.getElementById('orm-modal')?.classList.remove('open');
}
function render1RM(){
  const el=document.getElementById('orm-result');
  if(!el) return;
  const kg=parseFloat(document.getElementById('orm-kg')?.value)||0;
  const reps=parseInt(document.getElementById('orm-reps')?.value)||0;
  const key=document.getElementById('orm-ex-select')?.value;
  // Also try from history
  let histOrm=0;
  if(key){
    const hist=getModalSetHistory(key)||[];
    hist.forEach(session=>{
      if(!Array.isArray(session)) return;
      session.forEach(s=>{if(s.kg&&s.reps) histOrm=Math.max(histOrm,calc1RM(s.kg,s.reps));});
    });
  }
  const manualOrm=kg&&reps?calc1RM(kg,reps):0;
  const orm=manualOrm||histOrm;
  if(!orm){el.innerHTML='<div style="color:var(--muted);text-align:center;padding:8px;">הזן משקל + חזרות</div>';return;}
  const pcts=[1,.9,.8,.7,.6,.5];
  el.innerHTML=`
    <div style="text-align:center;margin-bottom:12px;">
      <div style="font-size:3rem;font-weight:900;color:var(--red);line-height:1;">${orm}</div>
      <div style="font-size:.8rem;color:var(--muted);">ק"ג · מקסימום חזרה אחת (1RM)</div>
      ${manualOrm?`<div style="font-size:.7rem;color:var(--muted);margin-top:2px;">מחושב מ-${kg}ק"ג × ${reps} חזרות</div>`:`<div style="font-size:.7rem;color:var(--cyan);margin-top:2px;">מהיסטוריית האימונים שלך</div>`}
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
      ${pcts.map(p=>`
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:8px;text-align:center;">
          <div style="font-size:1rem;font-weight:700;color:var(--text);">${Math.round(orm*p)}</div>
          <div style="font-size:.65rem;color:var(--muted);">${Math.round(p*100)}% 1RM</div>
        </div>
      `).join('')}
    </div>`;
}

// ═══════════════════════════════════════════════════
// AMOLED THEME (3rd mode: dark → light → amoled)
// ═══════════════════════════════════════════════════
function applyTheme(t){
  const root=document.documentElement;
  root.setAttribute('data-theme',t==='light'?'light':t==='amoled'?'amoled':'');
  const btn=document.getElementById('theme-btn');
  if(btn) btn.textContent=t==='light'?'ערכה: בהירה':t==='amoled'?'ערכה: AMOLED':'ערכה: כהה';
  localStorage.setItem('pf_theme',t);
}
function toggleTheme(){
  const cur=localStorage.getItem('pf_theme')||'dark';
  const next={dark:'light',light:'amoled',amoled:'dark'}[cur]||'dark';
  applyTheme(next);
}

// ═══════════════════════════════════════════════════
// PR SHARE CARD
// ═══════════════════════════════════════════════════
function openPRShareCard(exKey,kg,reps){
  const canvas=document.getElementById('share-canvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  const W=400,H=260;
  const exName=(EX[exKey]?.name)||exKey;
  const orm=calc1RM(kg,reps);
  // Background
  ctx.fillStyle='#0a0c10'; ctx.fillRect(0,0,W,H);
  const g=ctx.createLinearGradient(0,0,W,H);
  g.addColorStop(0,'rgba(230,57,70,.22)'); g.addColorStop(1,'rgba(255,214,0,.08)');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  // Border
  ctx.strokeStyle='rgba(230,57,70,.5)'; ctx.lineWidth=2; ctx.strokeRect(1,1,W-2,H-2);
  // Dumbbell mark (vector)
  ctx.fillStyle='#CCFF00';
  ctx.fillRect(22,44,7,28); ctx.fillRect(33,36,7,44);
  ctx.fillRect(58,36,7,44); ctx.fillRect(69,44,7,28);
  ctx.fillRect(40,54,18,8);
  // PR label
  ctx.font='900 13px "Barlow Condensed",Barlow,sans-serif';
  ctx.fillStyle='#CCFF00'; ctx.textAlign='left'; ctx.fillText('שיא אישי חדש!',86,42);
  // Exercise name
  ctx.font='700 22px Barlow,sans-serif';
  ctx.fillStyle='#F8FAFC'; ctx.fillText(exName,86,68);
  // Big weight
  ctx.font='900 72px "Barlow Condensed",Barlow,sans-serif';
  ctx.fillStyle='#CCFF00'; ctx.textAlign='center'; ctx.fillText(kg+'ק״ג',W/2,160);
  // Reps
  ctx.font='700 22px Barlow,sans-serif';
  ctx.fillStyle='rgba(255,255,255,.6)'; ctx.fillText('× '+reps+' חזרות',W/2,188);
  // 1RM
  ctx.font='600 14px Barlow,sans-serif';
  ctx.fillStyle='rgba(255,255,255,.4)'; ctx.fillText('1RM מוערך: '+orm+'ק״ג',W/2,212);
  // User + date
  const s=getSettings();
  ctx.font='400 11px Barlow,sans-serif'; ctx.fillStyle='rgba(255,255,255,.3)';
  ctx.fillText((s.name||'KOACH')+'  ·  '+todayStr(),W/2,H-14);
  // Logo
  ctx.font='900 14px "Barlow Condensed",Barlow,sans-serif';
  ctx.fillStyle='rgba(230,57,70,.7)'; ctx.textAlign='right';
  ctx.fillText('PROTOCOLOS',W-16,H-14);
  document.getElementById('share-overlay').classList.add('open');
  if(navigator.canShare) document.getElementById('share-native-btn').style.display='inline-block';
}

// ═══════════════════════════════════════════════════
// PROGRESSIVE OVERLOAD SUGGESTIONS
// ═══════════════════════════════════════════════════
function checkProgressiveSuggestion(exKey,kg,reps){
  const hist=getModalSetHistory(exKey)||[];
  if(hist.length<2) return; // need at least 2 sessions
  // Find best of PREVIOUS session (not current)
  const prev=hist[1]; // hist[0] is current session
  if(!Array.isArray(prev)||!prev.length) return;
  const prevBest=prev.reduce((best,s)=>{
    return(!best||calc1RM(s.kg,s.reps)>calc1RM(best.kg,best.reps))?s:best;
  },null);
  if(!prevBest) return;
  const currOrm=calc1RM(kg,reps);
  const prevOrm=calc1RM(prevBest.kg,prevBest.reps);
  const delta=Math.round((currOrm-prevOrm)/prevOrm*100);
  if(currOrm>prevOrm){
    showToast(`+${delta}% vs השבוע שעבר — ממשיכים!`);
  } else if(currOrm===prevOrm){
    showToast(`משקל זהה לשבוע שעבר — נסה +2.5ק"ג בסט הבא`);
  }
  // else: lighter, don't comment (might be deload)
}

// ═══════════════════════════════════════════════════
// RECOVERY SCORE
// ═══════════════════════════════════════════════════
const RECOVERY_KEY='pf_recovery';
function getRecoveryToday(){
  try{
    const d=JSON.parse(localStorage.getItem(RECOVERY_KEY)||'{}');
    return d.date===todayStr()?d:null;
  }catch(e){return null;}
}
function saveRecovery(sleep,energy,soreness){
  const score=Math.round((sleep+energy+(6-soreness))/3*2); // 1–10
  const rec={date:todayStr(),sleep,energy,soreness,score};
  localStorage.setItem(RECOVERY_KEY,JSON.stringify(rec));
  renderRecoveryCard();
  if(score<=3) showToast('ריקברי נמוך מאוד — מנוחה מלאה מומלצת היום!',4000);
  else if(score<=5) showToast('ריקברי בינוני — שקול אימון קל / Deload',3000);
}
function renderRecoveryCard(){
  const el=document.getElementById('recovery-card-body');
  if(!el) return;
  const today=getRecoveryToday();
  if(!today){
    el.innerHTML=`
      <div style="font-size:.85rem;color:var(--muted);margin-bottom:12px;">לא עשית צ'ק-אין היום — 3 שאלות מהירות:</div>
      <div style="margin-bottom:10px;">
        <label style="font-size:.78rem;color:var(--muted2);display:block;margin-bottom:4px;">איכות שינה (1=גרועה, 5=מצוינת)</label>
        <div style="display:flex;gap:6px;" id="rec-sleep-btns">
          ${[1,2,3,4,5].map(v=>`<button onclick="selectRecovery('sleep',${v},this)" style="flex:1;background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:6px 0;font-weight:700;color:var(--text);cursor:pointer;font-family:var(--font);">${v}</button>`).join('')}
        </div>
      </div>
      <div style="margin-bottom:10px;">
        <label style="font-size:.78rem;color:var(--muted2);display:block;margin-bottom:4px;">רמת אנרגיה (1=נמוכה, 5=גבוהה)</label>
        <div style="display:flex;gap:6px;" id="rec-energy-btns">
          ${[1,2,3,4,5].map(v=>`<button onclick="selectRecovery('energy',${v},this)" style="flex:1;background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:6px 0;font-weight:700;color:var(--text);cursor:pointer;font-family:var(--font);">${v}</button>`).join('')}
        </div>
      </div>
      <div style="margin-bottom:14px;">
        <label style="font-size:.78rem;color:var(--muted2);display:block;margin-bottom:4px;">כאבי שרירים (1=הרבה, 5=אין)</label>
        <div style="display:flex;gap:6px;" id="rec-soreness-btns">
          ${[1,2,3,4,5].map(v=>`<button onclick="selectRecovery('soreness',${v},this)" style="flex:1;background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:6px 0;font-weight:700;color:var(--text);cursor:pointer;font-family:var(--font);">${v}</button>`).join('')}
        </div>
      </div>
      <button onclick="submitRecovery()" style="width:100%;background:var(--red);color:#fff;border:none;border-radius:10px;padding:10px;font-weight:700;font-size:.9rem;cursor:pointer;font-family:var(--font);">שמור צ'ק-אין</button>`;
    window._rec={sleep:3,energy:3,soreness:3};
    return;
  }
  const score=today.score;
  const color=score>=8?'var(--lime)':score>=5?'var(--yellow)':'var(--red)';
  const rec=score>=8?'ירוק — אימון מלא מומלץ!':score>=5?'בינוני — אימון מתון/עצימות נמוכה':' אדום — מנוחה פעילה מומלצת';
  el.innerHTML=`
    <div style="display:flex;align-items:center;gap:16px;">
      <div style="text-align:center;min-width:64px;">
        <div style="font-size:2.5rem;font-weight:900;color:${color};line-height:1;">${score}</div>
        <div style="font-size:.65rem;color:var(--muted);">מתוך 10</div>
      </div>
      <div>
        <div style="font-size:.88rem;font-weight:700;color:var(--text);margin-bottom:4px;">${rec}</div>
        <div style="font-size:.72rem;color:var(--muted);">שינה: ${today.sleep}/5 · אנרגיה: ${today.energy}/5 · כאבים: ${today.soreness}/5</div>
      </div>
    </div>`;
}
let _rec={sleep:3,energy:3,soreness:3};
function selectRecovery(type,val,btn){
  _rec[type]=val;
  const container=btn.closest('[id$="-btns"]');
  if(container) container.querySelectorAll('button').forEach(b=>{
    b.style.background=b===btn?'var(--red)':'var(--bg2)';
    b.style.color=b===btn?'#fff':'var(--text)';
  });
}
function submitRecovery(){
  saveRecovery(_rec.sleep||3,_rec.energy||3,_rec.soreness||3);
  showToast('צ\'ק-אין יומי נשמר!');
}

// ═══════════════════════════════════════════════════
// WEEKLY REPORT
// ═══════════════════════════════════════════════════
function _getWeekDates(){
  const now=new Date();
  const day=now.getDay();
  const mon=new Date(now);
  // Sunday is the first day of the week here, as it is in the plan and on
  // the dashboard; this used to start on Monday and shift the whole strip
  mon.setDate(now.getDate()-day);
  return Array.from({length:7},(_,i)=>{
    const d=new Date(mon); d.setDate(mon.getDate()+i);
    // local, not UTC: todayStr() is local, and toISOString() shifted the key
    // by a day between midnight and 03:00 Israel time
    const p=x=>String(x).padStart(2,'0');
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
  });
}
/** @param {string[]} weekDates @returns {{workoutDays:number,weekPRs:number,weekVol:number,avgCal:number}} */
function _buildWeekStats(weekDates){
  const log=getLog(); const prs=getPRs(); const elog=getElog();
  const workoutDays=weekDates.filter(d=>log[d]&&Object.values(log[d]).some(v=>v===true||v===1)).length;
  let weekVol=0;
  Object.values(elog).forEach(arr=>{
    if(!Array.isArray(arr)) return;
    arr.forEach(e=>{ if(weekDates.includes(e.date)) weekVol+=Math.round((e.kg||0)*(e.reps||0)*(e.sets||1)); });
  });
  const weekPRs=Object.entries(prs).filter(([,v])=>weekDates.includes(v.date)).length;
  const foodLogs=weekDates.map(d=>{try{return JSON.parse(localStorage.getItem(FOOD_KEY+'_'+d)||'[]');}catch(e){return[];}});
  const avgCal=Math.round(foodLogs.reduce((s,fl)=>s+fl.reduce((a,f)=>a+(f.cal||0)*(f.qty||1),0),0)/Math.max(1,foodLogs.filter(fl=>fl.length).length));
  return {workoutDays,weekPRs,weekVol,avgCal};
}
function _buildWeekCoachSection(){
  const tips=Object.keys(EX).map(k=>({key:k,tip:getCoachTip(k)})).filter(x=>x.tip);
  if(!tips.length) return '';
  return `<div class="wr-coach">
    <div class="wr-coach-title">המלצות מאמן</div>
    ${tips.map(x=>`<div class="coach-tip coach-tip--${x.tip.type}">
      <span class="ct-icon">${_ic(x.tip.icon)}</span>
      <span class="ct-ex-name">${EX[x.key].name}:</span>
      <span class="ct-msg">${x.tip.msg}</span>
    </div>`).join('')}
  </div>`;
}
function renderWeeklyReport(){
  const el=document.getElementById('weekly-report-body');
  if(!el) return;
  const weekDates=_getWeekDates();
  const log=getLog();
  const {workoutDays,weekPRs,weekVol,avgCal}=_buildWeekStats(weekDates);
  const days=['א','ב','ג','ד','ה','ו','ש'];
  el.innerHTML=`
    <div class="wr-grid">
      <div class="wr-stat-card"><div class="wr-stat-val" data-val="${workoutDays}">0</div><div class="wr-stat-lbl">אימונים השבוע</div></div>
      <div class="wr-stat-card"><div class="wr-stat-val" data-val="${weekPRs}">0</div><div class="wr-stat-lbl">שיאים חדשים</div></div>
      <div class="wr-stat-card"><div class="wr-stat-val${weekVol>0?'':' is-empty'}">${weekVol>0?Math.round(weekVol/1000)+'K':'—'}</div><div class="wr-stat-lbl">נפח אימון (ק"ג)</div></div>
      <div class="wr-stat-card"><div class="wr-stat-val${avgCal?'':' is-empty'}" ${avgCal?'data-val="'+avgCal+'"':''}>${avgCal?'0':'—'}</div><div class="wr-stat-lbl">קל' ממוצע ליום</div></div>
    </div>
    <div class="wr-days">
      ${weekDates.map((d,i)=>{
        const hasWorkout=log[d]&&Object.values(log[d]).some(v=>v===true||v===1);
        const isToday=d===todayStr();
        return `<div class="wr-day">
          <div class="wr-day-bar${hasWorkout?' done':''}${isToday?' today':''}"></div>
          <div class="wr-day-lbl">${days[i]}</div>
        </div>`;
      }).join('')}
    </div>
    ${_buildWeekCoachSection()}`;
  el.querySelectorAll('.wr-stat-val[data-val]').forEach(v=>countUp(v,+v.dataset.val));
}

// ═══════════════════════════════════════════════════
// BODY MEASUREMENTS — enhanced with mini chart
// ═══════════════════════════════════════════════════
function saveMeasurementFull(){
  const fields=['meas-chest','meas-waist','meas-arm','meas-hip','meas-neck','meas-thigh'];
  const keys  =['chest','waist','arm','hip','neck','thigh'];
  const vals={};
  fields.forEach((id,i)=>{
    const v=parseFloat(document.getElementById(id)?.value)||null;
    if(v) vals[keys[i]]=v;
  });
  if(!Object.keys(vals).length){showToast('הזן לפחות מדידה אחת');return;}
  const arr=getMeasurements();
  arr.unshift({date:todayStr(),...vals});
  localStorage.setItem(MEAS_KEY,JSON.stringify(arr.slice(0,60)));
  fields.forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  renderMeasurementsFull();
  showToast('מדידות נשמרו!');
  if(navigator.vibrate) navigator.vibrate(30);
}
function renderMeasurementsFull(){
  renderMeasurements(); // existing list
  renderMeasChart();
}
function renderMeasChart(){
  const svg=document.getElementById('meas-svg');
  if(!svg) return;
  const arr=getMeasurements().slice(0,12).reverse();
  if(arr.length<2){
    svg.innerHTML='<text x="50%" y="50%" text-anchor="middle" fill="var(--muted)" font-size="12">הוסף לפחות 2 מדידות לגרף</text>';
    return;
  }
  const W=320,H=120,P={t:16,r:20,b:24,l:36};
  const metrics=[
    {key:'chest',color:'#e63946',label:'חזה'},
    {key:'waist',color:'#FF7A45',label:'מותן'},
    {key:'arm',color:'#7EF29A',label:'זרוע'},
  ];
  const allVals=arr.flatMap(m=>metrics.map(me=>m[me.key]).filter(Boolean));
  if(!allVals.length){svg.innerHTML='';return;}
  const minV=Math.min(...allVals)-1,maxV=Math.max(...allVals)+1;
  const xs=i=>P.l+(i/(arr.length-1))*(W-P.l-P.r);
  const ys=v=>P.t+(1-(v-minV)/(maxV-minV))*(H-P.t-P.b);
  let h=`<defs>`;
  metrics.forEach((m,mi)=>{h+=`<linearGradient id="mg${mi}" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${m.color}"/><stop offset="100%" stop-color="${m.color}" stop-opacity=".6"/></linearGradient>`;});
  h+='</defs>';
  metrics.forEach((m,mi)=>{
    const pts=arr.map((e,i)=>e[m.key]?`${xs(i)},${ys(e[m.key])}`:null).filter(Boolean);
    if(pts.length<2) return;
    h+=`<polyline points="${pts.join(' ')}" fill="none" stroke="${m.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
    arr.forEach((e,i)=>{if(e[m.key])h+=`<circle cx="${xs(i)}" cy="${ys(e[m.key])}" r="3" fill="${m.color}" stroke="#0a0c10" stroke-width="1.5"/>`; });
  });
  // X labels
  const step=Math.max(1,Math.floor(arr.length/4));
  arr.forEach((e,i)=>{if(i%step===0||i===arr.length-1)h+=`<text x="${xs(i)}" y="${H-P.b+14}" text-anchor="middle" fill="#8d97a5" font-size="10" font-family="Barlow,sans-serif">${e.date.slice(8)+'.'+e.date.slice(5,7)}</text>`;});
  // Legend
  metrics.forEach((m,mi)=>{h+=`<circle cx="${P.l+mi*70}" cy="${H-P.b+22}" r="3" fill="${m.color}"/><text x="${P.l+mi*70+6}" y="${H-P.b+26}" fill="${m.color}" font-size="8" font-family="Barlow,sans-serif">${m.label}</text>`;});
  svg.setAttribute('viewBox',`0 0 ${W} ${H+28}`);
  svg.innerHTML=h;
}

// ═══════════════════════════════════════════════════
// SHARE OPTIONS MODAL
// ═══════════════════════════════════════════════════
function openShareOptions(){
  const el=document.getElementById('share-options-modal');
  if(el){el.style.display='flex';}
}
function closeShareOptions(){
  const el=document.getElementById('share-options-modal');
  if(el){el.style.display='none';}
}
function shareStatsCard(){
  closeShareOptions();
  drawShareCard();
  document.getElementById('share-overlay').classList.add('open');
  if(navigator.canShare) document.getElementById('share-native-btn').style.display='inline-block';
}
function shareWhatsApp(){
  closeShareOptions();
  const u=getActiveUser()||{};
  const xp=getXP(); const lvl=getLevelData(xp);
  const streak=parseInt(document.getElementById('streak-num')?.textContent||'0');
  const text=`*KOACH — האימון שלי*\n\n${u.name||'מתאמן'}\nרמה: ${lvl.badge} ${lvl.name}\nXP: ${xp} נקודות\nרצף: ${streak} ימים\n\nהורד בחינם: https://bke1302.github.io/fitness_app/`;
  window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank');
}
function shareNativeOrDownload(){
  closeShareOptions();
  drawShareCard();
  const canvas=document.getElementById('share-canvas');
  if(!canvas) return;
  canvas.toBlob(async blob=>{
    const file=new File([blob],'protocolos-stats.png',{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){
      try{ await navigator.share({files:[file],title:'KOACH Stats',text:'הסטטיסטיקות שלי ב-KOACH'}); return; }
      catch(e){}
    }
    const a=document.createElement('a');
    a.download='protocolos-stats.png'; a.href=URL.createObjectURL(blob); a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),2000);
  });
}
function downloadStatsCard(){
  closeShareOptions();
  drawShareCard();
  const canvas=document.getElementById('share-canvas');
  if(!canvas) return;
  const a=document.createElement('a');
  a.download='protocolos-stats.png'; a.href=canvas.toDataURL('image/png'); a.click();
}

// ═══════════════════════════════════════════════════
// GYM → HOME substitution map (per equipment tier)
// ═══════════════════════════════════════════════════
const GYM_TO_HOME={
  benchPress:  {none:'pushup',        band:'bandChestPress', db:'dbFloorPress'},
  inclineBench:{none:'declinePushup', band:'bandChestPress', db:'dbFloorPress'},
  cableFlye:   {none:'pushup',        band:'bandChestPress', db:'dbFloorPress'},
  ohp:         {none:'pikePushup',    band:'bandLateral',    db:'dbShoulderPress'},
  pullup:      {none:'chinupHome',    band:'bandPulldown',   db:'chinupHome'},
  bentRow:     {none:'doorRow',       band:'bandRow',        db:'dbRow'},
  cableRow:    {none:'doorRow',       band:'bandRow',        db:'dbRow'},
  tBarRow:     {none:'doorRow',       band:'bandRow',        db:'dbRow'},
  facePull:    {none:'doorRow',       band:'bandFacePull',   db:'bandFacePull'},
  squat:       {none:'bwSquat',       band:'bwSquat',        db:'dbGobletSquat'},
  legPress:    {none:'bulgSplitHome', band:'bulgSplitHome',  db:'dbGobletSquat'},
  legExt:      {none:'pistolBox',     band:'bwSquat',        db:'dbGobletSquat'},
  legCurl:     {none:'nordicHome',    band:'bandGoodMorning',db:'dbRdl'},
  rdl:         {none:'gluteBridgeSL', band:'bandGoodMorning',db:'dbRdl'},
  deadlift:    {none:'nordicHome',    band:'bandGoodMorning',db:'dbRdl'},
  hipThrust:   {none:'gluteBridgeSL', band:'gluteBridgeSL',  db:'gluteBridgeSL'},
  lunges:      {none:'bulgSplitHome', band:'bulgSplitHome',  db:'bulgSplitHome'},
  calfRaise:   {none:'calfRaiseHome', band:'calfRaiseHome',  db:'calfRaiseHome'},
  seatedCalfRaise:{none:'calfRaiseHome',band:'calfRaiseHome',db:'calfRaiseHome'},
  bbCurl:      {none:'chinupHome',    band:'bandCurl',       db:'hammerCurl'},
  triPushdown: {none:'diamondPushup', band:'bandTricep',     db:'ohTricep'},
  skullCrusher:{none:'diamondPushup', band:'bandTricep',     db:'ohTricep'},
  arnoldPress: {none:'pikePushup',    band:'bandLateral',    db:'dbShoulderPress'},
};

// ═══════════════════════════════════════════════════
// MULTI-FREQUENCY WORKOUT PLANS
// ═══════════════════════════════════════════════════
const WORKOUT_PLANS={
  home_bw3:{
    days:[
      {id:'push',label:'פול-בודי א׳ — ביתי',shortLabel:'בית א׳',color:'#FF7A45',
       exercises:['pushup','doorRow','bwSquat','gluteBridgeSL','pikePushup','plankReach']},
      {id:'pull',label:'פול-בודי ב׳ — ביתי',shortLabel:'בית ב׳',color:'#00D9FF',
       exercises:['declinePushup','chinupHome','bulgSplitHome','nordicHome','diamondPushup','hollowHold']},
      {id:'legs',label:'פול-בודי ג׳ — ביתי',shortLabel:'בית ג׳',color:'#B47CFF',
       exercises:['pikePushup','doorRow','pistolBox','gluteBridgeSL','pushup','calfRaiseHome','plankReach']},
    ],
    dows:[0,2,4],
    schedule:'א׳ A · ג׳ B · ה׳ C — משקל גוף בלבד, 48 שעות מנוחה בין אימונים'
  },
  home_band3:{
    days:[
      {id:'push',label:'פול-בודי א׳ — גומיות',shortLabel:'גומי א׳',color:'#FF7A45',
       exercises:['pushup','bandRow','bwSquat','bandChestPress','bandGoodMorning','bandFacePull']},
      {id:'pull',label:'פול-בודי ב׳ — גומיות',shortLabel:'גומי ב׳',color:'#00D9FF',
       exercises:['bandPulldown','declinePushup','bulgSplitHome','bandLateral','bandCurl','bandTricep']},
      {id:'legs',label:'פול-בודי ג׳ — גומיות',shortLabel:'גומי ג׳',color:'#B47CFF',
       exercises:['bandChestPress','bandRow','pistolBox','gluteBridgeSL','bandFacePull','calfRaiseHome']},
    ],
    dows:[0,2,4],
    schedule:'א׳ A · ג׳ B · ה׳ C — גומיות התנגדות + משקל גוף'
  },
  home_db4:{
    days:[
      {id:'push',label:'עליון א׳ — ביתי',shortLabel:'עליון א׳',color:'#CCFF00',
       exercises:['dbFloorPress','dbRow','dbShoulderPress','chinupHome','lateralRaise','hammerCurl']},
      {id:'pull',label:'תחתון א׳ — ביתי',shortLabel:'תחתון א׳',color:'#B47CFF',
       exercises:['dbGobletSquat','dbRdl','bulgSplitHome','gluteBridgeSL','calfRaiseHome','plankReach']},
      {id:'legs',label:'עליון ב׳ — ביתי',shortLabel:'עליון ב׳',color:'#00D9FF',
       exercises:['pushup','dbRow','pikePushup','bandFacePull','inclineCurl','ohTricep']},
      {id:'arms',label:'תחתון ב׳ — ביתי',shortLabel:'תחתון ב׳',color:'#FF7A45',
       exercises:['dbRdl','pistolBox','dbGobletSquat','nordicHome','calfRaiseHome','hollowHold']},
    ],
    dows:[0,1,3,4],
    schedule:'א׳ עליון A · ב׳ תחתון A · ד׳ עליון B · ה׳ תחתון B'
  },
  1:{
    days:[
      {id:'push',label:'פול-בודי — אימון שבועי',shortLabel:'פול-בודי',color:'#FF7A45',
       exercises:['squat','benchPress','pullup','rdl','bentRow','ohp','triPushdown']},
    ],
    dows:[3],
    progression:'התקדמות ליניארית: כל אימון +2.5 ק״ג בעליון / +5 ק״ג בתחתון. נכשלת פעמיים ברצף — הורד 10% והתחל טיפוס מחדש.',
    schedule:'רביעי — כל הגוף (7 מתחמים, כ־65 דק׳)'
  },
  2:{
    days:[
      {id:'push',label:'יום א׳ — פול-בודי כבד',shortLabel:'יום א׳',color:'#CCFF00',
       exercises:['squat','benchPress','pullup','rdl','cableRow','triPushdown','bbCurl','calfRaise']},
      {id:'pull',label:'יום ב׳ — פול-בודי נפח',shortLabel:'יום ב׳',color:'#00D9FF',
       exercises:['legPress','ohp','bentRow','inclineBench','underhandPulldown','hipThrust','lateralRaise','legCurl','seatedCalfRaise','hangingLegRaise']},
    ],
    dows:[1,4],
    progression:'התקדמות ליניארית: כל אימון +2.5 ק״ג בעליון / +5 ק״ג בתחתון בתרגיל הראשי. נכשלת בטווח פעמיים ברצף — הורד 10%. בבידודים: הגע לראש הטווח בכל הסטים ואז +2.5 ק״ג. Deload כל 8–10 שבועות.',
    schedule:'ב׳ + ה׳ (72 / 96 שעות מנוחה — פריסה אופטימלית ל-2 אימונים)'
  },
  '3ab':{
    days:[
      {id:'push',label:'פלג גוף עליון',shortLabel:'עליון',color:'#CCFF00',
       exercises:['benchPress','pullup','ohp','bentRow','inclineBench','triPushdown','bbCurl','facePull']},
      {id:'pull',label:'פלג גוף תחתון',shortLabel:'תחתון',color:'#B47CFF',
       exercises:['squat','rdl','legPress','legCurl','legExt','hipThrust','calfRaise']},
    ],
    dows:[0,2,4],
    schedule:'א׳ עליון · ג׳ תחתון · ה׳ עליון — הסבב מתחלף שבוע-שבוע'
  },
  '3ss':{
    days:[
      {id:'push',label:'פול-בודי א׳ — כוח (מוט חופשי)',shortLabel:'פול-בודי א׳',color:'#CCFF00',estMin:52,
       exercises:['benchPress','pullup','squat','facePull','legCurl','cableLateral','triPushdown','cableCurl'],
       supersets:[
         {id:'A1',pair:['benchPress','pullup'],type:'antagonist',rounds:4,restWithin:20,restBetween:120,
          note:'דחיפה אופקית מול משיכה אנכית. אין שריר משותף, אפס עומס על עמוד השדרה, והאחיזה במתח מתאוששת במלואה במהלך סט הלחיצה.'},
         {id:'A2',pair:['squat','facePull'],type:'noncompeting',rounds:4,restWithin:20,restBetween:120,
          note:'סקוואט כבד מול בידוד כתף אחורית במשקל זניח. את משיכת הפנים תרוץ קל — היא מנוחה אקטיבית, לא תרגיל.'},
         {id:'A3',pair:['legCurl','cableLateral'],type:'noncompeting',rounds:3,restWithin:20,restBetween:60,
          note:'ירך אחורי בשכיבה מול כתף אמצעית בכבל. אפס חפיפה, אפס גב תחתון, אפס אחיזה.'},
         {id:'A4',pair:['triPushdown','cableCurl'],type:'antagonist',rounds:3,restWithin:15,restBetween:60,
          note:'אנטגוניסטים במרפק על אותה עמדת כבל. המפרק משותף — לכן 3 סבבים בלבד ובסוף האימון.'}
       ]},
      {id:'pull',label:'פול-בודי ב׳ — נפח (דמבל ומכונה)',shortLabel:'פול-בודי ב׳',color:'#00D9FF',estMin:58,
       exercises:['inclineDB','cableRowSeat','rdl','machineShoulderPress','legPress','lateralRaise','skullCrusher','hammerCurl','calfRaise','hangingLegRaise'],
       supersets:[
         {id:'B1',pair:['inclineDB','cableRowSeat'],type:'antagonist',rounds:4,restWithin:25,restBetween:105,
          note:'דחיפה בנטייה מול חתירה אופקית. שמור על חתירה קפדנית בלי תנופת גו — ה-RDL מגיע מיד אחרי.'},
         {id:'B2',pair:['rdl','machineShoulderPress'],type:'noncompeting',rounds:3,restWithin:25,restBetween:90,
          note:'דווקא מכונה ולא לחיצת כתפיים בעמידה: ה-RDL מרוקן זוקפי גב ואחיזה, והמכונה נותנת משענת מלאה. זה מה שהופך את הזוג לבטוח.'},
         {id:'B3',pair:['legPress','lateralRaise'],type:'noncompeting',rounds:3,restWithin:20,restBetween:90,
          note:'לג-פרס נתמך מושב (אפס עומס אקסיאלי) מול הרמות צד קלות.'},
         {id:'B4',pair:['skullCrusher','hammerCurl'],type:'antagonist',rounds:3,restWithin:15,restBetween:60,
          note:'אנטגוניסטים במרפק, שניהם בידוד, בסוף האימון.'},
         {id:'B5',pair:['calfRaise','hangingLegRaise'],type:'noncompeting',rounds:4,restWithin:15,restBetween:45,
          note:'שוק מול ליבה. אם האחיזה נשברת ראשונה — החלף את הרמת הרגליים בכפיפת בטן בכבל.'}
       ]},
      {id:'legs',label:'פול-בודי ג׳ — פאמפ (כבל וחד-צדדי)',shortLabel:'פול-בודי ג׳',color:'#B47CFF',estMin:54,
       exercises:['chinUp','ohp','bulgSplit','cableFlye','hipThrust','machineRow','seatedCalfRaise','cableCrunch'],
       supersets:[
         {id:'C1',pair:['chinUp','ohp'],type:'antagonist',rounds:4,restWithin:25,restBetween:105,
          note:'משיכה אנכית מול דחיפה אנכית. ראשון ביום — הלחיצה בעמידה דורשת זוקפים טריים, לפני ה-Hip Thrust.'},
         {id:'C2',pair:['bulgSplit','cableFlye'],type:'noncompeting',rounds:3,restWithin:20,restBetween:90,
          note:'רגל חד-צדדית מול בידוד חזה. שים לב: כל סבב = 2 סטים של רגליים (צד וצד).'},
         {id:'C3',pair:['hipThrust','machineRow'],type:'noncompeting',rounds:4,restWithin:25,restBetween:90,
          note:'פשיטת ירך מול חתירה בתמיכת חזה — אפס כיפוף מותני תחת עומס. זה הזוג שבו הגב התחתון מקבל אוויר.'},
         {id:'C4',pair:['seatedCalfRaise','cableCrunch'],type:'noncompeting',rounds:4,restWithin:15,restBetween:45,
          note:'סוליאוס בישיבה מול כפיפת בטן בכבל. אפס חפיפה.'}
       ]}
    ],
    dows:[0,2,4],
    waves:[
      {week:1,label:'צבירה',rir:3,note:'תחתית טווח החזרות, במשקל של שבוע 3 הקודם'},
      {week:2,label:'עומס',rir:2,note:'+2.5 ק״ג עליון / +5 ק״ג תחתון בזוג הראשון של כל אימון'},
      {week:3,label:'שיא',rir:1,note:'ראש הטווח בכל הסבבים — כאן קובעים שיאים'},
      {week:4,label:'דילואד',rir:4,note:'2 סבבים בלבד בכל זוג, 60% מהמשקל'}
    ],
    progression:'סופרסטים — מתקדמים על הזוג, לא על התרגיל הבודד. מחזור של 4 שבועות: שבוע 1 צבירה (RIR 3, תחתית הטווח) · שבוע 2 עומס (RIR 2, +2.5 ק״ג בעליון / +5 ק״ג בתחתון בזוג הראשון) · שבוע 3 שיא (RIR 1–2, ראש הטווח בכל הסבבים) · שבוע 4 דילואד (2 סבבים בכל זוג, 60% מהמשקל). כששני התרגילים בזוג הגיעו לראש הטווח בכל הסבבים — הוסף משקל לשניהם והתחל מתחתית הטווח. נכשלת באותו טווח פעמיים ברצף — הורד 10% בתרגיל הכושל בלבד. אל תקצר את המנוחה בין הסבבים כדי לסיים מהר — המנוחה היא חלק מהמינון.',
    schedule:'כל אימון = כל הגוף. א׳ כוח · ג׳ נפח · ה׳ פאמפ — 48 שעות מנוחה ביניהם'
  },
  '3abc':{
    days:[
      {id:'push',label:'דחיפה — חזה + כתפיים',shortLabel:'דחיפה',color:'#CCFF00',
       exercises:['benchPress','inclineBench','ohp','lateralRaise','triPushdown','skullCrusher','cableFlye']},
      {id:'pull',label:'משיכה — גב + בייסס',shortLabel:'משיכה',color:'#00D9FF',
       exercises:['pullup','bentRow','cableRow','facePull','bbCurl','hammerCurl']},
      {id:'legs',label:'רגליים — ירכיים ושוקיים',shortLabel:'רגליים',color:'#B47CFF',
       exercises:['squat','legPress','rdl','legCurl','legExt','hipThrust','calfRaise']},
    ],
    dows:[0,2,4],
    schedule:'א׳ Push · ג׳ Pull · ה׳ Legs'
  },
  4:{
    days:[
      {id:'push',label:'דחיפה — חזה + כתפיים',shortLabel:'דחיפה',color:'#CCFF00',
       exercises:['benchPress','ohp','inclineBench','cableFlye','lateralRaise','triPushdown']},
      {id:'pull',label:'משיכה — גב + בייסס',shortLabel:'משיכה',color:'#00D9FF',
       exercises:['rdl','pullup','bentRow','cableRow','facePull','bbCurl','hammerCurl']},
      {id:'legs',label:'LEGS — יום רגליים מלא',shortLabel:'רגליים',color:'#B47CFF',
       exercises:['squat','legPress','bulgSplit','legCurl','hipThrust','legExt','calfRaise']},
      {id:'arms',label:'ARMS — זרועות',shortLabel:'ידיים',color:'#FF7A45',
       exercises:['closeGripBench','ezCurl','skullCrusher','inclineCurl','ohTricep','hammerCurl']},
    ],
    dows:[0,1,3,4],
    schedule:'א׳ Push · ב׳ Pull · ד׳ Legs · ה׳ Arms'
  },
  5:{
    days:[
      {id:'push',label:'PUSH — כבד',shortLabel:'דחיפה',color:'#CCFF00',
       exercises:['benchPress','inclineBench','ohp','lateralRaise','triPushdown','skullCrusher','cableFlye']},
      {id:'pull',label:'PULL — כבד',shortLabel:'משיכה',color:'#00D9FF',
       exercises:['pullup','bentRow','cableRow','facePull','bbCurl','hammerCurl']},
      {id:'legs',label:'LEGS',shortLabel:'רגליים',color:'#B47CFF',
       exercises:['squat','legPress','rdl','legCurl','legExt','hipThrust','calfRaise']},
      {id:'arms',label:'פלג גוף עליון — שחזור בינוני',shortLabel:'עליון',color:'#FF7A45',
       exercises:['cableRow','lateralRaise','facePull','bbCurl','hammerCurl','triPushdown']},
    ],
    dows:[0,1,3,4,5],
    schedule:'א׳ Push · ב׳ Pull · ד׳ Legs · ה׳ Upper · ו׳ Push (סבב חוזר)'
  },
  6:{
    days:[
      {id:'push',label:'דחיפה א׳ — כוח',shortLabel:'דחיפה א׳',color:'#CCFF00',
       exercises:['benchPress','ohp','inclineBench','lateralRaise','triPushdown','skullCrusher','cableFlye']},
      {id:'pull',label:'משיכה א׳ — רוחב',shortLabel:'משיכה א׳',color:'#00D9FF',
       exercises:['pullup','bentRow','cableRow','facePull','bbCurl','hammerCurl']},
      {id:'legs',label:'רגליים א׳ — ירכיים',shortLabel:'רגליים א׳',color:'#B47CFF',
       exercises:['squat','legPress','rdl','legCurl','legExt','hipThrust','calfRaise']},
    ],
    dows:[0,1,2,3,4,5],
    schedule:'א׳ Push · ב׳ Pull · ג׳ Legs · ד׳ Push · ה׳ Pull · ו׳ Legs — שבת מנוחה מלאה'
  },
  '4ab':{
    days:[
      {id:'push',label:'עליון א׳ — כוח עליון',shortLabel:'UP-A',color:'#CCFF00',
       exercises:['benchPress','pullup','ohp','bentRow','lateralRaise','bbCurl','facePull']},
      {id:'pull',label:'תחתון א׳ — כוח תחתון',shortLabel:'LOW-A',color:'#B47CFF',
       exercises:['squat','rdl','legPress','legCurl','legExt','hipThrust','calfRaise']},
      {id:'legs',label:'עליון ב׳ — נפח עליון',shortLabel:'UP-B',color:'#00D9FF',
       exercises:['inclineBench','pullup','cableRow','facePull','lateralRaise','hammerCurl','skullCrusher','cableFlye']},
      {id:'arms',label:'תחתון ב׳ — נפח תחתון',shortLabel:'LOW-B',color:'#FF7A45',
       exercises:['legPress','bulgSplit','legExt','legCurl','rdl','hipThrust','calfRaise']},
    ],
    dows:[0,1,3,4],
    schedule:'א׳ עליון א׳ · ב׳ תחתון א׳ · ד׳ עליון ב׳ · ה׳ תחתון ב׳'
  },
  7:{
    days:[
      {id:'push',label:'PUSH — כוח + נפח',shortLabel:'דחיפה',color:'#CCFF00',
       exercises:['benchPress','ohp','inclineBench','lateralRaise','triPushdown','skullCrusher','cableFlye']},
      {id:'pull',label:'PULL — כוח + נפח',shortLabel:'משיכה',color:'#00D9FF',
       exercises:['pullup','bentRow','cableRow','facePull','bbCurl','hammerCurl']},
      {id:'legs',label:'LEGS — כוח + נפח',shortLabel:'רגליים',color:'#B47CFF',
       exercises:['squat','legPress','rdl','legCurl','legExt','hipThrust','calfRaise']},
      {id:'arms',label:'יום 7 — שחזור פעיל בלבד',shortLabel:'מנוחה',color:'#6B7280',
       exercises:['facePull','lateralRaise','inclineCurl','calfRaise','ezCurl','cableFlye']},
    ],
    dows:[0,1,2,3,4,5,6],
    schedule:'א׳ Push · ב׳ Pull · ג׳ Legs · ד׳ שחזור פעיל · ה׳ Push · ו׳ Pull · ש׳ Legs — לא מומלץ לאורך זמן'
  }
};

function buildExRow(key,num,over){
  const ex=EX[key];
  if(!ex) return '';
  const lvlStr=_exLvl(ex);
  const lvlCls=lvlStr.includes('כבד')?'badge-red':lvlStr.includes('בידוד')?'badge-blue':'badge-yellow';
  return `<tr onclick="openModal('${key}')">
    <td><div class="ex-num-cell">${num}</div></td>
    <td><div class="ex-name-main">${ex.name}</div><div class="ex-name-en" lang="en">${ex.en}</div>
        <div class="ex-why">${ex.desc?ex.desc.slice(0,60)+'…':''}</div></td>
    <td><span class="muscle-tag">${_exCatLabel(ex)}</span></td>
    <td class="sets-cell">${over?.sets||ex.sets||'3×10'}</td>
    <td class="rest-cell">${over?.rest||_exRest(ex)||'90 שנ׳'}</td>
    <td><span class="badge ${lvlCls}">${lvlStr}</span></td>
  </tr>`;
}

function renderWorkoutDay(panelId,dayObj){
  const panel=document.getElementById('panel-'+panelId);
  if(!panel) return;
  let tbl=panel.querySelector('.ex-table tbody');
  if(tbl) tbl.innerHTML=dayObj.supersets?_buildSupersetRows(dayObj)
                                         :dayObj.exercises.map((k,i)=>buildExRow(k,i+1)).join('');
  // Update nav tab label
  const navBtn=document.querySelector(`.nav-btn[onclick*="'${panelId}'"]`);
  if(navBtn){
    const lbl=navBtn.querySelector('.nav-lbl');
    if(lbl) lbl.textContent=dayObj.shortLabel||panelId.toUpperCase();
  }
}

// Renders a superset day as labelled pairs: a header row per pair, then its
// two exercises with the pair's round count and rest substituted in.
const _SS_TYPE={antagonist:'אנטגוניסטי',noncompeting:'לא-מתחרה',compound:'קומפאונד'};
function _buildSupersetRows(day){
  let out='',num=0,_ssNum=0;
  const paired=new Set();
  day.supersets.forEach(ss=>{
    const reps=ss.pair.map(k=>{
      const s=EX[k]?.sets||'3×10';
      const r=s.split('×')[1]||s;   // keep the plan's round count, the exercise's rep range
      return ss.rounds+'×'+r;
    });
    _ssNum++;
    const restTxt=ss.restBetween>=60
      ? (ss.restBetween%60?(ss.restBetween/60).toFixed(1):ss.restBetween/60)+' דק׳'
      : ss.restBetween+' שנ׳';
    out+=`<tr class="ss-head"><td colspan="6">
      <div class="ss-line">
        <span class="ss-tag">זוג ${_ssNum}</span>
        <span class="ss-meta">${ss.rounds} סבבים ברצף · מנוחה ${restTxt}</span>
        ${ss.note?`<button class="ss-why" aria-label="למה" onclick="this.closest('td').querySelector('.ss-note').hidden=!this.closest('td').querySelector('.ss-note').hidden">?</button>`:''}
      </div>
      ${ss.note?`<div class="ss-note" hidden>${_esc(ss.note)}</div>`:''}
    </td></tr>`;
    ss.pair.forEach((k,j)=>{
      paired.add(k); num++;
      const partner=EX[ss.pair[j?0:1]]?.name||'';
      out+=buildExRow(k,num,{sets:reps[j],rest:j===0?ss.restWithin+' שנ׳':ss.restBetween+' שנ׳'})
             .replace('<tr ','<tr class="ss-row'+(j?' ss-row-b':'')+'" data-ss="'+ss.id+'" '
                             +'data-ss-partner="'+_esc(partner)+'" data-ss-pos="'+(j?'ב':'א')+'" ');
    });
  });
  // anything the plan listed but didn't pair still gets a plain row
  day.exercises.filter(k=>!paired.has(k)).forEach(k=>{ num++; out+=buildExRow(k,num); });
  return out;
}

function renderAdaptivePanels(){
  const u=getActiveUser();
  const plan=_resolvePlan(u);
  if(!plan){ showToast('תוכנית אימון לא זמינה לתדירות זו'); return; }
  const days=plan.days;
  const dows=plan.dows||[0,1,3,4];
  const HD=['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
  // first day-of-week each panel is scheduled on, for the "ראשון | 7 תרגילים" line
  const dayName={};
  dows.forEach((d,i)=>{ const id=days[i%days.length].id; if(!(id in dayName)) dayName[id]=HD[d]; });

  const allIds=['push','pull','legs','arms'];
  allIds.forEach((pid,i)=>{
    const shown=i<days.length;
    const card=document.querySelector('.workout-card.'+pid);
    const schedBtn=document.querySelector(`#panel-schedule button[onclick*="'${pid}'"]`);
    if(card) card.style.display=shown?'':'none';
    if(schedBtn) schedBtn.style.display=shown?'':'none';
    if(!shown){
      const panel=document.getElementById('panel-'+pid);
      if(panel) panel.classList.remove('active');
      return;
    }
    const day=days[i];
    const sub=day.label.includes(' — ')?day.label.split(' — ').slice(1).join(' — '):day.label;
    const n=day.exercises.length;
    const mins=day.estMin||45+n*5;
    const short=day.shortLabel||pid.toUpperCase();

    if(card){
      const t=card.querySelector('.workout-card-title');
      if(t){ t.textContent=short; t.style.color=day.color; }
      const cs=card.querySelector('.workout-card-sub');
      if(cs) cs.textContent=sub;
    }
    if(schedBtn){
      const st=schedBtn.querySelector('.wsel-title');
      if(st){ st.textContent=short; st.style.color=day.color; }
      const ss=schedBtn.querySelector('.wsel-sub');
      if(ss) ss.textContent=sub;
      const sm=schedBtn.querySelector('.wsel-meta');
      if(sm) sm.textContent=`${dayName[day.id]||''} · ${n} תרגילים · כ־${mins} דק׳`;
    }
    // panel day header: title, duration badge, gym-mode label, watermark
    const head=document.querySelector('#panel-'+pid+' .day-head-card');
    if(head){
      head.dataset.wm=short;
      const h2=head.querySelector('.day-title');
      if(h2) h2.textContent=`${dayName[day.id]||''} — ${short}`;
      const meta=head.querySelector('.day-meta');
      if(meta) meta.textContent=`${n} תרגילים · כ־${mins} דק׳`;
      const gymBtn=head.querySelector('.gym-mode-btn');
      if(gymBtn) gymBtn.setAttribute('onclick',`startGymMode('${pid}','${short}','${day.color}')`);
    }
    renderWorkoutDay(pid,day);
  });

  // if the visible panel just got hidden, fall back to the plan's first day
  const activeId=document.querySelector('.panel.active')?.id?.replace('panel-','');
  if(activeId&&allIds.slice(days.length).includes(activeId)) showPanel(days[0].id);

  // The trainer-note and warm-up cards are hand-written for the classic
  // PPL/Arms split. On any other plan they describe the wrong workout.
  const classic=['3abc',4,'4',5,'5',6,'6',7,'7'].includes(_getPlanKey(u));
  allIds.forEach(pid=>{
    const panel=document.getElementById('panel-'+pid);
    if(!panel) return;
    panel.classList.toggle('plan-generic',!classic);
  });

  // schedule text + train-day counter + dynamic page titles
  const schedEl=document.getElementById('workout-schedule-text');
  if(schedEl) schedEl.textContent=plan.schedule||'';
  const grid=document.querySelector('.workout-card')?.parentElement;
  if(grid){
    const shown=[...grid.querySelectorAll('.workout-card')].filter(c=>c.style.display!=='none'&&!c.classList.contains('crossfit'));
    shown.forEach((c,i)=>c.classList.toggle('wc-span',shown.length%2===1&&i===shown.length-1));
  }
  const badge=document.getElementById('sched-days-badge');
  if(badge) badge.textContent=dows.length+' ימי אימון';
  const cfg=_buildDayCfg(u);
  allIds.forEach((pid,i)=>{
    if(i>=days.length) return;
    TITLES[pid]=`${dayName[days[i].id]||''} — ${days[i].shortLabel||pid.toUpperCase()}`;
  });
  const pt=document.getElementById('page-title');
  const cur=document.querySelector('.panel.active')?.id?.replace('panel-','');
  if(pt&&cur&&TITLES[cur]) pt.textContent=TITLES[cur];
  void cfg;
}

function getWorkoutFreqLabel(freq,split){
  if(freq===1) return '1×/שבוע — כל הגוף';
  if(freq===2) return '2×/שבוע — כל הגוף';
  if(freq===3) return split==='3ab'?'3×/שבוע — עליון/תחתון':split==='3ss'?'3×/שבוע — סופרסטים פול-בודי':'3×/שבוע — דחיפה/משיכה/רגליים';
  if(freq===4) return split==='4ab'?'4×/שבוע — עליון/תחתון א׳-ב׳':'4×/שבוע — דחיפה/משיכה/רגליים + ידיים';
  if(freq===5) return '5×/שבוע — דחיפה/משיכה/רגליים + עליון + תחתון';
  if(freq===6) return '6×/שבוע — דחיפה/משיכה/רגליים ×2';
  if(freq===7) return '7×/שבוע — לא מומלץ';
  return `${freq}×/שבוע`;
}

// ─── EXPOSE GLOBALS FOR HTML INLINE HANDLERS ────────────────────────────────
// index.html has 137 inline onclick= handlers — these must remain on window
// when app.js runs as an ES module (type="module" is function-scoped)
// ═══════════════════════════════════════════════════
// CROSSFIT — WODs מקצועיים, טיימר, רישום תוצאות
// ═══════════════════════════════════════════════════
const CF_SCORES_KEY='pf_wod_scores';
const CF_CATS=[['strength','כוח — Gains'],['home','בית — ללא ציוד'],['beginner','מתחילים'],['girls','The Girls'],['hero','Hero']];

const CF_WODS=[
  // ── כוח — Gains (בניית כוח ומסה בסגנון CrossFit) ──
  {id:'hybridWeek',name:'התוכנית ההיברידית',cat:'strength',type:'תוכנית',cap:0,icon:'',scheme:'כוח + מטקון · 3 ימים · רוטציה של 4 הרמות',
   cols:['שבוע','כוח (ראשון)','מטקון (אחרי, 8–12 דק׳)'],
   moves:[
    {n:'שבוע 1',rx:'א׳ Squat · ג׳ Bench · ה׳ Deadlift',sc:'אחרי רגליים — מטקון עליון/מנוע, אחרי עליון — מטקון רגליים קלות'},
    {n:'שבוע 2',rx:'א׳ Press · ג׳ Squat · ה׳ Bench',sc:'דוגמאות: Squat→EMOM Builder · Bench→Helen מדורגת · Deadlift→60 Burpees'},
    {n:'שבוע 3',rx:'א׳ Deadlift · ג׳ Press · ה׳ Squat',sc:'Press→Home Engine · Deadlift→Annie מדורגת (בלי סווינגים!)'},
    {n:'שבוע 4',rx:'א׳ Bench · ג׳ Deadlift · ה׳ Press',sc:'סוף השבוע — דלואוד: 60% מהמשקלים'},
   ],
   targets:{elite:'יום 4 קבוע: Pull Day או Oly Skill',good:'3 ימים מלאים ברוטציה',start:'התחל עם כוח בלבד, הוסף מטקון אחרי שבועיים'},
   desc:'ככה בונים גיין אמיתי בקרוספיט: כוח כבד קודם (כשאתה טרי), מטקון קצר אחרי. רוטציה של 4 הרמות (Squat/Bench/Deadlift/Press) על 3 ימים — כל הגוף מאוזן על פני החודש.',
   tips:['כוח תמיד לפני מטקון — לעולם לא אחרי','המטקון הפוך ליום הכוח: יום רגליים → מטקון עליון, יום עליון → מטקון רגליים','אחרי Deadlift אסור מטקון עם סווינגים/דדליפט באותו יום','48 שעות מנוחה בין ימי כוח · דלואוד כל 4 שבועות: 60% מהמשקלים']},
  {id:'squatDay',name:'Squat Day',cat:'strength',type:'Strength',cap:45,icon:'',scheme:'Back Squat 5×5 — Linear Progression',
   cols:['תרגיל','סכמה','התקדמות'],
   moves:[
    {n:'Back Squat',rx:'5×5 — התחל @ 75%',sc:'+2.5 ק"ג כל אימון מוצלח'},
    {n:'Front Squat',rx:'3×8 @ 60%',sc:'שמור טכניקה, מרפקים גבוהים'},
    {n:'Walking Lunges',rx:'3×12 לרגל',sc:'משקולות ביד — הוסף כשקל'},
    {n:'Plank',rx:'3×45 שנ׳',sc:'הוסף 5 שנ׳ בשבוע'},
   ],
   targets:{elite:'סקוואט 2× משקל גוף',good:'1.5× משקל גוף',start:'מוט ריק → 60% תוך חודש'},
   desc:'הבסיס של כל גיין: סקוואט כבד פעם בשבוע עם התקדמות ליניארית. 5×5 = הנוסחה הכי מוכחת בהיסטוריה לכוח ומסה.',
   tips:['עומק מלא — ירך מתחת לברך, בלי פשרות','סולו? סקוואט רק בראק עם מוטות ביטחון מעט מתחת לעומק — כשל בטוח = לשבת על הפינים','נכשלת בסט? נסה שוב אימון הבא באותו משקל · נכשלת פעמיים? הורד 10%','ברכיים החוצה בקו האצבעות לאורך כל התנועה']},
  {id:'pressDay',name:'Press Day',cat:'strength',type:'Strength',cap:45,icon:'',scheme:'Strict Press 5×3 + נפח דחיקה',
   cols:['תרגיל','סכמה','התקדמות'],
   moves:[
    {n:'Strict Press',rx:'5×3 — התחל @ 80%',sc:'+1.25 ק"ג כל אימון (הכי איטי — סבלנות)'},
    {n:'Push Press',rx:'3×5 כבד',sc:'דחיפה מהרגליים, נעילה מלאה'},
    {n:'Dips',rx:'3×8–12',sc:'הוסף משקל כשמגיע ל-12'},
    {n:'Face Pull',rx:'3×15',sc:'איזון כתף אחורית — חובה'},
   ],
   targets:{elite:'Strict Press 0.75× משקל גוף',good:'0.6× משקל גוף',start:'מוט ריק → 30 ק"ג'},
   desc:'כתפיים חזקות = כל תנועות הקרוספיט משתפרות: ת׳ראסטרים, וול-בול, HSPU. לחיצת הכתפיים מתקדמת הכי לאט מכל הליפטים — והכי שווה.',
   tips:['ישבן וליבה צמודים — בלי קשת בגב','המוט נע בקו ישר, הראש זז אחורה ואז חוזר','אל תדלג על ה-Face Pull — הוא שומר על הכתפיים שלך']},
  {id:'benchDay',name:'Bench Day',cat:'strength',type:'Strength',cap:45,icon:'',scheme:'Bench Press 5×5 + חתירה — חזה וגב עליון',
   cols:['תרגיל','סכמה','התקדמות'],
   moves:[
    {n:'Bench Press',rx:'5×5 — התחל @ 72%',sc:'+2.5 ק"ג כל אימון מוצלח'},
    {n:'Barbell Row',rx:'4×8',sc:'מוט לבטן, גו נעול — בלי תנופה'},
    {n:'DB Incline Press',rx:'3×10',sc:'הוסף משקל כשמגיע ל-12'},
    {n:'Band Pull-Apart',rx:'3×20',sc:'כתף אחורית — סוגר כל אימון דחיקה'},
   ],
   targets:{elite:'בנץ׳ 1.25× משקל גוף',good:'1× משקל גוף',start:'מוט ריק → 40 ק"ג תוך חודש'},
   desc:'החוליה החסרה לגיין עליון: דחיקה אופקית כבדה + חתירה באותו יום. כל דחיקה מקבלת משיכה — ככה בונים חזה בלי להרוס כתפיים. גם הפוש-אפים של Murph ו-Cindy יגידו תודה.',
   tips:['מתאמן לבד? בנץ׳ אך ורק בראק עם מוטות ביטחון בגובה החזה — או בלי סוגרים כדי להטות ולגלגל החוצה בכשל','שכמות צמודות מאחור, רגליים נעוצות ברצפה, המוט נוגע בחזה התחתון','בחתירה: אם הגו קופץ — המשקל כבד מדי. הגב עובד, לא המומנטום']},
  {id:'pullDay',name:'Pull Day',cat:'strength',type:'Strength',cap:45,icon:'',scheme:'Weighted Pull-ups 5×5 + נפח משיכה',
   cols:['תרגיל','סכמה','התקדמות'],
   moves:[
    {n:'Weighted Pull-ups',rx:'5×5 strict — חגורה/דמבל בין הרגליים',sc:'אין 5 נקיות? 8×3 במשקל גוף'},
    {n:'DB Row',rx:'4×10 לצד',sc:'+2.5 ק"ג כשכל הסטים נקיים'},
    {n:'DB Curl',rx:'3×12',sc:'זרוע ואחיזה — ביטוח למרפקים בקיפינג'},
    {n:'Hanging Knee Raise',rx:'3×10–15',sc:'ליבה + זמן תלייה על המוט'},
   ],
   targets:{elite:'מתח +20 ק"ג ל-5 חזרות',good:'12 מתח strict רצופים',start:'5 מתח strict נקיים'},
   desc:'הגב הוא המנוע של כל הקרוספיט: מתח, קלינים, דדליפט, חבל. משיכה כבדה בנפרד = גיין עליון אמיתי — וקיפינג בטוח כשתחזור אליו.',
   tips:['strict לפני קיפינג — 5 מתח נקיים הם כרטיס הכניסה היחיד לקיפינג','ירידה מבוקרת 2 שניות — שם מתחבא הגיין','לא צמוד ליום Deadlift — האחיזה צריכה 48 שעות']},
  {id:'deadliftDay',name:'Deadlift Day',cat:'strength',type:'Strength',cap:45,icon:'',scheme:'Deadlift 5×3 + שרשרת אחורית',
   cols:['תרגיל','סכמה','התקדמות'],
   moves:[
    {n:'Deadlift',rx:'5×3 @ 80%',sc:'+5 ק"ג בשבוע — הכי מהיר להתקדם'},
    {n:'Romanian Deadlift',rx:'3×8 @ 50%',sc:'מתיחה מלאה בהאמסטרינג'},
    {n:'Pull-ups',rx:'4×6–10 (השאר 1–2 בטנק)',sc:'הוסף משקל כשמגיע ל-4×10'},
    {n:'Farmer Carry',rx:'3×40 מ׳ כבד',sc:'אחיזה + ליבה — גיין נסתר'},
   ],
   targets:{elite:'דדליפט 2× משקל גוף',good:'1.5× משקל גוף',start:'60 ק"ג → 100 תוך 3 חודשים'},
   desc:'התרגיל שבונה הכי הרבה מסה כוללת: גב, רגליים, אחיזה, ליבה. פעם בשבוע, כבד, מושלם.',
   tips:['גב ניטרלי — אם הוא מתעגל, המשקל כבד מדי','המוט צמוד לגוף מהרצפה עד הנעילה','אל תעשה דדליפט כבד ומטקון עם דדליפט באותו שבוע']},
  {id:'olyDay',name:'Oly Skill — Power Clean',cat:'strength',type:'Strength',cap:40,icon:'',scheme:'טכניקה + כוח מתפרץ',
   cols:['תרגיל','סכמה','התקדמות'],
   moves:[
    {n:'Power Clean',rx:'EMOM 10 — 2 חזרות @ 70%',sc:'טכניקה מושלמת לפני משקל'},
    {n:'Front Squat',rx:'4×6 @ 65%',sc:'מרפקים גבוהים — תומך בקלין'},
    {n:'Hang High Pull',rx:'3×5',sc:'מתפרץ מהירך — מרפקים גבוהים'},
    {n:'Hollow Hold',rx:'3×30 שנ׳',sc:'ליבה להרמות אולימפיות'},
   ],
   targets:{elite:'Power Clean 1.25× משקל גוף',good:'1× משקל גוף',start:'מוט ריק — טכניקה בלבד שבועיים'},
   desc:'ההרמות האולימפיות הן הנשק הסודי של גיין קרוספיטי: כוח מתפרץ + מסה + קואורדינציה. Grace תרגיש קלה אחרי חודשיים כאלה.',
   tips:['הקלין הוא קפיצה עם מוט — הכוח מהירכיים','מרפקים מסתובבים מהר מתחת למוט','2 חזרות בדקה = איכות, לא עייפות — זה סקיל, לא מטקון']},
  // ── בית — ללא ציוד ──
  {id:'burpee100',name:'100 Burpees',cat:'home',type:'For Time',cap:15,icon:'',scheme:'100 חזרות — כמה שיותר מהר',
   moves:[{n:'Burpees',rx:'חזה לרצפה + קפיצה ומחיאת כף מעל הראש',sc:'ללא קפיצה — צעד אחורה וקימה'}],
   targets:{elite:'מתחת 7:00',good:'8:00–12:00',start:'12:00–15:00'},
   desc:'מבחן הכושר הפשוט והאכזרי ביותר. תנועה אחת, אפס ציוד, מנטליות ברזל.',
   tips:['קצב אחיד מההתחלה — אל תפתח מהר','חלק ל-10×10 עם 3 נשימות בין סטים','נשימה קבועה: שאיפה בירידה, נשיפה בקפיצה']},
  {id:'homeAmrap12',name:'Home Engine',cat:'home',type:'AMRAP',cap:12,icon:'',scheme:'AMRAP 12 דק׳ — כמה שיותר סבבים',
   moves:[{n:'10 Burpees',rx:'מלא',sc:'ללא קפיצה'},{n:'15 Air Squats',rx:'ירך מתחת לברך',sc:'לכיסא'},{n:'20 Mountain Climbers',rx:'ברך לחזה, קצב ריצה',sc:'איטי ומבוקר'}],
   targets:{elite:'8+ סבבים',good:'6–7 סבבים',start:'4–5 סבבים'},
   desc:'מנוע אירובי טהור. שומר על דופק גבוה 12 דקות רצוף — התחליף המושלם לשיעור בבוקס.',
   tips:['המטרה: אפס עצירות — האט במקום לעצור','ספור סבבים בקול או על הרצפה עם גיר','שבוע הבא: נסה לשפר בחצי סבב']},
  {id:'emom10Home',name:'EMOM Builder',cat:'home',type:'EMOM',cap:10,icon:'',scheme:'כל דקה עגולה, 10 דקות',
   moves:[{n:'דקה זוגית: 12 Push-ups',rx:'חזה לרצפה',sc:'על הברכיים'},{n:'דקה אי-זוגית: 15 Air Squats',rx:'עומק מלא',sc:'טווח חלקי'}],
   targets:{elite:'כל הסטים ללא שבירה',good:'שבירה אחת-שתיים',start:'הורד ל-8/12 חזרות'},
   desc:'עבודה-מנוחה מובנית: מסיים את החזרות, נח עד סוף הדקה. ככל שאתה מהיר יותר — נח יותר.',
   tips:['סיים כל סט תוך 30–35 שניות','אם אין 20 שניות מנוחה — הורד 2 חזרות','מצוין כחימום או כ-Finisher אחרי כוח']},
  {id:'tabataCore',name:'Tabata Core',cat:'home',type:'Tabata',cap:4,icon:'',scheme:'8 סבבים × (20 שנ׳ עבודה / 10 שנ׳ מנוחה)',
   moves:[{n:'סבבים 1,3,5,7: Sit-ups',rx:'מהירות מלאה',sc:'קצב נוח'},{n:'סבבים 2,4,6,8: Plank',rx:'סטטי מושלם',sc:'על הברכיים'}],
   targets:{elite:'15+ סיטאפים לסבב',good:'12–14',start:'8–11'},
   desc:'פרוטוקול טבטה יפני מקורי — 4 דקות שמרגישות כמו 20. ליבה בוערת.',
   tips:['20 שניות = ספרינט מלא, לא קצב נוח','השתמש בטיימר למטה — מצב Tabata','רשום את הסבב הכי חלש — הוא הציון שלך']},
  // ── מתחילים — ציוד בסיסי ──
  {id:'dbEngine15',name:'Dumbbell Engine',cat:'beginner',type:'AMRAP',cap:15,icon:'',scheme:'AMRAP 15 דק׳',
   moves:[{n:'10 DB Thrusters',rx:'2×10 ק"ג',sc:'2×5 ק"ג'},{n:'10 KB/DB Swings',rx:'16 ק"ג',sc:'8–12 ק"ג'},{n:'200מ׳ ריצה / 60 שנ׳ קפיצות',rx:'ריצה',sc:'הליכה מהירה'}],
   targets:{elite:'7+ סבבים',good:'5–6 סבבים',start:'3–4 סבבים'},
   desc:'ה-WOD המושלם למי שמתאמן לבד בחדר כושר רגיל — זוג משקולות וזהו.',
   tips:['ת׳ראסטר = סקוואט מלא + לחיצה בתנועה אחת רציפה','בסווינג הכוח מהירכיים, לא מהידיים','בחר משקל שמאפשר 10 רצופות בסבב ראשון']},
  {id:'gobletEmom12',name:'Goblet Grinder',cat:'beginner',type:'EMOM',cap:12,icon:'',scheme:'EMOM 12 — מחזור של 3 דקות × 4',
   moves:[{n:'דקה 1: 10 Goblet Squats',rx:'16–24 ק"ג',sc:'8–12 ק"ג'},{n:'דקה 2: 8 Push Press',rx:'2×10 ק"ג',sc:'2×5 ק"ג'},{n:'דקה 3: 10 KB Swings',rx:'16 ק"ג',sc:'8 ק"ג'}],
   targets:{elite:'משקלים כבדים, אפס שבירות',good:'כל הסטים הושלמו',start:'הורד חזרה אחת מכל תרגיל'},
   desc:'כוח + קרדיו בפורמט מסודר. בונה בסיס טכני לפני ה-Girls.',
   tips:['גב ישר בגובלט — המרפקים בין הברכיים בתחתית','בפוש-פרס: דחיפה קטנה מהרגליים ואז נעילה','אחרי 3 שבועות — עלה משקל, לא חזרות']},
  // ── The Girls — בנצ'מרקים ──
  {id:'fran',name:'Fran',cat:'girls',type:'For Time',cap:10,icon:'',scheme:'21-15-9',
   moves:[{n:'Thrusters',rx:'43/30 ק"ג',sc:'30/20 ק"ג · מתחילים: משקולות 2×10'},{n:'Pull-ups',rx:'קיפינג (אחרי 5 strict נקיים)/באטרפליי',sc:'גומייה · מתחילים: חתירה בטבעות'}],
   targets:{elite:'מתחת 3:00',good:'3:00–6:00',start:'6:00–10:00'},
   desc:'ה-WOD המפורסם בעולם. קצר, אכזרי, מדיד. זה המבחן שכל קרוספיטר משווה אליו.',
   tips:['21 ראשונות: חלק 11+10 — אל תלך ל-Failure','נשום בעליון של הת׳ראסטר','ה-9 האחרונות — הכל החוצה, בלי לעצור','קיפינג רק אם יש לך 5 מתח סטריקט נקיים — אחרת גומייה']},
  {id:'cindy',name:'Cindy',cat:'girls',type:'AMRAP',cap:20,icon:'',scheme:'AMRAP 20 דק׳',
   moves:[{n:'5 Pull-ups',rx:'קיפינג (אחרי 5 strict)',sc:'גומייה / חתירת שולחן'},{n:'10 Push-ups',rx:'חזה לרצפה',sc:'ברכיים'},{n:'15 Air Squats',rx:'עומק מלא',sc:'טווח נוח'}],
   targets:{elite:'20+ סבבים',good:'15–19 סבבים',start:'10–14 סבבים'},
   desc:'משקל גוף בלבד — נגיש מכל מקום עם מוט מתח. מבחן סיבולת שרירית אמיתי.',
   tips:['קצב סבב של דקה = 20 סבבים','שבור את הפוש-אפס מוקדם (5+5) לפני שנשרפים','זה מרתון, לא ספרינט — קצב מהסבב הראשון','קיפינג דורש בסיס: 5 סטריקט נקיים לפני שמתנדנדים']},
  {id:'helen',name:'Helen',cat:'girls',type:'For Time',cap:15,icon:'',scheme:'3 סבבים',
   moves:[{n:'400מ׳ ריצה',rx:'מהיר',sc:'200מ׳'},{n:'21 KB Swings',rx:'24/16 ק"ג',sc:'16/12 ק"ג'},{n:'12 Pull-ups',rx:'קיפינג (אחרי 5 strict)',sc:'גומייה'}],
   targets:{elite:'מתחת 8:00',good:'8:00–11:00',start:'11:00–14:00'},
   desc:'שילוב ריצה-כוח קלאסי. בודק את היכולת לעבוד עם דופק גבוה אחרי ריצה.',
   tips:['רוץ ב-85% — שמור משהו לסווינגים','סווינג RX = American, מעל הראש · 21 ללא שבירה משנה הכל','המתח אחרי ריצה קשה פי 2 — עייף? גומייה במקום קיפינג רשלני']},
  {id:'grace',name:'Grace',cat:'girls',type:'For Time',cap:8,icon:'',scheme:'30 חזרות',
   moves:[{n:'Clean & Jerk',rx:'61/43 ק"ג',sc:'43/30 ק"ג · מתחילים: 30/20'}],
   targets:{elite:'מתחת 2:00',good:'2:00–4:00',start:'4:00–7:00'},
   desc:'30 קלין-אנד-ג׳רק בזמן. וויט-ליפטינג טהור תחת עייפות — טכניקה פוגשת ריאות.',
   tips:['סינגלים מהירים עדיפים על Touch-and-Go לרוב המתאמנים','אפס שניות מתות — יד על המוט תמיד','שמור מרפקים מהירים בקליעה']},
  {id:'karen',name:'Karen',cat:'girls',type:'For Time',cap:12,icon:'',scheme:'150 Wall Balls',
   moves:[{n:'Wall Ball Shots',rx:'9/6 ק"ג ליעד 3/2.7 מ׳',sc:'6/4 ק"ג · מתחילים: ת׳ראסטר משקולות'}],
   targets:{elite:'מתחת 6:00',good:'6:00–9:00',start:'9:00–12:00'},
   desc:'תנועה אחת, 150 חזרות. נשמע פשוט — עד חזרה 70.',
   tips:['סטים של 15–20 מההתחלה עם מנוחות קצובות','תפוס את הכדור גבוה — חסוך אנרגיה בירידה','נעל את המבט בנקודת המטרה']},
  {id:'annie',name:'Annie',cat:'girls',type:'For Time',cap:12,icon:'',scheme:'50-40-30-20-10',
   moves:[{n:'Double-Unders',rx:'חבל כפול',sc:'×2 קפיצות רגילות'},{n:'Sit-ups',rx:'AbMat',sc:'רגיל'}],
   targets:{elite:'מתחת 6:00',good:'6:00–9:00',start:'9:00–12:00'},
   desc:'ה-Girl הידידותית ביותר — קצב ותיאום במקום כוח גס. מושלמת לאימון בית עם חבל.',
   tips:['דאבל-אנדרס: פרקי ידיים, לא כתפיים','אם אין דאבלים — 100-80-60-40-20 סינגלים','סיטאפים = מנוחה פעילה, נשום שם']},
  {id:'diane',name:'Diane',cat:'girls',type:'For Time',cap:10,icon:'',scheme:'21-15-9',
   moves:[{n:'Deadlift',rx:'102/70 ק"ג',sc:'70/50 ק"ג'},{n:'Handstand Push-ups',rx:'לקיר',sc:'Pike Push-ups · מתחילים: לחיצת כתפיים'}],
   targets:{elite:'מתחת 4:00',good:'4:00–7:00',start:'7:00–10:00'},
   desc:'כוח מקסימלי פוגש התעמלות. הדדליפט חייב להישאר טכני גם כשעייפים.',
   tips:['דדליפט: גב ניטרלי או שאתה עוצר — אין פשרות','שבור את ה-21 ל-3×7 מסודר','HSPU נשברים מהר — סטים קטנים מוקדם','HSPU תמיד עם AbMat/ריפוד מתחת לראש — בלי קיפינג למתחילים']},
  // ── Hero WODs ──
  {id:'murph',name:'Murph',cat:'hero',type:'For Time',cap:60,icon:'',scheme:'ריצה + 100/200/300 + ריצה',
   moves:[{n:'1.6 ק"מ ריצה',rx:'עם ווסט 9/6 ק"ג',sc:'ללא ווסט'},{n:'100 Pull-ups',rx:'כל חלוקה',sc:'גומייה / חתירה'},{n:'200 Push-ups',rx:'כל חלוקה',sc:'ברכיים'},{n:'300 Air Squats',rx:'כל חלוקה',sc:'טווח נוח'},{n:'1.6 ק"מ ריצה',rx:'סיום חזק',sc:'הליכה-ריצה'}],
   targets:{elite:'מתחת 40:00',good:'40:00–60:00',start:'חצי מרף: חצי מהכל'},
   desc:'לזכר לוטננט מייקל מרפי. ה-Hero WOD המפורסם בעולם — נעשה ב-Memorial Day בכל בוקס.',
   tips:['פרטישן: 20 סבבים של 5/10/15 (Cindy Style)','התחל ב-Half Murph אם זה ה-Murph הראשון שלך','שמור 30% לריצה השנייה — היא הסיפור האמיתי','100 מתח דורשים בסיס — בלי 10 סטריקט רצופים, כל המתח עם גומייה']},
  {id:'dt',name:'DT',cat:'hero',type:'For Time',cap:15,icon:'',scheme:'5 סבבים',
   moves:[{n:'12 Deadlifts',rx:'70/47.5 ק"ג',sc:'50/35 ק"ג'},{n:'9 Hang Power Cleans',rx:'70/47.5 ק"ג',sc:'50/35 ק"ג'},{n:'6 Push Jerks',rx:'70/47.5 ק"ג',sc:'50/35 ק"ג'}],
   targets:{elite:'מתחת 6:00',good:'6:00–10:00',start:'10:00–14:00'},
   desc:'לזכר סמל טימותי דיוויס. מוט אחד, משקל אחד, אחיזה נשרפת. ניהול אחיזה = ניצחון.',
   tips:['שבור את הדדליפט 11+1 — החזרה האחרונה הופכת לקלין הראשון','Hook Grip או שאתה מאבד את האחיזה בסבב 3','ג׳רקים ללא שבירה — שם הזמן מתחבא','המשקל קל אבל הנפח מצטבר — גב ניטרלי בכל 60 הדדליפטים']},
];

let _cfActiveCat='strength';
const _cfExpanded=new Set();

function _cfScores(){ return _getJSON(CF_SCORES_KEY,{}); }

/** WOD of the day — deterministic daily rotation */
function _cfWodOfDay(){
  const d=new Date();
  const doy=Math.floor((d-new Date(d.getFullYear(),0,0))/864e5);
  const pool=CF_WODS.filter(w=>w.type!=='תוכנית');
  return pool[doy%pool.length];
}

const _CF_TYPE_CLS={'For Time':'cf-type-ft','AMRAP':'cf-type-amrap','EMOM':'cf-type-emom','Tabata':'cf-type-tabata','Strength':'cf-type-str','תוכנית':'cf-type-plan'};

function _cfCardHTML(w){
  const open=_cfExpanded.has(w.id);
  const scores=(_cfScores())[w.id]||[];
  return `<div class="cf-card${open?' open':''}" id="cf-card-${w.id}">
    <button type="button" class="cf-card-head" onclick="cfToggleWod('${w.id}')">
      <span class="cf-card-titles">
        <span class="cf-card-name">${w.name}</span>
        <span class="cf-card-scheme">${w.scheme}</span>
      </span>
      <span class="cf-type-badge ${_CF_TYPE_CLS[w.type]||''}">${w.type}</span>
    </button>
    ${open?`<div class="cf-card-body">
      <p class="cf-desc">${w.desc}</p>
      <table class="cf-moves"><thead><tr>${(w.cols||['תנועה','RX','Scaled']).map(c=>`<th>${c}</th>`).join('')}</tr></thead>
        <tbody>${w.moves.map(m=>`<tr><td>${m.n}</td><td>${m.rx}</td><td>${m.sc}</td></tr>`).join('')}</tbody></table>
      <div class="cf-targets">
        <span class="cf-target elite">עילית: ${w.targets.elite}</span>
        <span class="cf-target good">טוב: ${w.targets.good}</span>
        <span class="cf-target start">התחלה: ${w.targets.start}</span>
      </div>
      <ul class="cf-tips">${w.tips.map(t=>`<li>${t}</li>`).join('')}</ul>
      <div class="cf-score-row">
        <input class="cf-score-input" id="cf-score-${w.id}" type="text" placeholder="תוצאה (4:32 / 17 סבבים)" maxlength="20"/>
        <button class="cf-score-save" onclick="cfSaveScore('${w.id}')">שמור</button>
      </div>
      ${scores.length?`<div class="cf-history">
        <span class="cf-best">תוצאות (${scores.length})</span>
        ${scores.slice(-3).reverse().map(s=>`<span class="cf-hist-item">${s.date.slice(5).replace('-','.')} — ${_esc(s.score)}</span>`).join('')}
      </div>`:''}
    </div>`:''}
  </div>`;
}

function renderCrossfitPanel(){
  const wrap=document.getElementById('crossfit-content'); if(!wrap) return;
  const wod=_cfWodOfDay();
  const list=CF_WODS.filter(w=>w.cat===_cfActiveCat);
  wrap.innerHTML=`
  <div class="trainer-note"><strong>CrossFit בלי בוקס — כוח + מטקון</strong><br>
  עזבת את השיעורים? לא עזבת את הקרוספיט. ימי כוח לגיין אמיתי (Squat/Press/Deadlift/Oly) + WODs לקונדישן — הכל מותאם לאימון עצמאי, בשעות שלך.</div>

  <div class="card cf-wotd-card">
    <div class="card-head"><h2>ה-WOD של היום</h2><span class="badge badge-red">${wod.type}</span></div>
    <div class="card-body">
      <div class="cf-wotd-name">${wod.name}</div>
      <div class="cf-wotd-scheme">${wod.scheme}</div>
      <button class="btn btn-primary cf-wotd-btn" onclick="cfOpenWod('${wod.id}')">פתח את האימון ←</button>
    </div>
  </div>

  <div class="card">
    <div class="card-head"><h2>טיימר WOD</h2></div>
    <div class="card-body">
      <div class="cf-timer-display" id="cf-timer-display">00:00</div>
      <div class="cf-timer-status" id="cf-timer-status">סטופר — For Time</div>
      <div class="cf-timer-controls">
        <button class="btn btn-primary" id="cf-timer-toggle" onclick="cfTimerToggle()">▶ התחל</button>
        <button class="btn btn-ghost" onclick="cfTimerReset()">איפוס</button>
      </div>
      <div class="cf-timer-presets">
        <button class="ex-chip" onclick="cfCountdown(10)">AMRAP 10</button>
        <button class="ex-chip" onclick="cfCountdown(12)">AMRAP 12</button>
        <button class="ex-chip" onclick="cfCountdown(15)">AMRAP 15</button>
        <button class="ex-chip" onclick="cfCountdown(20)">AMRAP 20</button>
        <button class="ex-chip" onclick="cfTabata()">Tabata 8×20/10</button>
      </div>
    </div>
  </div>

  <div class="ex-chips cf-cat-chips">
    ${CF_CATS.map(([c,lbl])=>`<button class="ex-chip${c===_cfActiveCat?' active':''}" onclick="cfFilter('${c}')">${lbl}</button>`).join('')}
  </div>
  <div class="cf-list">${list.map(_cfCardHTML).join('')}</div>`;
  _cfPaintTimer();
}

function cfFilter(cat){ _cfActiveCat=cat; renderCrossfitPanel(); }
function cfToggleWod(id){
  if(_cfExpanded.has(id)) _cfExpanded.delete(id); else _cfExpanded.add(id);
  renderCrossfitPanel();
}
function cfOpenWod(id){
  const w=CF_WODS.find(x=>x.id===id); if(!w) return;
  _cfActiveCat=w.cat; _cfExpanded.add(id);
  renderCrossfitPanel();
  setTimeout(()=>document.getElementById('cf-card-'+id)?.scrollIntoView({behavior:'smooth',block:'start'}),80);
}
function cfSaveScore(id){
  const inp=document.getElementById('cf-score-'+id);
  const score=(inp?.value||'').trim();
  if(!score){ showToast('הזן תוצאה קודם'); return; }
  const all=_cfScores();
  (all[id]=all[id]||[]).push({date:todayStr(),score});
  all[id]=all[id].slice(-20);
  _safeSet(CF_SCORES_KEY,JSON.stringify(all));
  showToast('התוצאה נשמרה — '+score);
  if(navigator.vibrate) navigator.vibrate(50);
  renderCrossfitPanel();
}

// ── טיימר WOD: סטופר / ספירה לאחור / Tabata ──
let _cf={int:null,running:false,mode:'up',t0:0,acc:0,total:0};
function _cfFmt(s){ s=Math.max(0,Math.round(s)); return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'); }
function _cfElapsed(){ return _cf.acc+(_cf.running?(Date.now()-_cf.t0)/1000:0); }
function _cfPaintTimer(){
  const d=document.getElementById('cf-timer-display'); if(!d) return;
  const el=_cfElapsed();
  if(_cf.mode==='up') d.textContent=_cfFmt(el);
  else if(_cf.mode==='down'){
    const rem=_cf.total-el;
    d.textContent=_cfFmt(rem);
    if(rem<=0) _cfFinish('הזמן נגמר! רשום את התוצאה');
  } else if(_cf.mode==='tabata'){
    const cyc=30, total=8*cyc, rem=total-el;
    if(rem<=0){ _cfFinish('טבטה הושלמה!'); return; }
    const inCyc=el%cyc, round=Math.floor(el/cyc)+1, work=inCyc<20;
    d.textContent=_cfFmt(work?20-inCyc:30-inCyc);
    const st=document.getElementById('cf-timer-status');
    if(st) st.textContent=(work?'עבודה':'מנוחה')+' — סבב '+round+'/8';
  }
}
function _cfFinish(msg){
  clearInterval(_cf.int); _cf.int=null; _cf.running=false; _cf.acc=0;
  const b=document.getElementById('cf-timer-toggle'); if(b) b.textContent='▶ התחל';
  const d=document.getElementById('cf-timer-display'); if(d) d.textContent='00:00';
  showToast(msg);
  if(navigator.vibrate) navigator.vibrate([300,150,300,150,500]);
}
function cfTimerToggle(){
  const b=document.getElementById('cf-timer-toggle');
  if(_cf.running){
    _cf.acc=_cfElapsed(); _cf.running=false; clearInterval(_cf.int); _cf.int=null;
    if(b) b.textContent='▶ המשך';
  } else {
    _cf.t0=Date.now(); _cf.running=true;
    if(!_cf.int) _cf.int=setInterval(_cfPaintTimer,250);
    if(b) b.textContent='השהה';
  }
}
function cfTimerReset(){
  clearInterval(_cf.int);
  _cf={int:null,running:false,mode:'up',t0:0,acc:0,total:0};
  const d=document.getElementById('cf-timer-display'); if(d) d.textContent='00:00';
  const st=document.getElementById('cf-timer-status'); if(st) st.textContent='סטופר — For Time';
  const b=document.getElementById('cf-timer-toggle'); if(b) b.textContent='▶ התחל';
}
function cfCountdown(min){
  cfTimerReset();
  _cf.mode='down'; _cf.total=min*60;
  const d=document.getElementById('cf-timer-display'); if(d) d.textContent=_cfFmt(_cf.total);
  const st=document.getElementById('cf-timer-status'); if(st) st.textContent='AMRAP '+min+' דק׳ — ספירה לאחור';
}
function cfTabata(){
  cfTimerReset();
  _cf.mode='tabata';
  const d=document.getElementById('cf-timer-display'); if(d) d.textContent='00:20';
  const st=document.getElementById('cf-timer-status'); if(st) st.textContent='Tabata — 8×(20 עבודה/10 מנוחה)';
}

Object.assign(window,{gymPairCheck,toggleExSearch,initCollapsibles,renderSubNav,fixNumericRanges,
  openModal,closeModal,closeModalBg,closeAltModal,
  cfFilter,cfToggleWod,cfOpenWod,cfSaveScore,cfTimerToggle,cfTimerReset,cfCountdown,cfTabata,
  showPanel,setMobileNav,renderExSearch,closeExSearch,browseExCategory,
  addWaterCup,removeWaterCup,
  toggleHabit,
  startGymMode,confirmCloseGymMode,gymNext,gymPrev,
  gymPickTimer,cancelGymTimer,toggleTempo,setRPE,
  closeCelebration,
  saveSettingsForm,updateBMRPreview,selectSettingsMC,toggleSettingsChol,
  testApiKey,exportData,importData,toggleTheme,
  showOnboarding,showOnboardingForNew,
  selectGoal,selectMealCount,toggleChol,selectActivity,
  obNext,obBack,selectObFreq,selectObSplit,obFinish,
  onTimerBtnClick,pickTimer,
  closeShareModal,downloadShareCard,nativeShare,
  openShareOptions,closeShareOptions,openShareModal,
  shareStatsCard,shareWhatsApp,shareNativeOrDownload,downloadStatsCard,
  openPlateCalc,closePlateCalc,calcPlates,
  open1RMCalc,close1RMCalc,render1RM,
  addWeightForm,saveMeasurementFull,updateNutritionTiming,
  elogSave,elogAdjust,swapMeal,selectFood,selectFoodResult,foodSearchDebounced,
  selectRecovery,submitRecovery,bossAddProgress,dismissDeload,
  toggleSidebar,openSidebar,closeSidebar,
  switchUser,showAlternatives,savePRFromModal,
  dismissInstallBanner,
  gymCheckSet,
  saveModalSetLog,
  deleteWEntry,deleteFoodEntry,
  openPRShareCard,
  goDay,
  saveSetLog,
  addFoodEntry,addCustomFood,
  closeGymMode,
  sendChat,
  saveGymSet,openGymSetPopup,
});

export {};
