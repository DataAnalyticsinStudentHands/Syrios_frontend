/**
 * coinContext.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Provides shared coin catalog data and filter option metadata to the app.
 *
 * Responsibilities:
 * - Fetch full coin collection data from `coin-collections.js`
 * - Store coin collection rows in React context
 * - Derive reusable filter term lists from the fetched collection
 * - Persist coin data and filter terms in sessionStorage
 *
 * Refactor Summary:
 * 1. Preserved Raw Collection Compatibility
 *    - Intentionally keeps legacy Strapi collection access:
 *        coin.attributes.*
 *    - Required because `coinCollection()` is still intentionally raw
 *
 * 2. Defensive Storage Handling
 *    - Safely hydrates context state from sessionStorage
 *    - Prevents crashes if stored JSON is malformed
 *
 * 3. Preserved Existing Behavior
 *    - Context shape and fetch behavior remain unchanged
 *    - Filter option extraction logic remains functionally the same
 *
 * Data Shape Notes:
 * - `coinCollection()` currently returns raw Strapi collection rows:
 *     response.data.data[] → each item contains `.attributes`
 * - This provider should NOT be normalized until all downstream catalog
 *   consumers are migrated away from `.attributes`
 *
 * Future Improvements:
 * - Introduce a coin adapter layer to flatten collection records
 * - Move sessionStorage helpers into a shared utility
 * - Add loading/error state to the context provider
 */

import { createContext, useEffect, useState } from "react";
import coinCollections from "src/api/coin-collections";

export const CoinContext = createContext();

/**
 * Safely parse JSON from sessionStorage
 */
function safeParseSessionStorage(key, fallback = null) {
  try {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`Failed to parse sessionStorage key "${key}"`, error);
    return fallback;
  }
}

/**
 * Extract unique deep relation filter values from raw Strapi coin rows
 * - Preserves legacy `.attributes` collection shape
 * - Excludes undefined values and "Uncertain"
 */
function getDeepFilterOptions(arr, filter) {
  let options = [];

  arr?.forEach((coin) => {
    const value = coin?.attributes?.[filter]?.data?.attributes?.[filter];

    if (
      !options.includes(value) &&
      value !== undefined &&
      value !== "Uncertain"
    ) {
      options.push(value);
    }
  });

  return options;
}

export const CoinContextProvider = ({ children }) => {
  const [coinsData, setCoinsData] = useState(
    safeParseSessionStorage("coins", null)
  );

  const [coinsKeyTerms, setCoinKeyTerms] = useState(
    safeParseSessionStorage("coinskeyTerms", null)
  );

  /**
   * Fetch full coin collection data
   * - Intentionally consumes raw Strapi collection rows
   * - Derives reusable filter key terms from the same dataset
   */
  const fetchCoinData = async () => {
    const res = await coinCollections.coinCollection();
    const rows = res?.data?.data || [];

    setCoinsData(rows);

    const options = {
      material: getDeepFilterOptions(rows, "material"),
      mint: getDeepFilterOptions(rows, "mint"),
      issuing_authority: getDeepFilterOptions(rows, "issuing_authority"),
      governing_power: getDeepFilterOptions(rows, "governing_power"),
      language: getDeepFilterOptions(rows, "language"),
      ancient_territory: getDeepFilterOptions(rows, "ancient_territory"),
    };

    setCoinKeyTerms(options);
  };

  /**
   * Persist fetched coin data + derived key terms for the current session
   */
  useEffect(() => {
    sessionStorage.setItem("coins", JSON.stringify(coinsData));
    sessionStorage.setItem("coinskeyTerms", JSON.stringify(coinsKeyTerms));
  }, [coinsData, coinsKeyTerms]);

  return (
    <CoinContext.Provider value={{ coinsData, coinsKeyTerms, fetchCoinData }}>
      {children}
    </CoinContext.Provider>
  );
};