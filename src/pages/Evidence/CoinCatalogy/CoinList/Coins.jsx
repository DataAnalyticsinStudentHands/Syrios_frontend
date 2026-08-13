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

import React, { useState, useEffect, useContext } from 'react'
import "./Coins.scss"
import CoinPaginate from './CoinPaginate'
import { useParams } from "react-router-dom";
import Fuse from 'fuse.js'
import CoinsFiter from './CoinsFilters';
import Search from './Search';
import qs from 'qs';
import { CoinContext } from "src/context/coinContext";

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
  const { coinsData, fetchCoinData } = useContext(CoinContext);

  useEffect(() => {
    if (!coinsData) {
      fetchCoinData();
    }
  }, [coinsData]);

  const params = qs.parse(useParams().params);

  const [searchedData, setSearchedData] = useState([]);
  const [coinList, setCoinList] = useState([]);
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

  useEffect(() => {
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

    let results = searchText
      ? fuse.search(searchText).map(r => r.item)
      : coinsData;

    setSearchedData(results);

    setOptions({
      material: getDeepFilterOptions(results, 'material'),
      mint: getDeepFilterOptions(results, 'mint'),
      issuing_authority: getDeepFilterOptions(results, 'issuing_authority'),
      governing_power: getDeepFilterOptions(results, 'governing_power'),
      language: getDeepFilterOptions(results, 'language'),
      ancient_territory: getDeepFilterOptions(results, 'ancient_territory'),
    });

  }, [searchText, coinsData]);

  useEffect(() => {
    const filteredCoins = searchedData?.filter((coin) => {
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
    });

    setCoinList(filteredCoins || []);

  }, [searchedData, filters]);

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

      <CoinPaginate coinsPerPage={coinsPerPage} coins={coinList} />

    </div>
  );
};

export default Coins;