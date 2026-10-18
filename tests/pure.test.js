// Node's built-in test runner, deliberately: a static HTML app should not need
// a package registry to be reachable before anyone can check its arithmetic.
// The cloud agent's environment blocks npmjs, so vitest could not install and
// the entire suite was unrunnable there — including the audits, which never
// needed a dependency at all.
//
// These run against the functions sliced out of app.js, not a copy of them.
// The previous version imported src/pure.js, which had drifted a month behind
// and was asserting two bugs as correct behaviour.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { app } from './from-app.mjs';

const { calcNutrition, _repRange, _setCount, _restSec, CONFIG } = app;
const LIFTER = { weight: 78, height: 178, age: 31, gender: 'm', activity: 1.55 };

// ── the target follows the lifter ────────────────────────────────────────────
test('recomputes the target instead of trusting a stored one', () => {
  // u.calories is written once, at sign-up. If it wins unconditionally the
  // target freezes and never follows a changing bodyweight.
  const stale = calcNutrition({ ...LIFTER, goal: 'lean_bulk', calories: 9999 });
  assert.equal(stale.target, stale.auto);
});

test('honours a target the lifter typed themselves', () => {
  const manual = calcNutrition({ ...LIFTER, goal: 'lean_bulk', calories: 2600, calories_manual: true });
  assert.equal(manual.target, 2600);
});

test('follows bodyweight upward', () => {
  const a = calcNutrition({ ...LIFTER, goal: 'lean_bulk' });
  const b = calcNutrition({ ...LIFTER, weight: 90, goal: 'lean_bulk' });
  assert.ok(b.target > a.target, b.target + ' should exceed ' + a.target);
});

test('never drops below the 1200 floor', () => {
  const tiny = calcNutrition({ weight: 38, height: 140, age: 80, gender: 'f', activity: 1.2, goal: 'cut' });
  assert.ok(tiny.target >= 1200, 'got ' + tiny.target);
});

// ── macros follow the goal ───────────────────────────────────────────────────
test('gives a deficit more protein than a surplus', () => {
  const cut = calcNutrition({ ...LIFTER, goal: 'cut' });
  const bulk = calcNutrition({ ...LIFTER, goal: 'lean_bulk' });
  assert.ok(cut.gPerKg > bulk.gPerKg);
  assert.ok(cut.protein > bulk.protein);
});

test('keeps protein inside the evidence range, 1.6 to 2.8 g/kg', () => {
  for (const goal of ['lean_bulk', 'bulk', 'cut', 'maintain']) {
    const perKg = calcNutrition({ ...LIFTER, goal }).protein / LIFTER.weight;
    assert.ok(perKg >= 1.6 && perKg <= 2.8, goal + ' gave ' + perKg.toFixed(2) + ' g/kg');
  }
});

test('holds fat at or above 0.8 g/kg even on a deep cut', () => {
  const n = calcNutrition({ ...LIFTER, goal: 'cut' });
  assert.ok(n.fat >= Math.round(LIFTER.weight * 0.8), 'got ' + n.fat + 'g');
});

// This used to assert only `carbs >= 0`, and so went green on precisely the
// input that was broken: the clamp at zero hid three macros that summed to
// 13.7% ABOVE the target printed on the same card.
test('the extreme profile that used to overflow now balances', () => {
  const n = calcNutrition({ weight: 150, height: 170, age: 60, gender: 'm', activity: 1.2, goal: 'cut' });
  assert.ok(n.carbs > 5, 'carbohydrate collapsed to ' + n.carbs + 'g');
  const kcal = n.protein * 4 + n.carbs * 4 + n.fat * 9;
  assert.ok(kcal <= n.target * 1.02, kcal + ' kcal of macros against a ' + n.target + ' target');
});

test('macros account for the target within 5 percent', () => {
  const n = calcNutrition({ ...LIFTER, goal: 'lean_bulk' });
  const kcal = n.protein * 4 + n.carbs * 4 + n.fat * 9;
  assert.ok(Math.abs(kcal - n.target) / n.target < 0.05, kcal + ' vs ' + n.target);
});

test('cut is below bulk, bulk is above maintain', () => {
  const cut = calcNutrition({ ...LIFTER, goal: 'cut' });
  const bulk = calcNutrition({ ...LIFTER, goal: 'bulk' });
  const maintain = calcNutrition({ ...LIFTER, goal: 'maintain' });
  assert.ok(cut.target < bulk.target);
  assert.ok(bulk.target > maintain.target);
});

// ── survives partial input ───────────────────────────────────────────────────
test('a male burns more than a female at identical stats', () => {
  const m = calcNutrition({ ...LIFTER, gender: 'm', goal: 'maintain' });
  const f = calcNutrition({ ...LIFTER, gender: 'f', goal: 'maintain' });
  assert.ok(m.bmr > f.bmr);
});

test('an empty object still produces usable numbers', () => {
  const n = calcNutrition({});
  for (const k of ['bmr', 'tdee', 'target', 'protein', 'carbs', 'fat'])
    assert.ok(Number.isFinite(n[k]), k + ' was ' + n[k]);
  assert.ok(n.target > 0);
});

// ── the whole input space, not one lifter ────────────────────────────────────
// Every assertion above runs a single profile, and that is how the macro
// squeeze survived: a rule that holds for a 78 kg male at 1.55 says nothing
// about a 68 kg woman at 155 cm, who was being handed 2 g of carbohydrate a
// day. These walk the space instead.
const GRID = [];
for (const weight of [38, 45, 52, 60, 68, 75, 78, 85, 92, 100, 110, 120, 130, 150])
  for (const height of [145, 155, 165, 175, 185, 195])
    for (const age of [18, 35, 55, 80])
      for (const gender of ['m', 'f'])
        for (const activity of [1.2, 1.375, 1.55, 1.725])
          for (const goal of ['cut', 'lean_bulk', 'bulk', 'maintain'])
            GRID.push({ weight, height, age, gender, activity, goal });

const show = u => u.weight + 'kg/' + u.height + 'cm ' + u.gender + ' ' + u.age + 'y act' + u.activity + ' ' + u.goal;
// Mirrors calcNutrition: per-kilo figures apply to this, not to scale weight.
const refWeight = u => Math.min(u.weight, Math.round(30 * Math.pow(u.height / 100, 2)));

test('the macros never add up to more than the target shown beside them', () => {
  for (const u of GRID) {
    const n = calcNutrition(u), kcal = n.protein * 4 + n.carbs * 4 + n.fat * 9;
    assert.ok(kcal <= n.target * 1.02,
      show(u) + ': ' + kcal + ' kcal of macros against a ' + n.target + ' target');
  }
});

test('carbohydrate is never squeezed out of the day', () => {
  for (const u of GRID) {
    const n = calcNutrition(u);
    assert.ok(n.carbs > 5, show(u) + ': ' + n.carbs + 'g of carbohydrate');
  }
});

test('protein never falls below 1.8 g/kg of the reference weight', () => {
  for (const u of GRID) {
    const perKg = calcNutrition(u).protein / refWeight(u);
    assert.ok(perKg >= 1.79, show(u) + ': ' + perKg.toFixed(2) + ' g/kg');
  }
});

test('fat never falls below the 0.6 g/kg hormonal floor', () => {
  for (const u of GRID) {
    const perKg = calcNutrition(u).fat / refWeight(u);
    assert.ok(perKg >= 0.59, show(u) + ': ' + perKg.toFixed(2) + ' g/kg');
  }
});

// The reference weight exists for the obese end of the range, where protein and
// fat priced per scale kilo crowded carbohydrate out of the day. It must not
// quietly reprice anyone of ordinary build, which is most of the users.
test('an untight lifter under BMI 30 keeps the full per-kilo allowance', () => {
  for (const u of GRID) {
    if (u.weight / Math.pow(u.height / 100, 2) > 30) continue;
    const n = calcNutrition(u);
    const fullProtein = Math.round(u.weight * n.gPerKg);
    const prefFat = Math.max(Math.round(u.weight * 0.8), Math.round(n.target * 0.27 / 9));
    // Skip the profiles the budget genuinely cannot hold — the assertions above
    // already cover what happens to those.
    if (fullProtein * 4 + prefFat * 9 + Math.round(n.target * 0.15 / 4) * 4 > n.target) continue;
    assert.equal(n.protein, fullProtein, show(u) + ' protein');
    assert.equal(n.fat, prefFat, show(u) + ' fat');
  }
});

// ── parsing what the catalogue writes ────────────────────────────────────────
test('_repRange reads a range', () => {
  assert.deepEqual(_repRange({ sets: '4×6–8' }), { min: 6, max: 8, mode: 'reps' });
});
test('_repRange reads a single number as both ends', () => {
  assert.deepEqual(_repRange({ sets: '3×12' }), { min: 12, max: 12, mode: 'reps' });
});
test('_repRange accepts a hyphen as well as an en dash', () => {
  assert.deepEqual(_repRange({ sets: '4×10-12' }), { min: 10, max: 12, mode: 'reps' });
});
test('_repRange accepts a capital X', () => {
  assert.deepEqual(_repRange({ sets: '3X12' }), { min: 12, max: 12, mode: 'reps' });
});
test('_repRange marks a timed hold rather than inventing reps', () => {
  assert.equal(_repRange({ sets: '3×45 שנ׳' }).mode, 'time');
});
test('_repRange marks a set taken to failure', () => {
  assert.equal(_repRange({ sets: '2×כישלון' }).mode, 'amrap');
});
test('_repRange falls back to 8-12 on nothing parseable', () => {
  assert.deepEqual(_repRange({ sets: '' }), { min: 8, max: 12, mode: 'reps' });
});
test('_repRange does not throw on null', () => {
  assert.doesNotThrow(() => _repRange(null));
});

test('_setCount counts the sets', () => assert.equal(_setCount('4×6–8'), 4));
test('_setCount defaults to 3 when unstated', () => assert.equal(_setCount(''), 3));
test('_restSec reads seconds', () => assert.equal(_restSec('90 שנ׳'), 90));
test('_restSec reads minutes as seconds', () => assert.equal(_restSec('2 דק׳'), 120));
test('_restSec averages a range of minutes', () => assert.equal(_restSec('2–3 דק׳'), 150));
test('_restSec defaults to 75 seconds on nothing parseable', () => assert.equal(_restSec(''), 75));

test('every CONFIG value is a positive number', () => {
  for (const [k, v] of Object.entries(CONFIG)) {
    assert.equal(typeof v, 'number', k);
    assert.ok(v > 0, k + ' was ' + v);
  }
});
