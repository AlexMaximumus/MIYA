
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import MiyaAssistant from '@/components/miya-assistant';
import { useTeacherMode } from '@/hooks/use-teacher-mode';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="ru">
      <head>
        <title>MIYA LINGO: Japanese Learning Companion</title>
        <meta name="description" content="Your friendly companion for mastering the Japanese language, from hiragana to syntax." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn(
        "font-body antialiased",
        isClient && isTeacherMode && "teacher-mode"
      )}>
        {children}
        <MiyaAssistant />
        <Toaster />
      </body>
    </html>
  );
}
