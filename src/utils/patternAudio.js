import patternMeta from '../data/patternMeta.json';

const cache = new Map();

export function preload(patterns) {
  for (const p of patterns) {
    if (cache.has(p)) continue;
    const meta = patternMeta[p];
    if (!meta) continue;
    const a = new Audio(meta.audio);
    a.preload = 'auto';
    cache.set(p, a);
  }
}

export function play(pattern) {
  const a = cache.get(pattern) ?? new Audio(patternMeta[pattern]?.audio);
  if (!a) return Promise.resolve();
  cache.set(pattern, a);
  try {
    a.currentTime = 0;
    return a.play().catch(() => undefined);
  } catch {
    return Promise.resolve();
  }
}

export function audioAvailable(pattern) {
  return !!patternMeta[pattern]?.audio;
}
