/**
 * createMarkup.js
 * Vite migration:
 * - No changes required (no env usage, pure utility)
 * - Keeps compatibility with dangerouslySetInnerHTML
 */

export function createMarkup(textTran) {
  return { __html: textTran };
}

export default createMarkup;