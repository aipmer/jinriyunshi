import { useState, useEffect } from 'react';
import { Navbar } from '@/sections/Navbar';
import { Hero } from '@/sections/Hero';
import { ZodiacGrid } from '@/sections/ZodiacGrid';
import { HoroscopeDisplay } from '@/sections/HoroscopeDisplay';
import { Compatibility } from '@/sections/Compatibility';
import { DailyQuote } from '@/sections/DailyQuote';
import { Footer } from '@/sections/Footer';
import { useLenis } from '@/hooks/useLenis';
import type { ZodiacSign } from '@/types';
import { zodiacSigns } from '@/data/zodiac';

function App() {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);

  // Initialize Lenis smooth scroll
  useLenis();

  // Check for saved sign in localStorage
  useEffect(() => {
    const savedSignId = localStorage.getItem('selectedZodiacSign');
    if (savedSignId) {
      const sign = zodiacSigns.find((s) => s.id === savedSignId);
      if (sign) {
        setSelectedSign(sign);
      }
    }
  }, []);

  // Save selected sign to localStorage
  const handleSelectSign = (sign: ZodiacSign) => {
    setSelectedSign(sign);
    localStorage.setItem('selectedZodiacSign', sign.id);

    // Scroll to horoscope section after a short delay
    setTimeout(() => {
      const horoscopeSection = document.querySelector('#horoscope');
      if (horoscopeSection) {
        horoscopeSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#faedcd]">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Zodiac Selection */}
        <ZodiacGrid
          onSelectSign={handleSelectSign}
          selectedSign={selectedSign}
        />

        {/* Horoscope Display */}
        <HoroscopeDisplay selectedSign={selectedSign} />

        {/* Compatibility */}
        <Compatibility />

        {/* Daily Quote */}
        <DailyQuote />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
