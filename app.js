const EX = {
  benchPress:{name:'לחיצת חזה בשכיבה',en:'Flat Bench Press',e:'🏋️',cat:'חזה',sets:'4×6–8',rest:'2–3 דק׳',lvl:'כבד',
    desc:'תרגיל הבסיס לחזה. שוכב על ספסל, מוט מוריד לחזה התחתון-אמצעי ודוחף למעלה.',
    muscles:'חזה הגדול (ראשי), כתפיים קדמיות, טריצפס.',
    tips:['גב קל בקשת — לא שטוח לגמרי','המוט יורד לחזה תחתון-אמצעי, לא לסנטר','לחץ שכמות לספסל לאורך כל התרגיל','אל תנעל מרפקים בחזרה','נשוף בעלייה, שאף בירידה']},
  inclineBench:{name:'לחיצת חזה בנטייה',en:'Incline DB/BB Press',e:'📐',cat:'חזה עליון',sets:'3×10–12',rest:'90 שנ׳',lvl:'בינוני',
    desc:'ספסל ב-30–45°. מדגיש חזה עליון — נטייה לחולשה אצל רוב האנשים.',
    muscles:'חזה עליון (clavicular head), כתפיים קדמיות, טריצפס.',
    tips:['30° עדיף על 45° — פחות עומס על כתפיים','ירידה איטית 2–3 שניות','אפשר עם משקולות להרחיב טווח תנועה','כוון שכמות אחורה ומטה לאורך כל התרגיל']},
  cableFlye:{name:'פשיטות פולי',en:'Cable Crossover / Flye',e:'🔀',cat:'חזה',sets:'3×12–15',rest:'60 שנ׳',lvl:'בידוד',
    desc:'כבל שומר מתח לאורך כל הטווח — עדיף על משקולות לבידוד חזה.',
    muscles:'חזה הגדול — בידוד.',
    tips:['מרפקים כפופים קלות בצורת קשת — לא ישרים','הרגש מתיחה בחלק הפתוח','האט בחזרה — אל תזרוק','פולי נמוך = חזה עליון. פולי גבוה = חזה תחתון']},
  ohp:{name:'לחיצת כתפיים עמידה',en:'Standing Overhead Press',e:'⬆️',cat:'כתפיים',sets:'4×8–10',rest:'90 שנ׳',lvl:'כבד',
    desc:'מלך תרגילי הכתפיים. מגייס גם שרירי ליבה לייצוב.',
    muscles:'דלטואיד קדמי + אמצעי, טריצפס, ליבה.',
    tips:['התחל עם המוט מתחת לסנטר','הראש נע מעט אחורה בדחיפה לפנות מקום למוט','גוף ישר לחלוטין — אל תכופף גב','נשוף בעלייה','בהתחלה — ישיבה (Seated) ליציבות']},
  lateralRaise:{name:'הרמות צד',en:'Cable / DB Lateral Raise',e:'↔️',cat:'כתף אמצעית',sets:'3×15–20',rest:'45 שנ׳',lvl:'בידוד',
    desc:'בידוד לכתף האמצעית — אחראי על "רוחב" הכתפיים. עדיף כבל על משקולות.',
    muscles:'Medial Deltoid — בידוד.',
    tips:['עד גובה כתפיים בלבד','מרפקים כפופים קלות','אל תשתמש בתנופה — תנועה שולטת','כף יד מעט כלפי מטה בחלק העליון','כבל = מתח קבוע > משקולות']},
  triPushdown:{name:'לחיצת טריצפס — חבל',en:'Rope Tricep Pushdown',e:'⬇️',cat:'טריצפס',sets:'3–4×10–15',rest:'60 שנ׳',lvl:'בינוני',
    desc:'חבל עדיף על ידית ישרה — מאפשר פיצול בסוף התנועה לבידוד מלא.',
    muscles:'Triceps Brachii — lateral head ראשי.',
    tips:['מרפקים קבועים לצדי הגוף','פצל את החבל בסוף התנועה','פשיטה מלאה — הרגש כיווץ','האט בחזרה']},
  skullCrusher:{name:'Skull Crushers',en:'Lying EZ Bar Tricep Extension',e:'💀',cat:'טריצפס',sets:'3×10–12',rest:'75 שנ׳',lvl:'בינוני',
    desc:'שכיבה על ספסל, מוט EZ מוריד לטיפת ראש. מצוין ל-long head.',
    muscles:'Triceps Brachii — long head ראשי.',
    tips:['מוריד לאמצע הראש — לא לפנים','מרפקים קרובים זה לזה','מוט EZ נוח יותר לשורש כף יד','ירידה איטית']},
  pullup:{name:'מתח / לט פולדאון',en:'Pull-up / Lat Pulldown',e:'⬇️',cat:'גב רחב',sets:'4×6–10',rest:'2–3 דק׳',lvl:'כבד',
    desc:'תרגיל הגב המלך. כשמגיע ל-12 מתחים בסט — הוסף משקל עם חגורה.',
    muscles:'Latissimus Dorsi, בייסס, כתף אחורית.',
    tips:['אחיזה רחבה = גב רחב. אחיזה צרה = יותר בייסס','הפעל גב — לא ידיים — להרמה','השב שכמות אחורה ומטה בעלייה','האט בירידה — lowering חשוב כמו העלייה','אם Lat Pulldown — לא להטות גוף אחורה']},
  bentRow:{name:'חתירה כפופה — מוט',en:'Barbell Bent-over Row',e:'🏋️',cat:'גב עליון + עובי',sets:'4×8–10',rest:'2 דק׳',lvl:'כבד',
    desc:'מוסיף עובי לגב בנוסף לרוחב. כיפוף 45° קדימה ומשיכת מוט לבטן.',
    muscles:'Rhomboids, Trapezius, Lat, Rear Delt, בייסס.',
    tips:['גב ישר לחלוטין — לא כפוף','עיניים קדימה-מטה (לא למעלה)','המוט מגיע לבטן תחתונה','ברכיים כפופות קלות']},
  cableRow:{name:'חתירה ישיבה — כבל',en:'Seated Cable Row',e:'🚣',cat:'גב אמצעי',sets:'3×10–12',rest:'90 שנ׳',lvl:'בינוני',
    desc:'כבל שומר מתח גם בנקודת ההתחלה — עדיף לבידוד גב אמצעי.',
    muscles:'Rhomboids, Middle Trapezius, Lat, Rear Delt.',
    tips:['שב זקוף — לא כפוף קדימה','שכמות מתקרבות בסוף המשיכה','אל תסחב בתנופה','מרפקים מאחורי הגוף בסיום']},
  facePull:{name:'Face Pull — חבל',en:'Cable Face Pull',e:'🎯',cat:'כתף אחורית',sets:'4×15–20',rest:'45 שנ׳',lvl:'בידוד',
    desc:'קריטי לבריאות הכתף ולמניעת פציעות. עשה אותו כמעט כל אימון.',
    muscles:'Rear Deltoid, Rotator Cuff, Trapezius.',
    tips:['כבל בגובה ראש, אחיזה חבל','מושך לפנים הפנים — לא לסנטר','מרפקים גבוהים ופתוחים','חזרות גבוהות — 15–20','הכרחי לבריאות כתפיים לאורך זמן']},
  rdl:{name:'דד-ליפט רומני',en:'Romanian Deadlift',e:'📊',cat:'גב תחתון + ירך אחורי',sets:'3×8–10',rest:'2 דק׳',lvl:'כבד',
    desc:'כיפוף מהאגן בלבד. הטריגר הטוב ביותר לגב תחתון וירך אחורי.',
    muscles:'Hamstrings, Glutes, גב תחתון (Erector Spinae).',
    tips:['הורד מוט לאורך הרגל — ממש ליד העור','כופף מהאגן (hip hinge) — לא מהגב','הפסק כשמרגיש מתיחה, לא כאב','גב ישר לחלוטין — קריטי','משקל שמרני בהתחלה']},
  bbCurl:{name:'כפיפות מוט EZ',en:'EZ Bar Curl',e:'💪',cat:'בייסס',sets:'4×8–10',rest:'75 שנ׳',lvl:'בינוני',
    desc:'מוט EZ נוח יותר לשורש כף יד ומאפשר עומס גבוה יותר.',
    muscles:'Biceps Brachii, Brachialis.',
    tips:['מרפקים קבועים בצדי הגוף','תנועה מלאה — מתח עד כיפוף מלא','האט בירידה','לא להשתמש בתנופה — גוף ישר']},
  hammerCurl:{name:'פטיש',en:'Hammer Curl',e:'🔨',cat:'Brachialis',sets:'3×12',rest:'60 שנ׳',lvl:'בידוד',
    desc:'אחיזה ניטרלית. מחזק Brachialis שנמצא מתחת לבייסס ומרים אותה ויזואלית.',
    muscles:'Brachialis, Brachioradialis, Biceps.',
    tips:['כף יד פונה פנימה לאורך כל התרגיל','אפשר חילופין ימין-שמאל','גוף ישר, אל תשתמש בתנופה','כבל = מתח קבוע יותר ממשקולות']},
  squat:{name:'סקוואט — מוט גבוה',en:'High Bar Barbell Squat',e:'🦵',cat:'כל הרגל',sets:'4×5–8',rest:'3 דק׳',lvl:'כבד מאוד',
    desc:'מלך כל התרגילים. לא ניתן להחליפו. גם מגרה שחרור הורמוני גדילה וטסטוסטרון.',
    muscles:'Quadriceps, Glutes, Hamstrings, ליבה, גב תחתון.',
    tips:['רוחב רגליים מעט מעבר לכתפיים','אצבעות 30° כלפי חוץ','ברכיים עוקבות כיוון אצבעות','חזה גבוה, גב ישר, מבט קדימה','רד לפחות ל-90° — ועדיף מתחת','מוט על Trapezius — לא על צוואר']},
  legPress:{name:'לחיצת רגליים',en:'Leg Press',e:'⬆️',cat:'ירכיים + ישבן',sets:'4×10–12',rest:'2 דק׳',lvl:'בינוני',
    desc:'פלטה גבוהה על המכונה = יותר ישבן וירך אחורי. פלטה נמוכה = יותר quad.',
    muscles:'Quadriceps, Glutes, Hamstrings.',
    tips:['פלטה גבוהה לדגש על ישבן','אל תנעל ברכיים','רד עמוק — לפחות 90° בברך','אל תרד כל כך עמוק שגב מתגלגל']},
  legExt:{name:'פשיטות רגליים',en:'Leg Extension',e:'〽️',cat:'ארבע ראשי',sets:'3×12–15',rest:'60 שנ׳',lvl:'בידוד',
    desc:'בידוד ל-Quad. בסוף כל סט — החזק 2 שניות בפשיטה מלאה.',
    muscles:'Quadriceps — בידוד מלא.',
    tips:['ציר הברך מיושר עם ציר המכונה','תנועה שלמה מלאה','החזק 2 שנ׳ בחלק העליון','האט בהורדה']},
  legCurl:{name:'כפיפות רגליים — שכיבה',en:'Lying Leg Curl',e:'🔄',cat:'Hamstrings',sets:'3×12–15',rest:'60 שנ׳',lvl:'בידוד',
    desc:'בידוד לירך האחורי — חיוני לאיזון ולמניעת פציעות ברכיים.',
    muscles:'Biceps Femoris, Semitendinosus.',
    tips:['שכב שטוח — רק הרגל זזה','תנועה מלאה','האט בהורדה','לפחות 3 סטים — שריר מוזנח לעיתים']},
  lunges:{name:'פסיעות בולגריות',en:'Bulgarian Split Squat',e:'🚶',cat:'ישבן + ירכיים',sets:'3×10 לצד',rest:'90 שנ׳',lvl:'קשה',
    desc:'הרגל האחורית על ספסל, הקדמית צועדת קדימה. הכי כואב ביום רגליים — והכי אפקטיבי.',
    muscles:'Glutes, Quadriceps, Hamstrings, שרירי איזון.',
    tips:['כסא או ספסל גובה 40–50 ס"מ','ירידה אנכית — לא קדימה','ברך קדמית לא חורגת מהאצבעות','גוף ישר, לא כפוף','בהתחלה בלי משקל — תלמד את התנועה']},
  calfRaise:{name:'עריסת עגל עמידה',en:'Standing Calf Raise',e:'👟',cat:'שוק',sets:'5×15–20',rest:'45 שנ׳',lvl:'בידוד',
    desc:'שוק = שריר עיקש. צריך נפח, מתיחה מלאה, וכאב. 5 סטים ולא פחות.',
    muscles:'Gastrocnemius, Soleus.',
    tips:['על קצה מדרגה — מתיחה מלאה למטה','עלייה עד גובה מקסימלי','החזק שנייה בחלק העליון','לא לקצר טווח תנועה']},
  arnoldPress:{name:'Arnold Press',en:'Seated Arnold Press',e:'🌀',cat:'כל הכתף',sets:'3×12',rest:'75 שנ׳',lvl:'בינוני',
    desc:'לחיצה מסתובבת. מעבד את כל 3 חלקי הכתף בתנועה אחת.',
    muscles:'דלטואיד קדמי + אמצעי + אחורי, טריצפס.',
    tips:['מתחיל עם כפות ידיים פנימה','בדחיפה — כף יד מסתובבת החוצה','האט בסיבוב ההורדה','ישיבה = יציבות + יותר בידוד לכתף']},
  inclineCurl:{name:'כפיפות בנטייה',en:'Incline Dumbbell Curl',e:'↗️',cat:'בייסס long head',sets:'3×10–12',rest:'75 שנ׳',lvl:'בינוני',
    desc:'ספסל ב-45°. מתיחה מלאה של הבייסס בנקודת ההתחלה — מחזק את ה-long head.',
    muscles:'Biceps Brachii — long head בדגש.',
    tips:['ידיים תלויות ישר כלפי מטה בהתחלה','אל תרים כתפיים','תנועה מלאה ואיטית','הרגש מתיחה בחלק התחתון']},
  ohTricep:{name:'טריצפס מעל הראש',en:'Overhead Tricep Extension',e:'🙌',cat:'טריצפס long head',sets:'3×10–12',rest:'75 שנ׳',lvl:'בינוני',
    desc:'Long head נמתח מעל הראש. הטריגר הכי טוב ל-long head שנותן נפח לזרוע.',
    muscles:'Triceps Brachii — long head בדגש.',
    tips:['מרפקים קרובים לראש — לא פתוחים','פשיטה מלאה למעלה','תחתון — מתח מקסימלי','אפשר משקולת אחת עם שתי ידיים או כבל']},
  frontRaise:{name:'הרמות קדמיות',en:'Front Raise',e:'⬆️',cat:'כתף קדמית',sets:'3×12',rest:'60 שנ׳',lvl:'בידוד',
    desc:'בידוד לכתף הקדמית.',
    muscles:'Anterior Deltoid.',
    tips:['עד גובה עיניים','כף יד כלפי מטה','אל תשתמש בתנופה','חילופין ידיים']},
  diamondPushup:{name:'שכיבות יהלום',en:'Diamond Push-ups',e:'💎',cat:'טריצפס',sets:'2×כישלון',rest:'60 שנ׳',lvl:'בינוני',
    desc:'שכיבות עם ידיים צמודות בצורת יהלום — מדגישות טריצפס.',
    muscles:'Triceps Brachii, חזה פנימי.',
    tips:['ידיים צמודות — אצבעות נוגעות','גוף ישר לחלוטין','מרפקים כלפי מאחור בירידה','עד כישלון מוחלט']}
};

const EX_YT={
  benchPress:'bench press proper form tutorial',
  inclineBench:'incline bench press form tutorial',
  cableFlye:'cable chest fly exercise tutorial form',
  ohp:'overhead press military press form tutorial',
  lateralRaise:'lateral raise shoulder exercise tutorial',
  triPushdown:'tricep pushdown cable exercise form',
  skullCrusher:'skull crusher EZ bar tricep tutorial',
  pullup:'pull up chin up proper form tutorial',
  bentRow:'barbell bent over row form tutorial',
  cableRow:'seated cable row exercise tutorial',
  facePull:'face pull cable rear delt exercise tutorial',
  rdl:'romanian deadlift RDL proper form tutorial',
  bbCurl:'barbell curl bicep exercise form tutorial',
  hammerCurl:'hammer curl dumbbell exercise tutorial',
  squat:'barbell squat proper form tutorial',
  legPress:'leg press machine proper form tutorial',
  legExt:'leg extension machine quad exercise tutorial',
  legCurl:'lying leg curl hamstring exercise tutorial',
  lunges:'bulgarian split squat form tutorial',
  calfRaise:'standing calf raise exercise form tutorial',
  inclineCurl:'incline dumbbell curl bicep tutorial',
  ohTricep:'overhead tricep extension cable long head tutorial',
  arnoldPress:'arnold press shoulder exercise tutorial',
  frontRaise:'front raise shoulder exercise tutorial',
  diamondPushup:'diamond push ups tricep exercise form',
};

const CAT_STYLE={
  PUSH:{grad:'linear-gradient(135deg,rgba(255,55,95,.28),rgba(255,55,95,.08))',color:'#FF375F'},
  PULL:{grad:'linear-gradient(135deg,rgba(90,200,250,.28),rgba(10,132,255,.08))',color:'#5AC8FA'},
  LEGS:{grad:'linear-gradient(135deg,rgba(191,90,242,.28),rgba(191,90,242,.06))',color:'#BF5AF2'},
  ARMS:{grad:'linear-gradient(135deg,rgba(255,214,10,.28),rgba(255,159,10,.06))',color:'#FFD60A'},
};

let _currentExKey = null;
function openModal(key){
  const e=EX[key]; if(!e)return;
  _currentExKey = key;
  // cinematic hero
  const cs=CAT_STYLE[e.cat]||CAT_STYLE.PUSH;
  document.getElementById('m-hero-bg').style.background=cs.grad;
  document.getElementById('m-hero-wm').textContent=e.e;
  document.getElementById('m-hero-cat').textContent=e.cat+' DAY';
  document.getElementById('m-hero-name').textContent=e.name;
  document.getElementById('m-hero-en').textContent=e.en;
  document.getElementById('m-title').textContent=e.name;
  document.getElementById('m-desc').textContent=e.desc;
  document.getElementById('m-muscles').textContent=e.muscles;
  document.getElementById('m-info').innerHTML=
    `<div class="info-pill">סטים: <strong>${e.sets}</strong></div>
     <div class="info-pill">מנוחה: <strong>${e.rest}</strong></div>
     <div class="info-pill">עצימות: <strong>${e.lvl}</strong></div>`;
  document.getElementById('m-tips').innerHTML=e.tips.map(t=>`<li><span>✅</span><span>${t}</span></li>`).join('');
  // Demo video card
  const demoEl=document.getElementById('m-demo');
  if(demoEl){
    const q=EX_YT[key]||(e.en+' exercise tutorial form');
    const ytUrl='https://www.youtube.com/results?search_query='+encodeURIComponent(q);
    demoEl.innerHTML=`<a class="demo-card" href="${ytUrl}" target="_blank" rel="noopener noreferrer">
      <div class="demo-thumb">
        <span class="demo-bg-emoji">${e.e}</span>
        <div class="demo-play-ring"><svg viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg></div>
        <span class="demo-ex-tag">${e.en}</span>
      </div>
      <div class="demo-bar">
        <span class="demo-bar-text">הדגמת ביצוע נכון — לחץ לצפייה</span>
        <span class="demo-yt-pill">YouTube</span>
      </div>
    </a>`;
  }
  // Load PR
  const prs = getPRs();
  const pr = prs[key];
  const kgEl = document.getElementById('pr-kg');
  const repsEl = document.getElementById('pr-reps');
  const dispEl = document.getElementById('pr-display');
  if(kgEl) kgEl.value = pr ? pr.kg : '';
  if(repsEl) repsEl.value = pr ? pr.reps : '';
  if(dispEl) dispEl.textContent = pr ? `שיא נוכחי: ${pr.kg}ק"ג × ${pr.reps} (${pr.date})` : '';
  if(dispEl) dispEl.style.color = 'var(--cyan)';
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal(){document.getElementById('modal-overlay').classList.remove('open');document.body.style.overflow='';}
function closeModalBg(ev){if(ev.target.id==='modal-overlay')closeModal();}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

const TITLES={dashboard:'לוח בקרה',schedule:'לוח שבועי',push:'ראשון — PUSH DAY',pull:'שני — PULL DAY',legs:'רביעי — LEGS DAY',arms:'חמישי — ARMS DAY',nutrition:'תוכנית תזונה',supplements:'תוספי תזונה',tips:'טיפים מהמאמן',timeline:'ציר זמן',elog:'יומן משקלים',food:'מעקב תזונה יומי',chat:'יועץ תזונה AI',progress:'גרף משקל גוף',settings:'הגדרות אישיות'};
function showPanel(name,btn){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('panel-'+name).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  const pt=document.getElementById('page-title');
  if(pt){pt.classList.add('switching');setTimeout(()=>{pt.textContent=TITLES[name]||name;pt.classList.remove('switching');},100);}
  else{document.getElementById('page-title').textContent=TITLES[name]||name;}
  if(window.innerWidth<=768) closeSidebar();
  window.scrollTo(0,0);
  // Lazy-render panels that build their UI dynamically
  if(name==='elog') setTimeout(renderElogPanel,0);
  if(name==='food') setTimeout(renderFoodPanel,0);
  if(name==='chat') setTimeout(renderChatPanel,0);
}
function goDay(name){showPanel(name);}
function openSidebar(){
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.add('show');
  document.body.style.overflow='hidden';
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('show');
  document.body.style.overflow='';
}
function toggleSidebar(){
  const open = document.getElementById('sidebar').classList.contains('open');
  open ? closeSidebar() : openSidebar();
}

// ── SWIPE GESTURE — right edge → open sidebar, swipe out → close ──
(function(){
  const EDGE_ZONE = 32;   // px from right edge that triggers open
  const THRESHOLD = 55;   // px swipe needed to commit open/close
  let startX=0, startY=0, tracking=false, didDecide=false;

  function isMobile(){ return window.innerWidth <= 768; }

  document.addEventListener('touchstart', e=>{
    if(!isMobile()) return;
    const t=e.touches[0];
    startX=t.clientX; startY=t.clientY;
    const sb=document.getElementById('sidebar');
    const isOpen=sb.classList.contains('open');
    const fromEdge = startX > window.innerWidth - EDGE_ZONE;
    tracking = fromEdge || isOpen;
    didDecide = false;
    if(tracking && isOpen){
      // Remove transition for live drag
      sb.style.transition='none';
    }
  }, {passive:true});

  document.addEventListener('touchmove', e=>{
    if(!tracking || !isMobile()) return;
    const t=e.touches[0];
    const dx=t.clientX - startX;
    const dy=t.clientY - startY;
    // Decide axis on first significant move
    if(!didDecide && Math.max(Math.abs(dx),Math.abs(dy)) > 6){
      if(Math.abs(dy) > Math.abs(dx)){ tracking=false; return; } // vertical scroll
      didDecide=true;
    }
    if(!didDecide) return;
    const sb=document.getElementById('sidebar');
    const isOpen=sb.classList.contains('open');
    if(isOpen && dx > 0){
      // Dragging open sidebar to the right (closing direction)
      sb.style.transform=`translateX(${Math.min(dx, sb.offsetWidth)}px)`;
    } else if(!isOpen && dx < 0){
      // Dragging from edge to the left (opening direction)
      const progress=Math.min(-dx, sb.offsetWidth);
      sb.style.transform=`translateX(${sb.offsetWidth - progress}px)`;
    }
  }, {passive:true});

  document.addEventListener('touchend', e=>{
    if(!tracking || !isMobile()) return;
    const dx=e.changedTouches[0].clientX - startX;
    const sb=document.getElementById('sidebar');
    // Restore transition
    sb.style.transition='';
    sb.style.transform='';
    const isOpen=sb.classList.contains('open');
    if(!isOpen && dx < -THRESHOLD){
      openSidebar();
    } else if(isOpen && dx > THRESHOLD){
      closeSidebar();
    }
    tracking=false;
  }, {passive:true});
})();

// ── URL PARAMS: open panel from shortcut ──
(function(){
  const p = new URLSearchParams(location.search).get('panel');
  if(p) showPanel(p);
})();

// ── SERVICE WORKER ──
if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('ProFit SW registered'))
      .catch(e => console.log('SW error', e));
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
  if(!prev||!w||!h||!a){if(prev)prev.innerHTML='הזן נתונים לחישוב BMR ו-TDEE';return;}
  const bmr=Math.round(10*w+6.25*h-5*a+5);
  const actVal=parseFloat(document.getElementById('sf-activity')?.value)||1.55;
  const tdee=Math.round(bmr*actVal);
  const goalVal=document.getElementById('sf-goal')?.value||'lean_bulk';
  const surp={lean_bulk:350,bulk:600,cut:-400,maintain:0}[goalVal]??350;
  const target=tdee+surp;
  const surpLabel=surp>0?'+'+surp:String(surp);
  prev.innerHTML=`BMR: <strong>${bmr.toLocaleString()}</strong> &nbsp;|&nbsp; TDEE: <strong>${tdee.toLocaleString()}</strong> &nbsp;|&nbsp; יעד (<strong>${surpLabel}</strong>): <strong style="color:var(--red)">${target.toLocaleString()}</strong> קל׳`;
  const calIn=document.getElementById('sf-calories');
  if(calIn && !calIn.dataset.touched) calIn.value = target;
}
function saveSettingsForm(){
  const name=(document.getElementById('sf-name')?.value||'').trim()||'המשתמש שלי';
  const weight=parseFloat(document.getElementById('sf-weight')?.value)||60;
  const height=parseFloat(document.getElementById('sf-height')?.value)||170;
  const age=parseInt(document.getElementById('sf-age')?.value)||31;
  const calories=parseInt(document.getElementById('sf-calories')?.value)||2750;
  saveSettings({name,weight,height,age,calories});
  const apiKey=(document.getElementById('sf-apikey')?.value||'').trim();
  if(apiKey) localStorage.setItem('proFit_apiKey',apiKey);
  // Read new profile fields
  const goal=document.getElementById('sf-goal')?.value||'lean_bulk';
  const activity=parseFloat(document.getElementById('sf-activity')?.value)||1.55;
  const workout_time=document.getElementById('sf-workout-time')?.value||'18:00';
  const meal_count=_sfMealCount||5;
  const cholesterol=_sfCholesterol;
  // Sync active user record
  const users=getUsers(); const aid=getActiveUserId();
  const idx=users.findIndex(u=>u.id===aid);
  if(idx>=0){
    users[idx]={...users[idx],name,weight,height,age,calories,goal,activity,workout_time,meal_count,cholesterol};
    saveUsers(users);
    renderUserList();
    renderNutritionPanel();
    applyUserConditions(users[idx]);
    renderDashboardStats(users[idx]);
  }
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
function saveUsers(u){ localStorage.setItem(USERS_KEY,JSON.stringify(u)); }
function getActiveUserId(){ return localStorage.getItem(ACTIVE_USER_KEY)||null; }
function setActiveUserId(id){ localStorage.setItem(ACTIVE_USER_KEY,id); }
function getActiveUser(){
  const users=getUsers(); const id=getActiveUserId();
  return users.find(u=>u.id===id)||users[0]||null;
}

function calcNutrition(u){
  const sex=(u.gender||'m')==='f'?-161:5;
  const bmr=Math.round(10*(u.weight||75)+6.25*(u.height||175)-5*(u.age||30)+sex);
  const tdee=Math.round(bmr*(u.activity||1.55));
  const surplusMap={lean_bulk:350,bulk:600,cut:-400,maintain:0};
  const surplus=surplusMap[u.goal||'lean_bulk']??350;
  const target=u.calories||Math.round(tdee+surplus);
  const protein=Math.round((u.weight||75)*2.5);
  const fat=Math.round(target*0.27/9);
  const carbs=Math.round((target-protein*4-fat*9)/4);
  return{bmr,tdee,target,protein,fat,carbs};
}

const GOAL_LABELS={lean_bulk:'Lean Bulk',bulk:'מסה מקסימלית',cut:'הורדת שומן',maintain:'שמירה'};

// ═══════════════════════════════════════════════════
// EXERCISE ALTERNATIVES
// ═══════════════════════════════════════════════════
const EX_ALTERNATIVES = {
  benchPress:[{name:'לחיצת משקולות שכיבה',tag:'Dumbbell Bench Press — ריינג׳ של תנועה גדול יותר'},{name:'פוש-אפ בחגורה',tag:'Weighted Push-up — בית / ללא מכשיר'},{name:'פק דק / Chest Press מכונה',tag:'Machine Chest Press — מתחילים / שיקום'}],
  incline:[{name:'Incline Dumbbell Press',tag:'אותה קבוצת שריר, יותר יציבות'},{name:'Incline Push-up',tag:'ללא ציוד — שנה זווית הרצפה'},{name:'Low to High Cable Fly',tag:'כבל — מתח קבוע בחזה עליון'}],
  cableFly:[{name:'פרפר עם משקולות',tag:'Dumbbell Fly — שכיבה'},{name:'Pec Deck מכונה',tag:'בידוד מושלם לחזה'},{name:'Push-up רחב',tag:'ללא ציוד'}],
  shoulderPress:[{name:'Arnold Press',tag:'סיבוב פנימי/חיצוני — כיסוי מלא של כתף'},{name:'Machine Shoulder Press',tag:'בטוח יותר לגב תחתון'},{name:'לחיצת כתפיים עמידה',tag:'Barbell OHP — מפתח כוח'}],
  lateralRaise:[{name:'הרמות צד עם משקולות',tag:'Dumbbell Lateral Raise'},{name:'Upright Row כבל',tag:'מגרה גם trapezius'},{name:'Machine Lateral Raise',tag:'בידוד מדויק'}],
  pullup:[{name:'לט פולדאון',tag:'Lat Pulldown — אותו תנועה בישיבה'},{name:'Assisted Pull-up',tag:'מכונה עם עזר — לפיתוח כוח'},{name:'TRX Row',tag:'ישיבה נוטה — קל יותר'}],
  bentRow:[{name:'חתירה עם משקולות',tag:'Dumbbell Row — גב ישר, יש הדגמות בכל מכון'},{name:'Machine Row',tag:'ללא שיווי משקל — טוב למתחילים'},{name:'TRX Row',tag:'ניתן לכוונן עצימות'}],
  cableRow:[{name:'חתירה עם מוט',tag:'Barbell Row — כבד יותר'},{name:'חתירה עם משקולות',tag:'Dumbbell Row — כל יד בנפרד'},{name:'T-Bar Row',tag:'זווית שונה לגב אמצעי'}],
  squat:[{name:'לחיצת רגליים',tag:'Leg Press — ללא עומס על עמוד השדרה'},{name:'Goblet Squat',tag:'משקולת אחת — טוב לטכניקה'},{name:'Bulgarian Split Squat',tag:'חד-רגלי — פחות משקל, יותר עבודה'}],
  legPress:[{name:'סקוואט',tag:'Squat — כוח מלא'},{name:'Hack Squat',tag:'פחות עומס על גב תחתון'},{name:'Sissy Squat',tag:'בודד Quads — ללא ציוד'}],
  rdl:[{name:'ליפט סומו',tag:'Sumo Deadlift — אחיזה רחבה, פחות גב'},{name:'Nordic Curl',tag:'Hamstrings ללא ציוד'},{name:'Leg Curl מכונה',tag:'בידוד Hamstrings'}],
  bbCurl:[{name:'כפיפות משקולות',tag:'Dumbbell Curl — כל יד בנפרד'},{name:'Preacher Curl',tag:'מקנה גם ראש קצר בלבד — עיצוב'},{name:'כבל — כפיפות',tag:'Cable Curl — מתח קבוע'}],
  skullCrusher:[{name:'Dips',tag:'מקביל — טריצפס + חזה תחתון'},{name:'Overhead Dumbbell Extension',tag:'Long Head — משקולת'},{name:'Close-Grip Push-up',tag:'ללא ציוד — טריצפס'}],
  triPushdown:[{name:'Overhead Cable Extension',tag:'Long Head — מתיחה מלאה'},{name:'Dips',tag:'משקל גוף — כל Tricep'},{name:'Kickbacks משקולות',tag:'בידוד — בחינם'}],
  wristCurl:[{name:'כפיפת פרק עם ריצועית',tag:'Resistance Band Wrist Curl'},{name:'אחיזת בקבוק מים',tag:'ללא ציוד — 3×60 שנ׳'},{name:'Farmer Hold',tag:'אחיזה סטטית — ניהול עומס'}],
};

function showAlternatives(exKey, exName){
  const alts=EX_ALTERNATIVES[exKey];
  if(!alts||!alts.length){ showToast('אין חלופות מוגדרות לתרגיל זה'); return; }
  document.getElementById('alt-title').textContent='חלופות ל: '+exName;
  const list=document.getElementById('alt-list');
  list.innerHTML=alts.map(a=>`
    <div class="alt-item">
      <div><div class="alt-item-name">${a.name}</div><div class="alt-item-tag">${a.tag}</div></div>
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
  const goalHe={lean_bulk:'Lean Bulk',bulk:'מסה',cut:'הורדת שומן',maintain:'שמירה'};

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
  if(m5) m5.innerHTML=`שינוי דרמטי. <strong>+${Math.round(w*0.06)}–${Math.round(w*0.1)} ק"ג שריר נטו.</strong> Bench ${bench}ק"ג, Squat ${squat}ק"ג. גוף מוצק.`;
  const m9=document.getElementById('tl-m9');
  if(m9) m9.innerHTML=`<strong>+${Math.round(w*0.1)}–${Math.round(w*0.15)} ק"ג שריר נטו</strong> — Deadlift ${dead}ק"ג. גוף שנבנה מחדש. שקול לעבור ל-Cut.`;
}

// 6 possible meal slots per goal (index 0-5)
// slot: [name, time, basePct, pRat, cRat, fRat, foods[], tip, ?accent]
const MEAL_SLOT_POOL = {
  lean_bulk:[
    ['🌅 בוקר','07:30',0.22,0.24,0.27,0.22,['🥣 100g שיבולת שועל','🥚 ביצה + 2 חלבונים','🥛 200g קוטג׳ 1%','🫐 אוכמניות'],'Beta-Glucan בשיבולת שועל מוריד LDL 📉'],
    ['🍎 ביניים','10:30',0.10,0.12,0.10,0.14,['🥛 200g יוגורט יווני 0%','🥜 20g אגוזי מלך','🍓 פירות יער'],'ביניים קל — מונע אכילת יתר בצהריים 💡'],
    ['🌞 צהריים','13:00',0.28,0.30,0.28,0.26,['🐟 200g סלמון / עוף','🍚 150g אורז מלא','🥦 ירקות','🫒 כף שמן זית'],'EPA+DHA בסלמון מעלים HDL ✅'],
    ['🏋️ לפני אימון','(60–90 דק׳ לפני)',0.14,0.13,0.19,0.07,['🍞 2 פרוסות לחם שיפון','🧀 75g גבינה 1%','🍌 בננה','☕ קפה שחור'],'פחמימות מהירות + מורכבות לאנרגיה מיטבית ⚡'],
    ['⚡ אחרי אימון','תוך 30–45 דק׳',0.17,0.24,0.20,0.05,['💪 Whey Isolate','🍌 בננה','🍠 100g בטטה'],'Whey Isolate — ספיגה מהירה לחלון האנאבוליזם 🏆','red'],
    ['🌙 ערב','21:00',0.09,0.11,0.06,0.14,['🐟 150g דג לבן / הודו','🥗 סלט ירקות + לימון','🥑 ¼ אבוקדו'],'אבוקדו — שומן חד-בלתי-רווי מוריד LDL 💚'],
  ],
  bulk:[
    ['🌅 בוקר','07:30',0.24,0.23,0.28,0.24,['🥣 150g שיבולת שועל','🥚 3 ביצים שלמות','🍌 בננה','🥛 200ml חלב 3%'],'ארוחת בוקר כבדה = דלק להיום כולו 🔥'],
    ['🍎 ביניים','10:30',0.10,0.11,0.12,0.10,['🧀 200g קוטג׳','🍯 דבש','🥜 25g בוטנים'],'ביניים — קלוריות קלות לשמירה על עודף ⚡'],
    ['🌞 צהריים','13:00',0.30,0.32,0.29,0.27,['🍗 300g חזה עוף / בשר רזה','🍚 200g אורז לבן','🥦 ירקות','🫒 כף שמן זית'],'הארוחה הכי חשובה ביום — אל תדלג! ⭐'],
    ['🏋️ לפני אימון','(60–90 דק׳ לפני)',0.14,0.13,0.21,0.07,['🍞 3 פרוסות לחם','🥚 3 ביצים קשות','🍎 תפוח'],'פחמימות מקסימליות לאנרגיה 💪'],
    ['⚡ אחרי אימון','תוך 30 דק׳',0.15,0.22,0.18,0.05,['💪 Whey + 200ml חלב','🍠 150g בטטה','🍯 כף דבש'],'חלון האנאבוליזם — ספיגה מיידית 🏆','red'],
    ['🌙 ערב','21:00',0.07,0.10,0.06,0.13,['🥩 200g הודו / דג','🍚 80g אורז','🥗 סלט'],'ערב — חלבון + פחמימות לשיקום שריר 💪'],
  ],
  cut:[
    ['🌅 בוקר','07:30',0.24,0.28,0.24,0.18,['🥚 3 ביצים שלמות + 2 חלבונים','🥣 60g שיבולת שועל','🥦 ירקות'],'חלבון גבוה בבוקר = פחות רעב לאורך היום 💡'],
    ['🍎 ביניים','10:30',0.10,0.14,0.06,0.08,['🥛 150g קוטג׳ 0%','🥒 ירקות חיים'],'ביניים חלבוני — שומר על מסת שריר תוך גירעון 🔒'],
    ['🌞 צהריים','13:00',0.33,0.36,0.30,0.24,['🍗 220g חזה עוף','🥗 סלט ירקות גדול','🫒 1.5 כף שמן זית','🍋 לימון'],'הארוחה הגדולה ביום — נפח מסלט מונע רעב 🥗'],
    ['🏋️ לפני אימון','(60–90 דק׳ לפני)',0.12,0.13,0.16,0.07,['🍎 תפוח','🥚 2 ביצים קשות','☕ קפה שחור'],'קפה לפני אימון = שריפת שומן משופרת ☕🔥'],
    ['⚡ אחרי אימון','תוך 30 דק׳',0.14,0.24,0.18,0.05,['💪 Whey Isolate + מים','🍌 בננה קטנה'],'Whey Isolate = שיקום מינימלי קלורי ✅','red'],
    ['🌙 ערב','21:00',0.07,0.15,0.03,0.10,['🥛 200g קוטג׳ 1%','🥒 ירקות חתוכים'],'קוטג׳ = קזאין איטי + שובע גבוה 💤'],
  ],
  maintain:[
    ['🌅 בוקר','07:30',0.24,0.26,0.27,0.22,['🥣 80g שיבולת שועל','🥚 2 ביצים שלמות','🥛 150g קוטג׳','🍓 פירות'],'ארוחת בוקר מאוזנת = אנרגיה יציבה ✅'],
    ['🍎 ביניים','10:30',0.10,0.12,0.10,0.12,['🥛 180g יוגורט יווני','🍓 פרי','🥜 15g שקדים'],'ביניים — מונע אכילת יתר בצהריים 💡'],
    ['🌞 צהריים','13:00',0.30,0.31,0.30,0.25,['🐟 180g סלמון / עוף','🍚 130g אורז מלא','🥦 ירקות','🫒 שמן זית'],'הארוחה הכי חשובה — חלבון + פחמימות ⭐'],
    ['🏋️ לפני אימון','(60–90 דק׳ לפני)',0.13,0.13,0.18,0.07,['🍞 2 פרוסות לחם','🧀 גבינה לבנה','🍌 בננה'],'ארוחה קלה לפני = ביצועים טובים יותר ⚡'],
    ['⚡ אחרי אימון','תוך 45 דק׳',0.15,0.22,0.20,0.05,['💪 Whey + מים','🍠 100g בטטה'],'חלבון אחרי אימון = שמירה על מסת שריר 💪','red'],
    ['🌙 ערב','21:00',0.08,0.12,0.06,0.13,['🍗 130g הודו / דג','🥗 סלט + לימון'],'ערב קל = שינה טובה יותר 🌙'],
  ],
};

// Which slots to use per meal count
const MEAL_SLOTS_BY_COUNT = {3:[0,2,5], 4:[0,2,4,5], 5:[0,2,3,4,5], 6:[0,1,2,3,4,5]};

function getMealPlan(u,n){
  const g=u.goal||'lean_bulk';
  const count=u.meal_count||5;
  const pool=MEAL_SLOT_POOL[g]||MEAL_SLOT_POOL['lean_bulk'];
  const indices=MEAL_SLOTS_BY_COUNT[count]||MEAL_SLOTS_BY_COUNT[5];
  const selected=indices.map(i=>pool[i]);
  // Renormalize percentages to sum 1.0
  const totalPct=selected.reduce((s,t)=>s+t[2],0);
  return selected.map(t=>({
    name:t[0],time:t[1],
    pct:t[2]/totalPct,
    pRat:t[3],cRat:t[4],fRat:t[5],
    foods:t[6],tip:t[7],accent:t[8]
  }));
}

function renderNutritionPanel(){
  const u=getActiveUser(); if(!u) return;
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
  if(fatNote) fatNote.innerHTML=`BMR: <strong>${n.bmr.toLocaleString()}</strong> קל׳ &nbsp;|&nbsp; TDEE: <strong>${n.tdee.toLocaleString()}</strong> קל׳ &nbsp;|&nbsp; יעד: <strong style="color:var(--red)">${n.target.toLocaleString()}</strong> קל׳`;

  // Meal badge
  const mealBadge=document.getElementById('meal-count-badge');
  if(mealBadge) mealBadge.textContent=(u.meal_count||5)+' ארוחות';

  // Meals
  const meals=getMealPlan(u,n);
  const cont=document.getElementById('meals-container');
  if(!cont) return;
  cont.innerHTML=meals.map(m=>{
    const kcal=Math.round(n.target*m.pct);
    const p=Math.round(n.protein*m.pRat);
    const c=Math.round(n.carbs*m.cRat);
    const f=Math.round(n.fat*m.fRat);
    const border=m.accent==='red'?'style="border-color:rgba(255,55,95,.35);"':'';
    const timeColor=m.accent==='red'?`style="color:var(--red)"`:'' ;
    const tipColor=m.tip.includes('❤')||m.tip.includes('✅')||m.tip.includes('💚')?'var(--green)':m.tip.includes('⚠')?'var(--yellow)':'var(--muted2)';
    return `<div class="meal-row" ${border}>
      <div class="meal-top">
        <div><div class="meal-name">${m.name}</div><div class="meal-time" ${timeColor}>${m.time}</div></div>
        <div style="text-align:left;"><div class="meal-cals">${kcal}</div><div class="meal-cals-unit">קל׳</div></div>
      </div>
      <div class="meal-foods">${m.foods.join(' · ')}</div>
      <div style="font-size:.75rem;color:${tipColor};margin-bottom:8px;">${m.tip}</div>
      <div class="meal-macros"><span class="mp mp-p">חלבון ${p}g</span><span class="mp mp-c">פחמימות ${c}g</span><span class="mp mp-f">שומן ${f}g</span></div>
    </div>`;
  }).join('');

  // Also update topbar chips
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
      <div class="user-avatar-sm">${(u.name||'?').charAt(0)}</div>
      <div class="user-item-info">
        <div class="user-item-name">${u.name}</div>
        <div class="user-item-sub">${u.weight}ק"ג · ${u.height}ס"מ · ${GOAL_LABELS[u.goal]||u.goal} · ${n.target.toLocaleString()} קל׳</div>
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
  showToast('עברת ל-'+u.name+' 👤');
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
  _sfMealCount=u.meal_count||5; _sfCholesterol=!!u.cholesterol;
  document.querySelectorAll('[data-smc]').forEach(b=>b.classList.toggle('sel',b.dataset.smc===String(_sfMealCount)));
  document.getElementById('sf-chol-pill')?.classList.toggle('on',_sfCholesterol);
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
      o3.innerHTML='מינון: <strong style="color:var(--green);">3–4g EPA+DHA ביום</strong><br>מפחית טריגליצרידים עד 30%<br>מעלה HDL (כולסטרול טוב)<br><span style="color:var(--green);">⭐ חשוב במיוחד עבורך</span>';
      if(o3card) o3card.style.borderColor='rgba(34,197,94,.4)';
      if(o3card) o3card.querySelector('div').textContent='🐟 אומגה 3 — עדיפות גבוהה!';
    } else {
      o3.innerHTML='מינון: <strong style="color:var(--green);">1–2g EPA+DHA ביום</strong><br>תומך בלב, מוח וירידת דלקת<br><span style="color:var(--green);">✅ מומלץ לכולם</span>';
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

function showOnboarding(){
  _obStep=1;_obGoal=null;_obActivity=null;
  document.querySelectorAll('.onboard-step').forEach(s=>s.classList.remove('active'));
  document.getElementById('ob-step-1')?.classList.add('active');
  document.querySelectorAll('.onboard-dot').forEach((d,i)=>{d.classList.toggle('active',i===0);});
  document.getElementById('ob-back').style.display='none';
  document.getElementById('ob-next').textContent='הבא →';
  document.getElementById('onboard-overlay').style.display='flex';
}
function showOnboardingForNew(){
  _isNewUserFlow=true;
  _obMealCount=5; _obCholesterol=false;
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
    obFinish();
    return;
  }
  document.querySelectorAll('.onboard-step').forEach(s=>s.classList.remove('active'));
  document.getElementById('ob-step-'+_obStep)?.classList.add('active');
  document.querySelectorAll('.onboard-dot').forEach((d,i)=>{d.classList.toggle('active',i===_obStep-1);});
  document.getElementById('ob-back').style.display='block';
  document.getElementById('ob-next').textContent=_obStep===3?'צור פרופיל ✓':'הבא →';
}
function obBack(){
  if(_obStep<=1) return;
  _obStep--;
  document.querySelectorAll('.onboard-step').forEach(s=>s.classList.remove('active'));
  document.getElementById('ob-step-'+_obStep)?.classList.add('active');
  document.querySelectorAll('.onboard-dot').forEach((d,i)=>{d.classList.toggle('active',i===_obStep-1);});
  document.getElementById('ob-back').style.display=_obStep===1?'none':'block';
  document.getElementById('ob-next').textContent='הבא →';
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
    animateStats();
    renderWLog();
    renderWChart();
    if(localStorage.getItem('pf_installDismissed')){
      const b=document.getElementById('install-banner'); if(b) b.style.display='none';
    }
  }
  _isNewUserFlow=false;
  showToast('ברוך הבא, '+name+'! 🎉');
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
  if(isNaN(kg)||isNaN(reps)||kg<=0||reps<=0){if(disp){disp.textContent='⚠️ הזן ק"ג וחזרות';disp.style.color='var(--red)';}return;}
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
  if(isNew) showToast('שיא אישי חדש! '+kg+'ק"ג × '+reps+' 🏆');
  if(typeof addXP==='function') addXP(isNew?25:0);
  if(typeof updateORMDisplay==='function') updateORMDisplay(kg,reps);
}

// ═══════════════════════════════════════════════════
// WORKOUT LOGGER (set checkboxes)
// ═══════════════════════════════════════════════════
const LOG_KEY='proFit_log';
function getLog(){ try{return JSON.parse(localStorage.getItem(LOG_KEY)||'{}')}catch(e){return{};} }
function saveLog(log){ localStorage.setItem(LOG_KEY,JSON.stringify(log)); }
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
const TRAIN_DAYS=[0,1,3,4];
const HEB_DAYS2=['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];

function computeStreak(){
  const log=getLog();
  let streak=0;
  const today=new Date();
  for(let i=1;i<90;i++){
    const d=new Date(today); d.setDate(today.getDate()-i);
    const dow=d.getDay();
    if(!TRAIN_DAYS.includes(dow)) continue;
    const ds=d.toISOString().slice(0,10);
    if(log[ds]?.__complete) streak++;
    else break;
  }
  return streak;
}

function updateStreak(){
  const n=computeStreak();
  ['streak-num','streak-num2'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=n;});
  const msgs=[[0,0,'מתחילים'],[1,3,'התחלה טובה'],[4,7,'אחלה קצב'],[8,14,'מכונה'],[15,999,'אגדה']];
  const msg=(msgs.find(([lo,hi])=>n>=lo&&n<=hi)||msgs[0])[2];
  ['streak-msg','streak-msg2'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=msg;});
}

// ═══════════════════════════════════════════════════
// TODAY HERO BANNER
// ═══════════════════════════════════════════════════
/* Per-workout label badge — shown instead of emoji */
const DAY_CFG={
  0:{panel:'push',badge:'💥 PUSH',color:'#FF6B6B',label:'חזה · כתפיים · טריצפס',sub:'PUSH DAY A',meta:'~55 דק׳ · 7 תרגילים'},
  1:{panel:'pull',badge:'🔄 PULL',color:'#5AC8FA',label:'גב · בייסס · כתף אחורית',sub:'PULL DAY B',meta:'~55 דק׳ · 7 תרגילים'},
  3:{panel:'legs',badge:'🦵 LEGS',color:'#BF5AF2',label:'ירכיים · ירך אחורי · שוק',sub:'LEGS DAY C',meta:'~65 דק׳ · 7 תרגילים'},
  4:{panel:'arms',badge:'💪 ARMS',color:'#FFD60A',label:'בייסס · טריצפס · כתפיים',sub:'ARMS DAY D',meta:'~50 דק׳ · 7 תרגילים'}
};
const HEB_DAYS3=['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];

function initTodayHero(){
  const d=new Date().getDay();
  const hero=document.getElementById('today-hero');
  if(!hero) return;
  const cfg=DAY_CFG[d];
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
        <span class="hero-badge">${cfg.badge}${done?' ✓':''}</span>
        <button class="hero-play" onclick="event.stopPropagation();document.querySelectorAll('.nav-btn').forEach(b=>{if(b.getAttribute('onclick')?.includes('${cfg.panel}'))b.click();});">
          <svg viewBox="0 0 24 24" fill="#000"><polygon points="5,3 19,12 5,21"/></svg>
        </button>
      </div>
      <div class="hero-bottom">
        <div class="today-hero-info">
          <div class="today-hero-day">יום ${HEB_DAYS3[d]} — ${cfg.sub}</div>
          <div class="today-hero-title">${cfg.label}</div>
        </div>
        <div class="hero-wk-meta">
          <span class="hero-meta-chip">${timeSvg}${cfg.meta.split(' · ')[0]}</span>
          <span class="hero-meta-chip">${exSvg}${cfg.meta.split(' · ')[1]}</span>
          ${done?'<span class="today-hero-hint">✓ הושלם היום!</span>':''}
        </div>
      </div>`;
    hero.onclick=()=>{
      document.querySelectorAll('.nav-btn').forEach(b=>{
        if(b.getAttribute('onclick')?.includes("'"+cfg.panel+"'")) b.click();
      });
    };
  } else {
    hero.style.cssText='';
    hero.style.background='linear-gradient(135deg,rgba(48,209,88,.12),rgba(48,209,88,.04))';
    hero.style.border='1px solid rgba(48,209,88,.25)';
    hero.style.cursor='default';
    hero.innerHTML=`
      <div class="hero-top-row">
        <span class="hero-badge" style="background:rgba(48,209,88,.15);color:var(--green);">😴 יום מנוחה</span>
      </div>
      <div class="hero-bottom">
        <div class="today-hero-info">
          <div class="today-hero-day">יום ${HEB_DAYS3[d]}</div>
          <div class="today-hero-title" style="color:#fff;">שיקום ושינה</div>
          <div class="today-hero-sub">הגוף גדל כשאתה נח. תזונה, שינה, ריפוי.</div>
        </div>
      </div>`;
  }
  // Highlight today + mark completed days this week + count
  const fullLog=getLog();
  const DAY_PANEL={0:'push',1:'pull',3:'legs',4:'arms'};
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
    c.querySelector('.ddc-dot')?.remove();
    if(i===d){
      c.classList.add('ddc-active');
      const dot=document.createElement('span');
      dot.className='ddc-dot';
      c.prepend(dot);
    }
  });
  // mark done days in dash carousel too
  document.querySelectorAll('.week-bar .day-cell.done-day').forEach((c,i)=>{
    const idx=[...c.parentElement.children].indexOf(c);
    if(dashChips[idx]) dashChips[idx].classList.add('ddc-done');
  });
  // Update week counter
  const wc=document.getElementById('week-counter');
  if(wc){
    const color=weekDone===4?'var(--green)':weekDone>=2?'var(--yellow)':'var(--muted)';
    wc.innerHTML=`<span style="color:${color}">${weekDone}</span><span style="color:var(--muted);font-size:.72rem;font-weight:600;"> / 4 אימונים</span>`;
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
      document.getElementById('timer-btn').textContent='⏱ מנוחה';
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
      btn.textContent='⏱ מנוחה';
      if(navigator.vibrate) navigator.vibrate([200,100,200]);
    }
  },1000);
}
function cancelTimer(){
  if(_timerIv){clearInterval(_timerIv);_timerIv=null;}
  document.getElementById('timer-btn').classList.remove('running');
  document.getElementById('timer-ring').classList.remove('show');
  document.getElementById('timer-btn').textContent='⏱ מנוחה';
}
function tickTimer(){
  const m=Math.floor(_timerRemain/60), s=_timerRemain%60;
  document.getElementById('timer-btn').textContent=m+':'+(s<10?'0':'')+s;
  document.getElementById('ring-text').textContent=m+':'+(s<10?'0':'')+s;
  const prog=document.getElementById('ring-prog');
  if(prog) prog.style.strokeDashoffset=CIRC*(1-_timerRemain/_timerTotal);
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
  el.innerHTML=log.slice().reverse().map(e=>`<div class="wlog-entry">
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
  const elog=(() => { try{return JSON.parse(localStorage.getItem('proFit_elog')||'{}')}catch(e){return{};} })();
  const volByWeek={};
  Object.values(elog).forEach(arr=>{
    if(!Array.isArray(arr)) return;
    arr.forEach(entry=>{
      if(!entry.date||!entry.kg||!entry.reps) return;
      const wk=getWeekKey(entry.date);
      volByWeek[wk]=(volByWeek[wk]||0)+Math.round(entry.kg*entry.reps);
    });
  });
  const vols=log.map(e=>volByWeek[getWeekKey(e.date)]||0);
  const hasVol=vols.some(v=>v>0);
  const maxV=hasVol?Math.max(...vols)+100:1;
  const ysV=v=>P.t+(1-(v/maxV))*(H-P.t-P.b);

  let h=`<defs>
    <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="ca" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#06b6d4" stop-opacity=".25"/><stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/></linearGradient>
  </defs>`;

  // Grid lines (left axis — weight)
  for(let r=0;r<4;r++){
    const y=P.t+r*(H-P.t-P.b)/3;
    const v=(maxK-(maxK-minK)*r/3).toFixed(1);
    h+=`<line x1="${P.l}" y1="${y}" x2="${W-P.r}" y2="${y}" stroke="#1e2433" stroke-width="1"/>`;
    h+=`<text x="${P.l-5}" y="${y+4}" text-anchor="end" fill="#6b7a99" font-size="9" font-family="Barlow,sans-serif">${v}</text>`;
    if(hasVol){const vv=Math.round(maxV*(1-r/3));h+=`<text x="${W-P.r+5}" y="${y+4}" text-anchor="start" fill="#ef4444" font-size="9" font-family="Barlow,sans-serif" opacity=".7">${vv}</text>`;}
  }

  // Volume area + line (red) — behind weight
  if(hasVol){
    const vPts=vols.map((v,i)=>`${xs(i)},${ysV(v)}`).join(' ');
    h+=`<polygon points="${xs(0)},${H-P.b} ${vPts} ${xs(n-1)},${H-P.b}" fill="rgba(239,68,68,.08)"/>`;
    h+=`<polyline points="${vPts}" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,3" stroke-linejoin="round" stroke-linecap="round" opacity=".7"/>`;
    vols.forEach((v,i)=>{if(v>0)h+=`<circle cx="${xs(i)}" cy="${ysV(v)}" r="3" fill="#ef4444" opacity=".7"/>`;});
  }

  // Weight area + line (blue) — on top
  const pts=log.map((e,i)=>`${xs(i)},${ysK(e.kg)}`).join(' ');
  h+=`<polygon points="${xs(0)},${H-P.b} ${pts} ${xs(n-1)},${H-P.b}" fill="url(#ca)"/>`;
  h+=`<polyline points="${pts}" fill="none" stroke="url(#cg)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  log.forEach((e,i)=>{
    h+=`<circle cx="${xs(i)}" cy="${ysK(e.kg)}" r="4" fill="#06b6d4" stroke="#000" stroke-width="2"/>`;
    if(n<=8||i===0||i===n-1) h+=`<text x="${xs(i)}" y="${ysK(e.kg)-9}" text-anchor="middle" fill="#eaf0fb" font-size="10" font-weight="700" font-family="Barlow,sans-serif">${e.kg}</text>`;
  });

  // X-axis date labels
  const step=Math.max(1,Math.floor(n/6));
  log.forEach((e,i)=>{if(i%step===0||i===n-1)h+=`<text x="${xs(i)}" y="${H-P.b+14}" text-anchor="middle" fill="#6b7a99" font-size="9" font-family="Barlow,sans-serif">${e.date.slice(5).replace('-','/')}</text>`;});

  // Legend
  h+=`<circle cx="${P.l+4}" cy="${H-P.b+28}" r="4" fill="#06b6d4"/>`;
  h+=`<text x="${P.l+11}" y="${H-P.b+32}" fill="#6b7a99" font-size="9" font-family="Barlow,sans-serif">משקל (ק"ג)</text>`;
  if(hasVol){
    h+=`<line x1="${P.l+75}" y1="${H-P.b+28}" x2="${P.l+87}" y2="${H-P.b+28}" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,2"/>`;
    h+=`<text x="${P.l+91}" y="${H-P.b+32}" fill="#ef4444" font-size="9" font-family="Barlow,sans-serif" opacity=".8">נפח שבועי (ק"ג)</text>`;
  }

  svg.setAttribute('viewBox',`0 0 ${W} ${H+36}`);
  svg.setAttribute('height','');
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
  // Inject swap buttons into exercise rows that have alternatives
  injectSwapButtons();
});

function injectSwapButtons(){
  // Map onclick attr to key
  document.querySelectorAll('.ex-table tbody tr[onclick]').forEach(tr=>{
    const m=tr.getAttribute('onclick')?.match(/openModal\('(\w+)'\)/);
    if(!m) return;
    const key=m[1];
    if(!EX_ALTERNATIVES[key]) return;
    const nameCell=tr.querySelector('.ex-name-main');
    if(!nameCell||nameCell.querySelector('.ex-swap-btn')) return;
    const btn=document.createElement('button');
    btn.className='ex-swap-btn';
    btn.textContent='חלופות';
    btn.title='הצג תרגילים חלופיים';
    btn.onclick=(e)=>{e.stopPropagation();showAlternatives(key,nameCell.textContent.replace('חלופות','').trim());};
    nameCell.appendChild(btn);
  });
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
  const rx=/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}✅⭐]/gu;
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
function saveElogEntry(key,kg,reps){
  const log=getElog();
  if(!log[key]) log[key]=[];
  const today=todayStr();
  // Remove existing entry for today if any
  const idx=log[key].findIndex(e=>e.date===today);
  if(idx>=0) log[key][idx]={date:today,kg,reps};
  else log[key].unshift({date:today,kg,reps});
  // Keep last 15 entries
  log[key]=log[key].slice(0,15);
  localStorage.setItem(ELOG_KEY,JSON.stringify(log));
}

const WORKOUT_ORDER=[
  {id:'push',label:'PUSH — ראשון',color:'var(--red)'},
  {id:'pull',label:'PULL — שני',color:'var(--blue)'},
  {id:'legs',label:'LEGS — רביעי',color:'var(--purple)'},
  {id:'arms',label:'ARMS — חמישי',color:'var(--yellow)'}
];

function renderElogPanel(){
  const wrap=document.getElementById('elog-content');
  if(!wrap) return;
  const elog=getElog();
  // Empty state
  const hasData=Object.values(elog).some(week=>Object.values(week).some(ex=>Object.keys(ex).length>0));
  if(!hasData){
    wrap.innerHTML=`<div class="elog-empty-state">
      <div class="elog-empty-icon">📒</div>
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
      html+=`<div class="elog-row" id="elog-row-${key}">
        <div class="elog-ex-info">
          <div class="elog-ex-name">${ex.name}</div>
          <div class="elog-ex-en" style="font-size:.72rem;color:var(--muted);margin-top:1px;">${ex.en}</div>
          <div class="elog-history">
            ${todayEntry?`<span class="elog-hist-chip latest">היום: ${todayEntry.kg}ק"ג×${todayEntry.reps}</span>`:''}
            ${chips}
            ${!chips&&!todayEntry?'<span style="color:var(--muted);font-size:.72rem;">אין היסטוריה עדיין</span>':''}
          </div>
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
      chip.innerHTML=`<span>פעם קודמת: ${e.kg}ק"ג × ${e.reps} (${e.date.slice(5)})</span>`;
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

function getFoodLog(){ try{const d=localStorage.getItem(FOOD_KEY+'_'+todayStr());return d?JSON.parse(d):[]}catch(e){return[];} }
function saveFoodLog(log){ localStorage.setItem(FOOD_KEY+'_'+todayStr(),JSON.stringify(log)); }

function renderFoodPanel(){
  const wrap=document.getElementById('food-content'); if(!wrap) return;
  const s=getSettings();
  const log=getFoodLog();
  const totals=log.reduce((acc,e)=>({cal:acc.cal+e.cal,p:acc.p+e.p,c:acc.c+e.c,f:acc.f+e.f}),{cal:0,p:0,c:0,f:0});
  const pct=(v,g)=>Math.min(100,(v/g)*100);
  const pGoal=Math.round(s.weight*2.5); const cGoal=Math.round((s.calories-pGoal*4-70*9)/4); const fGoal=70;

  wrap.innerHTML=`
  <div class="card">
    <div class="card-head"><h2>מעקב תזונה יומי — ${todayStr().split('-').reverse().join('/')}</h2></div>
    <div class="card-body">
      <div class="food-macro-bars">
        ${macroBar('קלוריות','kcal',totals.cal,s.calories,'linear-gradient(90deg,var(--red),#9333ea)')}
        ${macroBar('חלבון','g',totals.p,pGoal,'var(--blue)')}
        ${macroBar('פחמימות','g',totals.c,cGoal,'var(--yellow)')}
        ${macroBar('שומן','g',totals.f,fGoal,'var(--green)')}
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-head"><h2>הוסף מזון</h2></div>
    <div class="card-body">
      <div class="food-search-wrap">
        <input class="food-search" id="food-search" type="text" placeholder="חפש מזון... (לדוג׳ עוף, אורז, ביצה)" oninput="foodSearch(this.value)" autocomplete="off"/>
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
        <div style="flex:1"><div class="fle-name">${e.name}${e.qty!==1?` ×${e.qty}`:''}${e.unit?' '+e.unit:''}</div>
        <div class="fle-amount">${Math.round(e.cal)} קל׳ | <span style="color:var(--blue)">${Math.round(e.p)}g P</span> · <span style="color:var(--yellow)">${Math.round(e.c)}g C</span> · <span style="color:var(--green)">${Math.round(e.f)}g F</span></div></div>
        <button class="fle-del" onclick="deleteFoodEntry(${i})">✕</button>
      </div>`).join(''):'<div style="color:var(--muted);font-size:.85rem;padding:6px 0;">לא נוסף עדיין מזון להיום</div>'}
    </div>
  </div>`;
}

function macroBar(label,unit,cur,goal,color){
  const pct=Math.min(100,(cur/goal)*100);
  const over=cur>goal;
  return `<div class="fmb-row">
    <div class="fmb-top"><span class="fmb-label">${label}</span><span class="fmb-vals">${Math.round(cur)} / ${goal} ${unit} ${over?'<span style="color:var(--red);font-weight:700;">✓ חרגת</span>':''}</span></div>
    <div class="fmb-track"><div class="fmb-fill${over?' fmb-over':''}" style="width:${pct}%;background:${color};"></div></div>
  </div>`;
}

function foodSearch(q){
  const dd=document.getElementById('food-dropdown');
  if(!q||q.length<1){dd.classList.remove('show');return;}
  const matches=FOODS.filter(f=>f.name.includes(q)||f.name.toLowerCase().includes(q.toLowerCase())).slice(0,8);
  if(!matches.length){dd.classList.remove('show');return;}
  dd.innerHTML=matches.map((f,i)=>`<div class="food-option" onclick="selectFood(${FOODS.indexOf(f)})">
    ${f.name}<div class="fo-macros">${f.cal} קל׳ · P${f.p}g · C${f.c}g · F${f.f}g</div></div>`).join('');
  dd.classList.add('show');
}

function selectFood(idx){
  _selectedFood=FOODS[idx];
  document.getElementById('food-search').value=_selectedFood.name;
  document.getElementById('food-dropdown').classList.remove('show');
  document.getElementById('food-selected-name').textContent=_selectedFood.name;
  document.getElementById('food-selected-wrap').style.display='block';
  document.getElementById('food-qty-label').textContent='מנות';
  updateFoodPreview();
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
  if(!name||!cal) return;
  const log=getFoodLog();
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
  const s=getSettings();
  const apiKey=localStorage.getItem('proFit_apiKey')||'';
  const foodLog=getFoodLog();
  const totals=foodLog.reduce((a,e)=>({cal:a.cal+e.cal,p:a.p+e.p}),{cal:0,p:0});

  wrap.innerHTML=`
  <div class="card">
    <div class="card-head"><h2>יועץ תזונה AI — Claude</h2><span class="badge badge-purple">Powered by Claude</span></div>
    <div class="card-body">
      ${!apiKey?`<div class="api-key-notice">
        כדי להשתמש ביועץ AI, הכנס את מפתח ה-API שלך מ-<a href="https://console.anthropic.com" target="_blank">console.anthropic.com</a> בהגדרות.<br>
        <button style="margin-top:8px;background:var(--blue);border:none;color:#fff;border-radius:8px;padding:7px 16px;cursor:pointer;font-family:var(--font);font-size:.83rem;font-weight:700;" onclick="showPanel('settings')">פתח הגדרות</button>
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
  const GOAL_HE={lean_bulk:'Lean Bulk — עליית מסה נקייה',bulk:'מסה מקסימלית',cut:'הורדת שומן עם שמירת שריר',maintain:'שמירה על המשקל הנוכחי'};
  const cholNote=u.cholesterol?'\n- ⚠️ בעיית כולסטרול: הימנע משומן רווי. מקורות שומן רק מבלתי רווי (זית, אבוקדו, אגוזים, דגים שמנים). כשמציע מזון — בדוק שידידותי לכולסטרול.':'';
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
    const reply=data.content?.[0]?.text||'מצטער, לא הצלחתי לקבל תשובה.';
    _chatHistory.push({role:'assistant',content:reply});
  }catch(err){
    const offline=offlineAnswer(_chatHistory[_chatHistory.length-1]?.content||'');
    _chatHistory.push({role:'assistant',content:offline});
  }
  renderChatPanel();
}

// ═══════════════════════════════════════════════════
// F10 — OFFLINE AI FALLBACK
// ═══════════════════════════════════════════════════
const OFFLINE_QA=[
  {k:['חלבון','protein','ביצים','עוף'],a:'לבניית שריר אתה צריך 2–2.5 גרם חלבון לכל ק"ג גוף. המקורות הטובים: חזה עוף, דגים, ביצים, יוגורט יווני, קוטג׳, Whey. פזר על פני כל הארוחות — הגוף לא יכול לספוג הכל בפעם אחת.'},
  {k:['שינה','sleep','עייפות'],a:'שינה היא הסאפלמנט הכי זול ויעיל. בשינה מופרש הורמון גדילה שבונה שריר. מטרה: 7–9 שעות. גוף ישן = גוף שמתאושש. אם מתקשה לישון: הורד קפאין אחרי 14:00, שמור על טמפרטורה קרירה.'},
  {k:['כאב שריר','DOMS','כאב','כואב'],a:'כאב שריר מאוחר (DOMS) — תגובה נורמלית לגירוי חדש. נעלם אחרי 48–72 שעות. לא חייב לכאוב בשביל לגדול. אם הכאב חד ופתאומי — עצור. מה עוזר: חום, מגנזיום, מסז׳, הליכה קלה.'},
  {k:['קריאטין','creatine'],a:'קריאטין מונוהידרט — אחד מהסאפלמנטים הכי מוכחים מחקרית. 3–5 גרם ביום, לא צריך loading phase. מגביר כוח ונפח שריר. בטוח לשימוש ארוך טווח. שתה הרבה מים.'},
  {k:['פחמימות','carb','קארב','אורז','לחם'],a:'פחמימות הן דלק לשרירים. לפני אימון — אורז, בטטה, שיבולת שועל. אחרי אימון — בננה + Whey. לא אויב, חלק חיוני. בגרעון: הורד פחמימות, שמור חלבון גבוה.'},
  {k:['שומן','fat','אבוקדו','שמן'],a:'שומן חיוני לייצור הורמונים כולל טסטוסטרון. מטרה: 25–30% מהקלוריות. מקורות טובים: אבוקדו, אגוזי מלך, שמן זית, סלמון. הימנע משומן טרנס (מזון מעובד).'},
  {k:['קלוריות','calories','אכילה','לאכול','כמה לאכול'],a:'לבניית שריר (Lean Bulk): TDEE + 300–400 קלוריות. לירידת שומן (Cut): TDEE - 400 קלוריות. TDEE = BMR × רמת פעילות. הדשבורד מחשב את זה עבורך אוטומטית בהתאם לפרופיל.'},
  {k:['whey','ויי','אבקת חלבון','אבקה'],a:'Whey Isolate נספג מהר — אידיאלי 30 דק׳ אחרי אימון. Casein נספג לאט — טוב לפני שינה. לא חובה, אבל עוזר לעמוד ביעד החלבון. בחר Isolate אם יש רגישות ללקטוז.'},
  {k:['סקוואט','squat','רגליים'],a:'הסקוואט הוא מלך תרגילי הרגליים. טכניקה: גב ישר, חזה למעלה, ברכיים בכיוון בהונות, ירידה עד 90°. אם הגב סובל — נסה Goblet Squat לתיקון טכניקה.'},
  {k:['לחיצת חזה','bench','bench press','חזה'],a:'Bench Press: שכב על ספסל, מוט ברוחב כתפיים+, שכמות מקובצות. הורד לחזה התחתון (לא לצוואר), דחוף. להגדלת חזה עליון — Incline press חיוני.'},
  {k:['מנוחה','recovery','ריקוורי'],a:'שריר גדל בזמן מנוחה, לא בזמן אימון. קבוצת שריר צריכה 48–72 שעות מנוחה. לכן PPLA מחולק נכון — כל קבוצה פעם בשבוע עם מנוחה מלאה.'},
  {k:['חימום','warmup','להתחמם'],a:'חימום 5–7 דקות לפני כל אימון: קפיצות + סיבובי מפרקים + תרגיל קל בטכניקה. חימום מוריד סיכון לפציעה ב-30% ומשפר ביצועים. בכל פאנל יש כרטיס חימום מפורט.'},
  {k:['אינטרמיטנט','IF','צום','16:8'],a:'Intermittent Fasting (16:8) עובד לירידת שומן כי מקל על יצירת גרעון קלורי. לבניית מסה — פחות אידיאלי. חשוב: לאכול מספיק חלבון בחלון האכילה. לא קסם — פשוט כלי.'},
  {k:['כולסטרול','LDL','HDL'],a:'להורדת כולסטרול תוך כדי אימון: הגדל אומגה 3 (סלמון, אגוזי מלך), שיבולת שועל (Beta-Glucan), שמן זית. הפחת בשר אדום ומוצרי חלב שמנים. HDL עולה עם אירובי.'},
  {k:['השמנה','שומן בבטן','בטן','להשמין'],a:'שומן בבטן מוריד עם גרעון קלורי + אימוני כוח + שינה. אין "ממקד" — לא ניתן לאבד שומן רק מבטן. Cardio עוזר לגרעון. 80% מהתוצאה היא מהתזונה.'},
  {k:['ויטמינים','vitamin','D3','מגנזיום','zinc'],a:'ויטמינים חיוניים לספורטאי: D3 (1000–2000 IU), מגנזיום גליצינאט (200–400 מ"ג לפני שינה), Zinc (25 מ"ג), אומגה 3 (2–3 גרם EPA+DHA). בדוק ערכי דם.'},
  {k:['Lean Bulk','לין בולק','בניית מסה','להגדיל'],a:'Lean Bulk = עודף קטן של 300–400 קלוריות. קצב: 0.5–1 ק"ג בחודש. לאט, אך רוב העלייה הוא שריר. מיקס: 80% מזון אמיתי + 20% גמישות. הניטור הוא המפתח.'},
  {k:['Cut','קאט','לרזות','ירידה'],a:'Cut = גרעון של 400–500 קלוריות. שמור חלבון גבוה (2.5 גרם/ק"ג) לשמירת שריר. הוסף 20–30 דק׳ Cardio × 3 בשבוע. קצב אידיאלי: 0.5–1 ק"ג שבועי.'},
  {k:['Bulk','מסה','bulking'],a:'Bulk = עודף גדול של 500–700 קלוריות. גדילה מהירה יותר אבל עם יותר שומן. אחרי 3–4 חודשי Bulk — עבור ל-Cut לחשוף את השריר. מחזוריות היא המפתח.'},
  {k:['מדידות','התקדמות','progress','כמה עלה'],a:'מד התקדמות נכון: שקול עצמך שבועי (בבוקר, בצום). מדוד גם היקפי שריר (חזה, זרוע, ירך). לפעמים המשקל לא עולה אבל האחוז שומן יורד — זה בסדר. השתמש בגרף ההתקדמות.'},
  {k:['אמות','forearms','אחיזה','grip'],a:'Forearms עובדים כמה שבוע? 3–4 פעמים. תרגילים: Wrist Curl, Reverse Wrist Curl, Farmer Walk. גם מתחים ולחיצות מכשירים את האחיזה. בפאנל ARMS כבר יש חלק Forearms מפורט.'},
  {k:['בטן','core','abs','קיטוע'],a:'בטן מתאמנת 3× בשבוע בסוף Push/Legs/Arms. תרגילים: Plank, Crunches, Leg Raises, Russian Twists. בטן מתגלה כשאחוז השומן נמוך — תזונה היא 80% מהמשוואה.'},
  {k:['supplement','סאפלמנטים','תוספים'],a:'סאפלמנטים לפי עדיפות: 1) קריאטין מונוהידרט 3-5g, 2) Whey Protein (אם קשה לעמוד ביעד), 3) D3 1000IU, 4) מגנזיום גליצינאט, 5) אומגה 3. שאר — שיווק.'},
  {k:['Push','PUSH','חזה','לחיצה'],a:'Push Day: חזה → כתפיים → טריצפס. הסדר חשוב! עצב שניה כשהגוף טרי. Bench Press → Incline → Overhead Press → טריצפס. מנוחה 2–3 דק׳ בין סטים כבדים.'},
  {k:['Pull','PULL','גב','מתח'],a:'Pull Day: גב → בייסס → כתף אחורית. מתח / לט פולדאון → חתירה → Face Pull → כפיפות. גב חזק = יציבה טובה + פחות כאבי גב.'},
  {k:['Progressive Overload','עומס','להתקדם'],a:'Progressive Overload = הוספת עומס בהדרגה. כל שבועיים-שלושה: הוסף 2.5 ק"ג או חזרה נוספת. זה עיקרון הגדילה. בלי זה — הגוף לא מגיב. יומן המשקלים הוא הכלי.'},
  {k:['overtraining','אוברטריינינג','יתר'],a:'סימני אוברטריינינג: ירידה בביצועים, עייפות כרונית, עצבנות, נדודי שינה. הפתרון: שבוע דה-לוד — אותן תנועות, 40% פחות משקל.'},
];
function offlineAnswer(q){
  if(!q) return 'אין חיבור לאינטרנט. נסה שוב מאוחר יותר. (תשובה מקומית)';
  const lower=q.toLowerCase();
  for(const qa of OFFLINE_QA){
    if(qa.k.some(k=>lower.includes(k.toLowerCase()))) return qa.a;
  }
  return 'אני יועץ הכושר שלך גם ללא אינטרנט 💪 שאל על: חלבון, שינה, קריאטין, פחמימות, קלוריות, DOMS, חימום, Lean Bulk, Cut, Bulk, מנוחה, אמות, בטן, ויטמינים, Progressive Overload.';
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
  {id:0,title:'100 שכיבות סמיכה',desc:'צבור 100 שכיבות סמיכה מצטברות השבוע',target:100,unit:'חזרות',icon:'💥',step:10},
  {id:1,title:'Volume King',desc:'הרם סה"כ 5,000 ק"ג מצטבר השבוע',target:5000,unit:'ק"ג',icon:'⚡',step:250},
  {id:2,title:'4 אימונים השבוע',desc:'השלם 4 אימונים שלמים השבוע',target:4,unit:'אימונים',icon:'🏆',step:1},
  {id:3,title:'PR חדש',desc:'שבר שיא אישי באחד התרגילים',target:1,unit:'PR',icon:'🎯',step:1},
  {id:4,title:'100 חזרות סקוואט',desc:'צבור 100 חזרות סקוואט השבוע',target:100,unit:'חזרות',icon:'🦵',step:10},
  {id:5,title:'שבוע מלא תזונה',desc:'הוסף רישום תזונה 5 ימים השבוע',target:5,unit:'ימים',icon:'🥗',step:1},
  {id:6,title:'Dead-Pull Challenge',desc:'100 חזרות משיכות / Lat Pulldown מצטבר',target:100,unit:'חזרות',icon:'💪',step:10},
  {id:7,title:'מנוחה 0 שכחה',desc:'השתמש בטיימר מנוחה 10 פעמים השבוע',target:10,unit:'פעמים',icon:'⏱',step:1},
  {id:8,title:'Arm Day Blitz',desc:'200 חזרות כולל לבייסס + טריצפס השבוע',target:200,unit:'חזרות',icon:'🔥',step:20},
  {id:9,title:'3,000 קלוריות',desc:'רשום 3 ימים עם יעד קלורי מלא',target:3,unit:'ימים',icon:'⚡',step:1},
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
  const boss=getCurrentBoss();
  const prog=getBossProgress();
  const done=prog>=boss.target;
  const pct=Math.min(Math.round((prog/boss.target)*100),100);
  const wk=new Date().getFullYear()+' שבוע '+getISOWeek();
  document.getElementById('boss-week-tag').textContent='אתגר השבוע — '+wk;
  document.getElementById('boss-title').textContent=boss.title;
  document.getElementById('boss-desc').textContent=boss.desc;
  document.getElementById('boss-icon').textContent=boss.icon;
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
    val.textContent='~'+orm+' ק"ג';
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
    chest:done.push?'rgba(255,55,95,.55)':'rgba(255,255,255,.06)',
    shoulders:done.push||done.arms?'rgba(255,214,10,.45)':'rgba(255,255,255,.06)',
    biceps:done.pull||done.arms?'rgba(90,200,250,.5)':'rgba(255,255,255,.06)',
    triceps:done.push||done.arms?'rgba(191,90,242,.5)':'rgba(255,255,255,.06)',
    quads:done.legs?'rgba(191,90,242,.55)':'rgba(255,255,255,.06)',
    calves:done.legs?'rgba(48,209,88,.45)':'rgba(255,255,255,.06)',
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
let _gymPendingSetKey=null; // key for elog when saving set
let _gymPendingSetIdx=0;

function startGymMode(panelName,label,color){
  const panel=document.getElementById('panel-'+panelName);
  if(!panel) return;
  const rows=panel.querySelectorAll('.ex-table tbody tr[onclick]');
  _gymExercises=Array.from(rows).map(tr=>({
    name:tr.querySelector('.ex-name-main')?.textContent?.trim()||'תרגיל',
    nameEn:tr.querySelector('.ex-name-en')?.textContent?.trim()||'',
    sets:tr.querySelector('.sets-cell')?.textContent?.trim()||'3×10',
    muscle:tr.querySelector('.muscle-tag')?.textContent?.trim()||'',
    key:tr.getAttribute('onclick')?.match(/openModal\('(\w+)'\)/)?.[1]||null
  })).filter(e=>e.name&&e.sets);
  if(!_gymExercises.length){ showToast('לא נמצאו תרגילים'); return; }
  _gymIdx=0; _gymColor=color.trim(); _gymLabel=label;
  const badge=document.getElementById('gym-badge');
  if(badge){badge.textContent=label;badge.style.color=_gymColor;badge.style.borderColor=_gymColor;}
  renderGymExercise();
  document.getElementById('gym-overlay').classList.add('open');
  document.body.style.overflow='hidden';
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
function renderGymExercise(){
  const body=document.getElementById('gym-body');
  const prev=document.getElementById('gym-prev');
  const next=document.getElementById('gym-next');
  if(_gymIdx>=_gymExercises.length){
    // Done screen
    body.innerHTML=`<div class="gym-done-screen">
      <div class="gym-done-title">DONE</div>
      <div class="gym-done-sub">האימון הושלם!<br>הגוף שלך מתחזק.</div>
      <div class="gym-done-xp">+50 XP</div>
      <button class="gym-nav-btn next" onclick="closeGymMode()" style="max-width:200px">סגור</button>
    </div>`;
    if(prev) prev.style.display='none';
    if(next) next.style.display='none';
    addXP(50);
    if(navigator.vibrate) navigator.vibrate([200,100,200]);
    return;
  }
  const ex=_gymExercises[_gymIdx];
  // Parse sets count from sets string e.g. "4×8–10" → 4
  const setsCount=parseInt(ex.sets)||3;
  // Get current check state from workout log
  const today=todayStr(); const log=getLog();
  const key=ex.name;
  const checks=Array.from({length:setsCount},(_,i)=>log[today]?.[key]?.[i]||false);
  const checksHTML=checks.map((done,i)=>`
    <div class="gym-check${done?' done':''}" id="gym-chk-${i}" onclick="gymCheckSet(${i})">${done?'✓':''}</div>`).join('');
  body.innerHTML=`
    <div class="gym-counter">תרגיל ${_gymIdx+1} מתוך ${_gymExercises.length}</div>
    <div class="gym-name" style="color:${_gymColor}">${ex.name}</div>
    ${ex.nameEn?`<div class="gym-name-en">${ex.nameEn}</div>`:''}
    ${ex.muscle?`<div class="gym-muscle-tag">${ex.muscle}</div>`:''}
    <div class="gym-sets-label">${ex.sets}</div>
    <div class="gym-checks">${checksHTML}</div>`;
  if(prev) prev.disabled=_gymIdx===0;
  if(next){ next.textContent=_gymIdx>=_gymExercises.length-1?'סיים האימון':'הבא →'; }
}
function gymCheckSet(i){
  const el=document.getElementById('gym-chk-'+i);
  if(!el) return;
  const alreadyDone=el.classList.contains('done');
  if(alreadyDone){
    // Uncheck
    el.classList.remove('done'); el.textContent=''; el.style.background='';
    return;
  }
  // Mark done visually
  el.classList.add('done'); el.textContent='✓'; el.style.background=_gymColor;
  if(navigator.vibrate) navigator.vibrate(30);
  // Update workout log
  const ex=_gymExercises[_gymIdx];
  const today=todayStr(); const l=getLog();
  if(!l[today]) l[today]={}; if(!l[today][ex.name]) l[today][ex.name]={};
  l[today][ex.name][i]=true; saveLog(l);
  // Auto-start rest timer (remember last)
  setTimeout(()=>{ if(typeof pickTimer==='function') pickTimer(_lastTimerSec||90); },400);
  // Start tempo if on
  if(_tempoOn) speakTempo();
  // Open set weight/reps popup
  if(ex.key) setTimeout(()=>openGymSetPopup(ex.key,i),600);
}
function gymNext(){
  if(_gymIdx<_gymExercises.length) _gymIdx++;
  renderGymExercise();
}
function gymPrev(){
  if(_gymIdx>0) _gymIdx--;
  renderGymExercise();
}
function closeGymMode(){
  document.getElementById('gym-overlay').classList.remove('open');
  document.getElementById('gym-set-popup')?.classList.remove('show');
  document.body.style.overflow='';
  if(_tempoTimer){ clearTimeout(_tempoTimer); _tempoTimer=null; }
  if(_gymStopwatchIv){ clearInterval(_gymStopwatchIv); _gymStopwatchIv=null; }
  window.speechSynthesis?.cancel();
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
  if(_gymPendingSetKey && !isNaN(kg) && !isNaN(reps) && kg>0 && reps>0){
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
  if(btn){ btn.textContent='קצב '+(_tempoOn?'ON':'OFF'); btn.classList.toggle('on',_tempoOn); }
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
  g.addColorStop(0,'rgba(255,55,95,.18)'); g.addColorStop(1,'rgba(191,90,242,.12)');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  // Border
  ctx.strokeStyle='rgba(255,255,255,.1)'; ctx.lineWidth=1; ctx.strokeRect(.5,.5,W-1,H-1);
  // Logo
  ctx.font='900 32px "Barlow Condensed",sans-serif';
  ctx.fillStyle='#FF375F'; ctx.textAlign='right'; ctx.fillText('ProFit',W-28,48);
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
    ctx.font='700 22px "Barlow Condensed",sans-serif'; ctx.fillStyle='#FF375F';
    ctx.fillText(st.val,x,y);
    ctx.font='400 11px Barlow,sans-serif'; ctx.fillStyle='rgba(255,255,255,.45)';
    ctx.fillText(st.label,x,y+13);
  });
  // Left side — week grid
  ctx.textAlign='left';
  ctx.font='900 13px "Barlow Condensed",sans-serif'; ctx.fillStyle='rgba(255,255,255,.3)';
  ctx.fillText('השבוע שלך',28,138);
  const workouts=['PUSH','PULL','REST','LEGS','ARMS','REST','REST'];
  const colors=['#FF375F','#5AC8FA','#333','#BF5AF2','#FFD60A','#333','#333'];
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
  a.download='proFit-stats.png'; a.href=canvas.toDataURL('image/png');
  a.click();
}
async function nativeShare(){
  const canvas=document.getElementById('share-canvas');
  canvas.toBlob(async blob=>{
    const file=new File([blob],'proFit-stats.png',{type:'image/png'});
    try{ await navigator.share({files:[file],title:'ProFit Stats',text:'הסטטיסטיקות שלי ב-ProFit'}); }
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
  initNotifCard();
  renderMeasurements();
  setTimeout(injectOverloadBadges, 300);
});

// ═══════════════════════════════════════════════════
// LIGHT / DARK THEME
// ═══════════════════════════════════════════════════
function initTheme(){
  const t=localStorage.getItem('pf_theme')||'dark';
  applyTheme(t);
}
function applyTheme(t){
  document.documentElement.setAttribute('data-theme',t==='light'?'light':'');
  const btn=document.getElementById('theme-btn');
  if(btn) btn.textContent=t==='light'?'🌙':'☀️';
  localStorage.setItem('pf_theme',t);
}
function toggleTheme(){
  const cur=localStorage.getItem('pf_theme')||'dark';
  applyTheme(cur==='dark'?'light':'dark');
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
  const colors=['#FF375F','#30D158','#FFD60A','#BF5AF2','#5AC8FA','#FF9F0A','#fff'];
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
    <span class="meas-date">${m.date}</span>
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
  const today=todayStr();
  const rpe=JSON.parse(localStorage.getItem(RPE_KEY)||'{}');
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
  if(!card||!btn) return;
  if(!('Notification' in window)){ card.style.display='none'; return; }
  if(Notification.permission==='granted'){ btn.textContent='פעיל ✓'; btn.disabled=true; }
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
    if(days[today]) new Notification('ProFit — יום אימון!',{
      body:`היום יום ${days[today]} — זמן אימון. בוא נתחיל!`,
      icon:'/fitness_app/icons/icon-192.png',
      badge:'/fitness_app/icons/icon-72.png'
    });
  } else if(perm==='denied'){
    document.getElementById('notif-card')?.classList.add('display:none');
  }
}
