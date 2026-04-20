import { describe, it, expect } from 'vitest';
import {
  eligibleVowelTeamWords,
  eligibleHeartWords,
  eligibleCountByPattern,
  getEffectivePoolSize
} from '../utils/wordBank.js';

describe('eligibleVowelTeamWords', () => {
  it('includes single-pattern words at the requested difficulty', () => {
    const medium = eligibleVowelTeamWords({ patterns: ['oy'], difficulty: 'medium' });
    expect(medium.find((w) => w.word === 'boy')).toBeTruthy();
    expect(medium.every((w) => w.difficulty_tier === 'medium')).toBe(true);
  });

  it('only includes multi-pattern words on hard tier', () => {
    const hard = eligibleVowelTeamWords({ patterns: ['ai', 'ow'], difficulty: 'hard' });
    expect(hard.find((w) => w.word === 'rainbow')).toBeTruthy();
    const easy = eligibleVowelTeamWords({ patterns: ['ai', 'ow'], difficulty: 'easy' });
    expect(easy.find((w) => w.word === 'rainbow')).toBeFalsy();
  });
});

describe('eligibleHeartWords', () => {
  it('filters by selected grades', () => {
    const k = eligibleHeartWords({ grades: ['K'] });
    expect(k.every((w) => w.grade === 'K')).toBe(true);
    expect(k.length).toBeGreaterThan(0);
  });
});

describe('eligibleCountByPattern', () => {
  it('returns counts keyed by selected pattern', () => {
    const counts = eligibleCountByPattern({ patterns: ['ai', 'ee'], difficulty: 'easy' });
    expect(counts.ai).toBeGreaterThan(0);
    expect(counts.ee).toBeGreaterThan(0);
    expect(Object.keys(counts).sort()).toEqual(['ai', 'ee']);
  });
});

describe('getEffectivePoolSize', () => {
  it('combines vowel-team and heart-word pools for dash mode', () => {
    const dash = getEffectivePoolSize('dash', {
      patterns: ['ai'], grades: ['K'], difficulty: 'easy'
    });
    const vt = getEffectivePoolSize('dash', {
      patterns: ['ai'], grades: [], difficulty: 'easy'
    });
    const hw = getEffectivePoolSize('dash', {
      patterns: [], grades: ['K'], difficulty: 'easy'
    });
    expect(dash).toBe(vt + hw);
  });

  it('counts heart words for heart-words mode', () => {
    const n = getEffectivePoolSize('heart-words', { grades: ['K'] });
    expect(n).toBeGreaterThan(0);
  });

  it('returns words across all difficulty tiers for learning mode', () => {
    const n = getEffectivePoolSize('learning', { patterns: ['ai'] });
    expect(n).toBeGreaterThan(0);
  });
});
