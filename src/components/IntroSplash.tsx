'use client';

import { useEffect, useState, useMemo } from 'react';

interface IntroSplashProps {
  onComplete: () => void;
}

// Pre-generate stable random values so they don't re-randomize on re-render
function useStableLines(count: number) {
  return useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      left: `${(i / count) * 100 + (((i * 7.3) % 3) - 1.5)}%`,
      height: `${((i * 43) % 80) + 50}px`,
      duration: `${((i * 17) % 12) / 10 + 0.7}s`,
      delay: `${((i * 31) % 20) / 10}s`,
      opacity: ((i * 13) % 40) / 100 + 0.08,
    }));
  }, [count]);
}

export default function IntroSplash({ onComplete }: IntroSplashProps) {
  const [phase, setPhase] = useState<'rain' | 'text' | 'exit'>('rain');
  const lines = useStableLines(36);

  useEffect(() => {
    // Phase 1: just rain for 1.2s
    const t1 = setTimeout(() => setPhase('text'), 1200);
    // Phase 2: title fades in, holds for 1.6s
    const t2 = setTimeout(() => setPhase('exit'), 3200);
    // Phase 3: fade out, then tell parent we're done
    const t3 = setTimeout(() => onComplete(), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div className={`intro-splash${phase === 'exit' ? ' exit' : ''}`} aria-hidden="true">
      {/* Rain lines */}
      <div className="intro-rain-lines">
        {lines.map((l, i) => (
          <div
            key={i}
            className="rain-line"
            style={{
              left: l.left,
              height: l.height,
              animationDuration: l.duration,
              animationDelay: l.delay,
              opacity: l.opacity,
            }}
          />
        ))}
      </div>

      {/* Title reveal */}
      <div className={`intro-text${phase === 'text' || phase === 'exit' ? ' visible' : ''}`}>
        <span className="intro-title helvetica-bold">Weather<br />Any<br />Storm</span>
      </div>
    </div>
  );
}
