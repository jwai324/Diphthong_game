import { useEffect, useState } from 'react';

export default function Timer({ startedAt, running }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [running]);
  const elapsed = Math.max(0, (running ? now : startedAt) - startedAt);
  const s = (elapsed / 1000).toFixed(1);
  return <span className="font-mono tabular-nums">{s}s</span>;
}
