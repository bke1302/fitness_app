// The catalogue, read straight out of app.js. Shared by every audit so they all
// reason about exactly what ships.
import { slice } from './from-app.mjs';
export const EX = (0, eval)('(' + slice('const EX = {').replace(/^const EX = /, '') + ')');
export const PLANS = (0, eval)('(' + slice('const WORKOUT_PLANS={').replace(/^const WORKOUT_PLANS=/, '') + ')');

export const setCount = ex => { const m = String(ex?.sets || '').match(/^\s*(\d+)/); return m ? +m[1] : 3; };
export const restSec = r => {
  if (typeof r === 'number') return r;
  const s = String(r || ''), n = (s.match(/\d+(?:\.\d+)?/g) || []).map(Number);
  if (!n.length) return 75;
  const avg = n.reduce((a, b) => a + b, 0) / n.length;
  return /דק/.test(s) ? avg * 60 : avg;
};
export const repMin = ex => {
  const s = String(ex?.sets || '');
  if (/כישלון|שנ׳|שניות/.test(s)) return 99;
  const m = s.match(/\d+\s*[×xX]\s*(\d+)/);
  return m ? +m[1] : 10;
};
// The app's own definition, so audits and the progression engine agree.
export const isHeavy = ex => restSec(ex?.rest) >= 120 && repMin(ex) <= 8;
export const isCompound = ex => {
  const lvl = typeof ex?.lvl === 'number' ? '' : String(ex?.lvl || '');
  if (/בידוד/.test(lvl)) return false;
  return restSec(ex?.rest) >= 90 || repMin(ex) <= 10;
};
/** The muscle a swap or a comparison has to preserve. Order matters: a category
 *  naming two muscles is filed under the one the movement is really for. */
export const FAM = c => {
  const s = String(c || '');
  if (/ליבה|בטן/.test(s)) return 'ליבה';
  if (/שוק/.test(s)) return 'שוק';
  if (/מקרב/.test(s)) return 'מקרבים';
  if (/ירך אחורי|כל הגוף/.test(s)) return 'ירך אחורי';
  if (/ארבע ראשי|ירכיים|כל הרגל/.test(s)) return 'ארבע ראשי';
  if (/ישבן/.test(s)) return 'ישבן';
  if (/חזה/.test(s)) return 'חזה';
  if (/גב/.test(s)) return 'גב';
  if (/כתף|כתפיים/.test(s)) return 'כתפיים';
  if (/טריצפס/.test(s)) return 'טריצפס';
  if (/בייסס|בראכ/.test(s)) return 'יד קדמית';
  if (/אמות|אחיזה/.test(s)) return 'אמות';
  return s;
};
/** How many times a week each day template actually runs. _buildDayCfg assigns
 *  days[i % days.length] to dows[i], so a 3-template plan on 6 days runs each
 *  template twice — the mechanic that made earlier counts read low. */
export const weekFreq = plan => {
  const dows = plan.dows || [0, 1, 3, 4], days = plan.days || [];
  return days.map((_, i) => dows.filter((__, j) => j % days.length === i).length);
};
