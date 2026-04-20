import PatternText from '../components/PatternText.jsx';
import SoundKey from '../components/SoundKey.jsx';
import { getSettings } from '../utils/storage.js';

export default function ReviewScreen({ config, results, onHome }) {
  const settings = getSettings();
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-6 p-6 text-cream">
      <header className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-extrabold">Review</h2>
        <button type="button" onClick={onHome} className="rounded-full bg-white/20 px-4 py-2">Home</button>
      </header>
      <ul className="space-y-3">
        {results.map((r, i) => {
          const word = r.word;
          const variant = r.kind === 'heart-word' ? 'heart-word' : 'vowel-team';
          return (
            <li
              key={i}
              className={`rounded-2xl p-4 text-2xl ${r.correct ? 'bg-green-200/90 text-ink' : 'bg-red-200/90 text-ink'}`}
            >
              <div className="flex items-baseline justify-between">
                <PatternText
                  word={word.word}
                  variant={variant}
                  patterns={word.patterns ?? []}
                  hearts={word.heart_indices ?? []}
                />
                <span className="text-sm tabular-nums">{(r.elapsed / 1000).toFixed(1)}s</span>
              </div>
              {!r.correct && (
                <div className="mt-1 text-sm">picked: <strong>{r.picked}</strong></div>
              )}
            </li>
          );
        })}
      </ul>
      {settings.phoneticToggle && config.mode !== 'heart_words' && (
        <SoundKey patterns={config.patterns ?? []} />
      )}
    </div>
  );
}
