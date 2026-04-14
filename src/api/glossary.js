/**
 * glossary.js — Vite Migration Refactor (2026)
 *
 * Purpose:
 * Handles API requests for Glossary content from the Strapi backend.
 *
 * Refactor Summary:
 * 1. Migrated environment variables
 *    - Replaced `process.env.REACT_APP_strapiURL` with `import.meta.env.VITE_STRAPI_URL`
 *    - Replaced `process.env.REACT_APP_strapiURLLocal` with `import.meta.env.VITE_STRAPI_URL_LOCAL`
 *
 * 2. Simplified Axios usage
 *    - Converted `axios(url, { method: 'GET' })` to `axios.get(url)`
 *
 * 3. Preserved query structure
 *    - All qs-based filtering, pagination, and search behavior remains unchanged
 *
 * Environment Variables Required:
 * - VITE_STRAPI_URL
 * - VITE_STRAPI_URL_LOCAL (optional, for local endpoints)
 *
 * Notes:
 * - This file contains no JSX and remains `.js`
 * - qs is used for safe query string construction
 * - Vite env variables are exposed to the client bundle (not secure)
 *
 * Known Issues (preserved intentionally):
 * - Endpoint typo: `/api/glossry/by-term/` (should likely be `/api/glossary/...`)
 *
 * Future Improvements:
 * - Fix endpoint typo if confirmed
 * - Centralize axios base URL
 * - Add error handling / retries
 */

import axios from "axios";
import qs from "qs";

const baseURL = import.meta.env.VITE_STRAPI_URL;
const localBaseURL = import.meta.env.VITE_STRAPI_URL_LOCAL || "http://localhost:1337";

const glossaryRequest = {
  glossaryFindLocal: async () => {
    const query = qs.stringify({
      pagination: {
        page: 1,
        pageSize: 2147483647,
      },
    });

    return await axios.get(`${localBaseURL}/api/glossaries?${query}`);
  },

  glossaryHomeFind: () => {
    return axios.get(`${baseURL}/api/glossary-home`);
  },

  glossaryFind: () => {
    const query = qs.stringify({
      fields: ["term"],
    });

    return axios.get(`${baseURL}/api/glossaries?${query}`);
  },

  glossarySearch: (text) => {
    const query = qs.stringify({
      fields: ["term"],
      filters: {
        term: {
          $startsWithi: text,
        },
      },
    });

    return axios.get(`${baseURL}/api/glossaries?${query}`);
  },

  glossaryFindByTerm: (term) => {
    const query = qs.stringify({
      filters: {
        term: {
          $eqi: term,
        },
      },
    });

    return axios.get(`${baseURL}/api/glossaries?${query}`);
  },

  glossaryFindByTermLocal: (term) => {
    return axios.get(`${localBaseURL}/api/glossry/by-term/${term}`);
  },
};

export default glossaryRequest;