/**
 * @fileoverview Центральная инициализация и конфигурация Genkit.
 *
 * Этот файл создает и экспортирует основной экземпляр `ai`, который используется
 * во всем приложении для определения и вызова AI-моделей, потоков (flows) и инструментов (tools).
 * Он также загружает переменные окружения, в частности `GEMINI_API_KEY`,
 * для аутентификации с Google AI.
 *
 * Используемые технологии:
 * - Genkit: Основной фреймворк для работы с ИИ.
 * - @genkit-ai/googleai: Плагин для интеграции с моделями Google AI (Gemini).
 * - dotenv: для загрузки переменных окружения из файла `.env`.
 *
 * @see https://firebase.google.com/docs/genkit/configure
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import 'dotenv/config'; // Загружает переменные из .env файла

// `ai` - это основной объект Genkit, через который происходит вся работа с ИИ.
export const ai = genkit({
  plugins: [
    // Подключаем плагин для работы с Google AI.
    googleAI({
      // API-ключ для доступа к Gemini. Загружается из .env файла.
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
});
