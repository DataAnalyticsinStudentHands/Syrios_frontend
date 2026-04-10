/**
 * toolbox.js — Vite Migration Refactor (2026)
 *
 * Purpose:
 * Handles API requests for Toolbox content from the Strapi backend.
 *
 * Refactor Summary:
 * 1. Migrated environment variables
 *    - Replaced `process.env.REACT_APP_strapiURL` with `import.meta.env.VITE_STRAPI_URL`
 *
 * 2. Simplified Axios usage
 *    - Converted `axios(url, { method: 'GET' })` to `axios.get(url)`
 *
 * 3. Preserved API behavior
 *    - Endpoint paths and response handling remain unchanged
 *
 * Environment Variables Required:
 * - VITE_STRAPI_URL (e.g., https://your-api-domain.com)
 *
 * Notes:
 * - This file contains no JSX and remains `.js`
 * - `toolboxFindLocal` is for local Strapi development
 * - Vite env variables are exposed to the client bundle (not secure)
 *
 * Future Improvements:
 * - Centralize base URL using a shared axios instance
 * - Add error handling / retries
 * - Gate local endpoints behind environment flags
 */

import axios from "axios";

const baseURL = import.meta.env.VITE_STRAPI_URL;

const toolboxRequest = {
  toolboxFind: () => {
    return axios.get(`${baseURL}/api/tool-box`);
  },

  toolboxFindLocal: async () => {
    return await axios.get("http://localhost:1337/api/tool-box");
  },
};

export default toolboxRequest;