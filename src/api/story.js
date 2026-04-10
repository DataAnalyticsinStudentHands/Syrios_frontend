/**
 * story.js — Vite Migration Refactor (2026)
 *
 * Purpose:
 * Handles API requests for Story content from the Strapi backend.
 *
 * Refactor Summary:
 * 1. Migrated environment variables
 *    - Replaced `process.env.REACT_APP_*` with `import.meta.env.VITE_*`
 *
 * 2. Simplified Axios usage
 *    - Converted `axios(url, { method: 'GET' })` to `axios.get(url)`
 *
 * 3. Preserved environment filtering logic
 *    - Maintains behavior where development stories are conditionally included
 *
 * Environment Variables Required:
 * - VITE_STRAPI_URL
 * - VITE_PRODUCTION (e.g., "development" or "production")
 *
 * Notes:
 * - This file contains no JSX and remains `.js`
 * - Vite env variables are exposed to the client bundle (not secure)
 *
 * Future Improvements:
 * - Move environment filtering logic to backend
 * - Centralize axios instance for baseURL reuse
 * - Add error handling / retries
 */

import axios from "axios";

const baseURL = import.meta.env.VITE_STRAPI_URL;
const environmentFlag = import.meta.env.VITE_PRODUCTION;

const storyRequest = {
  storyHomeFind: () => {
    return axios.get(`${baseURL}/api/story-home`);
  },

  storyFind: () => {
    let environment = "";

    // if in development we include dev/test stories
    if (environmentFlag === "development") {
      environment = "development";
    }

    return axios.get(`${baseURL}/api/stories?env=${environment}`);
  },

  storyFindOne: (id) => {
    return axios.get(`${baseURL}/api/stories/${id}`);
  },

  // legacy / optional query block retained for reference
  // storyCoinsOfDays: () => { ... }
};

export default storyRequest;