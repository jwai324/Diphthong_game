import { useState } from 'react';
import PatternChecklist from '../../components/PatternChecklist.jsx';
import GradeChecklist from '../../components/GradeChecklist.jsx';

const COUNTS = [5, 10, 15, 20];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function DashConfig({ initial, onStart, onBack }) {
  const [patterns, setPatterns]           = useState(initial?.patterns ?? []);
  const [grades, setGrades]               = useState(initial?.grades ?? []);
  const [difficulty, setDifficulty]       = useState(initial?.difficulty ?? 'easy');
  const [trickyMode, setTrickyMode]       = useState(!!initial?.trickyMode);
  const [physicalPenalty, setPenalty]     = useState(!!initial?.physicalPenalty);
  const [questionCount, setCount]         = useState(initial?.questionCount ?? 10);

  const ready = patterns.length + grades.length >= 1;

  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-2 text-lg font-bold">Vowel team patterns</h3>
        <PatternChecklist selected={patterns} onChange={setPatterns} />
      </section>

      <section>
        <h3 className="mb-2 text-lg font-bold">Heart word grades</h3>
        <GradeChecklist selected={grades} onChange={setGrades} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="mb-2 text-lg font-bold">Difficulty</h3>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`flex-1 rounded-xl border-2 px-3 py-2 capitalize ${difficulty === d ? 'border-ink bg-amber-200' : 'border-slate-200 bg-white'}`}
              >{d}</button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-bold">Questions</h3>
          <div className="flex gap-2">
            {COUNTS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                className={`flex-1 rounded-xl border-2 px-3 py-2 ${questionCount === n ? 'border-ink bg-amber-200' : 'border-slate-200 bg-white'}`}
              >{n}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <label className="flex items-center gap-3">
          <input type="checkbox" className="h-5 w-5" checked={trickyMode} onChange={(e) => setTrickyMode(e.target.checked)} />
          <span className="font-bold">Tricky Mode</span>
          <span className="text-sm text-slate-500">(homophones + position-rule violators)</span>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" className="h-5 w-5" checked={physicalPenalty} onChange={(e) => setPenalty(e.target.checked)} />
          <span className="font-bold">Physical penalty</span>
          <span className="text-sm text-slate-500">(GO! interstitial after wrong answers)</span>
        </label>
      </section>

      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="rounded-2xl bg-white px-5 py-3 font-bold">Back</button>
        <button
          type="button"
          disabled={!ready}
          onClick={() => onStart({ mode: 'dash', patterns, grades, difficulty, trickyMode, physicalPenalty, questionCount })}
          className="flex-1 rounded-2xl bg-ink px-5 py-3 font-bold text-white disabled:opacity-40"
        >Start</button>
      </div>
    </div>
  );
}
