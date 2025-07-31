'use client';

import { useState } from 'react';
import { Cherry } from 'lucide-react';

const floatingWords = [
  { text: '美しい', highlighted: false },
  { text: 'Yamazaki Kento', highlighted: true },
  { text: '猫', highlighted: false },
  { text: 'G-Dragon', highlighted: true },
  { text: '127', highlighted: true },
];

export default function WelcomeScreen() {
  const [isVibrating, setIsVibrating] = useState(false);
  const [animatedWords, setAnimatedWords] = useState<typeof floatingWords>([]);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const handleTitleClick = () => {
    const currentTime = new Date().getTime();

    if (currentTime - lastClickTime < 1500) {
      setClickCount(clickCount + 1);
    } else {
      setClickCount(1);
    }
    setLastClickTime(currentTime);

    if (clickCount >= 3) {
        setShowEasterEgg(true);
        setTimeout(() => setShowEasterEgg(false), 3000);
        setClickCount(0);
    }


    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(100);
    }
    setIsVibrating(true);
    setAnimatedWords(floatingWords);

    setTimeout(() => setIsVibrating(false), 500); // Duration of the animation
    setTimeout(() => setAnimatedWords([]), 1500); // Duration for words to fade out
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground animate-fade-in p-4 overflow-hidden">
       <div className="relative">
        <h1 className="text-3xl font-bold font-headline text-center relative z-10">
          <span
            onClick={handleTitleClick}
            className={`cursor-pointer select-none inline-block ${isVibrating ? 'animate-shake' : ''}`}
          >
            MIYA
          </span> LINGO
        </h1>
        {animatedWords.map((word, index) => (
          <span
            key={index}
            className={`absolute text-lg animate-float-up ${word.highlighted ? 'text-primary font-bold' : 'text-foreground/80'}`}
            style={{
              top: `${Math.random() * 80 - 40}%`,
              left: `${Math.random() * 80 + 10}%`,
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {word.text}
          </span>
        ))}
        {showEasterEgg && (
            <div className="absolute inset-0 flex items-center justify-center z-20 animate-fade-in">
                <span className="text-6xl text-destructive font-bold animate-pulse">
                ✨さねちか✨
                </span>
            </div>
        )}
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Cherry className="w-24 h-24 mb-6 text-primary animate-pulse" />
      </div>

      <p className="mt-20 text-center text-lg max-w-md relative z-10">
        Добро пожаловать в MIYA LINGO — ваш спутник в изучении японского языка
      </p>
    </div>
  );
}
