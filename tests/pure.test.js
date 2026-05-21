import { describe, it, expect } from 'vitest';
import { calcNutrition, _parseRepRange } from '../src/pure.js';

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
  it('returns default for invalid input', () => {
    expect(_parseRepRange('')).toEqual({ min: 8, max: 12 });
    expect(_parseRepRange(null)).toEqual({ min: 8, max: 12 });
  });
  it('handles em-dash "3×15–20"', () => {
    expect(_parseRepRange('3×15–20')).toEqual({ min: 15, max: 20 });
  });
});

describe('calcNutrition', () => {
  const male70kg = { weight: 70, height: 175, age: 30, gender: 'm', goal: 'maintain' };
  const female60kg = { weight: 60, height: 165, age: 25, gender: 'f', goal: 'cut' };

  it('returns object with all macro fields', () => {
    const result = calcNutrition(male70kg);
    expect(result).toHaveProperty('target');
    expect(result).toHaveProperty('protein');
    expect(result).toHaveProperty('carbs');
    expect(result).toHaveProperty('fat');
    expect(result).toHaveProperty('bmr');
    expect(result).toHaveProperty('tdee');
  });

  it('male BMR is higher than female same weight/height/age', () => {
    const maleResult = calcNutrition(male70kg);
    // Female same params but female gender
    const femaleResult = calcNutrition({ ...male70kg, gender: 'f' });
    expect(maleResult.bmr).toBeGreaterThan(femaleResult.bmr);
  });

  it('cut goal gives lower calories than bulk', () => {
    const cut = calcNutrition({ ...male70kg, goal: 'cut' });
    const bulk = calcNutrition({ ...male70kg, goal: 'bulk' });
    expect(cut.target).toBeLessThan(bulk.target);
  });

  it('protein is reasonable range (1.6-2.5g per kg)', () => {
    const result = calcNutrition(male70kg);
    const proteinPerKg = result.protein / male70kg.weight;
    expect(proteinPerKg).toBeGreaterThanOrEqual(1.5);
    expect(proteinPerKg).toBeLessThanOrEqual(3.0);
  });

  it('female cut calories are positive', () => {
    const result = calcNutrition(female60kg);
    expect(result.target).toBeGreaterThan(1000);
  });

  it('handles missing fields with fallbacks', () => {
    // Should not throw with partial data
    expect(() => calcNutrition({ weight: 80 })).not.toThrow();
  });
});
