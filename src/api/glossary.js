/**
 * glossary.js — Post Vite Updates (2026)
 *
 * Purpose:
 * Handles API requests for Glossary content from the Strapi backend.
 *
 * Refactor Summary:
 * 1. Centralized API Client
 *    - Replaced direct Axios usage with shared `apiClient`
 *    - Eliminates duplicated base URL handling across API modules
 *
 * 2. Retry + Timeout Support
 *    - Inherits retry logic, timeout handling, and error behavior from `client.js`
 *
 * 3. Preserved Query Structure
 *    - Maintains qs-based filtering, pagination, and search behavior
 *    - Ensures consistent query serialization across endpoints
 *
 * 4. Environment-Gated Local Access
 *    - Local Strapi endpoints are gated behind:
 *        • `VITE_ENABLE_LOCAL_STRAPI`
 *    - Prevents accidental usage in production builds
 *
 * 5. Preserved API Behavior
 *    - All endpoints, filters, and response structures remain unchanged
 *
 * Environment Variables Required:
 * - VITE_STRAPI_URL              (string)  → Base API URL
 * - VITE_ENABLE_LOCAL_STRAPI     (boolean) → Enable local endpoints
 * - VITE_LOCAL_STRAPI_URL        (string)  → Local Strapi URL (optional)
 * - VITE_API_TIMEOUT_MS          (number)  → Timeout (inherited)
 * - VITE_API_RETRY_COUNT         (number)  → Retry count (inherited)
 * - VITE_API_RETRY_DELAY_MS      (number)  → Retry delay (inherited)
 *
 * Notes:
 * - This file contains no JSX and remains `.js`
 * - Uses `qs` for safe nested query string construction
 * - Uses shared Axios client for consistency across API modules
 * - Local endpoints throw explicit error if not enabled
 * - Vite env variables are exposed to the client bundle (not secure)
 *
 * Known Issues (preserved intentionally):
 * - Endpoint typo: `/api/glossry/by-term/` (likely should be `/api/glossary/...`)
 *
 * Future Improvements:
 * - Fix endpoint typo after confirming backend route
 * - Add response normalization layer for Strapi payloads
 * - Add caching for glossary datasets (good candidate due to low volatility)
 */

import axios from "axios";
import qs from "qs";
import apiClient from "./client";

const allowLocalStrapi = import.meta.env.VITE_ENABLE_LOCAL_STRAPI === "true";
const localStrapiURL =
  import.meta.env.VITE_LOCAL_STRAPI_URL || "http://localhost:1337";

const glossaryRequest = {
  /**
   * Fetch full glossary dataset from local Strapi
   * - Used for development/debugging
   */
  glossaryFindLocal: async () => {
    if (!allowLocalStrapi) {
      throw new Error(
        "Local Strapi endpoint is disabled. Set VITE_ENABLE_LOCAL_STRAPI=true to enable it."
      );
    }

    const query = qs.stringify(
      {
        pagination: {
          page: 1,
          pageSize: 2147483647,
        },
      },
      { encodeValuesOnly: true }
    );

    return axios.get(`${localStrapiURL}/api/glossaries?${query}`, {
      timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS || 10000),
    });
  },

  /**
   * Fetch glossary home content
   */
  glossaryHomeFind: () => {
    return apiClient.get("/api/glossary-home");
  },

  /**
   * Fetch glossary term list (lightweight)
   */
  glossaryFind: () => {
    const query = qs.stringify(
      {
        fields: ["term"],
      },
      { encodeValuesOnly: true }
    );

    return apiClient.get(`/api/glossaries?${query}`);
  },

  /**
   * Search glossary terms by prefix (case-insensitive)
   */
  glossarySearch: (text) => {
    const query = qs.stringify(
      {
        fields: ["term"],
        filters: {
          term: {
            $startsWithi: text,
          },
        },
      },
      { encodeValuesOnly: true }
    );

    return apiClient.get(`/api/glossaries?${query}`);
  },

  /**
   * Fetch glossary entry by exact term (case-insensitive)
   */
  glossaryFindByTerm: (term) => {
    const query = qs.stringify(
      {
        filters: {
          term: {
            $eqi: term,
          },
        },
      },
      { encodeValuesOnly: true }
    );

    return apiClient.get(`/api/glossaries?${query}`);
  },

  /**
   * Fetch glossary entry by term from local Strapi
   * - Preserves known endpoint typo for compatibility
   */
  glossaryFindByTermLocal: (term) => {
    if (!allowLocalStrapi) {
      throw new Error(
        "Local Strapi endpoint is disabled. Set VITE_ENABLE_LOCAL_STRAPI=true to enable it."
      );
    }

    return axios.get(`${localStrapiURL}/api/glossry/by-term/${term}`, {
      timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS || 10000),
    });
  },
};

export default glossaryRequest;