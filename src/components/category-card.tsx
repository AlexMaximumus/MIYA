import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface CategoryCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function CategoryCard({ icon, title, description }: CategoryCardProps) {
  return (
    <div className="h-full">
      <Card className="bg-card/60 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 group min-h-[180px] flex flex-col justify-center h-full">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
          <div className="text-primary bg-primary/20 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <CardTitle className="text-card-foreground text-xl md:text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-card-foreground/80">{description}</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
