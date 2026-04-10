/**
 * coin-collections.js — Deep Populate Fix (2026)
 *
 * Changes:
 * - Replaced `populate=*` with explicit structured populate
 * - Added deep population for:
 *   - spotlight coins (fullCoinPopulate)
 *   - coin_of_the_day.image
 * - Preserved existing CoinSort and collection endpoints
 *
 * Why:
 * - Strapi does not reliably deep-populate nested media with `populate=*`
 * - Spotlight and Coin of the Day were missing image relations
 *
 * Outcome:
 * - Main catalog page now receives fully populated media objects
 * - Enables Card.jsx to correctly resolve image URLs
 */

import axios from "axios";
import qs from "qs";

const baseURL = import.meta.env.VITE_STRAPI_URL;

const fullCoinPopulate = {
  obverse_image: true,
  reverse_image: true,
  mint: true,
  material: true,
  denomination: true,
  issuing_authority: true,
  governing_power: true,
  ancient_territory: true,
  type_categories: true,
  language: true,
};

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
  coinCollectionPage: () => {
    const query = qs.stringify(
      {
        populate: coinCollectionPagePopulate,
      },
      { encodeValuesOnly: true }
    );

    return axios.get(`${baseURL}/api/coin-collection-page?${query}`);
  },

  coinCollection: () => {
    const query = qs.stringify(
      {
        populate: fullCoinPopulate,
        pagination: { page: 1, pageSize: 2147483647 },
      },
      { encodeValuesOnly: true }
    );

    return axios.get(`${baseURL}/api/coin-collections?${query}`);
  },

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

    return axios.get(`${baseURL}/api/coin-collections?${query}`);
  },

  fetchCoinSortConfig: () => {
    return axios.get(`${baseURL}/api/coin-sort?populate=*`);
  },
};

export default coinCollectionsRequest;