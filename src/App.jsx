import { useEffect, useState } from 'react';
import LandingScreen from './screens/LandingScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import ConfigScreen from './screens/ConfigScreen.jsx';
import CountdownScreen from './screens/CountdownScreen.jsx';
import QuestionScreen from './screens/QuestionScreen.jsx';
import LearningScreen from './screens/LearningScreen.jsx';
import FinishScreen from './screens/FinishScreen.jsx';
import ReviewScreen from './screens/ReviewScreen.jsx';
import { requestWakeLock, releaseWakeLock } from './utils/wakeLock.js';

export default function App() {
  const [showLanding, setShowLanding] = useState(() => {
    return localStorage.getItem('dismissedLanding') !== 'true';
  });
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

  const dismissLanding = () => {
    localStorage.setItem('dismissedLanding', 'true');
    setShowLanding(false);
    setScreen('home');
  };

  const goHome = () => { setScreen('home'); setMode(null); setConfig(null); setResults([]); };

  const startConfig = (id) => { setMode(id); setConfig(null); setScreen('config'); };

  const startRun = (cfg) => {
    setConfig(cfg);
    if (cfg.mode === 'learning') setScreen('learning');
    else setScreen('countdown');
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-indigo-700 via-purple-700 to-rose-600 font-display text-ink">
      {showLanding && (
        <LandingScreen onEnter={dismissLanding} />
      )}
      {!showLanding && screen === 'home' && (
        <HomeScreen
          onPickMode={startConfig}
          onLoadPreset={(p) => { setMode(p.mode); setConfig(p.config); setScreen('config'); }}
        />
      )}
      {!showLanding && screen === 'config' && mode && (
        <ConfigScreen
          mode={mode}
          initial={config}
          onStart={startRun}
          onBack={goHome}
        />
      )}
      {!showLanding && screen === 'countdown' && (
        <CountdownScreen onDone={() => setScreen('game')} />
      )}
      {!showLanding && screen === 'game' && config && (
        <QuestionScreen
          config={config}
          onFinish={(r) => { setResults(r.results); setTotalMs(r.totalMs); setScreen('finish'); }}
        />
      )}
      {!showLanding && screen === 'learning' && config && (
        <LearningScreen config={config} onExit={goHome} />
      )}
      {!showLanding && screen === 'finish' && config && (
        <FinishScreen
          config={config}
          results={results}
          totalMs={totalMs}
          onReview={() => setScreen('review')}
          onHome={goHome}
        />
      )}
      {!showLanding && screen === 'review' && config && (
        <ReviewScreen config={config} results={results} onHome={goHome} />
      )}
    </div>
  );
}
