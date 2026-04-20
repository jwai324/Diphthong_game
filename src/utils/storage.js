const PREFIX = 'diphthongDash_';

function safeGet(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Quota or unavailable — silently no-op (matches Math Dash).
  }
}

export function getPresets()                  { return safeGet('presets', []); }
export function setPresets(presets)           { safeSet('presets', presets); }

export function getPersonalBests()            { return safeGet('personalBests', {}); }
export function setPersonalBests(bests)       { safeSet('personalBests', bests); }

export function getLearningState()            { return safeGet('learningState', {}); }
export function setLearningState(state)       { safeSet('learningState', state); }

export function getSettings() {
  return safeGet('settings', { phoneticToggle: true, sfxEnabled: true });
}
export function setSettings(settings)         { safeSet('settings', settings); }

// Stable hash of a config so personal bests bucket correctly across runs.
export function hashConfig(mode, config) {
  const fields = Object.keys(config).sort().map((k) => {
    const v = config[k];
    if (Array.isArray(v)) return `${k}=${[...v].sort().join(',')}`;
    return `${k}=${v}`;
  });
  return `${mode}__${fields.join('|')}`;
}

export function recordPersonalBest(mode, config, timeMs) {
  const key = hashConfig(mode, config);
  const bests = getPersonalBests();
  if (bests[key] == null || timeMs < bests[key]) {
    bests[key] = timeMs;
    setPersonalBests(bests);
    return true;
  }
  return false;
}

export function getPersonalBest(mode, config) {
  return getPersonalBests()[hashConfig(mode, config)] ?? null;
}
