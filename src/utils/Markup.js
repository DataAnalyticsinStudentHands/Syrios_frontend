/**
 * createMarkup.js — Post Vite Updates (2026)
 *
 * Purpose:
 * Utility helper for safely passing HTML content into React components
 * using `dangerouslySetInnerHTML`.
 *
 * Refactor Summary:
 * 1. Added Null Safety
 *    - Prevents undefined/null from breaking React rendering
 *
 * 2. Ensured String Output
 *    - Coerces input into string to avoid runtime issues
 *
 * 3. Preserved Behavior
 *    - Fully compatible with existing usage across components
 *
 * Notes:
 * - This function does NOT sanitize HTML
 * - Only use with trusted CMS content (e.g., Strapi)
 *
 * Future Improvements:
 * - Add optional sanitization (DOMPurify) if user-generated content is introduced
 */

export function createMarkup(textTran) {
  return {
    __html: textTran ? String(textTran) : "",
  };
}

export default createMarkup;