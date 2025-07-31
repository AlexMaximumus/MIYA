import { Cherry } from 'lucide-react';

export default function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground animate-fade-in p-4">
      <Cherry className="w-24 h-24 mb-6 text-primary animate-pulse" />
      <h1 className="text-3xl font-bold font-headline text-center">MIYA LINGO</h1>
      <p className="mt-4 text-center text-lg max-w-md">
        Добро пожаловать в MIYA LINGO — ваш спутник в изучении японского языка
      </p>
    </div>
  );
}
