let voicesReady = false;
let cachedVoice = null;

const PREFERRED_VOICES = [
  'Samantha', 'Karen', 'Moira', 'Tessa',
  'Google US English', 'Microsoft Aria Online (Natural)'
];

function pickVoice() {
  const synth = window.speechSynthesis;
  if (!synth) return null;
  const voices = synth.getVoices();
  if (!voices.length) return null;
  const en = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('en-us'));
  for (const name of PREFERRED_VOICES) {
    const hit = en.find((v) => v.name === name);
    if (hit) return hit;
  }
  return en[0] ?? voices[0];
}

export function ttsAvailable() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function warmUp() {
  if (!ttsAvailable()) return;
  try {
    const u = new SpeechSynthesisUtterance('');
    window.speechSynthesis.speak(u);
  } catch { /* ignore */ }
}

export function speak(text, { rate = 0.85 } = {}) {
  return new Promise((resolve) => {
    if (!ttsAvailable() || !text) { resolve(); return; }
    const synth = window.speechSynthesis;
    if (!voicesReady) {
      cachedVoice = pickVoice();
      voicesReady = !!cachedVoice;
    }
    try { synth.cancel(); } catch { /* ignore */ }
    const u = new SpeechSynthesisUtterance(text);
    if (cachedVoice) u.voice = cachedVoice;
    u.rate = rate;
    u.lang = 'en-US';
    u.onend = () => resolve();
    u.onerror = () => resolve();
    synth.speak(u);
  });
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = pickVoice();
    voicesReady = !!cachedVoice;
  };
}
