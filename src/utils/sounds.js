import { getSettings } from './storage.js';

let ctx = null;
function audioCtx() {
  if (!ctx) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (Ctor) ctx = new Ctor();
  }
  return ctx;
}

function tone({ freq, duration = 0.15, type = 'sine', gain = 0.2 }) {
  if (!getSettings().sfxEnabled) return;
  const ac = audioCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g);
  g.connect(ac.destination);
  osc.start();
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
  osc.stop(ac.currentTime + duration);
}

export const playDing      = () => tone({ freq: 880, duration: 0.18, type: 'sine' });
export const playBuzzer    = () => tone({ freq: 160, duration: 0.30, type: 'square', gain: 0.15 });
export const playCountdown = () => tone({ freq: 660, duration: 0.10, type: 'triangle' });

export function playFanfare() {
  if (!getSettings().sfxEnabled) return;
  [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone({ freq: f, duration: 0.18 }), i * 100));
}
