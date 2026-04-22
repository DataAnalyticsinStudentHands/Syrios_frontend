/**
 * client.js — Post Vite Updates (2026)
 *
 * Purpose:
 * Centralized Axios client for all API requests to the Strapi backend.
 *
 * Enhancements Introduced:
 * 1. Centralized Base URL
 *    - Uses `import.meta.env.VITE_STRAPI_URL` as the global API base
 *    - Eliminates repeated base URL definitions across API modules
 *
 * 2. Configurable Timeout
 *    - Adds request timeout via `VITE_API_TIMEOUT_MS`
 *    - Defaults to 10 seconds if not specified
 *
 * 3. Automatic Retry Logic
 *    - Retries failed requests for transient errors:
 *        • Network failures (no response)
 *        • Timeouts (`ECONNABORTED`)
 *        • Server errors (HTTP 5xx)
 *        • Rate limiting (HTTP 429)
 *    - Controlled by:
 *        • `VITE_API_RETRY_COUNT` (default: 2)
 *        • `VITE_API_RETRY_DELAY_MS` (default: 500ms base delay)
 *    - Uses exponential backoff (linear multiplier per retry)
 *
 * 4. Request-Level Caching
 *    - Supports optional in-memory caching for GET requests
 *    - Cache behavior is enabled per request via `config.meta`
 *    - Prevents repeated fetches for stable CMS content
 *
 * 5. Response Normalization
 *    - Supports optional Strapi response normalization
 *    - Normalization is enabled per request via `config.meta`
 *    - Reduces repeated `.data.data.attributes` access patterns
 *
 * 6. Axios Interceptors
 *    - Request interceptor checks cache before network call
 *    - Response interceptor applies normalization, caching, and retry logic
 *
 * Environment Variables Required:
 * - VITE_STRAPI_URL              (string)  → Base API URL
 * - VITE_API_TIMEOUT_MS          (number)  → Request timeout (ms)
 * - VITE_API_RETRY_COUNT         (number)  → Max retry attempts
 * - VITE_API_RETRY_DELAY_MS      (number)  → Base delay between retries (ms)
 *
 * Notes:
 * - Only transient errors are retried (safe for GET requests)
 * - Persistent client errors (4xx except 429) are not retried
 * - Retry count is tracked per request via `config.__retryCount`
 * - Cache is memory-only and resets on full page refresh
 * - Caching and normalization are opt-in per request
 *
 * Future Improvements:
 * - Add request interceptor for auth tokens (Auth0 JWT injection)
 * - Add logging/monitoring hooks (Sentry, Datadog, etc.)
 * - Add request cancellation support (AbortController)
 * - Implement smarter exponential backoff (jitter)
 * - Add cache invalidation helpers for admin/editor workflows
 */

import axios from "axios";
import { buildCacheKey, getCache, setCache } from "./cache";
import { normalizeStrapiResponse } from "./normalize";

/**
 * Create a shared Axios instance
 * - Centralizes baseURL and timeout configuration
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_STRAPI_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS || 10000),
});

/**
 * Retry configuration
 */
const MAX_RETRIES = Number(import.meta.env.VITE_API_RETRY_COUNT || 2);
const RETRY_DELAY_MS = Number(import.meta.env.VITE_API_RETRY_DELAY_MS || 500);

/**
 * Utility: sleep/delay helper for retry backoff
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Determines whether a request should be retried
 *
 * Retry conditions:
 * - Network failure (no response)
 * - Timeout (ECONNABORTED)
 * - Server errors (5xx)
 * - Rate limiting (429)
 *
 * Do NOT retry:
 * - Client errors (4xx except 429)
 */
const shouldRetry = (error) => {
  if (!error) return false;

  const status = error.response?.status;

  if (error.code === "ECONNABORTED") return true;
  if (!error.response) return true;
  if (status >= 500) return true;
  if (status === 429) return true;

  return false;
};

/**
 * Build a cache key for the current request config
 */
const getRequestCacheKey = (config) => {
  return buildCacheKey({
    baseURL: config.baseURL || "",
    url: config.url || "",
    params: config.params,
    method: config.method || "get",
  });
};

/**
 * Request interceptor
 *
 * Handles:
 * - Optional GET cache lookup before network request
 * - If cached response exists, short-circuits request by attaching cached response
 */
apiClient.interceptors.request.use((config) => {
  const meta = config.meta || {};
  const method = (config.method || "get").toLowerCase();

  if (meta.useCache && method === "get") {
    const cacheKey = getRequestCacheKey(config);
    const cachedResponse = getCache(cacheKey);

    if (cachedResponse) {
      config.adapter = async () => cachedResponse;
    }
  }

  return config;
});

/**
 * Response interceptor
 *
 * Handles:
 * - Successful responses:
 *   • Apply optional Strapi normalization
 *   • Save to cache when enabled
 * - Failed responses:
 *   • Apply retry logic if eligible
 */
apiClient.interceptors.response.use(
  (response) => {
    const config = response.config || {};
    const meta = config.meta || {};
    const method = (config.method || "get").toLowerCase();

    let finalResponse = response;

    // Optionally normalize Strapi response structure
    if (meta.normalize) {
      finalResponse = normalizeStrapiResponse(finalResponse);
    }

    // Optionally cache GET responses
    if (meta.useCache && method === "get") {
      const cacheKey = getRequestCacheKey(config);
      const ttlMs = Number(meta.cacheTtlMs || 0);

      if (ttlMs > 0) {
        setCache(cacheKey, finalResponse, ttlMs);
      }
    }

    return finalResponse;
  },
  async (error) => {
    const config = error.config;

    // If no config exists, cannot retry
    if (!config) {
      return Promise.reject(error);
    }

    // Initialize retry counter
    config.__retryCount = config.__retryCount || 0;

    // Stop retrying if max reached or not retryable
    if (config.__retryCount >= MAX_RETRIES || !shouldRetry(error)) {
      return Promise.reject(error);
    }

    // Increment retry count
    config.__retryCount += 1;

    // Apply backoff delay (linear scaling)
    await sleep(RETRY_DELAY_MS * config.__retryCount);

    // Retry the original request
    return apiClient(config);
  }
);

export default apiClient;