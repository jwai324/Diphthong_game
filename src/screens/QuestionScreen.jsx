import { useEffect, useMemo, useRef, useState } from 'react';
import MultipleChoice from '../components/MultipleChoice.jsx';
import StreakCounter from '../components/StreakCounter.jsx';
import Timer from '../components/Timer.jsx';
import PatternText from '../components/PatternText.jsx';
import { speak, ttsAvailable } from '../utils/tts.js';
import { playDing, playBuzzer, playFanfare } from '../utils/sounds.js';
import { buildVowelTeamQuestions } from '../utils/vowelTeamGenerator.js';
import { buildHeartWordQuestions, dashAllocation, combineDashSources } from '../utils/heartWordQuestions.js';

const AUTO_ADVANCE_MS = 1500;

function buildQuestions(config) {
  if (config.mode === 'heart_words') {
    return buildHeartWordQuestions(config, config.questionCount);
  }
  if (config.mode === 'dash') {
    const { vowel, heart } = dashAllocation({
      patternsCount: config.patterns?.length ?? 0,
      gradesCount:   config.grades?.length ?? 0,
      total:         config.questionCount
    });
    const vowelTeamQs = vowel ? buildVowelTeamQuestions(config, vowel) : [];
    const heartWordQs = heart ? buildHeartWordQuestions({ grades: config.grades }, heart) : [];
    return combineDashSources({ vowelTeamQs, heartWordQs });
  }
  return [];
}

export default function QuestionScreen({ config, onFinish }) {
  const questions = useMemo(() => buildQuestions(config), [config]);
  const [idx, setIdx]             = useState(0);
  const [streak, setStreak]       = useState(0);
  const [highlight, setHighlight] = useState(null);
  const [shake, setShake]         = useState(false);
  const [results, setResults]     = useState([]);
  const startedAt                 = useRef(Date.now());
  const questionStart             = useRef(Date.now());

  const q = questions[idx];

  useEffect(() => {
    if (!q) return;
    questionStart.current = Date.now();
    speak(q.word.word);
  }, [q]);

  if (!q) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-cream">
        No words available for this configuration.
      </div>
    );
  }

  const handlePick = (choice) => {
    if (highlight) return;
    const correct = choice === q.word.word;
    const next = { ...q, picked: choice, correct, elapsed: Date.now() - questionStart.current };
    setResults((r) => [...r, next]);
    if (correct) {
      playDing();
      setStreak((s) => s + 1);
      setHighlight({ [choice]: 'correct' });
    } else {
      playBuzzer();
      setStreak(0);
      setShake(true);
      setTimeout(() => setShake(false), 250);
      setHighlight({ [choice]: 'wrong', [q.word.word]: 'correct' });
    }
    setTimeout(() => {
      setHighlight(null);
      const nextIdx = idx + 1;
      if (nextIdx >= questions.length) {
        playFanfare();
        onFinish({
          results: [...results, next],
          totalMs: Date.now() - startedAt.current,
          startedAt: startedAt.current
        });
      } else {
        setIdx(nextIdx);
      }
    }, AUTO_ADVANCE_MS);
  };

  return (
    <div className={`mx-auto flex min-h-dvh w-full max-w-4xl flex-col gap-6 p-6 ${shake ? 'animate-pulse' : ''}`}>
      <header className="flex items-center justify-between text-cream">
        <div className="text-sm uppercase tracking-wide">Q {idx + 1} / {questions.length}</div>
        <Timer startedAt={startedAt.current} running />
        <StreakCounter streak={streak} />
      </header>

      <section className="flex flex-1 flex-col items-center justify-center gap-6">
        <button
          type="button"
          aria-label="Replay word"
          onClick={() => speak(q.word.word)}
          className="rounded-full bg-white/90 px-8 py-6 text-4xl text-ink shadow-xl"
        >
          {ttsAvailable() ? '🔊 Tap to hear' : <span className="font-bold">{q.word.word}</span>}
        </button>
        {!ttsAvailable() && (
          <p className="text-sm text-cream/80">Sound unavailable on this device — read the word above.</p>
        )}
      </section>

      <section>
        <MultipleChoice
          choices={q.choices}
          highlight={highlight}
          disabled={!!highlight}
          onSelect={handlePick}
        />
      </section>

      {highlight && q.kind === 'heart-word' && (
        <div className="text-center text-3xl text-cream">
          <PatternText word={q.word.word} variant="heart-word" hearts={q.word.heart_indices} />
        </div>
      )}
    </div>
  );
}
