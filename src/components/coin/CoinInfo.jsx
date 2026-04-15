/**
 * CoinInfo.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders the coin detail popup, including:
 * - metadata display
 * - image flip interaction
 * - image scaling interaction
 * - helper formatting functions used by coin detail views
 *
 * Refactor Summary:
 * 1. Preserved Existing Behavior
 *    - Popup behavior, image flip behavior, scale toggle behavior,
 *      metadata rendering, and reference rendering remain functionally the same
 *
 * 2. Improved Data Shape Tolerance
 *    - Added light compatibility handling for values that may arrive either as:
 *        • legacy Strapi relation objects
 *        • flattened strings from future normalization work
 *
 * 3. Preserved Existing Media Assumptions
 *    - Image fields still use the current nested media shape:
 *        obverse_file.data.attributes.url
 *        reverse_file.data.attributes.url
 *
 * Notes:
 * - This component does not fetch API data directly
 * - It depends on the shape of `coinMetaData` provided by parent components
 * - Full normalization migration should happen upstream before changing this component further
 *
 * Environment Variables Required:
 * - VITE_STRAPI_URL
 *
 * Future Improvements:
 * - Add a full coin adapter layer so view components no longer care about Strapi shape
 * - Normalize nested media access
 * - Convert repeated metadata rows into a mapped config for easier maintenance
 */

import React, { useEffect, useState } from "react";
import WhitePopUp from "src/utils/WhitePopUp";

const baseURL = import.meta.env.VITE_STRAPI_URL;

export function StringifyTypeCategory(type_category) {
  if (!type_category || type_category.length === 0) return;

  let stringified_list = `${type_category[0].type_category}`;
  for (let i = 1; i < type_category.length; i++) {
    stringified_list += `, ${type_category[i].type_category}`;
  }

  return stringified_list;
}

export function CoinIdIntoTitle(coin_id) {
  function ConvertToRoman(num) {
    const roman = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1,
    };

    let str = "";

    for (const i of Object.keys(roman)) {
      const q = Math.floor(num / roman[i]);
      num -= q * roman[i];
      str += i.repeat(q);
    }

    return str;
  }

  const coin_title = Object.assign([], coin_id);
  let coin_title_length = coin_title.length;

  if (coin_title_length === 0) return coin_id;

  coin_title[0] = coin_title[0].toUpperCase();

  for (let i = 0; i < coin_title_length; i++) {
    if (coin_title[i] === "(") break;

    if (coin_title[i] === "_") {
      coin_title[i] = " ";
      if (i < coin_title_length - 1) {
        coin_title[i + 1] = coin_title[i + 1].toUpperCase();
      }
    } else if (!isNaN(coin_title[i])) {
      let num_of_digits = 1;
      const num_str = [coin_title[i]];

      for (let j = i + 1; j < coin_title_length && !isNaN(coin_title[j]); j++) {
        num_of_digits++;
        num_str.push(coin_title[j]);
      }

      const roman_numeral = ConvertToRoman(parseInt(num_str.join(""), 10));
      coin_title.splice(i, 1, roman_numeral);
      coin_title.splice(i, 0, " ");

      coin_title_length = coin_title.length;
      i += num_of_digits;
    }
  }

  return coin_title.join("");
}

export function IfEmptyReturnNotApplicable(str) {
  return str?.length === 0 ? "N/A" : str;
}

export function IfEmptyReturnNone(str) {
  return str?.length === 0 ? "N/A" : str;
}

export function IfUrlHrefElseString(str) {
  function isUrl(string) {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

  if (isUrl(str)) {
    return (
      <a className="coin-info-url" href={str}>
        {str}
      </a>
    );
  }

  return IfEmptyReturnNotApplicable(str);
}

export function CoinAlt(coin) {
  return coin.alternativeText == null || coin.alternativeText.length === 0
    ? "coin_image"
    : coin.alternativeText;
}

/**
 * Helper:
 * Allows metadata fields to work whether they arrive as:
 * - a plain string
 * - a legacy Strapi relation object
 */
function getRelationDisplayValue(value, nestedKey) {
  if (value == null) return "N/A";
  if (typeof value === "string") return value;

  return value?.data?.attributes?.[nestedKey] ?? "N/A";
}

function CoinScaleAndFlip(props) {
  const { coinMetaData } = props;

  const [coin_rotation, set_coin_rotation] = useState("rotateY(0deg)");
  const [dotted_circle_height, set_dotted_circle_height] = useState("0%");
  const [is_img_scaled, set_is_img_scaled] = useState(false);
  const [size_diameter_jsx, set_size_diameter_jsx] = useState("0");

  const ResetCoin = () => {
    set_coin_rotation("rotateY(0deg)");
    set_dotted_circle_height("0%");
    set_is_img_scaled(false);
  };

  useEffect(() => {
    ResetCoin();
  }, [coinMetaData]);

  useEffect(() => {
    if (is_img_scaled) {
      set_size_diameter_jsx("1em");
    } else {
      set_size_diameter_jsx("0");
    }
  }, [is_img_scaled, coinMetaData.diameter]);

  const ScaleCoin = () => {
    if (is_img_scaled) {
      set_dotted_circle_height("0%");
    } else {
      set_dotted_circle_height("80%");

      const box_percent = 100;
      const box_height_mm = 62.5;
      let height_of_coin_percent = (box_percent / box_height_mm) * coinMetaData.diameter;

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

  if (coinMetaData.obverse_file.data == null || coinMetaData.reverse_file.data == null) {
    return (
      <div className="coin-image-box">
        <div className="coin-info-no-image coin-info-dark-text">No image</div>
      </div>
    );
  }

  return (
    <div className="coin-image-box">
      <div className="coin-info-dotted-circle" style={{ height: dotted_circle_height }} />
      <div
        className="coin-info-image-diameter-box coin-info-dark-text"
        style={{ fontSize: size_diameter_jsx }}
      >
        DIAMETER: {coinMetaData.diameter == null ? "N/A" : `${coinMetaData.diameter}mm`}
      </div>

      <div className="flip-box">
        <div className="flip-box-inner" style={{ transform: coin_rotation }}>
          <div className="flip-box-front">
            <img
              alt={CoinAlt(coinMetaData.obverse_file.data.attributes)}
              className="coin-info-image-flip coin-info-image-flip-front"
              src={`${baseURL}${coinMetaData.obverse_file.data.attributes.url}`}
            />
          </div>

          <div className="flip-box-back">
            <img
              alt={CoinAlt(coinMetaData.obverse_file.data.attributes)}
              className="coin-info-image-flip coin-info-image-flip-back"
              src={`${baseURL}${coinMetaData.reverse_file.data.attributes.url}`}
            />
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

const CoinInfo = (props) => {
  const { coinMetaData, onClose, show } = props;

  const coinTitle = CoinIdIntoTitle(coinMetaData.coin_id);

  const CloseHandler = () => {
    onClose(false);
  };

  return (
    <WhitePopUp show={show} onClose={CloseHandler}>
      <div className="coin-info">
        <div className="coin-info-title text-center mb-5">
          {coinMetaData.issuing_authority} {coinMetaData.mint} {coinMetaData.material}
        </div>

        <div className="coin-info-subtitle text-center my-3 mb-5">{coinMetaData.date_range}</div>

        <div className="coin-info-basic mb-3">
          <div className="coin-info-basic-left">
            <div className="coin-info-basic-text text-center mb-3">OBVERSE TYPE:</div>
            <div className="coin-info-basic-content text-center mb-5">
              {IfEmptyReturnNone(coinMetaData.obverse_type)}
            </div>

            <div className="coin-info-basic-text text-center mb-3">OBVERSE LEGEND:</div>
            <div className="coin-info-basic-content text-center mb-5">
              {IfEmptyReturnNone(coinMetaData.obverse_legend)}
            </div>
          </div>

          <div className="coin-info-basic-right">
            <div className="coin-info-basic-text text-center mb-3">REVERSE TYPE:</div>
            <div className="coin-info-basic-content text-center mb-5">
              {IfEmptyReturnNone(coinMetaData.reverse_type)}
            </div>

            <div className="coin-info-basic-text text-center mb-3">REVERSE LEGEND:</div>
            <div className="coin-info-basic-content text-center mb-5">
              {IfEmptyReturnNone(coinMetaData.reverse_legend)}
            </div>
          </div>
        </div>

        <hr />

        <div className="coin-info-detail my-5">
          <div className="coin-info-detail-left">
            <div className="coin-info-image">
              <CoinScaleAndFlip coinMetaData={coinMetaData} />
            </div>
          </div>

          <div className="coin-info-detail-right">
            <div className="coin-info-detail-text text-left mb-5">
              ANCIENT TERRITORY:
              <span style={{ marginLeft: "0.5em" }} className="coin-info-detail-content">
                {IfEmptyReturnNone(coinMetaData.ancient_territory)}
              </span>
            </div>

            <div className="coin-info-detail-text text-left mb-5">
              MODERN COUNTRY:
              <span style={{ marginLeft: "0.5em" }} className="coin-info-detail-content">
                {IfEmptyReturnNone(coinMetaData.modern_country)}
              </span>
            </div>

            <div className="coin-info-detail-text text-left mb-5">
              MINT:
              <span style={{ marginLeft: "0.5em" }} className="coin-info-detail-content">
                {IfEmptyReturnNone(coinMetaData.mint)}
              </span>
            </div>

            <div className="coin-info-detail-text text-left mb-5">
              MODERN NAME:
              <span style={{ marginLeft: "0.5em" }} className="coin-info-detail-content">
                {IfEmptyReturnNone(coinMetaData.mint_modern_name)}
              </span>
            </div>

            <div className="coin-info-detail-text text-left mb-5">
              GOVERNING POWER:
              <span style={{ marginLeft: "0.5em" }} className="coin-info-detail-content">
                {getRelationDisplayValue(coinMetaData.governing_power, "governing_power")}
              </span>
            </div>

            <div className="coin-info-detail-text text-left mb-5">
              ISSUING AUTHORITY:
              <span style={{ marginLeft: "0.5em" }} className="coin-info-detail-content">
                {IfEmptyReturnNone(coinMetaData.issuing_authority)}
              </span>
            </div>

            <div className="coin-info-detail-text text-left mb-5">
              LANGUAGE:
              <span style={{ marginLeft: "0.5em" }} className="coin-info-detail-content">
                {IfEmptyReturnNone(coinMetaData.language)}
              </span>
            </div>

            <div className="coin-info-detail-text text-left mb-5">
              MATERIAL:
              <span style={{ marginLeft: "0.5em" }} className="coin-info-detail-content">
                {IfEmptyReturnNone(coinMetaData.material)}
              </span>
            </div>

            <div className="coin-info-detail-text text-left mb-5">
              DENOMINATION:
              <span style={{ marginLeft: "0.5em" }} className="coin-info-detail-content">
                {IfEmptyReturnNone(coinMetaData.denomination)}
              </span>
            </div>
          </div>
        </div>

        <div className="coin-info-reference">
          <div className="coin-info-reference-text text-center">
            SOURCE IMAGE:
            <span style={{ marginLeft: "0.25em" }} className="coin-info-reference-content">
              {coinMetaData.source_image ? (
                <a href={coinMetaData.source_image} target="_blank" rel="noopener noreferrer">
                  {coinMetaData.source_image}
                </a>
              ) : null}
            </span>
          </div>

          <div className="coin-info-reference-text text-center">
            RIGHTS HOLDER:
            <span style={{ marginLeft: "0.25em" }} className="coin-info-reference-content">
              {IfUrlHrefElseString(coinMetaData.right_holder) ?? "N/A"}
            </span>
          </div>

          {coinMetaData.coin_id.split("(")[1]?.split(")")[0] ? (
            <div className="coin-info-reference-text text-center">
              REFERENCE:
              <span style={{ marginLeft: "0.25em" }} className="coin-info-reference-content">
                {coinMetaData.coin_id.split("(")[1]?.split(")")[0]}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </WhitePopUp>
  );
};

export default CoinInfo;