import { describe, it, expect } from 'vitest';
import { calcNutrition, _parseRepRange, CONFIG, _buildSparklineFromData } from '../src/pure.js';

// ─── _parseRepRange ──────────────────────────────────────────────────────────
describe('_parseRepRange', () => {
  it('parses standard range "4×6–8"', () => {
    expect(_parseRepRange('4×6–8')).toEqual({ min: 6, max: 8 });
  });
  it('parses single number "3×12"', () => {
    expect(_parseRepRange('3×12')).toEqual({ min: 12, max: 12 });
  });
  it('handles hyphen separator "4×10-12"', () => {
    expect(_parseRepRange('4×10-12')).toEqual({ min: 10, max: 12 });
  });
  it('returns default {min:8,max:12} for empty string', () => {
    expect(_parseRepRange('')).toEqual({ min: 8, max: 12 });
  });
  it('returns default for null', () => {
    expect(_parseRepRange(null)).toEqual({ min: 8, max: 12 });
  });
  it('handles em-dash "3×15–20"', () => {
    expect(_parseRepRange('3×15–20')).toEqual({ min: 15, max: 20 });
  });
  it('handles capital X separator "3X12"', () => {
    const r = _parseRepRange('3X12');
    expect(r.min).toBe(12);
    expect(r.max).toBe(12);
  });
  it('handles lowercase x separator "4x8-10"', () => {
    expect(_parseRepRange('4x8-10')).toEqual({ min: 8, max: 10 });
  });
  it('min is always <= max', () => {
    const r = _parseRepRange('4×6–8');
    expect(r.min).toBeLessThanOrEqual(r.max);
  });
  it('parses high rep range "3×15–20"', () => {
    expect(_parseRepRange('3×15–20')).toEqual({ min: 15, max: 20 });
  });
});

// ─── CONFIG ──────────────────────────────────────────────────────────────────
describe('CONFIG', () => {
  it('has WATER_GOAL = 10', () => { expect(CONFIG.WATER_GOAL).toBe(10); });
  it('has MAX_ELOG_ENTRIES = 100', () => { expect(CONFIG.MAX_ELOG_ENTRIES).toBe(100); });
  it('has SPARKLINE_SESSIONS = 6', () => { expect(CONFIG.SPARKLINE_SESSIONS).toBe(6); });
  it('has COACH_STAGNATION = 4', () => { expect(CONFIG.COACH_STAGNATION).toBe(4); });
  it('has COACH_INCREASE_MIN = 2', () => { expect(CONFIG.COACH_INCREASE_MIN).toBe(2); });
  it('has TIMER_DEFAULT_SEC = 90', () => { expect(CONFIG.TIMER_DEFAULT_SEC).toBe(90); });
  it('has CONFETTI_PARTICLES = 90', () => { expect(CONFIG.CONFETTI_PARTICLES).toBe(90); });
  it('has CONFETTI_DURATION = 3200', () => { expect(CONFIG.CONFETTI_DURATION).toBe(3200); });
  it('GYM_TIMER_CIRC equals 2*PI*38', () => {
    expect(CONFIG.GYM_TIMER_CIRC).toBeCloseTo(2 * Math.PI * 38, 5);
  });
  it('all values are positive numbers', () => {
    Object.values(CONFIG).forEach(v => {
      expect(typeof v).toBe('number');
      expect(v).toBeGreaterThan(0);
    });
  });
});

// ─── calcNutrition ───────────────────────────────────────────────────────────
describe('calcNutrition', () => {
  const male70 = { weight: 70, height: 175, age: 30, gender: 'm', goal: 'maintain' };
  const female60 = { weight: 60, height: 165, age: 25, gender: 'f', goal: 'cut' };

  it('returns all required macro fields', () => {
    const r = calcNutrition(male70);
    ['target','protein','carbs','fat','bmr','tdee'].forEach(k => expect(r).toHaveProperty(k));
  });
  it('male BMR > female at same stats', () => {
    expect(calcNutrition(male70).bmr).toBeGreaterThan(calcNutrition({...male70,gender:'f'}).bmr);
  });
  it('cut < bulk calories', () => {
    expect(calcNutrition({...male70,goal:'cut'}).target).toBeLessThan(calcNutrition({...male70,goal:'bulk'}).target);
  });
  it('bulk > maintain calories', () => {
    expect(calcNutrition({...male70,goal:'bulk'}).target).toBeGreaterThan(calcNutrition(male70).target);
  });
  it('heavier person needs more calories', () => {
    expect(calcNutrition({...male70,weight:100}).target).toBeGreaterThan(calcNutrition({...male70,weight:60}).target);
  });
  it('older person has lower BMR', () => {
    expect(calcNutrition({...male70,age:20}).bmr).toBeGreaterThan(calcNutrition({...male70,age:60}).bmr);
  });
  it('macros sum to target ±5%', () => {
    const r = calcNutrition(male70);
    const sum = r.protein*4 + r.carbs*4 + r.fat*9;
    expect(Math.abs(sum - r.target) / r.target).toBeLessThan(0.05);
  });
  it('protein, carbs, fat are positive integers', () => {
    const r = calcNutrition(male70);
    [r.protein,r.carbs,r.fat].forEach(v => {
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThan(0);
    });
  });
  it('female cut calories > 1000', () => {
    expect(calcNutrition(female60).target).toBeGreaterThan(1000);
  });
  it('does not throw for partial input', () => {
    expect(() => calcNutrition({ weight: 80 })).not.toThrow();
  });
  it('empty object produces valid output', () => {
    const r = calcNutrition({});
    expect(r.target).toBeGreaterThan(0);
    expect(r.bmr).toBeGreaterThan(0);
  });
});

// ─── _buildSparklineFromData ─────────────────────────────────────────────────
describe('_buildSparklineFromData', () => {
  const up   = [{kg:65},{kg:62},{kg:60}];
  const down = [{kg:60},{kg:62},{kg:65}];
  const flat = [{kg:60},{kg:60},{kg:60}];

  it('returns "" for empty array', () => { expect(_buildSparklineFromData([])).toBe(''); });
  it('returns "" for null', () => { expect(_buildSparklineFromData(null)).toBe(''); });
  it('returns "" for single session', () => { expect(_buildSparklineFromData([{kg:60}])).toBe(''); });
  it('returns SVG string for 2+ sessions', () => {
    expect(_buildSparklineFromData(up)).toContain('<svg');
    expect(_buildSparklineFromData(up)).toContain('</svg>');
  });
  it('contains <polyline>', () => { expect(_buildSparklineFromData(up)).toContain('<polyline'); });
  it('contains <circle> dot', () => { expect(_buildSparklineFromData(up)).toContain('<circle'); });
  it('uses --lime for upward trend', () => { expect(_buildSparklineFromData(up)).toContain('var(--lime)'); });
  it('uses --red for downward trend', () => { expect(_buildSparklineFromData(down)).toContain('var(--red)'); });
  it('flat trend (same kg) uses --lime (>=)', () => { expect(_buildSparklineFromData(flat)).toContain('var(--lime)'); });
  it('respects sessions limit', () => {
    const many = Array.from({length:10},(_,i)=>({kg:60+i}));
    expect(_buildSparklineFromData(many, 3)).toContain('<svg');
  });
  it('has correct viewBox "0 0 60 20"', () => {
    expect(_buildSparklineFromData(up)).toContain('viewBox="0 0 60 20"');
  });
  it('has aria-hidden="true"', () => {
    expect(_buildSparklineFromData(up)).toContain('aria-hidden="true"');
  });
});
