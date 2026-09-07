/**
 * story.js — Post Vite Updates (2026)
 *
 * Purpose:
 * Handles API requests for Story content from the Strapi backend.
 *
 * Refactor Summary:
 * 1. Centralized API Client
 *    - Replaced direct Axios usage with shared `apiClient`
 *    - Eliminates duplicated base URL handling across API modules
 *
 * 2. Retry + Timeout Support
 *    - Inherits retry logic, timeout handling, and error behavior from `client.js`
 *
 * 3. Updated Environment Flag
 *    - Uses `VITE_APP_ENV`
 *    - Clarifies intent (environment vs deployment mode)
 *
 * 4. Selective Caching + Response Normalization
 *    - Enables caching + normalization for `storyHomeFind()`
 *    - Enables caching only for `storyFind()` and `storyFindOne()`
 *    - Preserves raw response shape for story list/detail compatibility
 *
 * 5. Preserved Environment Filtering Logic
 *    - Maintains behavior where development stories are conditionally included
 *
 * 6. Preserved API Behavior
 *    - Endpoints remain unchanged
 *
 * Environment Variables Required:
 * - VITE_STRAPI_URL              (string)  → Base API URL
 * - VITE_APP_ENV                 (string)  → "development" or "production"
 * - VITE_API_TIMEOUT_MS          (number)  → Timeout (inherited)
 * - VITE_API_RETRY_COUNT         (number)  → Retry count (inherited)
 * - VITE_API_RETRY_DELAY_MS      (number)  → Retry delay (inherited)
 *
 * Notes:
 * - This file contains no JSX and remains `.js`
 * - Uses shared Axios client for consistency across API modules
 * - Environment filtering is still handled client-side (not secure)
 * - `storyHomeFind()` is normalized because it behaves like a page endpoint
 * - `storyFind()` and `storyFindOne()` remain raw for compatibility
 *
 * Future Improvements:
 * - Move environment filtering logic to backend
 * - Normalize story list/detail payloads after updating all callers
 * - Add optional cache invalidation for editor/admin workflows
 */

import apiClient from "./client";
import { CACHE_TTL, requestOptions } from "./request-options";

const environmentFlag = import.meta.env.VITE_APP_ENV;

const storyRequest = {
  /**
   * Fetch story homepage content
   * - Enables caching for stable page content
   * - Enables Strapi response normalization
   */
  storyHomeFind: () => {
    return apiClient.get("/api/story-home", {
      meta: requestOptions.cachedNormalized(CACHE_TTL.VERY_LONG),
    });
  },

  /**
   * Fetch all stories
   * - Includes development stories when environment is "development"
   * - Enables caching
   * - Keeps raw Strapi response shape for compatibility
   */
  storyFind: () => {
    let environment = "";

    if (environmentFlag === "development") {
      environment = "development";
    }

    return apiClient.get(`/api/stories?env=${environment}`, {
      meta: requestOptions.cached(CACHE_TTL.MEDIUM),
    });
  },

  /**
   * Fetch a single story by ID
   * - Enables caching
   * - Keeps raw Strapi response shape for compatibility
   */
  storyFindOne: (id) => {
    return apiClient.get(`/api/stories/${id}`, {
      meta: requestOptions.cached(CACHE_TTL.MEDIUM),
    });
  },

  // legacy / optional query block retained for reference
  // storyCoinsOfDays: () => { ... }
};

export default storyRequest;