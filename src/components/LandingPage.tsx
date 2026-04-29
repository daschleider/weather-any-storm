'use client';

import { useRef, useEffect, useState } from 'react';

interface LandingPageProps {
  isVisible: boolean;
  onRSVPClick: () => void;
}

const LAYERS = [
  { src: '/images/layer-0.png', label: 'Weather',             delay: 0   },
  { src: '/images/layer-1.png', label: 'Any',                 delay: 0.3 },
  { src: '/images/layer-2.png', label: 'Storm',               delay: 0.6 },
  { src: '/images/layer-3.png', label: 'Dominique Schleider', delay: 0.9 },
];

export default function LandingPage({ isVisible, onRSVPClick }: LandingPageProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const animatedOnce = useRef(false); // persists across renders without causing re-renders
  const [layersIn, setLayersIn] = useState(false);
  const [useDelays, setUseDelays] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    if (!animatedOnce.current) {
      // First time: animate with staggered delays
      animatedOnce.current = true;
      setUseDelays(true);
      const t = setTimeout(() => setLayersIn(true), 150);
      return () => clearTimeout(t);
    } else {
      // Returning via Back — snap in instantly, no stagger
      setUseDelays(false);
      setLayersIn(true);
    }
  }, [isVisible]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
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
    <main className={`landing-page${isVisible ? '' : ' slide-out'}`} aria-hidden={!isVisible}>

      <div className="welcome-image-col">
        <div
          className="welcome-image-wrapper layers-white-bg"
          role="img"
          aria-label="Weather Any Storm — Dominique Schleider"
        >
          <div className="layers-stack">
            {LAYERS.map((layer) => (
              <img
                key={layer.src}
                src={layer.src}
                alt={layer.label}
                className={`layer-img${layersIn ? ' in' : ''}`}
                style={{
                  transitionDelay: useDelays ? `${layer.delay}s` : '0s',
                }}
                draggable={false}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="text-col">
        <div className="text-col-inner">
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
            onClick={handleClick}
            aria-label="Open RSVP form"
          >
            RSVP
          </button>
        </div>
      </div>
    </main>
  );
}
