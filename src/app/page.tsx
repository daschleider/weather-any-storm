'use client';

import { useState, useEffect, useCallback } from 'react';
import RainAnimation from '@/components/RainAnimation';
import LogoHeader from '@/components/LogoHeader';
import LandingPage from '@/components/LandingPage';
import MobileLandingPage from '@/components/MobileLandingPage';
import RSVPPanel from '@/components/RSVPPanel';
import ConfirmationPage from '@/components/ConfirmationPage';
import IntroSplash from '@/components/IntroSplash';

export type AppView = 'intro' | 'landing' | 'rsvp' | 'confirmed-attending' | 'confirmed-cant';

export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
}

function parseGuestFromURL(): GuestInfo {
  if (typeof window === 'undefined') return { firstName: '', lastName: '', email: '' };
  const p = new URLSearchParams(window.location.search);

  // ?guest=yasmin-schleider → first=Yasmin, last=Schleider
  const guest = p.get('guest') || '';
  if (!guest) return { firstName: '', lastName: '', email: '' };

  const parts = guest.split('-');
  const firstName = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : '';
  const lastName = parts.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return { firstName, lastName, email: '' };
}

export default function Home() {
  const [view, setView] = useState<AppView>('intro');
  const [rainIntensity, setRainIntensity] = useState<'ambient' | 'burst'>('ambient');
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOnDarkSection, setMobileOnDarkSection] = useState(false);
  const [guest, setGuest] = useState<GuestInfo>({ firstName: '', lastName: '', email: '' });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    setGuest(parseGuestFromURL());
  }, []);

  const handleIntroComplete = () => {
    setRainIntensity('burst');
    setTimeout(() => {
      setView('landing');
      setTimeout(() => setRainIntensity('ambient'), 900);
    }, 80);
  };

  const handleRSVPClick = () => {
    setRainIntensity('burst');
    setTimeout(() => {
      setView('rsvp');
      setTimeout(() => setRainIntensity('ambient'), 900);
    }, 120);
  };

  const handleBack = () => {
    setRainIntensity('burst');
    setView('landing');
    setTimeout(() => setRainIntensity('ambient'), 900);
  };

  const handleLogoClick = () => {
    if (view === 'landing' && isMobile) {
      window.dispatchEvent(new Event('mobile-scroll-top'));
    } else if (view !== 'landing' && view !== 'intro') {
      handleBack();
    }
  };

  const handleSubmit = (status: 'attending' | 'cant_make_it') => {
    setRainIntensity('burst');
    setTimeout(() => {
      setView(status === 'attending' ? 'confirmed-attending' : 'confirmed-cant');
      setTimeout(() => setRainIntensity('ambient'), 900);
    }, 120);
  };

  const handleDarkSection = useCallback((isDark: boolean) => {
    setMobileOnDarkSection(isDark);
  }, []);

  const isOnLanding = view === 'landing';
  const isOnConfirmation = view === 'confirmed-attending' || view === 'confirmed-cant';
  const logoDark = isMobile && isOnLanding && !mobileOnDarkSection;
  const hasGuest = !!(guest.firstName || guest.lastName);

  return (
    <div className="app-shell">
      <RainAnimation intensity={rainIntensity} />

      {view === 'intro' && (
        <IntroSplash onComplete={handleIntroComplete} />
      )}

      <LogoHeader
        onClick={view !== 'intro' ? handleLogoClick : undefined}
        darkMode={logoDark}
      />

      {isMobile ? (
        <MobileLandingPage
          isVisible={isOnLanding}
          onRSVPClick={handleRSVPClick}
          onDarkSection={handleDarkSection}
          guest={guest}
        />
      ) : (
        <LandingPage
          isVisible={isOnLanding}
          onRSVPClick={handleRSVPClick}
          guest={guest}
        />
      )}

      <RSVPPanel
        isOpen={view === 'rsvp'}
        onBack={handleBack}
        onSubmit={handleSubmit}
        guest={guest}
      />

      <ConfirmationPage
        isOpen={isOnConfirmation}
        type={view === 'confirmed-attending' ? 'attending' : 'cant'}
        guestName={guest.firstName}
      />
    </div>
  );
}
