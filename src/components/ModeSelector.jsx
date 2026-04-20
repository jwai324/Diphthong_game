const MODES = [
  { id: 'dash',        label: 'DASH',        sub: 'Run between questions', tone: 'from-pink-500 to-rose-500' },
  { id: 'learning',    label: 'LEARNING',    sub: 'One pattern at a time', tone: 'from-amber-400 to-orange-500' },
  { id: 'heart_words', label: 'HEART WORDS', sub: 'Tricky sight words',    tone: 'from-sky-400 to-indigo-500' }
];

export default function ModeSelector({ onSelect }) {
  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onSelect(m.id)}
          className={`flex flex-col items-center justify-center gap-2 rounded-3xl bg-gradient-to-br ${m.tone} p-8 text-white shadow-2xl transition active:scale-95`}
        >
          <span className="text-3xl font-extrabold tracking-wide">{m.label}</span>
          <span className="text-base opacity-90">{m.sub}</span>
        </button>
      ))}
    </div>
  );
}
