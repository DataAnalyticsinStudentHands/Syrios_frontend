/**
 * Read the public Zotero group bibliography without authentication.
 * Public libraries do not require an API key. Credentials for private libraries
 * belong in a backend service, never in the Vite environment or browser client.
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

/**
 * Retry + timeout configuration
 */
const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT_MS || 10000);
const MAX_RETRIES = Number(import.meta.env.VITE_API_RETRY_COUNT || 2);
const RETRY_DELAY_MS = Number(import.meta.env.VITE_API_RETRY_DELAY_MS || 500);

/**
 * Shared headers for anonymous bibliography requests. Do not add API-key or
 * bearer headers here: frontend environment values are visible to visitors.
 */
const zoteroHeaders = {
  "Zotero-API-Version": zoteroApiVersion,
};

/**
 * Dedicated Axios instance for Zotero
 */
const zoteroClient = axios.create({
  baseURL,
  timeout: TIMEOUT,
  headers: zoteroHeaders,
  withCredentials: false,
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
