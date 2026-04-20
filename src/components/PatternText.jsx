import patternMeta from '../data/patternMeta.json';

function findPatternRanges(word, patterns) {
  const ranges = [];
  const lower = word.toLowerCase();
  const sorted = [...patterns].sort((a, b) => b.length - a.length);
  for (const p of sorted) {
    let from = 0;
    while (from < lower.length) {
      const i = lower.indexOf(p, from);
      if (i < 0) break;
      const overlaps = ranges.some((r) => i < r.end && i + p.length > r.start);
      if (!overlaps) ranges.push({ start: i, end: i + p.length, pattern: p });
      from = i + p.length;
    }
  }
  return ranges.sort((a, b) => a.start - b.start);
}

function renderVowelTeam(word, patterns) {
  const ranges = findPatternRanges(word, patterns);
  const out = [];
  let cursor = 0;
  ranges.forEach((r, i) => {
    if (cursor < r.start) out.push(<span key={`p${i}`}>{word.slice(cursor, r.start)}</span>);
    const color = patternMeta[r.pattern]?.color ?? '#0f172a';
    out.push(
      <span key={`m${i}`} style={{ color }} className="font-bold">
        {word.slice(r.start, r.end)}
      </span>
    );
    cursor = r.end;
  });
  if (cursor < word.length) out.push(<span key="tail">{word.slice(cursor)}</span>);
  return out;
}

function renderHeartWord(word, hearts) {
  const set = new Set(hearts);
  return word.split('').map((ch, i) => (
    <span key={i} className="relative inline-block">
      {ch}
      {set.has(i) && (
        <span
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 top-full text-pink-500"
          style={{ fontSize: '0.55em', lineHeight: 1, marginTop: '0.05em' }}
        >
          ♥
        </span>
      )}
    </span>
  ));
}

export default function PatternText({
  word,
  variant = 'plain',
  patterns = [],
  hearts = [],
  className = ''
}) {
  if (!word) return null;
  if (variant === 'vowel-team' || variant === 'both') {
    if (variant === 'both') {
      return (
        <span className={`tracking-wide ${className}`}>
          {renderVowelTeam(word, patterns)}
        </span>
      );
    }
    return <span className={`tracking-wide ${className}`}>{renderVowelTeam(word, patterns)}</span>;
  }
  if (variant === 'heart-word') {
    return <span className={`tracking-wide ${className}`}>{renderHeartWord(word, hearts)}</span>;
  }
  return <span className={className}>{word}</span>;
}
