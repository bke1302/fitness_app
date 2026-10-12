// These run against the functions sliced out of app.js, not a copy of them.
// The previous version of this file imported src/pure.js, which had drifted a
// month behind and was asserting two bugs as correct behaviour.
import { describe, it, expect } from 'vitest';
import { app } from './from-app.mjs';

const { calcNutrition, _repRange, _setCount, _restSec, CONFIG } = app;
const LIFTER = { weight: 78, height: 178, age: 31, gender: 'm', activity: 1.55 };

describe('calcNutrition — the target follows the lifter', () => {
  it('recomputes the target instead of trusting a stored one', () => {
    // u.calories is written once, at sign-up. If it wins unconditionally the
    // target freezes and never follows a changing bodyweight.
    const stale = calcNutrition({ ...LIFTER, goal: 'lean_bulk', calories: 9999 });
    expect(stale.target).toBe(stale.auto);
  });

  it('honours a target the lifter typed themselves', () => {
    const manual = calcNutrition({ ...LIFTER, goal: 'lean_bulk', calories: 2600, calories_manual: true });
    expect(manual.target).toBe(2600);
  });

  it('follows bodyweight upward', () => {
    const a = calcNutrition({ ...LIFTER, goal: 'lean_bulk' });
    const b = calcNutrition({ ...LIFTER, weight: 90, goal: 'lean_bulk' });
    expect(b.target).toBeGreaterThan(a.target);
  });

  it('never drops below the 1200 floor', () => {
    const tiny = calcNutrition({ weight: 38, height: 140, age: 80, gender: 'f', activity: 1.2, goal: 'cut' });
    expect(tiny.target).toBeGreaterThanOrEqual(1200);
  });
});

describe('calcNutrition — macros follow the goal', () => {
  it('gives a deficit more protein than a surplus', () => {
    const cut = calcNutrition({ ...LIFTER, goal: 'cut' });
    const bulk = calcNutrition({ ...LIFTER, goal: 'lean_bulk' });
    expect(cut.gPerKg).toBeGreaterThan(bulk.gPerKg);
    expect(cut.protein).toBeGreaterThan(bulk.protein);
  });

  it('keeps protein inside the evidence range, 1.6 to 2.8 g/kg', () => {
    for (const goal of ['lean_bulk', 'bulk', 'cut', 'maintain']) {
      const n = calcNutrition({ ...LIFTER, goal });
      const perKg = n.protein / LIFTER.weight;
      expect(perKg).toBeGreaterThanOrEqual(1.6);
      expect(perKg).toBeLessThanOrEqual(2.8);
    }
  });

  it('holds fat at or above 0.8 g/kg even on a deep cut', () => {
    const n = calcNutrition({ ...LIFTER, goal: 'cut' });
    expect(n.fat).toBeGreaterThanOrEqual(Math.round(LIFTER.weight * 0.8));
  });

  it('never returns negative carbohydrate', () => {
    const extreme = calcNutrition({ weight: 150, height: 170, age: 60, gender: 'm', activity: 1.2, goal: 'cut' });
    expect(extreme.carbs).toBeGreaterThanOrEqual(0);
  });

  it('macros account for the target within 5 percent', () => {
    const n = calcNutrition({ ...LIFTER, goal: 'lean_bulk' });
    const kcal = n.protein * 4 + n.carbs * 4 + n.fat * 9;
    expect(Math.abs(kcal - n.target) / n.target).toBeLessThan(0.05);
  });

  it('cut is below bulk, bulk is above maintain', () => {
    const cut = calcNutrition({ ...LIFTER, goal: 'cut' });
    const bulk = calcNutrition({ ...LIFTER, goal: 'bulk' });
    const maintain = calcNutrition({ ...LIFTER, goal: 'maintain' });
    expect(cut.target).toBeLessThan(bulk.target);
    expect(bulk.target).toBeGreaterThan(maintain.target);
  });
});

describe('calcNutrition — survives partial input', () => {
  it('a male burns more than a female at identical stats', () => {
    const m = calcNutrition({ ...LIFTER, gender: 'm', goal: 'maintain' });
    const f = calcNutrition({ ...LIFTER, gender: 'f', goal: 'maintain' });
    expect(m.bmr).toBeGreaterThan(f.bmr);
  });
  it('an empty object still produces usable numbers', () => {
    const n = calcNutrition({});
    for (const k of ['bmr', 'tdee', 'target', 'protein', 'carbs', 'fat'])
      expect(Number.isFinite(n[k])).toBe(true);
    expect(n.target).toBeGreaterThan(0);
  });
});

describe('_repRange', () => {
  it('reads a range', () => expect(_repRange({ sets: '4×6–8' })).toMatchObject({ min: 6, max: 8, mode: 'reps' }));
  it('reads a single number as both ends', () => expect(_repRange({ sets: '3×12' })).toMatchObject({ min: 12, max: 12 }));
  it('accepts a hyphen as well as an en dash', () => expect(_repRange({ sets: '4×10-12' })).toMatchObject({ min: 10, max: 12 }));
  it('accepts a capital X', () => expect(_repRange({ sets: '3X12' })).toMatchObject({ min: 12, max: 12 }));
  it('marks a timed hold rather than inventing reps', () => expect(_repRange({ sets: '3×45 שנ׳' }).mode).toBe('time'));
  it('marks a set taken to failure', () => expect(_repRange({ sets: '2×כישלון' }).mode).toBe('amrap'));
  it('falls back to 8-12 on nothing parseable', () => expect(_repRange({ sets: '' })).toMatchObject({ min: 8, max: 12 }));
  it('does not throw on null', () => expect(() => _repRange(null)).not.toThrow());
});

describe('_setCount and _restSec', () => {
  it('counts the sets', () => expect(_setCount('4×6–8')).toBe(4));
  it('defaults to 3 when unstated', () => expect(_setCount('')).toBe(3));
  it('reads seconds', () => expect(_restSec('90 שנ׳')).toBe(90));
  it('reads minutes as seconds', () => expect(_restSec('2 דק׳')).toBe(120));
  it('averages a range of minutes', () => expect(_restSec('2–3 דק׳')).toBe(150));
  it('defaults to 75 seconds on nothing parseable', () => expect(_restSec('')).toBe(75));
});

describe('CONFIG', () => {
  it('every value is a positive number', () => {
    for (const [k, v] of Object.entries(CONFIG)) {
      expect(typeof v, k).toBe('number');
      expect(v, k).toBeGreaterThan(0);
    }
  });
});
