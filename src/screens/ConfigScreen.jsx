import DashConfig from './configs/DashConfig.jsx';
import LearningConfig from './configs/LearningConfig.jsx';
import HeartWordsConfig from './configs/HeartWordsConfig.jsx';

export default function ConfigScreen({ mode, initial, onStart, onBack }) {
  const Inner =
    mode === 'dash'        ? DashConfig :
    mode === 'learning'    ? LearningConfig :
    mode === 'heart_words' ? HeartWordsConfig :
                             null;

  return (
    <div className="mx-auto min-h-dvh w-full max-w-3xl p-6">
      <h2 className="mb-6 font-display text-2xl font-extrabold text-cream uppercase">{mode.replace('_', ' ')}</h2>
      <div className="rounded-3xl bg-cream p-6 text-ink shadow-2xl">
        {Inner ? <Inner initial={initial} onStart={onStart} onBack={onBack} /> : null}
      </div>
    </div>
  );
}
