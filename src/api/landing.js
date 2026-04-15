/**
 * landing.js — Post Vite Updates (2026)
 *
 * Purpose:
 * Handles API requests for Landing Page content from the Strapi backend.
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
 *    - Enables in-memory caching for stable landing page content
 *    - Enables Strapi response normalization for easier frontend consumption
 *
 * 5. Preserved API Behavior
 *    - Endpoint remains unchanged
 *    - Maintains legacy method name for compatibility
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
 * Known Issues (preserved intentionally):
 * - Typo in method name: `landingdFind` → should be `landingFind`
 *
 * Future Improvements:
 * - Fix method name typo after updating all callers
 * - Add local response normalization helper if needed for dev parity
 * - Add optional cache invalidation for editor/admin workflows
 */

import axios from "axios";
import apiClient from "./client";
import { CACHE_TTL, requestOptions } from "./request-options";

const allowLocalStrapi = import.meta.env.VITE_ENABLE_LOCAL_STRAPI === "true";
const localStrapiURL =
  import.meta.env.VITE_LOCAL_STRAPI_URL || "http://localhost:1337";

const landingRequest = {
  /**
   * Fetch landing page content from production Strapi
   * - Preserves legacy method name to avoid breaking callers
   * - Uses shared API client (retry + timeout enabled)
   * - Enables caching for stable page content
   * - Enables Strapi response normalization
   */
  landingdFind: () => {
    return apiClient.get("/api/landing-page", {
      meta: requestOptions.cachedNormalized(CACHE_TTL.VERY_LONG),
    });
  },

  /**
   * Fetch landing page content from local Strapi instance
   * - Only allowed when explicitly enabled via env flag
   * - Kept raw for local debugging consistency
   */
  landingFindLocal: async () => {
    if (!allowLocalStrapi) {
      throw new Error(
        "Local Strapi endpoint is disabled. Set VITE_ENABLE_LOCAL_STRAPI=true to enable it."
      );
    }

    return axios.get(`${localStrapiURL}/api/landing-page`, {
      timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS || 10000),
    });
  },
};

export default landingRequest;