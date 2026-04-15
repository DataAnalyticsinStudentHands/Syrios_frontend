/**
 * makeRequest.js — Post Vite Updates (2026)
 *
 * Purpose:
 * Creates a shared Axios instance for backend API requests.
 *
 * Refactor Summary:
 * 1. Vite Environment Compatibility
 *    - Uses `import.meta.env.VITE_*` variables
 *
 * 2. Configurable Base URL
 *    - Defaults to `VITE_API_URL`
 *    - Can switch to `VITE_API_URL_LOCAL` when local API mode is enabled
 *
 * 3. Configurable Timeout
 *    - Uses `VITE_API_TIMEOUT_MS`
 *    - Falls back to 10000ms if not provided
 *
 * 4. Optional Auth Header Support
 *    - Adds bearer token only if `VITE_API_TOKEN` is present
 *
 * Notes:
 * - This file is intended for non-Strapi/backend API requests
 * - Environment variables exposed through Vite are client-visible
 * - Do not place sensitive production secrets here unless that is intentional
 *
 * Environment Variables:
 * - VITE_API_URL
 * - VITE_API_URL_LOCAL
 * - VITE_ENABLE_LOCAL_API
 * - VITE_API_TIMEOUT_MS
 * - VITE_API_TOKEN
 *
 * Future Improvements:
 * - Add retry logic
 * - Add interceptors for unified error handling
 * - Merge with broader shared API client strategy if desired
 */

import axios from "axios";

const useLocalApi = import.meta.env.VITE_ENABLE_LOCAL_API === "true";

const baseURL = useLocalApi
  ? import.meta.env.VITE_API_URL_LOCAL || import.meta.env.VITE_API_URL
  : import.meta.env.VITE_API_URL;

const apiToken = import.meta.env.VITE_API_TOKEN;

export const makeRequest = axios.create({
  baseURL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS || 10000),
  headers: apiToken
    ? {
        Authorization: `bearer ${apiToken}`,
      }
    : {},
});