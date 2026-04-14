/**
 * zotero.js — Vite Migration Refactor (2026)
 *
 * Purpose:
 * Handles all client-side requests to the Zotero API for research data retrieval.
 *
 * Refactor Summary:
 * 1. Removed hardcoded API values
 *    - Replaced base URL, group ID, API version, and API key with Vite environment variables
 *
 * 2. Migrated from CRA environment variables
 *    - Replaced `process.env.REACT_APP_*` with `import.meta.env.VITE_*`
 *
 * 3. Centralized request configuration
 *    - Extracted shared Zotero headers into `zoteroHeaders` object
 *    - Reduced duplication across request methods
 *
 * 4. Preserved API behavior
 *    - All endpoints, parameters, and response structures remain unchanged
 *
 * Environment Variables Required:
 * - VITE_ZOTERO_API_URL       (default: https://api.zotero.org)
 * - VITE_ZOTERO_GROUP_ID      (e.g., 4740395)
 * - VITE_ZOTERO_API_VERSION   (default: 3)
 * - VITE_ZOTERO_API_KEY       (Zotero API key)
 *
 * Notes:
 * - This file intentionally remains `.js` (no JSX present)
 * - Vite environment variables are exposed to the client bundle
 *   → API key is not secure and should be moved to a backend proxy if needed
 * - Ensure `.env` file is properly configured with required variables before running the app
 */


import axios from "axios";

const baseURL = import.meta.env.VITE_ZOTERO_API_URL || "https://api.zotero.org";
const zoteroGroupId = import.meta.env.VITE_ZOTERO_GROUP_ID;
const zoteroApiVersion = import.meta.env.VITE_ZOTERO_API_VERSION || "3";
const zoteroApiKey = import.meta.env.VITE_ZOTERO_API_KEY;

const zoteroHeaders = {
  "Zotero-API-Version": zoteroApiVersion,
  "Zotero-API-Key": zoteroApiKey,
};

const zoteroRequest = {
  getAllitems: async () => {
    return await axios(`${baseURL}/groups/${zoteroGroupId}/items`, {
      method: "GET",
      headers: zoteroHeaders,
      params: {
        include: "bib",
        sort: "creator",
        limit: "1000",
      },
    });
  },

  getItemsTop: async () => {
    return await axios(`${baseURL}/groups/${zoteroGroupId}/items/top`, {
      method: "GET",
      headers: zoteroHeaders,
    });
  },

  getOneItem: async (itemKey) => {
    return await axios(`${baseURL}/groups/${zoteroGroupId}/items/${itemKey}`, {
      method: "GET",
      headers: zoteroHeaders,
    });
  },

  getOneItemBib: async (itemKey) => {
    return await axios(`${baseURL}/groups/${zoteroGroupId}/items/${itemKey}`, {
      method: "GET",
      headers: zoteroHeaders,
      params: {
        format: "bib",
      },
    });
  },

  getOneItemChildren: async (itemKey) => {
    return await axios(`${baseURL}/groups/${zoteroGroupId}/items/${itemKey}/children`, {
      method: "GET",
      headers: zoteroHeaders,
      params: {
        format: "json",
      },
    });
  },
};

export default zoteroRequest;