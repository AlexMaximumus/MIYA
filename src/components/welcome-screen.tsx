'use client';

import { useState } from 'react';
import { Cherry } from 'lucide-react';

export default function WelcomeScreen() {
  const [isVibrating, setIsVibrating] = useState(false);

  const handleTitleClick = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(100);
    }
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 500); // Duration of the animation
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground animate-fade-in p-4">
      <Cherry className="w-24 h-24 mb-6 text-primary animate-pulse" />
      <h1 className="text-3xl font-bold font-headline text-center">
        <span 
          onClick={handleTitleClick} 
          className={`cursor-pointer select-none inline-block ${isVibrating ? 'animate-shake' : ''}`}
        >
          MIYA
        </span> LINGO
      </h1>
      <p className="mt-4 text-center text-lg max-w-md">
        Добро пожаловать в MIYA LINGO — ваш спутник в изучении японского языка
      </p>
    </div>
  );
}
