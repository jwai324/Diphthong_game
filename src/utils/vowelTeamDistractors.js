import patternMetaData from '../data/patternMeta.json';
import { eligibleVowelTeamWords } from './wordBank.js';
import { pickN, shuffle } from './rng.js';

const PATTERNS = patternMetaData.patterns ?? {};

function isMultiVariant(pattern) {
  return (PATTERNS[pattern]?.variants?.length ?? 0) > 1;
}

function sameSoundVariant(a, b) {
  if (a.patterns.length !== 1 || b.patterns.length !== 1) return true;
  const p = a.patterns[0];
  if (p !== b.patterns[0]) return true;
  if (!isMultiVariant(p)) return true;
  const av = a.sound_variant ?? PATTERNS[p]?.default_variant;
  const bv = b.sound_variant ?? PATTERNS[p]?.default_variant;
  return av === bv;
}

function normalDistractors(target, pool) {
  const targetPatterns = new Set(target.patterns);
  const aPool = pool.filter((w) =>
    w.word !== target.word
    && !w.patterns.some((p) => targetPatterns.has(p))
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

// Position-rule violator using the word's own per-pattern position
// (target.position[pattern]) and the sibling-pattern table.
function positionViolator(target) {
  const swap = { oi: 'oy', oy: 'oi', ai: 'ay', ay: 'ai', au: 'aw', aw: 'au' };
  for (const p of target.patterns) {
    const partner = swap[p];
    if (!partner) continue;
    const targetPos = target.position?.[p];
    const partnerRule = PATTERNS[partner]?.position_rule;
    if (!targetPos || !partnerRule) continue;
    if (targetPos !== partnerRule) {
      return target.word.replace(p, partner);
    }
  }
  return null;
}

export function buildVowelTeamChoices(target, config) {
  const pool = eligibleVowelTeamWords({
    patterns: config.patterns,
    difficulty: config.difficulty
  }).filter((w) => sameSoundVariant(target, w));

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
