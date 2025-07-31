import CategoryCard from '@/components/category-card';
import { PenLine, BookOpen, Puzzle, Workflow } from 'lucide-react';

export default function MainScreen() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-12 font-headline text-center">
        MIYA LINGO
      </h1>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <CategoryCard
          icon={<PenLine className="w-10 h-10 md:w-12 md:h-12" />}
          title="Хирагана и катакана"
          description="Изучите японские слоги"
        />
        <CategoryCard
          icon={<BookOpen className="w-10 h-10 md:w-12 md:h-12" />}
          title="Лексика"
          description="Пополняйте словарный запас"
        />
        <CategoryCard
          icon={<Puzzle className="w-10 h-10 md:w-12 md:h-12" />}
          title="Грамматика"
          description="Освойте правила и структуры"
        />
        <CategoryCard
          icon={<Workflow className="w-10 h-10 md:w-12 md:h-12" />}
          title="Синтаксис и построение предложений"
          description="Научитесь строить предложения"
        />
      </div>
    </div>
  );
}
