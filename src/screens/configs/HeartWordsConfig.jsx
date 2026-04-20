import { useState } from 'react';
import GradeChecklist from '../../components/GradeChecklist.jsx';

const COUNTS = [5, 10, 15, 20];

export default function HeartWordsConfig({ initial, onStart, onBack }) {
  const [grades, setGrades]       = useState(initial?.grades ?? []);
  const [questionCount, setCount] = useState(initial?.questionCount ?? 10);
  const ready = grades.length >= 1;
  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-2 text-lg font-bold">Grades</h3>
        <GradeChecklist selected={grades} onChange={setGrades} />
      </section>
      <section>
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
      </section>
      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="rounded-2xl bg-white px-5 py-3 font-bold">Back</button>
        <button
          type="button"
          disabled={!ready}
          onClick={() => onStart({ mode: 'heart_words', grades, questionCount })}
          className="flex-1 rounded-2xl bg-ink px-5 py-3 font-bold text-white disabled:opacity-40"
        >Start</button>
      </div>
    </div>
  );
}
