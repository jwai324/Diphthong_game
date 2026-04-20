import { describe, it, expect } from 'vitest';
import { eligibleVowelTeamWords, eligibleHeartWords } from '../utils/wordBank.js';

describe('eligibleVowelTeamWords', () => {
  it('includes single-pattern words at the requested difficulty', () => {
    const easy = eligibleVowelTeamWords({ patterns: ['oy'], difficulty: 'easy' });
    expect(easy.find((w) => w.word === 'boy')).toBeTruthy();
    expect(easy.every((w) => w.difficulty_tier === 'easy')).toBe(true);
  });

  it('only includes multi-pattern words on hard tier', () => {
    const hard = eligibleVowelTeamWords({ patterns: ['ay', 'ai'], difficulty: 'hard' });
    expect(hard.find((w) => w.word === 'saying')).toBeTruthy();
    const easy = eligibleVowelTeamWords({ patterns: ['ay', 'ai'], difficulty: 'easy' });
    expect(easy.find((w) => w.word === 'saying')).toBeFalsy();
  });
});

describe('eligibleHeartWords', () => {
  it('filters by selected grades', () => {
    const k = eligibleHeartWords({ grades: ['K'] });
    expect(k.every((w) => w.grade === 'K')).toBe(true);
    expect(k.length).toBeGreaterThan(0);
  });
});
