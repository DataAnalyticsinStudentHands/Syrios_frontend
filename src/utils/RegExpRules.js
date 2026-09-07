/**
 * regex.js — Post Vite Updates (2026)
 *
 * Purpose:
 * Centralized validation patterns for forms across the application.
 *
 * Improvements:
 * - Prevents empty-only matches where not desired
 * - Improves readability of patterns
 * - Provides both named and grouped exports
 *
 * Notes:
 * - These are frontend validation helpers only
 * - Backend validation should still be enforced separately
 */

/**
 * Full name validation
 * - Allows letters + spaces
 * - Requires at least 1 character
 */
export const nameRegExp = /^[A-Za-z\s]+$/;

/**
 * Phone number validation (flexible international-ish format)
 * Supports:
 * - +1234567890
 * - (123) 456-7890
 * - 123-456-7890
 * - 123 456 7890
 */
export const phoneRegExp =
  /^\+?[\d\s().-]{7,20}$/;

/**
 * Email validation (RFC-lite)
 * - Covers most real-world emails
 * - Avoids over-strict edge-case failures
 */
export const emailRegExp =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Optional grouped export (useful for dynamic validation systems)
 */
export const REGEX = {
  name: nameRegExp,
  phone: phoneRegExp,
  email: emailRegExp,
};