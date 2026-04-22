/**
 * about-us.js — Post Vite Updates (2026)
 *
 * Purpose:
 * Handles API requests for About Us content from the Strapi backend.
 *
 * Refactor Summary:
 * 1. Centralized API Client
 *    - Replaced direct Axios usage with shared `apiClient`
 *    - Removes duplicated base URL logic
 *
 * 2. Retry + Timeout Support
 *    - Inherits retry, timeout, and error handling from `client.js`
 *
 * 3. Environment-Gated Local Access
 *    - Local Strapi endpoint is now gated behind:
 *        • `VITE_ENABLE_LOCAL_STRAPI`
 *    - Prevents accidental use in production builds
 *
 * 4. Caching + Response Normalization
 *    - Enables in-memory caching for stable CMS content
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
 *
 * Future Improvements:
 * - Add local response normalization helper if needed for dev parity
 * - Add TypeScript typings or JSDoc schemas
 * - Add optional cache invalidation for editor/admin workflows
 */

import axios from "axios";
import apiClient from "./client";
import { CACHE_TTL, requestOptions } from "./request-options";

const allowLocalStrapi = import.meta.env.VITE_ENABLE_LOCAL_STRAPI === "true";
const localStrapiURL =
  import.meta.env.VITE_LOCAL_STRAPI_URL || "http://localhost:1337";

const aboutUsRequest = {
  /**
   * Fetch About Us content from production Strapi
   * - Uses shared API client (retry + timeout enabled)
   * - Enables caching for stable page content
   * - Enables Strapi response normalization
   */
  aboutUsFind: () => {
    return apiClient.get("/api/about-us", {
      meta: requestOptions.cachedNormalized(CACHE_TTL.VERY_LONG),
    });
  },

  /**
   * Fetch About Us content from local Strapi instance
   * - Only allowed when explicitly enabled via env flag
   * - Kept raw for local debugging consistency
   */
  aboutUsFindLocal: async () => {
    if (!allowLocalStrapi) {
      throw new Error(
        "Local Strapi endpoint is disabled. Set VITE_ENABLE_LOCAL_STRAPI=true to enable it."
      );
    }

    return axios.get(`${localStrapiURL}/api/about-us`, {
      timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS || 10000),
    });
  },
};

export default aboutUsRequest;