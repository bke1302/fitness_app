// Read the real functions out of app.js.
//
// The tests used to import from src/pure.js, a hand-copied shadow of these
// functions that nothing in the app imported. It drifted: by October it still
// asserted the frozen calorie target and the flat 2.5 g/kg protein that app.js
// had stopped doing in September, so 43 green tests were certifying a bug.
//
// app.js cannot simply be imported — it touches the DOM as it loads — so the
// functions under test are sliced out of the source and evaluated on their own.
// They are pure: numbers and strings in, numbers and strings out. There is no
// second copy to keep in sync, and a test can only ever go green against the
// code that actually ships.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
export const APP_SRC = readFileSync(join(ROOT, 'app.js'), 'utf8');
const BS = String.fromCharCode(92);

/** Slice one brace-balanced declaration out of the source, from `marker` to the
 *  closing brace of its first `{`. Quotes are tracked so a brace inside a
 *  string cannot end the slice early. */
export function slice(marker) {
  const s = APP_SRC.indexOf(marker);
  if (s < 0) throw new Error('not found in app.js: ' + marker);
  const b = APP_SRC.indexOf('{', s);
  let d = 0, i = b, q = null, p = '';
  for (; i < APP_SRC.length; i++) {
    const c = APP_SRC[i];
    if (q) {
      if (c === BS && p !== BS) { p = c; continue; }
      if (c === q && p !== BS) q = null;
    } else {
      if (c === "'" || c === '"' || c === '`') q = c;
      else if (c === '{') d++;
      else if (c === '}') { d--; if (!d) { i++; break; } }
    }
    p = c;
  }
  return APP_SRC.slice(s, i);
}

/** Evaluate the named declarations together and hand back their values, so a
 *  function that calls a sibling still works. */
export function load(markers, names) {
  const body = markers.map(slice).join('\n');
  // eslint-disable-next-line no-new-func
  return new Function(body + '\nreturn {' + names.join(',') + '};')();
}

export const app = load(
  ['function calcNutrition(u){', 'function _repRange(ex){', 'const CONFIG = {',
   'function _setCount(str){', 'function _restSec(str){'],
  ['calcNutrition', '_repRange', 'CONFIG', '_setCount', '_restSec']
);
