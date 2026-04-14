/**
 * evidence.js — Vite Migration Refactor (2026)
 *
 * Purpose:
 * Handles API requests for "Explore the Evidence" content from the Strapi backend.
 *
 * Refactor Summary:
 * 1. Migrated environment variables
 *    - Replaced `process.env.REACT_APP_strapiURL` with `import.meta.env.VITE_STRAPI_URL`
 *
 * 2. Simplified Axios usage
 *    - Converted `axios(url, { method: 'GET' })` to `axios.get(url)`
 *
 * 3. Preserved query structure
 *    - Maintains qs-based population of related image fields
 *
 * Environment Variables Required:
 * - VITE_STRAPI_URL
 *
 * Notes:
 * - This file contains no JSX and remains `.js`
 * - qs is used for safe query string construction
 * - `evidenceFindLocal` is for local Strapi development
 * - Vite env variables are exposed to the client bundle (not secure)
 *
 * Future Improvements:
 * - Centralize base URL using a shared axios instance
 * - Add error handling / retries
 * - Gate local endpoints behind environment flags
 */

import axios from "axios";
import qs from "qs";

const baseURL = import.meta.env.VITE_STRAPI_URL;

const evidenceRequest = {
  evidenceFind: () => {
    const query = qs.stringify({
      populate: ["image_icon", "image_icon.image"],
    });

    return axios.get(`${baseURL}/api/explore-the-evidence?${query}`);
  },

  evidenceFindLocal: async () => {
    return await axios.get("http://localhost:1337/api/explore-the-evidence");
  },
};

export default evidenceRequest;