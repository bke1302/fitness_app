// The catalogue, read straight out of app.js. Shared by every audit so they all
// reason about exactly what ships.
import { slice, heavy } from './from-app.mjs';
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
/** "Costs enough recovery already" — the app's own _isHeavyCompound, sliced
 *  out of app.js rather than restated. This is the predicate setsToday uses to
 *  decide which exercises do NOT receive the extra set in weeks 2 and 3, so an
 *  audit reasoning about volume has to use exactly it.
 *
 *  It used to be written here as `restSec(rest) >= 120 && repMin <= 8` under a
 *  comment claiming it was the app's definition. It was not: it had neither the
 *  early false on בידוד/קל nor the early true on כבד, so it disagreed with the
 *  app on ohp, hipThrust, dbFloorPress, dbRow and dbRdl — five entries whose
 *  lvl says כבד in words. That is why two separate measurements of the week-2
 *  volume came back with different numbers. */
export const isHeavy = ex => heavy(ex);

/** "Demands to go first" — a different question, and the reason the line above
 *  looked right for so long.
 *
 *  The order rules ask whether a lift needs maximal freshness, not whether it
 *  is expensive to recover from. Those come apart: a dumbbell row at 4×8–12
 *  with 90 s rest is heavy enough that adding a set to it is a bad trade, and
 *  nowhere near demanding enough to claim position 1. Feeding the order rules
 *  the recovery-cost predicate made them fire on press-then-row in an upper
 *  day and on a hip thrust finishing a leg day — both of which are textbook.
 *
 *  Rest and rep range are what encode "limited by maximal capacity": two
 *  minutes or more between sets, and a bottom of the range at 8 or below. */
export const demandsFirst = ex => restSec(ex?.rest) >= 120 && repMin(ex) <= 8;
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
