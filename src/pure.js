// Pure utility functions — extracted for testing
// These are also defined globally in app.js

export const CONFIG = {
  WATER_GOAL: 10,
  MAX_ELOG_ENTRIES: 15,
  SPARKLINE_SESSIONS: 6,
  COACH_STAGNATION: 4,
  COACH_INCREASE_MIN: 2,
  GYM_TIMER_CIRC: 2 * Math.PI * 38,
  TIMER_DEFAULT_SEC: 90,
  CONFETTI_PARTICLES: 90,
  CONFETTI_DURATION: 3200,
};

export function calcNutrition(u){
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

export function _parseRepRange(setsStr){
  const m=(setsStr||'').match(/\d+[×xX](\d+)(?:[–\-](\d+))?/);
  if(!m) return {min:8,max:12};
  return {min:parseInt(m[1]),max:parseInt(m[2]||m[1])};
}

/**
 * Pure version of _buildSparkline — accepts data directly instead of reading getElog()
 * @param {Array} hist - array of {kg, reps, date} objects (newest first)
 * @param {number} sessions - max sessions to use
 * @returns {string} SVG HTML or ''
 */
export function _buildSparklineFromData(hist, sessions=6){
  const data=(hist||[]).slice(0,sessions).reverse();
  if(data.length<2) return '';
  const W=60,H=20,P=2;
  const vals=data.map(e=>e.kg||0);
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
