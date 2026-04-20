import { getVowelTeamWords } from './wordBank.js';
import { getLearningState, setLearningState } from './storage.js';
import { shuffle } from './rng.js';

function ensurePatternState(state, pattern) {
  if (!state[pattern]) {
    state[pattern] = { unseen: [], gotIt: [], again: [] };
  }
  return state[pattern];
}

function seedPattern(state, pattern) {
  const all = getVowelTeamWords()
    .filter((w) => w.patterns.includes(pattern))
    .map((w) => w.word);
  const known = new Set([
    ...state[pattern].unseen,
    ...state[pattern].gotIt,
    ...state[pattern].again
  ]);
  for (const w of all) if (!known.has(w)) state[pattern].unseen.push(w);
}

// Cycle: unseen → again → got-it review.
export function nextLearningWord(pattern) {
  const state = getLearningState();
  ensurePatternState(state, pattern);
  seedPattern(state, pattern);
  setLearningState(state);

  const buckets = state[pattern];
  if (buckets.unseen.length) return buckets.unseen[0];
  if (buckets.again.length) return shuffle(buckets.again)[0];
  if (buckets.gotIt.length) return shuffle(buckets.gotIt)[0];
  return null;
}

export function recordResult(pattern, word, result) {
  const state = getLearningState();
  ensurePatternState(state, pattern);
  const b = state[pattern];
  b.unseen = b.unseen.filter((w) => w !== word);
  b.again  = b.again.filter((w) => w !== word);
  b.gotIt  = b.gotIt.filter((w) => w !== word);
  if (result === 'gotIt') b.gotIt.push(word);
  else b.again.push(word);
  setLearningState(state);
}

export function patternSummary(pattern) {
  const state = getLearningState();
  ensurePatternState(state, pattern);
  return {
    unseen: state[pattern].unseen.length,
    gotIt:  state[pattern].gotIt.length,
    again:  state[pattern].again.length
  };
}
