import { recordPersonalBest, getPersonalBest } from '../utils/storage.js';

export default function FinishScreen({ config, results, totalMs, onReview, onHome }) {
  const correct = results.filter((r) => r.correct).length;
  const total   = results.length;
  const avgMs   = total ? Math.round(results.reduce((a, r) => a + r.elapsed, 0) / total) : 0;
  const isBest  = recordPersonalBest(config.mode, config, totalMs);
  const best    = getPersonalBest(config.mode, config);
  let longest = 0, current = 0;
  for (const r of results) {
    if (r.correct) { current += 1; if (current > longest) longest = current; }
    else current = 0;
  }
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center justify-center gap-6 p-6 text-cream">
      <h2 className="font-display text-4xl font-extrabold">Nice run!</h2>
      <div className="grid w-full grid-cols-2 gap-3 rounded-3xl bg-white/10 p-6 text-lg">
        <div>Correct</div>            <div className="text-right tabular-nums">{correct}/{total}</div>
        <div>Total time</div>         <div className="text-right tabular-nums">{(totalMs / 1000).toFixed(1)}s</div>
        <div>Average / question</div> <div className="text-right tabular-nums">{(avgMs / 1000).toFixed(1)}s</div>
        <div>Longest streak</div>     <div className="text-right tabular-nums">{longest}</div>
        <div>Personal best</div>      <div className="text-right tabular-nums">{best != null ? `${(best/1000).toFixed(1)}s` : '—'}</div>
      </div>
      {isBest && <div className="text-xl font-bold text-amber-200">⭐ New personal best!</div>}
      <div className="flex gap-3">
        <button type="button" onClick={onHome} className="rounded-2xl bg-white/20 px-5 py-3 font-bold">Home</button>
        <button type="button" onClick={onReview} className="rounded-2xl bg-cream px-5 py-3 font-bold text-ink">Review</button>
      </div>
    </div>
  );
}
