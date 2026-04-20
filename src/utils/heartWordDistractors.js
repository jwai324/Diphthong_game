import { shuffle, pickN } from './rng.js';

// Pool comes from build-time generation in `heartWords.json`.
// Track per-session usage in memory so distractors vary across questions.
const sessionSeen = new Map();

export function resetSession() {
  sessionSeen.clear();
}

export function buildHeartWordChoices(target) {
  const pool = (target.common_misspellings ?? []).filter(Boolean);
  const used = sessionSeen.get(target.word) ?? new Set();
  const fresh = pool.filter((d) => !used.has(d));
  const fallback = pool.filter((d) => used.has(d));
  const need = 2;
  const chosen = pickN(fresh, Math.min(need, fresh.length));
  if (chosen.length < need) {
    const more = pickN(fallback, need - chosen.length);
    chosen.push(...more);
  }
  for (const c of chosen) used.add(c);
  sessionSeen.set(target.word, used);
  return shuffle([target.word, ...chosen.slice(0, need)]);
}
