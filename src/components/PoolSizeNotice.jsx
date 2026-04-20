import { getEffectivePoolSize } from '../utils/wordBank.js';

export default function PoolSizeNotice({ mode, config, questionCount }) {
  if (!questionCount) return null;
  const pool = getEffectivePoolSize(mode, config);
  if (pool <= 0) return null;
  const ratio = pool / questionCount;
  if (ratio >= 2) return null;
  if (ratio >= 1) {
    return (
      <div className="rounded-xl bg-amber-100 px-4 py-2 text-sm text-amber-900">
        Small word set ({pool} words for {questionCount} questions) — expect some repeats.
      </div>
    );
  }
  return (
    <div className="rounded-xl bg-rose-100 px-4 py-2 text-sm text-rose-900">
      Very small word set ({pool} words for {questionCount} questions) — every word will repeat.
    </div>
  );
}
