
'use client';

import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from './ui/badge';

const WELCOME_KEY = 'miya-lingo-welcome-seen';

export default function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // This effect runs only on the client-side
    const welcomeSeen = localStorage.getItem(WELCOME_KEY);
    if (!welcomeSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(WELCOME_KEY, 'true');
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-center">Добро пожаловать в MIYA LINGO!</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base pt-2">
            Привет! Я — Мия, твой личный сенсей. Я помогу тебе освоить японский язык, пон.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4 text-sm">
            <p>Вот краткий обзор того, что мы можем делать вместе:</p>
            <ul className="space-y-3 list-disc list-inside">
                <li>
                    <b className="text-foreground">Тренировка дня:</b> Используй систему интервальных повторений, чтобы эффективно учить новые слова и не забывать старые.
                </li>
                <li>
                    <b className="text-foreground">Кана, Грамматика, Словарь:</b> Изучай теорию и проходи тесты в этих разделах, чтобы закрепить знания.
                </li>
                <li>
                    <b className="text-foreground">ИИ-Ассистент (Я!):</b> Нажми на иконку со мной в правом нижнем углу. Я всегда готова ответить на твои вопросы по японскому, объяснить грамматику, подсказать перевод или просто поболтать, пон.
                </li>
            </ul>
            <p className="pt-2">Кстати, в приложении есть <Badge variant="destructive">секретный режим учителя</Badge> и много других пасхалок. Попробуй их найти!</p>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleClose} className="w-full">Понятно, начинаем!</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
