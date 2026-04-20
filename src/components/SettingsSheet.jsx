import { useState } from 'react';
import { getSettings, setSettings } from '../utils/storage.js';

export default function SettingsSheet({ open, onClose }) {
  const [s, setS] = useState(() => getSettings());

  if (!open) return null;
  const update = (patch) => {
    const next = { ...s, ...patch };
    setS(next);
    setSettings(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-3xl bg-cream p-6 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-xl font-bold">Settings</h2>
        <label className="mb-3 flex items-center justify-between gap-4">
          <span>Show phonetic sound key</span>
          <input
            type="checkbox"
            checked={!!s.phoneticToggle}
            onChange={(e) => update({ phoneticToggle: e.target.checked })}
            className="h-6 w-6"
          />
        </label>
        <label className="mb-6 flex items-center justify-between gap-4">
          <span>Sound effects</span>
          <input
            type="checkbox"
            checked={!!s.sfxEnabled}
            onChange={(e) => update({ sfxEnabled: e.target.checked })}
            className="h-6 w-6"
          />
        </label>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-2xl bg-ink py-3 text-white"
        >
          Done
        </button>
      </div>
    </div>
  );
}
