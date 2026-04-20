import { eligibleHeartWords } from './wordBank.js';
import { buildHeartWordChoices, resetSession } from './heartWordDistractors.js';
import { shuffle } from './rng.js';

export function buildHeartWordQuestions(config, count) {
  resetSession();
  const pool = shuffle(eligibleHeartWords({ grades: config.grades }));
  const out = [];
  let idx = 0;
  while (out.length < count && pool.length) {
    const target = pool[idx % pool.length];
    out.push({
      kind: 'heart-word',
      word: target,
      choices: buildHeartWordChoices(target)
    });
    idx++;
  }
  return out;
}

// Combined sampling for Dash mode when both vowel-team patterns AND heart-word
// grades are active. Allocate proportionally to the count of selected items in
// each source, then interleave.
export function combineDashSources({ vowelTeamQs, heartWordQs }) {
  const merged = [];
  const a = [...vowelTeamQs];
  const b = [...heartWordQs];
  while (a.length || b.length) {
    if (a.length) merged.push(a.shift());
    if (b.length) merged.push(b.shift());
  }
  return merged;
}

export function dashAllocation({ patternsCount, gradesCount, total }) {
  if (patternsCount > 0 && gradesCount === 0) return { vowel: total, heart: 0 };
  if (patternsCount === 0 && gradesCount > 0) return { vowel: 0, heart: total };
  const vowel = Math.round((total * patternsCount) / (patternsCount + gradesCount));
  return { vowel, heart: total - vowel };
}
