import { useState } from 'react';
import ModeSelector from '../components/ModeSelector.jsx';
import SettingsSheet from '../components/SettingsSheet.jsx';
import { getPresets } from '../utils/storage.js';
import { warmUp } from '../utils/tts.js';

export default function HomeScreen({ onPickMode, onLoadPreset }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const presets = getPresets();

  const handleMode = (id) => {
    warmUp();
    onPickMode(id);
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-8 p-6">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-extrabold text-cream sm:text-4xl">
          Diphthong Dash
        </h1>
        <button
          type="button"
          aria-label="Settings"
          onClick={() => setSettingsOpen(true)}
          className="rounded-full bg-white/20 p-3 text-2xl text-white"
        >
          ⚙️
        </button>
      </header>

      <ModeSelector onSelect={handleMode} />

      {presets.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold text-cream">Presets</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {presets.map((p, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => onLoadPreset(p)}
                  className="w-full rounded-2xl bg-white/90 p-4 text-left shadow"
                >
                  <div className="text-sm uppercase tracking-wide text-slate-500">{p.mode}</div>
                  <div className="text-lg font-bold">{p.name}</div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
