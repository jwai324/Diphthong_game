import patternMeta from '../data/patternMeta.json';

export function score(word) {
  const rarities = word.patterns.map((p) => patternMeta[p]?.rarity_rank ?? 1);
  const rarity = rarities.reduce((a, b) => a + b, 0) / rarities.length;
  return (word.syllables * 2) + (word.letters * 0.2) + (rarity * 0.5);
}

// Per-pattern tercile bucketing. Returns a map of word -> 'easy'|'medium'|'hard'.
// Used by build/dev scripts; runtime reads `difficulty_tier` from the JSON directly.
export function bucketByPattern(words) {
  const byPattern = {};
  for (const w of words) {
    if (w.patterns.length !== 1) continue;
    const p = w.patterns[0];
    (byPattern[p] ||= []).push(w);
  }
  const out = new Map();
  for (const list of Object.values(byPattern)) {
    list.sort((a, b) => score(a) - score(b));
    const t1 = Math.floor(list.length / 3);
    const t2 = Math.floor((list.length * 2) / 3);
    list.forEach((w, i) => {
      out.set(w.word, i < t1 ? 'easy' : i < t2 ? 'medium' : 'hard');
    });
  }
  return out;
}
