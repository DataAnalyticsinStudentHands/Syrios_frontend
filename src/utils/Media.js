/**
 * media.js — Centralized Media Utilities (Planned Integration) (2026)
 *
 * PURPOSE:
 * This file provides a single, consistent way to resolve media URLs
 * and extract image data from Strapi responses across the application.
 *
 * STATUS:
 * ⚠️ Not yet fully integrated — safe to adopt incrementally.
 *
 * WHY THIS EXISTS:
 * - Multiple components currently implement their own image logic
 * - Strapi responses vary in shape:
 *   - coin vs coin.attributes
 *   - thumbnail vs small vs original
 * - Bugs previously caused:
 *   - Missing images (Spotlight, Catalog)
 *   - Invalid src (NaN warnings)
 *   - Incorrect base URLs
 *
 * WHAT THIS SOLVES:
 * - Normalizes Strapi media handling
 * - Prevents malformed URLs
 * - Supports multiple response shapes
 * - Provides safe fallbacks
 *
 * FUTURE PLAN:
 * - Replace all inline media logic in:
 *   - Card.jsx
 *   - CoinAnimations.jsx
 *   - CoinCatalog.jsx
 *   - CoinSort components
 * - Standardize image handling across entire app
 */

const BASE_URL = import.meta.env.VITE_STRAPI_URL || "";

/**
 * Safely joins base URL + relative path
 */
export const joinUrl = (path) => {
  if (!path || typeof path !== "string") return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const cleanBase = BASE_URL.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");

  return `${cleanBase}/${cleanPath}`;
};

/**
 * Normalizes coin or entity shape
 * Handles both:
 *   coin
 *   coin.attributes
 */
export const getEntity = (obj) => {
  return obj?.attributes || obj || {};
};

/**
 * Extracts best available media URL from a Strapi media object
 */
export const getMediaUrl = (media) => {
  return (
    media?.data?.attributes?.formats?.thumbnail?.url ||
    media?.data?.attributes?.formats?.small?.url ||
    media?.data?.attributes?.url ||
    ""
  );
};

/**
 * Returns full resolved URL for a media object
 */
export const getFullMediaUrl = (media) => {
  return joinUrl(getMediaUrl(media));
};

/**
 * Extracts best coin image (obverse → reverse fallback)
 */
export const getCoinImage = (coin) => {
  const c = getEntity(coin);

  return (
    getFullMediaUrl(c?.obverse_image) ||
    getFullMediaUrl(c?.reverse_image) ||
    c?.obverse_thumb_src || // CoinSort compatibility
    ""
  );
};

/**
 * Extract alt text safely
 */
export const getAltText = (media, fallback = "image") => {
  return (
    media?.data?.attributes?.alternativeText ||
    media?.data?.attributes?.caption ||
    fallback
  );
};

/**
 * Extract entity ID safely
 */
export const getId = (obj, fallback = null) => {
  return obj?.id || obj?.attributes?.id || fallback;
};