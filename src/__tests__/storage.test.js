import { describe, it, expect } from 'vitest';
import { hashConfig } from '../utils/storage.js';

describe('hashConfig', () => {
  it('is order-independent for array fields', () => {
    const a = hashConfig('dash', { patterns: ['oi', 'oy'], grades: ['K'], difficulty: 'easy', questionCount: 10 });
    const b = hashConfig('dash', { patterns: ['oy', 'oi'], grades: ['K'], difficulty: 'easy', questionCount: 10 });
    expect(a).toBe(b);
  });

  it('changes when mode changes', () => {
    const a = hashConfig('dash',     { patterns: ['oi'], grades: [], difficulty: 'easy', questionCount: 10 });
    const b = hashConfig('learning', { patterns: ['oi'], grades: [], difficulty: 'easy', questionCount: 10 });
    expect(a).not.toBe(b);
  });
});
