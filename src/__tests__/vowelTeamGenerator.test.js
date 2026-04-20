import { describe, it, expect } from 'vitest';
import { buildVowelTeamQuestions } from '../utils/vowelTeamGenerator.js';
import { mulberry32 } from '../utils/rng.js';
import { eligibleCountByPattern } from '../utils/wordBank.js';

describe('buildVowelTeamQuestions', () => {
  it('returns the requested number of questions', () => {
    const qs = buildVowelTeamQuestions(
      { patterns: ['ai', 'ee'], difficulty: 'easy', trickyMode: false },
      8,
      mulberry32(42)
    );
    expect(qs.length).toBe(8);
    for (const q of qs) {
      expect(q.kind).toBe('vowel-team');
      expect(q.choices).toContain(q.word.word);
    }
  });

  it('roughly mirrors eligible_count weights across patterns', () => {
    const config = { patterns: ['ai', 'oe'], difficulty: 'easy', trickyMode: false };
    const counts = eligibleCountByPattern(config);
    // ai has many easy entries; oe has very few. Over a large round, ai
    // questions should outnumber oe questions whenever oe has fewer eligibles.
    const N = 200;
    const qs = buildVowelTeamQuestions(config, N, mulberry32(7));
    const aiHits = qs.filter((q) => q.word.patterns.includes('ai')).length;
    const oeHits = qs.filter((q) => q.word.patterns.includes('oe')).length;
    if (counts.ai > counts.oe) {
      expect(aiHits).toBeGreaterThan(oeHits);
    }
  });
});
