import patternMeta from '../data/patternMeta.json';

export default function SoundKey({ patterns }) {
  if (!patterns?.length) return null;
  return (
    <div className="rounded-2xl bg-white/80 p-4 text-sm">
      <div className="mb-2 font-bold uppercase tracking-wide text-slate-500">Sound key</div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {patterns.map((p) => {
          const m = patternMeta[p];
          if (!m) return null;
          return (
            <li key={p} className="flex items-center gap-2">
              <span className="font-bold" style={{ color: m.color }}>{p}</span>
              <span className="text-slate-700">{m.sound_label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
