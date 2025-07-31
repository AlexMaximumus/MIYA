'use client';

import { useState, useEffect } from 'react';
import WelcomeScreen from '@/components/welcome-screen';
import MainScreen from '@/app/main-screen';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Duration of the welcome screen

    return () => clearTimeout(timer);
  }, []);

  if (!isClient) {
    // Render a skeleton on the server to avoid hydration mismatch
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground p-4">
          <Skeleton className="w-24 h-24 mb-6 rounded-lg" />
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-6 w-80 max-w-full" />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {isLoading ? <WelcomeScreen /> : <MainScreen />}
    </div>
  );
}
