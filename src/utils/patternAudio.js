import patternMetaData from '../data/patternMeta.json';

const PATTERNS = patternMetaData.patterns ?? {};
const cache = new Map();

function variantOf(pattern, soundVariant) {
  const entry = PATTERNS[pattern];
  if (!entry) return null;
  const id = soundVariant ?? entry.default_variant;
  return entry.variants?.find((v) => v.id === id) ?? entry.variants?.[0] ?? null;
}

function ensure(variantId, src) {
  if (cache.has(variantId)) return cache.get(variantId);
  const a = new Audio(src);
  a.preload = 'auto';
  cache.set(variantId, a);
  return a;
}

export function preload(patterns) {
  for (const p of patterns) {
    const entry = PATTERNS[p];
    if (!entry) continue;
    for (const v of entry.variants ?? []) {
      ensure(v.id, v.audio);
    }
  }
}

export function play(pattern, soundVariant) {
  const v = variantOf(pattern, soundVariant);
  if (!v) return Promise.resolve();
  const a = ensure(v.id, v.audio);
  try {
    a.currentTime = 0;
    return a.play().catch(() => undefined);
  } catch {
    return Promise.resolve();
  }
}

export function audioAvailable(pattern, soundVariant) {
  return !!variantOf(pattern, soundVariant)?.audio;
}
