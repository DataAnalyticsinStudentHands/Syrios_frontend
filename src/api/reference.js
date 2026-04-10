/**
 * reference.js — Vite Migration Refactor (2026)
 *
 * Purpose:
 * Handles API requests for Reference content from the Strapi backend.
 *
 * Refactor Summary:
 * 1. Migrated environment variables
 *    - Replaced `process.env.REACT_APP_strapiURL` with `import.meta.env.VITE_STRAPI_URL`
 *
 * 2. Simplified Axios usage
 *    - Converted `axios(url, { method: 'GET' })` to `axios.get(url)`
 *
 * 3. Preserved API behavior
 *    - Endpoints and response handling remain unchanged
 *
 * Environment Variables Required:
 * - VITE_STRAPI_URL (e.g., https://your-api-domain.com)
 *
 * Notes:
 * - This file contains no JSX and remains `.js`
 * - Vite env variables are exposed to the client bundle (not secure)
 *
 * Future Improvements:
 * - Centralize base URL using a shared axios instance
 * - Add error handling / retries
 */

import axios from "axios";

const baseURL = import.meta.env.VITE_STRAPI_URL;

const referenceRequest = {
  referenceFind: async () => {
    return await axios.get(`${baseURL}/api/references`);
  },

  referenceFindone: async (id) => {
    return await axios.get(`${baseURL}/api/references/${id}`);
  },
};

export default referenceRequest;