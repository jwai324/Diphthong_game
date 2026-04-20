import { useEffect, useMemo, useState } from 'react';
import PatternText from '../components/PatternText.jsx';
import SoundKey from '../components/SoundKey.jsx';
import { speak, ttsAvailable } from '../utils/tts.js';
import { preload, play, audioAvailable } from '../utils/patternAudio.js';
import { nextLearningWord, recordResult, patternSummary } from '../utils/learningPicker.js';
import { getVowelTeamWords } from '../utils/wordBank.js';
import { getSettings } from '../utils/storage.js';

function findWordRecord(word) {
  return getVowelTeamWords().find((w) => w.word === word) ?? null;
}

export default function LearningScreen({ config, onExit }) {
  const patterns = config.patterns;
  const [pIdx, setPIdx]       = useState(0);
  const [word, setWord]       = useState(null);
  const [seen, setSeen]       = useState(0);
  const [gotCount, setGot]    = useState(0);
  const settings              = useMemo(() => getSettings(), []);
  const pattern               = patterns[pIdx];

  useEffect(() => { preload(patterns); }, [patterns]);

  useEffect(() => {
    const next = nextLearningWord(pattern);
    setWord(next);
    if (next) {
      speak(next).then(() => audioAvailable(pattern) && play(pattern));
    }
  }, [pattern]);

  const advance = (result) => {
    if (!word) return;
    recordResult(pattern, word, result);
    setSeen((n) => n + 1);
    if (result === 'gotIt') setGot((n) => n + 1);
    const next = nextLearningWord(pattern);
    if (next) {
      setWord(next);
      speak(next).then(() => audioAvailable(pattern) && play(pattern));
    } else if (pIdx + 1 < patterns.length) {
      setPIdx(pIdx + 1);
    } else {
      setWord(null);
    }
  };

  const summary = patternSummary(pattern);
  const record = findWordRecord(word);

  if (!word) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center justify-center gap-6 p-6 text-cream">
        <h2 className="text-3xl font-bold">All done!</h2>
        <p className="text-lg">Words seen this session: {seen} · Got it: {gotCount}</p>
        <button type="button" onClick={onExit} className="rounded-2xl bg-cream px-6 py-3 font-bold text-ink">
          Home
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-8 p-6 text-cream">
      <header className="flex items-center justify-between">
        <div className="text-sm uppercase tracking-wide">Pattern <strong>{pattern}</strong> · {summary.gotIt}/{summary.gotIt + summary.again + summary.unseen}</div>
        <button type="button" onClick={onExit} className="rounded-full bg-white/20 px-3 py-2 text-sm">Exit</button>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center gap-6">
        <div className="text-7xl font-extrabold sm:text-8xl">
          <PatternText
            word={word}
            variant="vowel-team"
            patterns={record?.patterns ?? [pattern]}
          />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => speak(word)}
            className="rounded-full bg-white/90 px-6 py-3 text-ink"
          >
            🔊 Word
          </button>
          {audioAvailable(pattern) && (
            <button
              type="button"
              onClick={() => play(pattern)}
              className="rounded-full bg-white/90 px-6 py-3 text-ink"
            >
              🎵 Pattern
            </button>
          )}
        </div>
        {!ttsAvailable() && (
          <p className="text-sm text-cream/80">Sound unavailable on this device — read the word above.</p>
        )}
      </section>

      <section className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => advance('again')}
          className="rounded-3xl bg-rose-400 py-6 text-2xl font-bold text-white shadow-lg active:scale-95"
        >
          AGAIN
        </button>
        <button
          type="button"
          onClick={() => advance('gotIt')}
          className="rounded-3xl bg-green-400 py-6 text-2xl font-bold text-ink shadow-lg active:scale-95"
        >
          GOT IT
        </button>
      </section>

      {settings.phoneticToggle && <SoundKey patterns={[pattern]} />}
    </div>
  );
}
