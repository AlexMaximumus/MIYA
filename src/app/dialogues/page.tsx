
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import DialogueChat from '@/components/dialogue-chat';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DialoguesPage() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in">
      <div className="w-full max-w-2xl">
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
                <CardTitle className="text-2xl md:text-3xl">Диалоги</CardTitle>
                <CardDescription>Практикуйте общение в реальных ситуациях. Введите правильные фразы, чтобы продолжить диалог.</CardDescription>
            </CardHeader>
        </Card>

        <DialogueChat />
      </div>
    </div>
  );
}
