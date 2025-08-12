/**
 * @fileoverview Корневой макет приложения (Root Layout).
 *
 * Этот компонент является основным шаблоном для всех страниц приложения.
 * Он определяет общую структуру HTML-документа, включая теги <html> и <body>,
 * подключает глобальные стили, шрифты и обеспечивает контекст для всего приложения.
 *
 * Ключевые элементы:
 * - Настройка метаданных (title, description).
 * - Подключение глобальных CSS (`globals.css`).
 * - Подключение шрифтов (Inter).
 * - Обертка для UI-компонентов, требующих провайдеров (например, `Toaster` для уведомлений).
 * - Рендеринг компонента `<MiyaAssistant />` на всех страницах.
 * - Управление темой (светлая/темная/режим учителя) через хук `useTeacherMode`.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates
 */

'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import MiyaAssistant from '@/components/miya-assistant';
import { useTeacherMode } from '@/hooks/use-teacher-mode';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

// Метаданные страницы (закомментированы для клиентского рендеринга заголовка).
// export const metadata: Metadata = {
//   title: 'MIYA LINGO: Japanese Learning Companion',
//   description: 'Your friendly companion for mastering the Japanese language, from hiragana to syntax.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isTeacherMode } = useTeacherMode();
  const [isClient, setIsClient] = useState(false);

  // Этот хук гарантирует, что код, зависящий от состояния на клиенте (isTeacherMode),
  // выполняется только после гидратации, чтобы избежать ошибок.
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="ru">
      <head>
        {/* Динамическая установка заголовка на клиенте */}
        <title>MIYA LINGO: Japanese Learning Companion</title>
        <meta name="description" content="Your friendly companion for mastering the Japanese language, from hiragana to syntax." />
        {/* Подключение шрифтов Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
        {/* Настройки для PWA (Progressive Web App) */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/my-cool-icon.png"></link>
        <meta name="theme-color" content="#A0E7E5" />
      </head>
      <body className={cn(
        "font-body antialiased",
        // Применяем специальный CSS-класс, если активен режим учителя
        isClient && isTeacherMode && "teacher-mode"
      )}>
        {/* Основной контент страницы */}
        {children}
        {/* Компонент ИИ-ассистента, доступный на всех страницах */}
        <MiyaAssistant />
        {/* Компонент для отображения всплывающих уведомлений (тостов) */}
        <Toaster />
      </body>
    </html>
  );
}
