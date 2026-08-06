/**
 * video-library.js — Post Vite Updates (2026)
 *
 * Purpose:
 * Handles API requests for Video Library content from the Strapi backend.
 *
 * Refactor Summary:
 * 1. Centralized API Client
 *    - Replaced direct Axios usage with shared `apiClient`
 *    - Eliminates duplicated base URL handling across API modules
 *
 * 2. Retry + Timeout Support
 *    - Inherits retry logic, timeout handling, and error behavior from `client.js`
 *
 * 3. Environment-Gated Local Access
 *    - Local Strapi endpoint is now gated behind:
 *        • `VITE_ENABLE_LOCAL_STRAPI`
 *    - Prevents accidental usage in production builds
 *
 * 4. Caching + Response Normalization
 *    - Enables in-memory caching for stable video library content
 *    - Enables Strapi response normalization for easier frontend consumption
 *
 * 5. Preserved API Behavior
 *    - Endpoint remains unchanged
 *    - Local development behavior remains unchanged
 *
 * Environment Variables Required:
 * - VITE_STRAPI_URL              (string)  → Base API URL
 * - VITE_ENABLE_LOCAL_STRAPI     (boolean) → Enable local endpoint
 * - VITE_LOCAL_STRAPI_URL        (string)  → Local Strapi URL (optional)
 * - VITE_API_TIMEOUT_MS          (number)  → Timeout (inherited)
 * - VITE_API_RETRY_COUNT         (number)  → Retry count (inherited)
 * - VITE_API_RETRY_DELAY_MS      (number)  → Retry delay (inherited)
 *
 * Notes:
 * - This file contains no JSX and remains `.js`
 * - Uses shared Axios client for consistency across API modules
 * - Local endpoint throws explicit error if not enabled
 * - Production request now opts into cache + normalization
 * - Vite env variables are exposed to the client bundle (not secure)
 *
 * Future Improvements:
 * - Add local response normalization helper if needed for dev parity
 * - Expand populate fields if media relations become more complex
 * - Add optional cache invalidation for editor/admin workflows
 */

import apiClient, { localStrapiRequest } from "./client";
import { CACHE_TTL, requestOptions } from "./request-options";


const VideoLibraryRequest = {
  /**
   * Fetch video library content from production Strapi
   * - Uses shared API client (retry + timeout enabled)
   * - Enables caching for stable page content
   * - Enables Strapi response normalization
   */
  videoFind: () => {
    return apiClient.get("/api/videos", {
      meta: requestOptions.cachedNormalized(CACHE_TTL.LONG),
    });
  },

  /**
   * Fetch video library content from local Strapi instance
   * - Only allowed when explicitly enabled via env flag
   * - Kept raw for local debugging consistency
   */
  videoFindLocal: async () => {
    return localStrapiRequest({
      method: "get",
      url: "/api/videos",
    });
  },
};

export default VideoLibraryRequest;