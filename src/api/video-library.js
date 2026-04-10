/**
 * video-library.js — Vite Migration Refactor (2026)
 *
 * Purpose:
 * Handles API requests for the Video Library content from Strapi.
 *
 * Refactor Summary:
 * 1. Migrated environment variables
 *    - Replaced `process.env.REACT_APP_strapiURL` with `import.meta.env.VITE_STRAPI_URL`
 *
 * 2. Removed hardcoded dependency on CRA env system
 *    - Ensures compatibility with Vite build system
 *
 * 3. Preserved existing API structure
 *    - Endpoints and request behavior remain unchanged
 *
 * Environment Variables Required:
 * - VITE_STRAPI_URL (e.g., https://your-api-domain.com)
 *
 * Notes:
 * - This file contains no JSX and remains `.js`
 * - `videoFindLocal` is intended for local Strapi development only
 * - Axios usage is intentionally simple for consistency with existing request layer
 *
 * Future Improvements:
 * - Consolidate base URL into shared axios instance
 * - Add error handling / retry logic
 * - Remove or gate local endpoints behind environment flag
 */

import axios from "axios";

const baseURL = import.meta.env.VITE_STRAPI_URL;

const VideoLibraryRequest = {
  videoFind: () => {
    return axios.get(`${baseURL}/api/videos`);
  },

  videoFindLocal: async () => {
    return await axios.get("http://localhost:1337/api/videos");
  },
};

export default VideoLibraryRequest;