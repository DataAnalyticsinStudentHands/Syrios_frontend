/**
 * landing.js — Vite Migration Refactor (2026)
 *
 * Purpose:
 * Handles API requests for Landing Page content from the Strapi backend.
 *
 * Refactor Summary:
 * 1. Migrated environment variables
 *    - Replaced `process.env.REACT_APP_strapiURL` with `import.meta.env.VITE_STRAPI_URL`
 *
 * 2. Simplified Axios usage
 *    - Converted `axios(url, { method: 'GET' })` to `axios.get(url)`
 *
 * 3. Preserved API behavior
 *    - Endpoint and response handling remain unchanged
 *
 * Environment Variables Required:
 * - VITE_STRAPI_URL (e.g., https://your-api-domain.com)
 *
 * Notes:
 * - This file contains no JSX and remains `.js`
 * - `landingFindLocal` is for local Strapi development
 * - Vite env variables are exposed to the client bundle (not secure)
 *
 * Future Improvements:
 * - Fix typo in method name (`landingdFind` → `landingFind`)
 * - Centralize base URL using a shared axios instance
 * - Add error handling / retries
 */

import axios from "axios";

const baseURL = import.meta.env.VITE_STRAPI_URL;

const landingRequest = {
  // keeping original name to avoid breaking callers
  landingdFind: () => {
    return axios.get(`${baseURL}/api/landing-page`);
  },

  landingFindLocal: async () => {
    return await axios.get("http://localhost:1337/api/landing-page");
  },
};

export default landingRequest;