import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/sections/Navbar';
import { ZodiacGrid } from '@/sections/ZodiacGrid';
import { HoroscopeDisplay } from '@/sections/HoroscopeDisplay';
import { Compatibility } from '@/sections/Compatibility';
import { ProfileEditor } from '@/sections/ProfileEditor';
import { ZodiacSelectorModal } from '@/components/ZodiacSelectorModal';
import { StreakBar } from '@/components/StreakBar';
import { AddToHomeHint } from '@/components/AddToHomeHint';
import type { ZodiacSign } from '@/types';
import { zodiacSigns } from '@/data/zodiac';
import { trackEvent } from '@/lib/analytics';

function App() {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [hasSavedSign, setHasSavedSign] = useState(false);
  const [isZodiacModalOpen, setIsZodiacModalOpen] = useState(false);

  // Check for saved sign in localStorage
  useEffect(() => {
    const savedSignId = localStorage.getItem('selectedZodiacSign');
    if (savedSignId) {
      const sign = zodiacSigns.find((s) => s.id === savedSignId);
      if (sign) {
        setSelectedSign(sign);
        setHasSavedSign(true);
      }
    }
  }, []);

  const updateSelectedSign = useCallback((sign: ZodiacSign, source: 'homepage' | 'compatibility' | 'profile') => {
    setSelectedSign(sign);
    localStorage.setItem('selectedZodiacSign', sign.id);
    trackEvent('zodiac_selected', { sign: sign.id, source });
  }, []);

  const handlePrimarySelect = useCallback((sign: ZodiacSign) => {
    updateSelectedSign(sign, 'homepage');

    requestAnimationFrame(() => {
      const horoscopeSection = document.querySelector('#horoscope');
      if (horoscopeSection) {
        horoscopeSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }, [updateSelectedSign]);

  // Open zodiac selector modal
  const openZodiacSelector = useCallback(() => {
    setIsZodiacModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-moon pt-20">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-5 pt-4 sm:px-8">
          <StreakBar />
          <AddToHomeHint />
        </div>
        {/* 未选星座时一步到位：介绍和选择合成一屏，不再先滚一屏 Hero */}
        {!hasSavedSign && (
          <ZodiacGrid
            onSelectSign={handlePrimarySelect}
            selectedSign={selectedSign}
          />
        )}

        {/* Horoscope Display */}
        <HoroscopeDisplay
          selectedSign={selectedSign}
          onChangeSign={openZodiacSelector}
        />

        <Compatibility
          selectedSign={selectedSign}
          onChangeSign={(sign) => updateSelectedSign(sign, 'compatibility')}
        />
        <ProfileEditor selectedSign={selectedSign} onSelectSign={(sign) => updateSelectedSign(sign, 'profile')} />
      </main>

      {/* Zodiac Selector Modal */}
      <ZodiacSelectorModal
        isOpen={isZodiacModalOpen}
        onClose={() => setIsZodiacModalOpen(false)}
        onSelect={handlePrimarySelect}
        currentSign={selectedSign}
        title="切换星座"
      />
    </div>
  );
}

export default App;
