import { useEffect, useState } from 'react';
import { playCountdown } from '../utils/sounds.js';

export default function CountdownScreen({ onDone }) {
  const [n, setN] = useState(3);
  useEffect(() => {
    playCountdown();
    const id = setInterval(() => {
      setN((prev) => {
        const next = prev - 1;
        if (next < 0) {
          clearInterval(id);
          onDone();
          return prev;
        }
        playCountdown();
        return next;
      });
    }, 700);
    return () => clearInterval(id);
  }, [onDone]);
  const label = n > 0 ? n : 'GO!';
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="font-display text-9xl font-extrabold text-cream sm:text-[12rem]">{label}</div>
    </div>
  );
}
