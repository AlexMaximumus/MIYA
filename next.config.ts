/**
 * @fileoverview Конфигурационный файл для Next.js.
 *
 * Этот файл определяет настройки для сборки и работы Next.js приложения.
 * Здесь можно управлять правилами TypeScript, ESLint, оптимизацией изображений и многим другим.
 *
 * @see https://nextjs.org/docs/api-reference/next.config.js/introduction
 */

import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* Здесь находятся опции конфигурации */

  // Настройки TypeScript
  typescript: {
    // Игнорировать ошибки сборки TypeScript.
    // Полезно для быстрого прототипирования, но в продакшене рекомендуется установить в `false`.
    ignoreBuildErrors: true,
  },

  // Настройки ESLint
  eslint: {
    // Игнорировать ошибки ESLint во время сборки.
    // Рекомендуется исправлять ошибки, а не игнорировать их.
    ignoreDuringBuilds: true,
  },

  // Настройки оптимизации изображений (next/image)
  images: {
    // Список разрешенных хостов для загрузки изображений.
    // Это мера безопасности, предотвращающая загрузку изображений с неизвестных доменов.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co', // Разрешаем изображения с хоста-плейсхолдера
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
