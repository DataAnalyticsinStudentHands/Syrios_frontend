/**
 * Card.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders reusable coin card views for list/grid and spotlight contexts.
 *
 * Refactor Summary:
 * 1. Hybrid Data Shape Compatibility
 *    - Supports both:
 *        • raw Strapi collection rows (`coin.attributes`)
 *        • normalized coin objects (`coin`)
 *
 * 2. Safer Media Resolution
 *    - Supports:
 *        • precomputed `obverse_thumb_src`
 *        • thumbnail format
 *        • small format
 *        • original uploaded media URL
 *    - Uses safe URL joining to avoid malformed paths
 *
 * 3. Preserved Existing Behavior
 *    - Card and spotlight layouts remain unchanged
 *    - Link behavior and metadata rendering remain unchanged
 *
 * Notes:
 * - This component acts as a compatibility layer during staged normalization
 * - Nested relations/media are still relation-shaped and accessed via `.data.attributes`
 *
 * Future Improvements:
 * - Normalize nested relation/media data
 * - Move shared coin display helpers into a reusable utility module
 * - Add explicit fallback artwork for missing images
 */

import React from "react";
import "./Card.scss";
import { Link } from "react-router-dom";

const uploadBaseURL = import.meta.env.VITE_STRAPI_URL || "";

const joinUrl = (base, path) => {
  if (!path || typeof path !== "string") return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const cleanBase = base.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");
  return `${cleanBase}/${cleanPath}`;
};

/**
 * Supports both raw collection rows and normalized coin objects
 */
const getCoinData = (coin) => coin?.attributes || coin || {};

const getMediaUrl = (media) => {
  return (
    media?.data?.attributes?.formats?.thumbnail?.url ||
    media?.data?.attributes?.formats?.small?.url ||
    media?.data?.attributes?.url ||
    ""
  );
};

const getCoinImageUrl = (coin) => {
  const c = getCoinData(coin);

  return (
    c?.obverse_thumb_src ||
    joinUrl(uploadBaseURL, getMediaUrl(c?.obverse_image)) ||
    joinUrl(uploadBaseURL, getMediaUrl(c?.reverse_image)) ||
    ""
  );
};

const getCoinId = (coin, fallbackId) => {
  return coin?.id || fallbackId;
};

const getCoinTitle = (coin) => {
  const c = getCoinData(coin);

  const mint = c?.mint?.data?.attributes?.mint || "";
  const material = c?.material?.data?.attributes?.material || "";
  const obverseType = c?.obverse_type || "";
  const reverseType = c?.reverse_type || "";
  const typeText = obverseType?.length === 0 ? reverseType : obverseType;

  return `${mint} ${material} ${typeText}`.trim() || "Coin";
};

const getAncientTerritory = (coin) => {
  const c = getCoinData(coin);
  const territory = c?.ancient_territory?.data?.attributes?.ancient_territory || "";
  return territory?.length === 0 ? "None" : territory || "None";
};

const getFromYear = (coin) => {
  const c = getCoinData(coin);
  return c?.from_year ?? null;
};

const getToYear = (coin) => {
  const c = getCoinData(coin);
  return c?.to_year ?? null;
};

const renderYear = (year) => {
  if (year === null || year === undefined || year === "") return "Unknown";
  return year < 0 ? `${String(year).substring(1)} BCE` : `${year} CE`;
};

const CoinMeta = ({ coin }) => (
  <>
    <h1>{getCoinTitle(coin)}</h1>
    <h2>Origin: {getAncientTerritory(coin)}</h2>
    <h2>
      Date: {renderYear(getFromYear(coin))} - {renderYear(getToYear(coin))}
    </h2>
  </>
);

export const Card = (props) => {
  const coin = props?.coin;
  const imageSrc = getCoinImageUrl(coin);
  const coinId = getCoinId(coin, props?.id);

  return (
    <div className="coin-card">
      <Link className="link" to={`/Coin/${coinId}`}>
        <div className="image">
          {imageSrc ? <img src={imageSrc} alt={getCoinTitle(coin)} /> : null}
        </div>
        <CoinMeta coin={coin} />
      </Link>
    </div>
  );
};

export const SpotlightCard = (props) => {
  const coin = props?.coin;
  const imageSrc = getCoinImageUrl(coin);
  const coinId = getCoinId(coin, props?.id);

  return (
    <div className="sportlight-card">
      <Link className="link" to={`/Coin/${coinId}`}>
        <div className="image">
          {imageSrc ? <img src={imageSrc} alt={getCoinTitle(coin)} /> : null}
        </div>
        <CoinMeta coin={coin} />
      </Link>
    </div>
  );
};