/**
 * reference.js — Post Vite Updates (2026)
 *
 * Purpose:
 * Handles API requests for Reference content from the Strapi backend.
 *
 * Refactor Summary:
 * 1. Centralized API Client
 *    - Replaced direct Axios usage with shared `apiClient`
 *    - Eliminates duplicated base URL handling across API modules
 *
 * 2. Retry + Timeout Support
 *    - Inherits retry logic, timeout handling, and error behavior from `client.js`
 *
 * 3. Preserved API Behavior
 *    - Endpoints and response structure remain unchanged
 *    - Maintains existing method naming to avoid breaking callers
 *
 * Environment Variables Required:
 * - VITE_STRAPI_URL              (string)  → Base API URL
 * - VITE_API_TIMEOUT_MS          (number)  → Timeout (inherited)
 * - VITE_API_RETRY_COUNT         (number)  → Retry count (inherited)
 * - VITE_API_RETRY_DELAY_MS      (number)  → Retry delay (inherited)
 *
 * Notes:
 * - This file contains no JSX and remains `.js`
 * - Uses shared Axios client for consistency across API modules
 * - Vite env variables are exposed to the client bundle (not secure)
 *
 * Future Improvements:
 * - Normalize response structure across reference endpoints
 * - Add caching for reference datasets
 * - Consider renaming `referenceFindone` → `referenceFindOne` after updating callers
 */

import apiClient from "./client";

const referenceRequest = {
  /**
   * Fetch all reference entries
   */
  referenceFind: async () => {
    return await apiClient.get("/api/references");
  },

  /**
   * Fetch a single reference entry by ID
   * - Preserves existing method name for compatibility
   */
  referenceFindone: async (id) => {
    return await apiClient.get(`/api/references/${id}`);
  },
};

export default referenceRequest;