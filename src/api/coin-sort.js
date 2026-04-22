/**
 * coin-sort.js — Post Vite Updates (2026)
 *
 * Purpose:
 * Handles API requests for Coin Sort functionality and related coin datasets
 * from the Strapi backend.
 *
 * Refactor Summary:
 * 1. Centralized API Client
 *    - Replaced direct Axios usage with shared `apiClient`
 *    - Eliminates duplicated base URL handling across API modules
 *
 * 2. Retry + Timeout Support
 *    - Inherits retry logic, timeout handling, and error behavior from `client.js`
 *
 * 3. Preserved Query Structure
 *    - Maintains qs-based filtering, population, and pagination logic
 *    - Preserves existing endpoint behavior and response shape
 *
 * 4. Preserved Existing Method Names
 *    - Retains legacy method names to avoid breaking current callers
 *    - Known typos remain intentionally preserved for compatibility
 *
 * Environment Variables Required:
 * - VITE_STRAPI_URL              (string)  → Base API URL
 * - VITE_API_TIMEOUT_MS          (number)  → Timeout (inherited)
 * - VITE_API_RETRY_COUNT         (number)  → Retry count (inherited)
 * - VITE_API_RETRY_DELAY_MS      (number)  → Retry delay (inherited)
 *
 * Notes:
 * - This file contains no JSX and remains `.js`
 * - Uses `qs` for safe nested query string construction
 * - Shared API client standardizes timeout + retry behavior
 * - Vite env variables are exposed to the client bundle (not secure)
 *
 * Known Issues (preserved intentionally):
 * - Typo in method name: `coinFectAll` → should be `coinFetchAll`
 * - Typo in method name: `coinStotlight` → should be `coinSpotlight`
 *
 * Future Improvements:
 * - Fix method name typos after updating all callers
 * - Normalize Strapi response payloads in one shared layer
 * - Replace extremely large page sizes with paginated helpers if needed
 */

import qs from "qs";
import apiClient from "./client";

const coinSortRequest = {
  /**
   * Fetch all coins included in the Coin Sort catalog set
   * - Preserves legacy method name for compatibility
   * - Includes population for display and grouping metadata
   */
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

    return apiClient.get(`/api/coins?${query}`);
  },

  /**
   * Fetch spotlight coins for Coin Sort
   * - Preserves legacy typo in method name for compatibility
   * - Includes both obverse and reverse media plus classification relations
   */
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

    return apiClient.get(`/api/coins?${query}`);
  },

  /**
   * Fetch Coin Sort page/config data
   * - Preserves original endpoint behavior
   */
  coinSortFind: () => {
    return apiClient.get("/api/coin-sort");
  },
};

export default coinSortRequest;