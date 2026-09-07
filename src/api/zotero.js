/**
 * zotero.js — Post Vite Updates (2026)
 *
 * Purpose:
 * Handles all client-side requests to the Zotero API for research data retrieval.
 *
 * Refactor Summary:
 * 1. Centralized API Client (Partial)
 *    - Introduced a dedicated Axios instance for Zotero (`zoteroClient`)
 *    - Keeps separation from Strapi `apiClient` due to different base URL + headers
 *
 * 2. Retry + Timeout Support
 *    - Applies same timeout + retry strategy used in `client.js`
 *    - Ensures resilience for external API calls (Zotero rate limits + latency)
 *
 * 3. Centralized Zotero Configuration
 *    - Base URL, group ID, API version, and API key pulled from env
 *    - Shared headers extracted into a single configuration
 *
 * 4. Preserved API Behavior
 *    - All endpoints, parameters, and response structures remain unchanged
 *
 * Environment Variables Required:
 * - VITE_ZOTERO_API_URL         (string)  → Default: https://api.zotero.org
 * - VITE_ZOTERO_GROUP_ID        (string)  → Zotero group ID
 * - VITE_ZOTERO_API_VERSION     (string)  → Default: 3
 * - VITE_ZOTERO_API_KEY         (string)  → Zotero API key (public exposure warning)
 * - VITE_API_TIMEOUT_MS         (number)  → Timeout
 * - VITE_API_RETRY_COUNT        (number)  → Retry count
 * - VITE_API_RETRY_DELAY_MS     (number)  → Retry delay
 *
 * Notes:
 * - This file intentionally remains `.js` (no JSX present)
 * - Uses a separate Axios instance due to different API domain + headers
 * - Vite environment variables are exposed to the client bundle
 *   → API key is NOT secure (should be proxied through backend for production)
 *
 * Future Improvements:
 * - Add caching layer (Zotero data is highly cacheable)
 * - Add pagination handling (Zotero caps results per request)
 * - Normalize response format for frontend consumption
 */

import axios from "axios";

/**
 * Environment configuration
 */
const baseURL =
  import.meta.env.VITE_ZOTERO_API_URL || "https://api.zotero.org";
const zoteroGroupId = import.meta.env.VITE_ZOTERO_GROUP_ID;
const zoteroApiVersion =
  import.meta.env.VITE_ZOTERO_API_VERSION || "3";
const zoteroApiKey = import.meta.env.VITE_ZOTERO_API_KEY;

/**
 * Retry + timeout configuration
 */
const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT_MS || 10000);
const MAX_RETRIES = Number(import.meta.env.VITE_API_RETRY_COUNT || 2);
const RETRY_DELAY_MS = Number(import.meta.env.VITE_API_RETRY_DELAY_MS || 500);

/**
 * Shared headers for all Zotero requests
 */
const zoteroHeaders = {
  "Zotero-API-Version": zoteroApiVersion,
  "Zotero-API-Key": zoteroApiKey,
};

/**
 * Dedicated Axios instance for Zotero
 */
const zoteroClient = axios.create({
  baseURL,
  timeout: TIMEOUT,
  headers: zoteroHeaders,
});

/**
 * Retry helper
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
 * Retry interceptor
 */
zoteroClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (!config) return Promise.reject(error);

    config.__retryCount = config.__retryCount || 0;

    if (config.__retryCount >= MAX_RETRIES || !shouldRetry(error)) {
      return Promise.reject(error);
    }

    config.__retryCount += 1;

    await sleep(RETRY_DELAY_MS * config.__retryCount);

    return zoteroClient(config);
  }
);

/**
 * Zotero request layer
 */
const zoteroRequest = {
  /**
   * Fetch all items (with bibliography formatting)
   */
  getAllitems: async () => {
    return zoteroClient.get(
      `/groups/${zoteroGroupId}/items`,
      {
        params: {
          include: "bib",
          sort: "creator",
          limit: "1000",
        },
      }
    );
  },

  /**
   * Fetch top-level items
   */
  getItemsTop: async () => {
    return zoteroClient.get(
      `/groups/${zoteroGroupId}/items/top`
    );
  },

  /**
   * Fetch single item by key
   */
  getOneItem: async (itemKey) => {
    return zoteroClient.get(
      `/groups/${zoteroGroupId}/items/${itemKey}`
    );
  },

  /**
   * Fetch single item formatted as bibliography
   */
  getOneItemBib: async (itemKey) => {
    return zoteroClient.get(
      `/groups/${zoteroGroupId}/items/${itemKey}`,
      {
        params: {
          format: "bib",
        },
      }
    );
  },

  /**
   * Fetch child items (attachments, notes, etc.)
   */
  getOneItemChildren: async (itemKey) => {
    return zoteroClient.get(
      `/groups/${zoteroGroupId}/items/${itemKey}/children`,
      {
        params: {
          format: "json",
        },
      }
    );
  },
};

export default zoteroRequest;