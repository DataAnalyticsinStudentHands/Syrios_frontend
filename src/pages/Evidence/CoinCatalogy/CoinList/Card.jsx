/**
 * Card.jsx — Image Handling Refactor (2026)
 *
 * Changes:
 * - Unified coin data access (`coin` vs `coin.attributes`)
 * - Added defensive media resolution:
 *   - supports thumbnail, small, and original formats
 *   - supports precomputed `obverse_thumb_src` (CoinSort compatibility)
 * - Added safe URL join to prevent malformed paths
 * - Fixed missing images in:
 *   - Spotlight cards
 *   - Coin list/grid views
 *
 * Why:
 * - Spotlight and List passed different data shapes into Card
 * - Original implementation assumed a single Strapi response format
 * - Resulted in missing images on main catalog page
 *
 * Outcome:
 * - Cards now render images reliably across all entry points
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
    joinUrl(uploadBaseURL, getMediaUrl(c?.obverse_image)) ||
    joinUrl(uploadBaseURL, getMediaUrl(c?.reverse_image)) ||
    c?.obverse_thumb_src ||
    ""
  );
};

const getCoinId = (coin, fallbackId) => {
  return coin?.id || coin?.attributes?.id || fallbackId;
};

const getCoinTitle = (coin) => {
  const c = getCoinData(coin);

  const mint = c?.mint?.data?.attributes?.mint || "";
  const material = c?.material?.data?.attributes?.material || "";
  const obverseType = c?.obverse_type || "";
  const reverseType = c?.reverse_type || "";
  const typeText = obverseType?.length === 0 ? reverseType : obverseType;

  return `${mint} ${material} ${typeText}`.trim();
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