/**
 * Coins.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Main catalog page for browsing, searching, and filtering coins.
 *
 * Refactor Summary:
 * 1. Fixed fetch lifecycle
 *    - Moves `fetchCoinData()` into useEffect
 *
 * 2. Improved safety
 *    - Guards array operations
 *    - Adds helper for deep relation access
 *
 * 3. Preserved Raw Data Shape
 *    - Continues using `coin.attributes.*`
 *    - Required for compatibility with CoinContext + filtering system
 *
 * Notes:
 * - This component is NOT ready for normalization yet
 * - Depends heavily on raw Strapi collection shape
 *
 * Future Improvements:
 * - Introduce coin adapter layer
 * - Normalize Fuse search structure
 */

import React, { useState, useEffect, useContext, useMemo } from 'react'
import "./Coins.scss"
import CoinPaginate from './CoinPaginate'
import { useParams } from "react-router-dom";
import Fuse from 'fuse.js'
import CoinsFiter from './CoinsFilters';
import Search from './Search';
import qs from 'qs';
import { CoinContext } from "src/context/coinContext";
import LoadingPage from 'src/components/loadingPage/LoadingPage';

/**
 * Helper for safe deep relation access
 */
const getRel = (coin, key) =>
  coin?.attributes?.[key]?.data?.attributes?.[key];

function getDeepFilterOptions(arr, filter) {
  let options = [];

  arr?.forEach((coin) => {
    const value = getRel(coin, filter);

    if (!options.includes(value) && value !== undefined) {
      options.push(value);
    }
  });

  return options;
}

const Coins = () => {
  const { coinsData, fetchCoinData, coinsStatus } = useContext(CoinContext);

  useEffect(() => {
    if (!coinsData && coinsStatus === 'idle') {
      fetchCoinData().catch(() => {});
    }
  }, [coinsData, coinsStatus, fetchCoinData]);

  const params = qs.parse(useParams().params);

  const [coinsPerPage, setCoinsPerPage] = useState(12);

  const [options, setOptions] = useState({});

  const [filters, setFilters] = useState({
    material: [],
    mint: [],
    issuing_authority: [],
    governing_power: [],
    language: [],
    ancient_territory: [],
    from_year: -450,
    to_year: 450,
    ...params.tags
  });

  const [searchText, setSearchText] = useState(params.pattern || "");
  const coinsPerPages = [12, 24, 48, 96];

  const searchedData = useMemo(() => {
    const fuseOptions = {
      includeScore: true,
      threshold: 0.25,
      keys: [
        "attributes.obverse_type",
        "attributes.reverse_type",
        "attributes.reference",
        "attributes.reverse_legend",
        "attributes.obverse_legend",
        "attributes.material.data.attributes.material",
        "attributes.mint.data.attributes.mint",
        "attributes.issuing_authority.data.attributes.issuing_authority",
        "attributes.governing_power.data.attributes.governing_power",
        "attributes.language.data.attributes.language",
        "attributes.ancient_territory.data.attributes.ancient_territory",
      ]
    };

    const fuse = new Fuse(coinsData || [], fuseOptions);

    return searchText
      ? fuse.search(searchText).map(r => r.item)
      : coinsData || [];
  }, [searchText, coinsData]);

  useEffect(() => {
    setOptions({
      material: getDeepFilterOptions(searchedData, 'material'),
      mint: getDeepFilterOptions(searchedData, 'mint'),
      issuing_authority: getDeepFilterOptions(searchedData, 'issuing_authority'),
      governing_power: getDeepFilterOptions(searchedData, 'governing_power'),
      language: getDeepFilterOptions(searchedData, 'language'),
      ancient_territory: getDeepFilterOptions(searchedData, 'ancient_territory'),
    });
  }, [searchedData]);

  // Derive results synchronously so newly loaded/cached data never flashes a
  // misleading zero count while a second effect catches up with the collection.
  const coinList = useMemo(() => (
    searchedData.filter((coin) => {
      return (
        (filters.material.length === 0 || filters.material.includes(getRel(coin, "material"))) &&
        (filters.mint.length === 0 || filters.mint.includes(getRel(coin, "mint"))) &&
        (filters.issuing_authority.length === 0 || filters.issuing_authority.includes(getRel(coin, "issuing_authority"))) &&
        (filters.governing_power.length === 0 || filters.governing_power.includes(getRel(coin, "governing_power"))) &&
        (filters.language.length === 0 || filters.language.includes(getRel(coin, "language"))) &&
        (filters.ancient_territory.length === 0 || filters.ancient_territory.includes(getRel(coin, "ancient_territory"))) &&
        (filters.from_year <= coin?.attributes?.from_year) &&
        (filters.to_year >= coin?.attributes?.to_year)
      );
    })
  ), [searchedData, filters]);

  if (!coinsData && coinsStatus === 'error') {
    return (
      <div className='Coins' role='alert'>
        <h2>We could not load the coin catalog.</h2>
        <p>Please try again to browse and filter the collection.</p>
        <button type='button' onClick={() => fetchCoinData().catch(() => {})}>Try again</button>
      </div>
    );
  }

  if (!coinsData) {
    return <LoadingPage variant='coin-results' compact title='Gathering the coin catalog' />;
  }

  return (
    <div className='Coins'>

      <Search coinsLength={coinList.length} searchText={searchText} setSearchText={setSearchText} />

      <CoinsFiter
        filters={filters}
        options={options}
        setFilters={setFilters}
        setOptions={setOptions}
      />

      <div className='results'>
        <label className='results-per-page'>
          <span>Results per page</span>
          <select
            value={coinsPerPage}
            onChange={(event) => setCoinsPerPage(Number(event.target.value))}
          >
            {coinsPerPages.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      {coinList.length > 0 ? (
        <CoinPaginate coinsPerPage={coinsPerPage} coins={coinList} />
      ) : (
        <p role='status'>
          {coinsData.length === 0 ? 'The coin catalog is currently empty.' : 'No coins match these filters.'}
        </p>
      )}

    </div>
  );
};

export default Coins;
