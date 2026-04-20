export default function MultipleChoice({ choices, onSelect, disabled, highlight }) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {choices.map((c) => {
        const state = highlight?.[c];
        const base = 'rounded-3xl py-8 px-6 text-3xl font-bold shadow-lg transition active:scale-95';
        const tone =
          state === 'correct' ? 'bg-green-400 text-ink' :
          state === 'wrong'   ? 'bg-red-400 text-white' :
                                'bg-white text-ink hover:bg-amber-100';
        return (
          <button
            key={c}
            type="button"
            disabled={disabled}
            onClick={() => onSelect?.(c)}
            className={`${base} ${tone} disabled:cursor-not-allowed`}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
