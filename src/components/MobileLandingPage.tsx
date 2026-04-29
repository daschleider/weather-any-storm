'use client';

import { useRef, useEffect, useState } from 'react';

interface MobileLandingPageProps {
  isVisible: boolean;
  onRSVPClick: () => void;
}

const LAYERS = [
  { src: '/images/layer-0.png', label: 'Weather',             delay: 0   },
  { src: '/images/layer-1.png', label: 'Any',                 delay: 0.3 },
  { src: '/images/layer-2.png', label: 'Storm',               delay: 0.6 },
  { src: '/images/layer-3.png', label: 'Dominique Schleider', delay: 0.9 },
];

// Last layer finishes at delay 0.9s + transition 0.92s = ~1.82s
const LAST_LAYER_DONE = 1900;

export default function MobileLandingPage({ isVisible, onRSVPClick }: MobileLandingPageProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const artSectionRef = useRef<HTMLElement>(null);
  const animatedOnce = useRef(false);
  const [layersIn, setLayersIn] = useState(false);
  const [useDelays, setUseDelays] = useState(false);
  const [nudge, setNudge] = useState(false); // triggers the peek animation

  useEffect(() => {
    if (!isVisible) return;
    if (!animatedOnce.current) {
      animatedOnce.current = true;
      setUseDelays(true);
      const t1 = setTimeout(() => setLayersIn(true), 150);
      // After all layers land, do one gentle peek nudge
      const t2 = setTimeout(() => {
        setNudge(true);
        // Reset nudge class after animation completes so it can't re-trigger
        setTimeout(() => setNudge(false), 1200);
      }, LAST_LAYER_DONE + 600);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else {
      setUseDelays(false);
      setLayersIn(true);
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isVisible]);

  // Logo scroll-to-top
  useEffect(() => {
    const handler = () => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    window.addEventListener('mobile-scroll-top', handler);
    return () => window.removeEventListener('mobile-scroll-top', handler);
  }, []);

  // Arrow click — scroll down to text section
  const handleArrowClick = () => {
    const artH = artSectionRef.current?.offsetHeight ?? window.innerHeight;
    scrollRef.current?.scrollTo({ top: artH, behavior: 'smooth' });
  };

  const handleRSVPButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
    onRSVPClick();
  };

  return (
    <main
      ref={scrollRef}
      className={`mobile-landing${isVisible ? '' : ' mobile-landing-hidden'}`}
      aria-hidden={!isVisible}
    >
      {/* Full-screen artwork section */}
      <section
        ref={artSectionRef}
        className={`mobile-art-section${nudge ? ' nudge' : ''}`}
      >
        <div className="mobile-layers-stack">
          {LAYERS.map((layer) => (
            <img
              key={layer.src}
              src={layer.src}
              alt={layer.label}
              className={`layer-img${layersIn ? ' in' : ''}`}
              style={{ transitionDelay: useDelays ? `${layer.delay}s` : '0s' }}
              draggable={false}
            />
          ))}
        </div>

        {/* Clickable scroll hint arrow */}
        <button
          className={`scroll-hint${layersIn ? ' scroll-hint-visible' : ''}`}
          onClick={handleArrowClick}
          aria-label="Scroll down"
        >
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
            <path d="M1 1L11 12L21 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </section>

      {/* Text + RSVP section */}
      <section className="mobile-text-section">
        <div className="mobile-text-inner">
          <h1 className="show-title helvetica-bold">
            Weather<br />Any<br />Storm
          </h1>

          <p className="show-subtitle helvetica-italic">
            Dominique Schleider<br />Senior Show
          </p>

          <div className="show-details helvetica-regular">
            May 31. Six PM.<br />
            Terman Fountain<br />
            Stanford University
          </div>

          <p className="show-thanks helvetica-regular">
            Thank you to the Stanford Arts Institute<br />
            x The Arbor
          </p>

          <button
            ref={btnRef}
            className="rsvp-btn"
            onClick={handleRSVPButtonClick}
            aria-label="Open RSVP form"
          >
            RSVP
          </button>
        </div>
      </section>
    </main>
  );
}
