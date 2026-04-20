import { useState } from 'react';
import PatternChecklist from '../../components/PatternChecklist.jsx';

export default function LearningConfig({ initial, onStart, onBack }) {
  const [patterns, setPatterns] = useState(initial?.patterns ?? []);
  const ready = patterns.length >= 1;
  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-2 text-lg font-bold">Pick patterns to learn</h3>
        <PatternChecklist selected={patterns} onChange={setPatterns} />
      </section>
      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="rounded-2xl bg-white px-5 py-3 font-bold">Back</button>
        <button
          type="button"
          disabled={!ready}
          onClick={() => onStart({ mode: 'learning', patterns })}
          className="flex-1 rounded-2xl bg-ink px-5 py-3 font-bold text-white disabled:opacity-40"
        >Start</button>
      </div>
    </div>
  );
}
