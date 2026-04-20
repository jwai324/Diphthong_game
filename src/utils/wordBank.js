import vowelTeamData from '../data/vowelTeamWords.json';
import heartWordData from '../data/heartWords.json';
import patternMetaData from '../data/patternMeta.json';

const VOWEL_TEAM_WORDS = vowelTeamData.words ?? [];
const HEART_WORDS = heartWordData.words ?? [];
const PATTERNS = patternMetaData.patterns ?? {};

export function getVowelTeamWords()  { return VOWEL_TEAM_WORDS; }
export function getHeartWords()      { return HEART_WORDS; }
export function getPatternMeta()     { return PATTERNS; }
export function getPatternEntry(p)   { return PATTERNS[p]; }
export function listPatterns()       { return Object.keys(PATTERNS); }
export function listGrades()         { return ['K', '1', '2', '3', '4']; }

export function variantForWord(word) {
  const p = word.patterns?.[0];
  if (!p) return null;
  const entry = PATTERNS[p];
  if (!entry) return null;
  const id = word.sound_variant ?? entry.default_variant;
  return entry.variants?.find((v) => v.id === id) ?? entry.variants?.[0] ?? null;
}

export function eligibleVowelTeamWords({ patterns, difficulty }) {
  const set = new Set(patterns);
  return VOWEL_TEAM_WORDS.filter((w) => {
    if (w.difficulty_tier !== difficulty) return false;
    if (w.patterns.length >= 2) {
      if (difficulty !== 'hard') return false;
      return w.patterns.every((p) => set.has(p));
    }
    return set.has(w.patterns[0]);
  });
}

export function eligibleHeartWords({ grades }) {
  const set = new Set(grades);
  return HEART_WORDS.filter((w) => set.has(w.grade));
}

export function eligibleCountByPattern({ patterns, difficulty }) {
  const counts = {};
  for (const p of patterns) counts[p] = 0;
  for (const w of eligibleVowelTeamWords({ patterns, difficulty })) {
    for (const p of w.patterns) {
      if (counts[p] !== undefined) counts[p] += 1;
    }
  }
  return counts;
}

export function getEffectivePoolSize(mode, config) {
  if (mode === 'heart-words') {
    return eligibleHeartWords({ grades: config.grades ?? [] }).length;
  }
  if (mode === 'learning') {
    const set = new Set(config.patterns ?? []);
    return VOWEL_TEAM_WORDS.filter((w) => w.patterns.some((p) => set.has(p))).length;
  }
  // dash
  const vowelTeams = (config.patterns?.length ?? 0) > 0
    ? eligibleVowelTeamWords({
        patterns: config.patterns,
        difficulty: config.difficulty ?? 'easy'
      }).length
    : 0;
  const hearts = (config.grades?.length ?? 0) > 0
    ? eligibleHeartWords({ grades: config.grades }).length
    : 0;
  return vowelTeams + hearts;
}
