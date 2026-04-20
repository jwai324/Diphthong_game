import patternMeta from '../data/patternMeta.json';

export default function PatternChecklist({ selected, onChange }) {
  const set = new Set(selected);
  const toggle = (p) => {
    if (set.has(p)) set.delete(p); else set.add(p);
    onChange(Array.from(set));
  };
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Object.entries(patternMeta).map(([p, meta]) => {
        const on = set.has(p);
        return (
          <button
            key={p}
            type="button"
            onClick={() => toggle(p)}
            className={`rounded-2xl border-2 px-4 py-3 text-lg font-bold shadow-sm transition ${on ? 'border-ink bg-amber-200' : 'border-slate-200 bg-white'}`}
            style={{ color: meta.color }}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}
