/**
 * request-options.js — Post Vite Updates (2026)
 *
 * Purpose:
 * Centralizes default request behavior flags for caching and normalization.
 *
 * Notes:
 * - These are lightweight helpers for request-level configuration
 * - Keeps per-file API code readable
 */

export const CACHE_TTL = {
  SHORT: 1000 * 60,          // 1 minute
  MEDIUM: 1000 * 60 * 5,     // 5 minutes
  LONG: 1000 * 60 * 30,      // 30 minutes
  VERY_LONG: 1000 * 60 * 60, // 60 minutes
};

export const requestOptions = {
  raw: () => ({
    useCache: false,
    normalize: false,
  }),

  normalized: () => ({
    useCache: false,
    normalize: true,
  }),

  cached: (ttl = CACHE_TTL.MEDIUM) => ({
    useCache: true,
    cacheTtlMs: ttl,
    normalize: false,
  }),

  cachedNormalized: (ttl = CACHE_TTL.MEDIUM) => ({
    useCache: true,
    cacheTtlMs: ttl,
    normalize: true,
  }),
};