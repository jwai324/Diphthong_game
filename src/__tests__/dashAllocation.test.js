import { describe, it, expect } from 'vitest';
import { dashAllocation } from '../utils/heartWordQuestions.js';

describe('dashAllocation', () => {
  it('routes everything to vowel team when no grades selected', () => {
    expect(dashAllocation({ patternsCount: 2, gradesCount: 0, total: 10 })).toEqual({ vowel: 10, heart: 0 });
  });
  it('routes everything to heart words when no patterns selected', () => {
    expect(dashAllocation({ patternsCount: 0, gradesCount: 2, total: 10 })).toEqual({ vowel: 0, heart: 10 });
  });
  it('splits proportionally when both selected', () => {
    const { vowel, heart } = dashAllocation({ patternsCount: 3, gradesCount: 1, total: 10 });
    expect(vowel + heart).toBe(10);
    expect(vowel).toBeGreaterThan(heart);
  });
});
