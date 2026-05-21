// Pure utility functions — extracted for testing
// These are also defined globally in app.js

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

// computeStreak is NOT exported — it reads localStorage and TRAIN_DAYS global,
// making it impure and untestable in a node environment.
