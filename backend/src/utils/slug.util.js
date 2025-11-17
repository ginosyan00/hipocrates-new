/**
 * Slug Utility
 * Создание URL-friendly slug из строки
 */

/**
 * Создает slug из строки
 * @param {string} text - Исходный текст
 * @returns {string} URL-friendly slug
 */
export function createSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Заменить пробелы на дефис
    .replace(/[^\w\-]+/g, '') // Удалить все не-word символы
    .replace(/\-\-+/g, '-') // Заменить множественные дефисы на один
    .replace(/^-+/, '') // Убрать дефис в начале
    .replace(/-+$/, ''); // Убрать дефис в конце
}

/**
 * Создает уникальный slug с счетчиком
 * @param {string} baseSlug - Базовый slug
 * @param {number} counter - Счетчик
 * @returns {string} Уникальный slug
 */
export function createUniqueSlug(baseSlug, counter = 0) {
  if (counter === 0) {
    return baseSlug;
  }
  return `${baseSlug}-${counter}`;
}

