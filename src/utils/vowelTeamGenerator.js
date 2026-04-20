import { eligibleVowelTeamWords } from './wordBank.js';
import { buildVowelTeamChoices } from './vowelTeamDistractors.js';
import { shuffle } from './rng.js';

// Proportional pattern sampling: P(pattern_i) = eligible_count(pattern_i) / sum
// Each draw picks a pattern by weight, then a word from that pattern's bucket.
// Multi-pattern (Hard) words are pooled into the bucket of every contained pattern.
function bucketsByPattern(patterns, pool) {
  const buckets = {};
  for (const p of patterns) buckets[p] = [];
  for (const w of pool) {
    for (const p of w.patterns) {
      if (buckets[p]) buckets[p].push(w);
    }
  }
  return buckets;
}

function pickWeightedPattern(weights, rand) {
  const total = weights.reduce((s, [, n]) => s + n, 0);
  if (total <= 0) return null;
  let r = rand() * total;
  for (const [p, n] of weights) {
    if ((r -= n) <= 0) return p;
  }
  return weights[weights.length - 1][0];
}

export function buildVowelTeamQuestions(config, count, rand = Math.random) {
  const pool = eligibleVowelTeamWords({
    patterns: config.patterns,
    difficulty: config.difficulty
  });
  if (!pool.length || count <= 0) return [];

  const buckets = bucketsByPattern(config.patterns, pool);
  const liveCursors = {};
  for (const p of config.patterns) {
    liveCursors[p] = shuffle(buckets[p], rand);
    buckets[p] = liveCursors[p];
  }

  const out = [];
  const seenInRound = new Set();
  while (out.length < count) {
    const weights = config.patterns
      .map((p) => [p, buckets[p].length])
      .filter(([, n]) => n > 0);
    if (!weights.length) {
      // Refill: every pattern bucket exhausted of unique words. Re-shuffle
      // and allow repeats for the remainder of the round.
      for (const p of config.patterns) buckets[p] = shuffle(liveCursors[p].length ? liveCursors[p] : pool.filter((w) => w.patterns.includes(p)), rand);
      seenInRound.clear();
      continue;
    }
    const p = pickWeightedPattern(weights, rand);
    const idx = buckets[p].findIndex((w) => !seenInRound.has(w.word));
    let target;
    if (idx === -1) {
      target = buckets[p][0];
      buckets[p] = buckets[p].slice(1);
    } else {
      target = buckets[p][idx];
      buckets[p] = buckets[p].slice(0, idx).concat(buckets[p].slice(idx + 1));
    }
    seenInRound.add(target.word);
    out.push({
      kind: 'vowel-team',
      word: target,
      choices: buildVowelTeamChoices(target, config)
    });
  }
  return out;
}
