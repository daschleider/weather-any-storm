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

export default function Home() {
  const [view, setView] = useState<AppView>('intro');
  const [rainIntensity, setRainIntensity] = useState<'ambient' | 'burst'>('ambient');
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOnDarkSection, setMobileOnDarkSection] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
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

  // Logo is dark (black) only on mobile white art section
  const logoDark = isMobile && isOnLanding && !mobileOnDarkSection;

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
        />
      ) : (
        <LandingPage
          isVisible={isOnLanding}
          onRSVPClick={handleRSVPClick}
        />
      )}

      <RSVPPanel
        isOpen={view === 'rsvp'}
        onBack={handleBack}
        onSubmit={handleSubmit}
      />

      <ConfirmationPage
        isOpen={isOnConfirmation}
        type={view === 'confirmed-attending' ? 'attending' : 'cant'}
      />
    </div>
  );
}
