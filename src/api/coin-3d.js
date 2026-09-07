/**
 * coin-3d.js — Post Vite Updates (2026)
 *
 * Purpose:
 * Handles API requests for 3D coin data from the Strapi backend.
 *
 * Refactor Summary:
 * 1. Centralized API Client
 * 2. Retry + Timeout Support
 * 3. Environment-Gated Local Access
 * 4. Caching + Response Normalization (NEW)
 *
 * Future Improvements:
 * - Request batching for large asset sets
 */

import apiClient, { localStrapiRequest } from "./client";
import { CACHE_TTL, requestOptions } from "./request-options";


const coin3DRequest = {
  /**
   * Fetch 3D coin data from production Strapi
   * - Enables caching (3D metadata is stable)
   * - Enables normalization
   */
  coin3DFind: () => {
    return apiClient.get("/api/coin-3d", {
      meta: requestOptions.cachedNormalized(CACHE_TTL.LONG),
    });
  },

  coin3DFindLocal: async () => {
    return localStrapiRequest({
      method: "get",
      url: "/api/coin-3d",
    });
  },
};

export default coin3DRequest;