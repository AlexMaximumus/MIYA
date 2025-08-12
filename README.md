# MIYA LINGO: Ваш личный помощник в изучении японского языка

Это проект на Next.js, созданный в Firebase Studio. Приложение представляет собой интерактивную платформу для изучения японского языка, включающую уроки, тесты, словарь и ИИ-ассистента по имени Мия.

## Обзор технологий

- **Фреймворк**: [Next.js](https://nextjs.org/) (App Router)
- **Язык**: [TypeScript](https://www.typescriptlang.org/)
- **UI Компоненты**: [ShadCN/UI](https://ui.shadcn.com/)
- **Стилизация**: [Tailwind CSS](https://tailwindcss.com/)
- **ИИ-функциональность**: [Genkit (Firebase)](https://firebase.google.com/docs/genkit)
- **Управление состоянием**: [Zustand](https://github.com/pmndrs/zustand)
- **Хостинг**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## Структура проекта

- `src/app/`: Основные страницы приложения, использующие Next.js App Router.
- `src/components/`: Переиспользуемые React-компоненты.
- `src/ai/`: Логика, связанная с искусственным интеллектом (Genkit).
  - `src/ai/flows/`: Genkit Flows, которые определяют логику взаимодействия с языковыми моделями.
- `src/lib/`: Вспомогательные утилиты и статические данные (например, словарные статьи).
- `src/hooks/`: Пользовательские React-хуки для управления состоянием и логикой.
- `public/`: Статические ассеты (изображения, звуки, иконки).

## Как запустить

Для запуска проекта в режиме разработки выполните команду:

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:9002`.

Для работы с Genkit в отдельном терминале можно запустить:

```bash
npm run genkit:watch
```
