
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ReactNode } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Stat {
    label: string;
    value: string | number;
}

const fallingWords = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ'];

const FallingWord = ({ word }: { word: string }) => {
    const style = {
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 2}s`, // 2s to 5s
      animationDelay: `${Math.random() * 5}s`,
    };
    return <div className="absolute top-0 text-primary/50 animate-fall" style={style}>{word}</div>;
  };

interface CategoryCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  progress?: number | null;
  stats?: Stat[];
  isSpecial?: boolean;
  color?: string;
  isAnimated?: boolean;
}

export default function CategoryCard({ icon, title, description, progress, stats, isSpecial = false, color, isAnimated = false }: CategoryCardProps) {
  return (
    <div className="h-full relative overflow-hidden rounded-lg">
      <Card className={cn("bg-card/60 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 group min-h-[200px] flex flex-col justify-between h-full w-full",
       isSpecial && 'relative',
       color
      )}>
         {isAnimated && (
            <div className="absolute inset-0 pointer-events-none z-0">
              {fallingWords.map((word, index) => <FallingWord key={index} word={word} />)}
            </div>
        )}
        <div className="relative z-10 flex flex-col flex-grow h-full">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
            <div className="text-primary bg-primary/20 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <CardTitle className="text-card-foreground text-xl md:text-2xl break-words">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between flex-grow">
            <CardDescription className="text-card-foreground/80 mb-4">{description}</CardDescription>
            {progress !== undefined && progress !== null && (
                <div className="mt-auto">
                    <p className="text-xs text-muted-foreground mb-1">Общий прогресс:</p>
                    <Progress value={progress} />
                </div>
            )}
            {stats && stats.length > 0 && (
                <div className="mt-auto space-y-2">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                            <p className="text-muted-foreground">{stat.label}</p>
                            <p className="font-bold">{stat.value}</p>
                        </div>
                    ))}
                </div>
            )}
            </CardContent>
        </div>
      </Card>
    </div>
  );
}
