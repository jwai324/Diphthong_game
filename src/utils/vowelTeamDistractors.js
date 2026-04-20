import patternMeta from '../data/patternMeta.json';
import { eligibleVowelTeamWords } from './wordBank.js';
import { pickN, shuffle } from './rng.js';

// Two distractors. Priority:
//   a) words sharing none of the target's patterns (prefer same selected list)
//   b) near-misses by alternate-spelling
//   c) words with a different rarity-rank pattern from the same group
function normalDistractors(target, pool) {
  const targetPatterns = new Set(target.patterns);
  const aPool = pool.filter((w) =>
    w.word !== target.word && !w.patterns.some((p) => targetPatterns.has(p))
  );
  if (aPool.length >= 2) return pickN(aPool, 2).map((w) => w.word);
  const out = aPool.map((w) => w.word);
  for (const alt of shuffle(target.alternate_spellings ?? [])) {
    if (out.length >= 2) break;
    if (alt && !out.includes(alt) && alt !== target.word) out.push(alt);
  }
  if (out.length < 2) {
    const fallback = pool
      .filter((w) => w.word !== target.word && !out.includes(w.word))
      .flatMap((w) => w.alternate_spellings ?? []);
    for (const alt of shuffle(fallback)) {
      if (out.length >= 2) break;
      if (alt && !out.includes(alt) && alt !== target.word) out.push(alt);
    }
  }
  return out.slice(0, 2);
}

// Position-rule violator for the same /sound/. The correct answer always
// follows the rule: oi/ai/au medial, oy/ay/aw final.
function positionViolator(target) {
  const swap = { oi: 'oy', oy: 'oi', ai: 'ay', ay: 'ai', au: 'aw', aw: 'au' };
  for (const p of target.patterns) {
    const partner = swap[p];
    if (!partner) continue;
    if (patternMeta[p]?.position_rule !== patternMeta[partner]?.position_rule) {
      return target.word.replace(p, partner);
    }
  }
  return null;
}

// Tricky-mode: 3 distractors = 1 homophone (if any) + 1 position-violator + 1 normal.
export function buildVowelTeamChoices(target, config) {
  const pool = eligibleVowelTeamWords({
    patterns: config.patterns,
    difficulty: config.difficulty
  });

  if (!config.trickyMode) {
    const distractors = normalDistractors(target, pool);
    return shuffle([target.word, ...distractors]);
  }

  const distractors = [];
  const homophone = (target.alternate_spellings ?? []).find((s) => s && s !== target.word);
  if (homophone) distractors.push(homophone);
  const violator = positionViolator(target);
  if (violator && !distractors.includes(violator)) distractors.push(violator);
  for (const cand of normalDistractors(target, pool)) {
    if (distractors.length >= 3) break;
    if (!distractors.includes(cand)) distractors.push(cand);
  }
  return shuffle([target.word, ...distractors.slice(0, 3)]);
}
