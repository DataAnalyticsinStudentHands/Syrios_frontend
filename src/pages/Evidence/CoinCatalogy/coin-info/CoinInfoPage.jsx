/**
 * CoinInfoPage.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders the full coin detail page using the shared normalized API layer.
 *
 * Refactor Summary:
 * 1. Removed `useFetch`
 *    - Replaced custom raw fetch hook with `coinCollectionsRequest.fetchOne(id)`
 *    - Aligns this page with the shared Axios client architecture
 *
 * 2. Response Normalization Compatibility
 *    - Updated top-level coin access from:
 *        coin.data.attributes
 *      → to:
 *        coin
 *    - Works with normalized single-entity responses from `coin-collections.js`
 *
 * 3. Preserved Nested Relation Access
 *    - Related entities and media remain relation-shaped
 *    - Nested access still uses `.data.attributes`
 *
 * 4. Improved Safety
 *    - Added helpers for relation text, plain text, and year formatting
 *    - Prevents repeated null/length checks
 *    - Fixes `souce_image` typo by reading `source_image`
 *
 * 5. Preserved Existing Behavior
 *    - Layout, section structure, coin animation usage, and back navigation remain unchanged
 *
 * Notes:
 * - This component now depends on `coinCollectionsRequest.fetchOne(id)`
 * - Loading state is explicit
 * - Error state falls back to a simple "Coin not found" view
 *
 * Future Improvements:
 * - Normalize nested relations/media
 * - Replace repeated detail rows with a mapped config array
 * - Add richer error UI state
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import LoadingPage from 'src/components/loadingPage/LoadingPage';
import "./CoinInfoPage.scss";
import CoinScaleAndFlip from './CoinAnimations';
import coinCollectionsRequest from 'src/api/coin-collections';

function getRelationValue(relation, key) {
  return relation?.data?.attributes?.[key] ?? "None";
}

function getTextValue(value) {
  return value == null || value.length === 0 ? "None" : value;
}

function formatYear(year) {
  if (year == null) return "None";
  return year < 0 ? `${String(year).substring(1)} BCE` : `${year} CE`;
}

function CoinInfoPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [coin, setCoin] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const result = await coinCollectionsRequest.fetchOne(id);

        if (!mounted) return;

        setCoin(result?.data?.data || null);
      } catch (error) {
        console.error("Failed to load coin detail:", error);
        if (mounted) setCoin(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (isLoading) return <LoadingPage />;

  if (!coin) {
    return (
      <div id='CoinInfoPage'>
        <div className='section1'>
          <div className='title'>Coin not found</div>
          <div className='BackButton' onClick={() => navigate(-1)}>
            Back to the Catalog
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id='CoinInfoPage'>
      <div className='section1'>
        <div className='title'>
          {getRelationValue(coin.issuing_authority, "issuing_authority")}{" "}
          {getRelationValue(coin.mint, "mint")}{" "}
          {getRelationValue(coin.material, "material")}
        </div>

        <div className='year'>
          {formatYear(coin.from_year)} - {formatYear(coin.to_year)}
        </div>

        <div className='basic-info'>
          <div className='item'>
            <h1>OBVERSE TYPE:</h1>
            <h2>{getTextValue(coin.obverse_type)}</h2>
          </div>

          <div className='item'>
            <h1>OBVERSE LEGEND:</h1>
            <h2>{getTextValue(coin.obverse_legend)}</h2>
          </div>

          <div className='item'>
            <h1>REVERSE TYPE:</h1>
            <h2>{getTextValue(coin.reverse_type)}</h2>
          </div>

          <div className='item'>
            <h1>REVERSE LEGEND:</h1>
            <h2>{getTextValue(coin.reverse_legend)}</h2>
          </div>
        </div>
      </div>

      <hr />

      <div className='section2'>
        <div className='left'>
          <CoinScaleAndFlip
            obverseImg={coin?.obverse_image}
            reverseImg={coin?.reverse_image}
            diameter={coin?.diameter}
          />
        </div>

        <div className='right'>
          <div className='item'>
            <h1>Ancient Territory:</h1>
            <p>{getRelationValue(coin.ancient_territory, "ancient_territory")}</p>
          </div>

          <div className='item'>
            <h1>Modern Country:</h1>
            <p>{getRelationValue(coin?.mint?.data?.attributes?.modern_country, "modern_country")}</p>
          </div>

          <div className='item'>
            <h1>Mint:</h1>
            <p>{getRelationValue(coin.mint, "mint")}</p>
          </div>

          <div className='item'>
            <h1>Modern Name:</h1>
            <p>{getRelationValue(coin?.mint?.data?.attributes?.modern_name, "modern_name")}</p>
          </div>

          <div className='item'>
            <h1>Governing Power:</h1>
            <p>{getRelationValue(coin.governing_power, "governing_power")}</p>
          </div>

          <div className='item'>
            <h1>Issuing Authority:</h1>
            <p>{getRelationValue(coin.issuing_authority, "issuing_authority")}</p>
          </div>

          <div className='item'>
            <h1>Material:</h1>
            <p>{getRelationValue(coin.material, "material")}</p>
          </div>

          <div className='item'>
            <h1>Denomination:</h1>
            <p>{getRelationValue(coin.denomination, "denomination")}</p>
          </div>

          <div className='item'>
            <h1>Language:</h1>
            <p>{getRelationValue(coin.language, "language")}</p>
          </div>
        </div>
      </div>

      <div className='section2-bottom'>
        <div className='item'>
          Source Image: {getTextValue(coin.source_image)}
        </div>

        <div className='item'>
          Rights holder: {getTextValue(coin.right_holder)}
        </div>

        <div className='item'>
          Bibliography: {getTextValue(coin.reference)}
        </div>

        <div className='BackButton' onClick={() => navigate(-1)}>
          Back to the Catalog
        </div>
      </div>

      <div className='section3'></div>
      <div className='section4'></div>
    </div>
  );
}

export default CoinInfoPage;