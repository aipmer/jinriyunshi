import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/sections/Navbar';
import { Hero } from '@/sections/Hero';
import { ZodiacGrid } from '@/sections/ZodiacGrid';
import { HoroscopeDisplay } from '@/sections/HoroscopeDisplay';
import { Compatibility } from '@/sections/Compatibility';
import { DailyQuote } from '@/sections/DailyQuote';
import { Footer } from '@/sections/Footer';
import { ZodiacSelectorModal } from '@/components/ZodiacSelectorModal';
import { useLenis } from '@/hooks/useLenis';
import type { ZodiacSign } from '@/types';
import { zodiacSigns } from '@/data/zodiac';

function App() {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [hasSavedSign, setHasSavedSign] = useState(false);
  const [isZodiacModalOpen, setIsZodiacModalOpen] = useState(false);

  // Initialize Lenis smooth scroll
  useLenis();

  // Check for saved sign in localStorage
  useEffect(() => {
    const savedSignId = localStorage.getItem('selectedZodiacSign');
    if (savedSignId) {
      const sign = zodiacSigns.find((s) => s.id === savedSignId);
      if (sign) {
        setSelectedSign(sign);
        setHasSavedSign(true);
        // Scroll to horoscope section immediately
        setTimeout(() => {
          const horoscopeSection = document.querySelector('#horoscope');
          if (horoscopeSection) {
            horoscopeSection.scrollIntoView({ behavior: 'auto' });
          }
        }, 100);
      }
    }
  }, []);

  // Save selected sign to localStorage and sync across components
  const handleSelectSign = useCallback((sign: ZodiacSign) => {
    setSelectedSign(sign);
    localStorage.setItem('selectedZodiacSign', sign.id);

    // Scroll to horoscope section after a short delay
    setTimeout(() => {
      const horoscopeSection = document.querySelector('#horoscope');
      if (horoscopeSection) {
        horoscopeSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  }, []);

  // Open zodiac selector modal
  const openZodiacSelector = useCallback(() => {
    setIsZodiacModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#faedcd]">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Section - hidden if has saved sign */}
        {!hasSavedSign && <Hero />}

        {/* Zodiac Selection - hidden if has saved sign */}
        {!hasSavedSign && (
          <ZodiacGrid
            onSelectSign={handleSelectSign}
            selectedSign={selectedSign}
          />
        )}

        {/* Horoscope Display */}
        <HoroscopeDisplay 
          selectedSign={selectedSign} 
          onChangeSign={openZodiacSelector}
        />

        {/* Daily Quote - moved above Compatibility */}
        <DailyQuote />

        {/* Compatibility */}
        <Compatibility 
          selectedSign={selectedSign} 
          onChangeSign={handleSelectSign}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Zodiac Selector Modal */}
      <ZodiacSelectorModal
        isOpen={isZodiacModalOpen}
        onClose={() => setIsZodiacModalOpen(false)}
        onSelect={handleSelectSign}
        currentSign={selectedSign}
        title="切换星座"
      />
    </div>
  );
}

export default App;
