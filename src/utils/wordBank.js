import vowelTeamWords from '../data/vowelTeamWords.json';
import heartWords from '../data/heartWords.json';
import patternMeta from '../data/patternMeta.json';

export function getVowelTeamWords()  { return vowelTeamWords; }
export function getHeartWords()      { return heartWords; }
export function getPatternMeta()     { return patternMeta; }
export function listPatterns()       { return Object.keys(patternMeta); }
export function listGrades()         { return ['K', '1', '2', '3', '4']; }

export function eligibleVowelTeamWords({ patterns, difficulty }) {
  const set = new Set(patterns);
  return vowelTeamWords.filter((w) => {
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
  return heartWords.filter((w) => set.has(w.grade));
}
