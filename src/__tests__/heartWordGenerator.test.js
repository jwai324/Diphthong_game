import { describe, it, expect } from 'vitest';
import { generateDistractors } from '../utils/heartWordGenerator.js';

describe('generateDistractors', () => {
  it('produces at least one valid distractor for each sample heart word', () => {
    const samples = [
      { word: 'said',  heart_indices: [1, 2] },
      { word: 'they',  heart_indices: [2, 3] },
      { word: 'have',  heart_indices: [3] },
      { word: 'would', heart_indices: [1, 2, 3] }
    ];
    for (const s of samples) {
      const d = generateDistractors(s);
      expect(d.length).toBeGreaterThan(0);
      expect(d).not.toContain(s.word);
      for (const c of d) {
        expect(c).toMatch(/^[a-z']+$/);
      }
    }
  });

  it('is deterministic across runs', () => {
    const a = generateDistractors({ word: 'said', heart_indices: [1, 2] });
    const b = generateDistractors({ word: 'said', heart_indices: [1, 2] });
    expect(a).toEqual(b);
  });
});
