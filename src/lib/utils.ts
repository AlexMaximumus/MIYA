/**
 * @fileoverview Вспомогательные утилиты.
 *
 * Этот файл содержит общие утилиты, которые могут использоваться в разных частях приложения.
 *
 * Ключевые функции:
 * - `cn`: Утилита для условного и декларативного объединения CSS-классов Tailwind CSS.
 *   Она использует `clsx` для объединения классов и `tailwind-merge` для разрешения
 *   конфликтов между ними (например, `p-2` и `p-4` -> `p-4`).
 *
 * Используемые технологии:
 * - clsx: для условного построения строк классов.
 * - tailwind-merge: для интеллектуального слияния классов Tailwind.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
