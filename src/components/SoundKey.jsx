import patternMetaData from '../data/patternMeta.json';

const PATTERNS = patternMetaData.patterns ?? {};

export default function SoundKey({ patterns }) {
  if (!patterns?.length) return null;
  const rows = [];
  for (const p of patterns) {
    const m = PATTERNS[p];
    if (!m) continue;
    for (const v of m.variants ?? []) {
      rows.push({ p, color: m.color, label: v.sound_label, variantId: v.id });
    }
  }
  if (!rows.length) return null;
  return (
    <div className="rounded-2xl bg-white/80 p-4 text-sm">
      <div className="mb-2 font-bold uppercase tracking-wide text-slate-500">Sound key</div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {rows.map((r) => (
          <li key={r.variantId} className="flex items-center gap-2">
            <span className="font-bold" style={{ color: r.color }}>{r.p}</span>
            <span className="text-slate-700">{r.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
