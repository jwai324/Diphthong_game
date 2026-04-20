let sentinel = null;

export async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      sentinel = await navigator.wakeLock.request('screen');
      sentinel.addEventListener?.('release', () => { sentinel = null; });
    }
  } catch {
    sentinel = null;
  }
}

export async function releaseWakeLock() {
  try { await sentinel?.release(); } catch { /* ignore */ }
  sentinel = null;
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !sentinel) requestWakeLock();
  });
}
