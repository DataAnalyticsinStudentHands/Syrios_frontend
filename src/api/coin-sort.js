/**
 * coin-sort.js — Vite Migration Refactor (2026)
 *
 * Purpose:
 * Handles API requests for Coin Sort functionality and related coin datasets
 * from the Strapi backend.
 *
 * Refactor Summary:
 * 1. Migrated environment variables
 *    - Replaced `process.env.REACT_APP_strapiURL` with `import.meta.env.VITE_STRAPI_URL`
 *
 * 2. Simplified Axios usage
 *    - Converted `axios(url, { method: 'GET' })` to `axios.get(url)`
 *
 * 3. Preserved query structure
 *    - Maintains qs-based filtering, population, and pagination logic
 *
 * Environment Variables Required:
 * - VITE_STRAPI_URL
 *
 * Notes:
 * - This file contains no JSX and remains `.js`
 * - qs is used for safe query string construction
 * - Vite env variables are exposed to the client bundle (not secure)
 *
 * Known Issues (preserved intentionally):
 * - Typo in method name: `coinFectAll` → should be `coinFetchAll`
 * - Typo in method name: `coinStotlight` → should be `coinSpotlight`
 *
 * Future Improvements:
 * - Fix method name typos (requires updating all callers)
 * - Centralize base URL using a shared axios instance
 * - Add error handling / retries
 */

import axios from "axios";
import qs from "qs";

const baseURL = import.meta.env.VITE_STRAPI_URL;

const coinSortRequest = {
  coinFectAll: () => {
    const query = qs.stringify({
      filters: {
        catalog_coinsort_set: true,
      },
      populate: ["obverse_file", "governing_power", "type_category"],
      pagination: {
        page: 1,
        pageSize: 2147483647,
      },
    });

    return axios.get(`${baseURL}/api/coins?${query}`);
  },

  coinStotlight: () => {
    const query = qs.stringify({
      filters: {
        spotlight_on: true,
      },
      populate: [
        "obverse_file",
        "reverse_file",
        "governing_power",
        "type_category",
      ],
      pagination: {
        page: 1,
        pageSize: 2147483647,
      },
    });

    return axios.get(`${baseURL}/api/coins?${query}`);
  },

  coinSortFind: () => {
    return axios.get(`${baseURL}/api/coin-sort`);
  },
};

export default coinSortRequest;