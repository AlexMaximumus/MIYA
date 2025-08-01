
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, BookCheck } from 'lucide-react';

export default function GrammarHubPage() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад на главную
            </Link>
          </Button>
        </div>
        <Card className="w-full mb-8">
            <CardHeader>
                <CardTitle className="text-2xl md:text-3xl">Раздел: Грамматика</CardTitle>
                <CardDescription>Выберите урок, чтобы погрузиться в теорию и практику японской грамматики.</CardDescription>
            </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/grammar/lesson-1">
                 <Card className="bg-card/60 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 group h-full">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="text-primary bg-primary/20 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                           <BookCheck className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-primary">Урок 1</p>
                            <CardTitle className="text-xl">Основы: Связки и предложения</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            Части речи, связка です, простые утвердительные, отрицательные и вопросительные предложения.
                        </CardDescription>
                    </CardContent>
                </Card>
            </Link>
            {/* Future lessons will be added here */}
            <Card className="bg-card/60 border-dashed border-2 flex items-center justify-center text-muted-foreground min-h-[180px]">
                <p>Скоро здесь появятся новые уроки!</p>
            </Card>
        </div>
      </div>
    </div>
  );
}
