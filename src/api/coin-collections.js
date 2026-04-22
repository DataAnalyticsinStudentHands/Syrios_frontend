/**
 * coin-collections.js — Post Vite Updates (2026)
 *
 * Purpose:
 * Handles API requests for coin collection page data, collection catalog data,
 * and coin sorting configuration from the Strapi backend.
 *
 * Refactor Summary:
 * 1. Centralized API Client
 *    - Uses shared `apiClient`
 *    - Eliminates duplicated base URL handling across API modules
 *
 * 2. Retry + Timeout Support
 *    - Inherits retry logic, timeout handling, caching hooks, and optional
 *      response normalization behavior from `client.js`
 *
 * 3. Preserved Deep Populate Fix
 *    - Retains explicit structured populate definitions instead of `populate=*`
 *    - Ensures nested media and related entities are returned reliably
 *
 * 4. Cache-First Rollout
 *    - Adds in-memory caching for page/config/catalog requests
 *    - Reduces repeated CMS fetches for stable content
 *
 * 5. Selective Response Normalization
 *    - Enables normalization for single-entity page/detail requests
 *    - Leaves collection endpoints raw for compatibility with existing callers
 *
 * Why:
 * - Strapi does not reliably deep-populate nested media with `populate=*`
 * - Spotlight and Coin of the Day required explicit population for image/media relations
 * - Collection/list endpoints may still be consumed using legacy Strapi response shapes
 *
 * Outcome:
 * - Coin collection landing page and coin detail page can use normalized CMS access
 * - Catalog/config requests benefit from caching without risking caller breakage
 *
 * Environment Variables Required:
 * - VITE_STRAPI_URL              (string)  → Base API URL
 * - VITE_API_TIMEOUT_MS          (number)  → Timeout (inherited)
 * - VITE_API_RETRY_COUNT         (number)  → Retry count (inherited)
 * - VITE_API_RETRY_DELAY_MS      (number)  → Retry delay (inherited)
 *
 * Notes:
 * - This file contains no JSX and remains `.js`
 * - Uses `qs` for safe nested query serialization
 * - Large page sizes are preserved to match prior app behavior
 * - `fetchCoinSortConfig` still uses `populate=*` because it was not part of the original deep-populate issue
 * - Only single-entity page/detail requests are normalized in this pass
 *
 * Future Improvements:
 * - Normalize collection endpoints after updating all callers
 * - Replace very large pageSize values with paginated fetch helpers
 * - Expand explicit populate for CoinSort config if nested media issues appear there
 */

import qs from "qs";
import apiClient from "./client";
import { CACHE_TTL, requestOptions } from "./request-options";

/**
 * Full population map for coin relations
 * - Ensures catalog cards and spotlight entries receive all related metadata
 */
const fullCoinPopulate = {
  obverse_image: true,
  reverse_image: true,
  mint: {
    populate: {
      modern_name: true,
      modern_country: true,
    },
  },
  material: true,
  denomination: true,
  issuing_authority: true,
  governing_power: true,
  ancient_territory: true,
  type_categories: true,
  language: true,
};

/**
 * Population map for the main coin collection landing page
 * - `contents` is preserved as-is
 * - `spotlight` receives full related coin data
 * - `coin_of_the_day` explicitly populates its image relation
 */
const coinCollectionPagePopulate = {
  contents: true,
  spotlight: {
    populate: fullCoinPopulate,
  },
  coin_of_the_day: {
    populate: {
      image: true,
    },
  },
};

const coinCollectionsRequest = {
  /**
   * Fetch the main coin collection landing page content
   * - Includes deep population for spotlight and Coin of the Day image
   * - Enables caching for stable CMS page content
   * - Enables normalization because this is a single-entity page response
   */
  coinCollectionPage: () => {
    const query = qs.stringify(
      {
        populate: coinCollectionPagePopulate,
      },
      { encodeValuesOnly: true }
    );

    return apiClient.get(`/api/coin-collection-page?${query}`, {
      meta: requestOptions.cachedNormalized(CACHE_TTL.LONG),
    });
  },

  /**
   * Fetch a single coin collection record by ID
   * - Includes deep population for detail page relations and media
   * - Enables caching
   * - Enables normalization because this is a single-entity detail response
   */
  fetchOne: (id) => {
    const query = qs.stringify(
      {
        populate: fullCoinPopulate,
      },
      { encodeValuesOnly: true }
    );

    return apiClient.get(`/api/coin-collections/${id}?${query}`, {
      meta: requestOptions.cachedNormalized(CACHE_TTL.LONG),
    });
  },

  /**
   * Fetch the full coin collection catalog
   * - Preserves very large page size used by the existing app
   * - Includes full relation population for each coin entry
   * - Enables caching
   * - Keeps raw Strapi response shape for compatibility with existing callers
   */
  coinCollection: () => {
    const query = qs.stringify(
      {
        populate: fullCoinPopulate,
        pagination: { page: 1, pageSize: 2147483647 },
      },
      { encodeValuesOnly: true }
    );

    return apiClient.get(`/api/coin-collections?${query}`, {
      meta: requestOptions.cached(CACHE_TTL.LONG),
    });
  },

  /**
   * Fetch all catalog-visible coins for CoinSort
   * - Filters to entries that should appear in the catalog pile
   * - Includes full relation population for sorting/display logic
   * - Enables caching
   * - Keeps raw Strapi response shape for compatibility with existing callers
   */
  fetchAllForCoinSort: () => {
    const query = qs.stringify(
      {
        filters: {
          appear_catalog_pile: true,
        },
        populate: fullCoinPopulate,
        pagination: { page: 1, pageSize: 2147483647 },
      },
      { encodeValuesOnly: true }
    );

    return apiClient.get(`/api/coin-collections?${query}`, {
      meta: requestOptions.cached(CACHE_TTL.LONG),
    });
  },

  /**
   * Fetch CoinSort configuration
   * - Preserves current `populate=*` behavior
   * - Left unchanged because the prior deep-populate fix targeted catalog page relations
   * - Enables caching
   * - Keeps raw Strapi response shape for compatibility with existing callers
   */
  fetchCoinSortConfig: () => {
    return apiClient.get("/api/coin-sort?populate=*", {
      meta: requestOptions.cached(CACHE_TTL.LONG),
    });
  },
};

export default coinCollectionsRequest;