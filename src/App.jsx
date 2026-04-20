import { useEffect, useState } from 'react';
import HomeScreen from './screens/HomeScreen.jsx';
import ConfigScreen from './screens/ConfigScreen.jsx';
import CountdownScreen from './screens/CountdownScreen.jsx';
import QuestionScreen from './screens/QuestionScreen.jsx';
import LearningScreen from './screens/LearningScreen.jsx';
import FinishScreen from './screens/FinishScreen.jsx';
import ReviewScreen from './screens/ReviewScreen.jsx';
import { requestWakeLock, releaseWakeLock } from './utils/wakeLock.js';

export default function App() {
  const [screen, setScreen]   = useState('home');
  const [mode, setMode]       = useState(null);
  const [config, setConfig]   = useState(null);
  const [results, setResults] = useState([]);
  const [totalMs, setTotalMs] = useState(0);

  useEffect(() => {
    if (screen === 'game' || screen === 'learning' || screen === 'countdown') {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
  }, [screen]);

  const goHome = () => { setScreen('home'); setMode(null); setConfig(null); setResults([]); };

  const startConfig = (id) => { setMode(id); setConfig(null); setScreen('config'); };

  const startRun = (cfg) => {
    setConfig(cfg);
    if (cfg.mode === 'learning') setScreen('learning');
    else setScreen('countdown');
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-indigo-700 via-purple-700 to-rose-600 font-display text-ink">
      {screen === 'home' && (
        <HomeScreen
          onPickMode={startConfig}
          onLoadPreset={(p) => { setMode(p.mode); setConfig(p.config); setScreen('config'); }}
        />
      )}
      {screen === 'config' && mode && (
        <ConfigScreen
          mode={mode}
          initial={config}
          onStart={startRun}
          onBack={goHome}
        />
      )}
      {screen === 'countdown' && (
        <CountdownScreen onDone={() => setScreen('game')} />
      )}
      {screen === 'game' && config && (
        <QuestionScreen
          config={config}
          onFinish={(r) => { setResults(r.results); setTotalMs(r.totalMs); setScreen('finish'); }}
        />
      )}
      {screen === 'learning' && config && (
        <LearningScreen config={config} onExit={goHome} />
      )}
      {screen === 'finish' && config && (
        <FinishScreen
          config={config}
          results={results}
          totalMs={totalMs}
          onReview={() => setScreen('review')}
          onHome={goHome}
        />
      )}
      {screen === 'review' && config && (
        <ReviewScreen config={config} results={results} onHome={goHome} />
      )}
    </div>
  );
}
