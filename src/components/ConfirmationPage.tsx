'use client';

import { useRef, useEffect } from 'react';

interface ConfirmationPageProps {
  isOpen: boolean;
  type: 'attending' | 'cant';
  guestName?: string;
}

export default function ConfirmationPage({ isOpen, type, guestName }: ConfirmationPageProps) {
  const frozenType = useRef<'attending' | 'cant' | null>(null);

  useEffect(() => {
    if (isOpen) frozenType.current = type;
  }, [isOpen, type]);

  const displayType = frozenType.current;
  if (!displayType) return null;

  const word = displayType === 'attending' ? 'See You There' : 'Raincheck.';
  const sub = displayType === 'attending'
    ? 'May 31. Terman Fountain. Please arrive at six PM if you want to catch the show.'
    : `We'll miss you${guestName ? `, ${guestName}` : ''} — thank you for letting us know.`;

  return (
    <div
      className={`confirmation-page${isOpen ? ' open' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={word}
    >
      <div className="confirmation-rain-lines" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="rain-line"
            style={{
              left: `${(i / 24) * 100 + Math.random() * 3}%`,
              height: `${Math.random() * 80 + 60}px`,
              animationDuration: `${Math.random() * 1.2 + 0.8}s`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.4 + 0.1,
            }}
          />
        ))}
      </div>

      <p className="confirmation-word helvetica-bold">{word}</p>
      <p className="confirmation-sub">{sub}</p>
    </div>
  );
}
