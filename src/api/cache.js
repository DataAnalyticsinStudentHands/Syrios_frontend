/**
 * cache.js — Post Vite Updates (2026)
 *
 * Purpose:
 * Provides a lightweight in-memory cache for API responses.
 *
 * Features:
 * - TTL-based expiration
 * - Simple string-key lookup
 * - Safe for client-side read-heavy content
 * - Designed for GET request caching only
 *
 * Notes:
 * - Cache is memory-only and resets on page refresh
 * - Best suited for CMS/Strapi content that changes infrequently
 * - Not appropriate for auth/session-sensitive data
 *
 * Future Improvements:
 * - Add cache size limits / LRU eviction
 * - Add sessionStorage/localStorage persistence option
 * - Add tag-based invalidation
 */

const cacheStore = new Map();

/**
 * Build a cache entry object
 */
const buildEntry = (value, ttlMs) => ({
  value,
  expiresAt: Date.now() + ttlMs,
});

/**
 * Returns true if cache entry is expired
 */
const isExpired = (entry) => {
  if (!entry) return true;
  return Date.now() > entry.expiresAt;
};

/**
 * Get cached value by key
 * - Returns undefined if missing or expired
 */
export const getCache = (key) => {
  const entry = cacheStore.get(key);

  if (!entry) return undefined;

  if (isExpired(entry)) {
    cacheStore.delete(key);
    return undefined;
  }

  return entry.value;
};

/**
 * Save value to cache with TTL
 */
export const setCache = (key, value, ttlMs) => {
  cacheStore.set(key, buildEntry(value, ttlMs));
  return value;
};

/**
 * Remove a single cache entry
 */
export const deleteCache = (key) => {
  cacheStore.delete(key);
};

/**
 * Clear all cache entries
 */
export const clearCache = () => {
  cacheStore.clear();
};

/**
 * Build a stable cache key from request inputs
 */
export const buildCacheKey = ({ baseURL = "", url = "", params, method = "get" }) => {
  const serializedParams =
    params && typeof params === "object" ? JSON.stringify(params) : String(params || "");

  return `${method.toUpperCase()}::${baseURL}${url}::${serializedParams}`;
};