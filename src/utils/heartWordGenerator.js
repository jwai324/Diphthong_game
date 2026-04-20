// Heart-word distractor generator. Run at build time via
// `npm run generate:heart-distractors`. Deterministic — JSON diffs are reviewable.

const PHONETIC_SUBS = {
  a:   ['e', 'u', 'o'],
  ai:  ['e', 'ay', 'ey'],
  ay:  ['ai', 'ey', 'a'],
  e:   ['u', 'i', 'a'],
  ea:  ['e', 'ee', 'ay'],
  ee:  ['ea', 'e', 'i'],
  i:   ['e', 'y', 'u'],
  o:   ['u', 'a', 'oa'],
  oa:  ['o', 'oh', 'oe'],
  ou:  ['ow', 'o', 'u'],
  ow:  ['ou', 'o', 'au'],
  u:   ['o', 'oo', 'a'],
  ui:  ['oo', 'u', 'oo'],
  ue:  ['oo', 'u', 'ew'],
  oi:  ['oy'],
  oy:  ['oi'],
  igh: ['ite', 'i', 'y'],
  ie:  ['y', 'ee', 'i'],
  wh:  ['w'],
  kn:  ['n'],
  gh:  ['', 'f'],
  ph:  ['f'],
  th:  ['t', 'd'],
  ch:  ['sh', 'k'],
  ck:  ['k'],
  qu:  ['kw']
};

const COMMON_DIGRAPHS = ['ai','ay','ea','ee','oa','ou','ow','oo','ie','igh','wh','kn','gh','ph','th','ch','ck','qu','oi','oy','ui','ue'];

const BLOCKLIST = new Set([
  // simple guard against generating other real common words. In a real ship this
  // would be a much larger curated list per grade band.
  'the','was','to','of','is','it','in','on','no','do','go','so','my','me','we',
  'be','by','an','at','as','if','or','up','us','am','sat','set','sit','red',
  'bed','bad','ten','run','top','hot','dog','cat','car','cup','sun','fun'
]);

function unique(arr) {
  return Array.from(new Set(arr));
}

function pronounceable(s) {
  if (!s) return false;
  if (/[^a-z']/.test(s)) return false;
  if (!/[aeiouy]/.test(s)) return false;
  if (/[bcdfghjklmnpqrstvwxz]{4,}/.test(s)) return false;
  if (s.startsWith("'")) return false;
  return true;
}

function editDistance(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

function* heartLetterSubstitutions(word, hearts) {
  const chars = word.split('');
  for (const idx of hearts) {
    const c = chars[idx];
    if (!c) continue;
    const subs = PHONETIC_SUBS[c] ?? [];
    for (const s of subs) {
      const next = [...chars.slice(0, idx), s, ...chars.slice(idx + 1)].join('');
      yield next;
    }
  }
}

function* heartLetterOmissions(word, hearts) {
  const chars = word.split('');
  for (const idx of hearts) {
    const next = [...chars.slice(0, idx), ...chars.slice(idx + 1)].join('');
    if (next.length >= 2) yield next;
  }
}

function* digraphSwaps(word) {
  for (const dg of COMMON_DIGRAPHS) {
    const i = word.indexOf(dg);
    if (i < 0) continue;
    for (const sub of (PHONETIC_SUBS[dg] ?? [])) {
      yield word.slice(0, i) + sub + word.slice(i + dg.length);
    }
  }
}

function* doubledConsonantToggle(word) {
  for (let i = 1; i < word.length; i++) {
    if (word[i] === word[i - 1] && /[bcdfghjklmnpqrstvwxz]/.test(word[i])) {
      yield word.slice(0, i) + word.slice(i + 1);
    }
  }
  for (let i = 1; i < word.length - 1; i++) {
    if (/[bcdfghjklmnpqrstvwxz]/.test(word[i]) && word[i] !== word[i - 1] && word[i] !== word[i + 1]) {
      yield word.slice(0, i) + word[i] + word.slice(i);
    }
  }
}

export function generateDistractors(target, options = {}) {
  const { word, heart_indices = [] } = target;
  const max = options.max ?? 4;
  const candidates = unique([
    ...heartLetterSubstitutions(word, heart_indices),
    ...heartLetterOmissions(word, heart_indices),
    ...digraphSwaps(word),
    ...doubledConsonantToggle(word)
  ]);

  const valid = candidates.filter((c) =>
    c !== word
    && pronounceable(c)
    && !BLOCKLIST.has(c)
    && editDistance(word, c) <= 2
  );

  return valid.slice(0, max);
}
