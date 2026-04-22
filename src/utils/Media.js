/**
 * media.js — Centralized Media Utilities (2026)
 *
 * Purpose:
 * Provides shared helpers for resolving Strapi media URLs and entity shapes.
 *
 * Why this exists:
 * - Different components currently access media in different ways
 * - Strapi data may arrive as:
 *   - entity
 *   - entity.attributes
 * - Media may exist in:
 *   - thumbnail format
 *   - small format
 *   - original upload
 *
 * What this solves:
 * - Prevents malformed URLs
 * - Standardizes media access
 * - Reduces repeated null checks
 * - Supports hybrid raw/normalized entity shapes
 *
 * Safe adoption plan:
 * - Card.jsx
 * - Coin animations / flip views
 * - Coin catalog pages
 * - CoinSort components
 *
 * Notes:
 * - This does not normalize media into a new schema
 * - It only provides safe read helpers around current Strapi shapes
 */

const BASE_URL = import.meta.env.VITE_STRAPI_URL || "";

/**
 * Safely joins the Strapi base URL to a relative media path
 */
export const joinUrl = (path) => {
  if (!path || typeof path !== "string") return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const cleanBase = BASE_URL.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");

  return `${cleanBase}/${cleanPath}`;
};

/**
 * Normalizes entity access for either:
 * - entity
 * - entity.attributes
 */
export const getEntity = (obj) => {
  return obj?.attributes || obj || {};
};

/**
 * Returns the best available relative media URL from a Strapi media relation
 * Prefers:
 * - thumbnail
 * - small
 * - original
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
 * Returns the best available full media URL
 */
export const getFullMediaUrl = (media) => {
  return joinUrl(getMediaUrl(media));
};

/**
 * Returns the preferred coin image URL
 * Prefers:
 * - precomputed thumbnail src
 * - obverse image
 * - reverse image
 */
export const getCoinImage = (coin) => {
  const c = getEntity(coin);

  return (
    c?.obverse_thumb_src ||
    getFullMediaUrl(c?.obverse_image) ||
    getFullMediaUrl(c?.reverse_image) ||
    ""
  );
};

/**
 * Safely extracts alt text from a Strapi media relation
 */
export const getAltText = (media, fallback = "image") => {
  return (
    media?.data?.attributes?.alternativeText ||
    media?.data?.attributes?.caption ||
    fallback
  );
};

/**
 * Safely extracts the entity ID
 */
export const getId = (obj, fallback = null) => {
  return obj?.id || fallback;
};