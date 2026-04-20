const GRADES = ['K', '1', '2', '3', '4'];

export default function GradeChecklist({ selected, onChange }) {
  const set = new Set(selected);
  const toggle = (g) => {
    if (set.has(g)) set.delete(g); else set.add(g);
    onChange(Array.from(set));
  };
  return (
    <div className="flex flex-wrap gap-3">
      {GRADES.map((g) => {
        const on = set.has(g);
        return (
          <button
            key={g}
            type="button"
            onClick={() => toggle(g)}
            className={`h-14 w-14 rounded-full border-2 text-xl font-bold shadow-sm transition ${on ? 'border-ink bg-sky-300' : 'border-slate-200 bg-white'}`}
          >
            {g}
          </button>
        );
      })}
    </div>
  );
}
