'use client';

import { useRef, useEffect, useState } from 'react';

interface ConfirmationPageProps {
  isOpen: boolean;
  type: 'attending' | 'cant';
  guestName?: string;
}

const FAQ = [
  {
    q: 'Is there a dress code?',
    a: 'No.',
  },
  {
    q: 'What is the timing?',
    a: 'Short and sweet. Please be there at six if you want to catch the show.',
  },
];

export default function ConfirmationPage({ isOpen, type, guestName }: ConfirmationPageProps) {
  const frozenType = useRef<'attending' | 'cant' | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [faqOpen, setFaqOpen] = useState(false);

  useEffect(() => {
    if (isOpen) frozenType.current = type;
  }, [isOpen, type]);

  // Reset FAQ when page closes
  useEffect(() => {
    if (!isOpen) { setFaqOpen(false); setOpenFaq(null); }
  }, [isOpen]);

  const displayType = frozenType.current;
  if (!displayType) return null;

  const word = displayType === 'attending' ? 'See You There' : 'Raincheck.';
  const sub = displayType === 'attending'
    ? 'May 31 · Six PM · Terman Fountain'
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

      <div className="confirmation-content">
        <p className="confirmation-word helvetica-bold">{word}</p>
        <p className="confirmation-sub">{sub}</p>

        {/* FAQ — only on attending confirmation */}
        {displayType === 'attending' && (
          <div className={`faq-section${isOpen ? ' faq-visible' : ''}`}>
            <button
              className="faq-toggle"
              onClick={() => setFaqOpen(o => !o)}
              aria-expanded={faqOpen}
            >
              <span className="helvetica-regular">FAQ</span>
              <span className={`faq-chevron${faqOpen ? ' open' : ''}`} aria-hidden="true">
                <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
                  <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>

            <div className={`faq-body${faqOpen ? ' open' : ''}`}>
              {FAQ.map((item, i) => (
                <div key={i} className="faq-item">
                  <button
                    className="faq-q helvetica-regular"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span>{item.q}</span>
                    <span className={`faq-chevron small${openFaq === i ? ' open' : ''}`} aria-hidden="true">
                      <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                  <div className={`faq-a helvetica-regular${openFaq === i ? ' open' : ''}`}>
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
