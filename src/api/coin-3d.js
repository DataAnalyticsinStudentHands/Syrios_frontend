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

import axios from "axios";
import apiClient from "./client";
import { CACHE_TTL, requestOptions } from "./request-options";

const allowLocalStrapi = import.meta.env.VITE_ENABLE_LOCAL_STRAPI === "true";
const localStrapiURL =
  import.meta.env.VITE_LOCAL_STRAPI_URL || "http://localhost:1337";

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
    if (!allowLocalStrapi) {
      throw new Error(
        "Local Strapi endpoint is disabled. Set VITE_ENABLE_LOCAL_STRAPI=true to enable it."
      );
    }

    return axios.get(`${localStrapiURL}/api/coin-3d`, {
      timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS || 10000),
    });
  },
};

export default coin3DRequest;