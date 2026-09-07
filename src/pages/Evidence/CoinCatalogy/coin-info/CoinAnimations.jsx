/**
 * CoinAnimations.jsx — Image Source & Rendering Fix (2026)
 *
 * Changes:
 * - Replaced incorrect env var:
 *   VITE_UPLOAD_URL → VITE_STRAPI_URL
 * - Added safe URL join helper
 * - Prevented invalid `src` values (NaN / undefined)
 * - Fixed alt text rendering ([object Object] bug)
 * - Added graceful fallback UI when images are missing
 *
 * Why:
 * - Coin detail page (/Coin/:id) failed to render images
 * - Incorrect base URL caused broken image paths
 *
 * Outcome:
 * - Coin detail page now renders obverse/reverse images correctly
 * - Eliminates React warning: "Received NaN for src"
 */

import React, { useState, useEffect } from "react";

const uploadBaseURL = import.meta.env.VITE_STRAPI_URL || "";

const joinUrl = (base, path) => {
  if (!path || typeof path !== "string") return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const cleanBase = base.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");
  return `${cleanBase}/${cleanPath}`;
};

const getAltText = (media, fallback) => {
  return (
    media?.data?.attributes?.alternativeText ||
    media?.data?.attributes?.caption ||
    fallback ||
    "coin image"
  );
};

function CoinScaleAndFlip(props) {
  const [coin_rotation, set_coin_rotation] = useState("rotateY(0deg)");
  const [dotted_circle_height, set_dotted_circle_height] = useState("0%");
  const [is_img_scaled, set_is_img_scaled] = useState(false);
  const [size_diameter_jsx, set_size_diameter_jsx] = useState("0");

  const obverseSrc = joinUrl(uploadBaseURL, props?.obverseImg?.data?.attributes?.url);
  const reverseSrc = joinUrl(uploadBaseURL, props?.reverseImg?.data?.attributes?.url);

  const ResetCoin = () => {
    set_coin_rotation("rotateY(0deg)");
    set_dotted_circle_height("0%");
    set_is_img_scaled(false);
  };

  useEffect(() => {
    ResetCoin();
  }, [props?.coinMetaData]);

  useEffect(() => {
    if (is_img_scaled) set_size_diameter_jsx("3em");
    else set_size_diameter_jsx("0");
  }, [is_img_scaled, props?.diameter]);

  const ScaleCoin = () => {
    if (is_img_scaled) {
      set_dotted_circle_height("0%");
    } else {
      set_dotted_circle_height("80%");

      const box_percent = 100;
      const box_height_mm = 62.5;
      let height_of_coin_percent = (box_percent / box_height_mm) * props?.diameter;

      if (height_of_coin_percent == null || height_of_coin_percent === 0) {
        height_of_coin_percent = 5;
      }
    }

    set_is_img_scaled(!is_img_scaled);
  };

  const RotateCoin = () => {
    if (coin_rotation.includes("(0deg)")) {
      set_coin_rotation("rotateY(180deg)");
    } else {
      set_coin_rotation("rotateY(0deg)");
    }
  };

  return (
    <div className="coin-image-box">
      <div
        className="coin-info-dotted-circle"
        style={{ height: dotted_circle_height }}
      />
      <div
        className="coin-info-image-diameter-box coin-info-dark-text"
        style={{ fontSize: size_diameter_jsx }}
      >
        DIAMETER: {props?.diameter == null ? "N/A" : `${props?.diameter}mm`}
      </div>

      <div className="flip-box">
        <div className="flip-box-inner" style={{ transform: coin_rotation }}>
          <div className="flip-box-front">
            {obverseSrc ? (
              <img
                alt={getAltText(props?.obverseImg, "obverse")}
                className="coin-info-image-flip coin-info-image-flip-front"
                src={obverseSrc}
              />
            ) : (
              <div className="coin-info-no-image coin-info-dark-text">No obverse image</div>
            )}
          </div>

          <div className="flip-box-back">
            {reverseSrc ? (
              <img
                alt={getAltText(props?.reverseImg, "reverse")}
                className="coin-info-image-flip coin-info-image-flip-back"
                src={reverseSrc}
              />
            ) : (
              <div className="coin-info-no-image coin-info-dark-text">No reverse image</div>
            )}
          </div>
        </div>
      </div>

      <div className="demo-icon coin-info-icon-rotate" onClick={RotateCoin}>
        &#xe833;
      </div>
      <div className="demo-icon coin-info-scale-icon" onClick={ScaleCoin}>
        &#xe834;
      </div>
    </div>
  );
}

export default CoinScaleAndFlip;