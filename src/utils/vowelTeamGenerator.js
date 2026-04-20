import { eligibleVowelTeamWords } from './wordBank.js';
import { buildVowelTeamChoices } from './vowelTeamDistractors.js';
import { shuffle } from './rng.js';

export function buildVowelTeamQuestions(config, count) {
  const pool = shuffle(eligibleVowelTeamWords({
    patterns: config.patterns,
    difficulty: config.difficulty
  }));
  const out = [];
  let idx = 0;
  while (out.length < count && pool.length) {
    const target = pool[idx % pool.length];
    out.push({
      kind: 'vowel-team',
      word: target,
      choices: buildVowelTeamChoices(target, config)
    });
    idx++;
  }
  return out;
}
