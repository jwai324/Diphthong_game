export default function StreakCounter({ streak }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-ink">
      <span className="text-xl">🔥</span>
      <span className="text-lg font-bold tabular-nums">{streak}</span>
    </div>
  );
}
