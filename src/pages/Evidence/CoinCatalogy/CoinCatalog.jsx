/**
 * CoinCatalog.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders the main coin catalog page using content from `coin-collections.js`.
 *
 * Refactor Summary:
 * 1. Response Normalization Compatibility
 *    - Updated coin collection page access from:
 *        response.data.data.attributes
 *      → to:
 *        response.data.data
 *    - Aligns with normalized `coinCollectionPage()` response shape
 *
 * 2. Preserved Media Rendering Safety
 *    - Retains `joinUrl()` helper for reliable Strapi relative media URL handling
 *
 * 3. Preserved UI + Behavior
 *    - Layout, spotlight rendering, contents navigation, Coin of the Day,
 *      and video behavior unchanged
 *
 * Data Shape (Post-Normalization):
 * - `coinCollectionPage()` now returns:
 *     response.data.data → flattened page entity
 * - Nested relations/media still remain nested and are accessed via:
 *     relation.data.attributes...
 *
 * Notes:
 * - `contents`, `spotlight`, and `coin_of_the_day` remain relation-shaped
 * - Coin of the Day nested media still uses `.data.attributes.url`
 *
 * Future Improvements:
 * - Normalize nested media / relation objects
 * - Normalize spotlight relation payloads
 * - Extract catalog fetch into reusable CMS hook
 */

import React, { useState, useEffect } from "react";
import NoFeedBackicon from "src/components/constant/NoFeedBackIcon";
import SearchBar from "./component/SearchBar";
import SpotLight from "./component/SpotLight";
import ReactPlayer from "react-player";
import coinCollections from "src/api/coin-collections";
import LoadingPage from "src/components/loadingPage/LoadingPage";
import { Link } from "react-router-dom";
import ans_logo from "./res/ans_large.png";
import berlin_logo from "./res/berlin_logo.svg";
import french_logo from "./res/french_logo.svg";
import rpc_logo from "./res/rpc_logo.png";

const uploadBaseURL = import.meta.env.VITE_STRAPI_URL || "";

const joinUrl = (base, path) => {
  if (!path || typeof path !== "string") return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const cleanBase = base.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");
  return `${cleanBase}/${cleanPath}`;
};

const CoinCatalog = () => {
  const [data, setData] = useState({
    title: "",
    subtitle: "",
    contents: [],
    spotlight: null,
    coin_of_the_day: null,
    video_url: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await coinCollections.coinCollectionPage();

        // Updated for normalized response
        setData(response?.data?.data || {});
      } catch (error) {
        console.error("Failed to load coin catalog:", error);
        setData({
          title: "",
          subtitle: "",
          contents: [],
          spotlight: null,
          coin_of_the_day: null,
          video_url: "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const contents = data?.contents || [];
  const spotlightData = data?.spotlight?.data || null;
  const coinOfDay = data?.coin_of_the_day?.data || null;
  const coinOfDayImageUrl =
    coinOfDay?.attributes?.image?.data?.attributes?.url || "";
  const coinOfDayCaption =
    coinOfDay?.attributes?.image_caption ||
    coinOfDay?.attributes?.image?.data?.attributes?.caption ||
    "";

  return (
    <>
      <NoFeedBackicon url="default" />
      {loading ? (
        <LoadingPage />
      ) : (
        <div id="coin-catalog">
          <div className="catalog-section">
            <h1>{data?.title}</h1>
            <h3>{data?.subtitle}</h3>
          </div>

          <div className="catalog-section">
            <SearchBar />

            <div className="catalog-buttons">
              {contents.map((content, index) => {
                if (index === 0) return null;
                return (
                  <a href={`#anchor-${index}`} key={index}>
                    {content?.anchor ?? content?.title}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="catalog-section">
            <h2>{contents[0]?.title || ""}</h2>
            {spotlightData && <SpotLight data={spotlightData} />}
          </div>

          <div className="catalog-section">
            <span className="anchor" id="anchor-1"></span>
            <h2>{contents[1]?.title || ""}</h2>
            <p>{contents[1]?.body || ""}</p>

            {coinOfDay && (
              <div className="coins-of-the-day">
                <div className="left">
                  <h1>{coinOfDay?.attributes?.name || ""}</h1>
                  <h2>{coinOfDayCaption}</h2>
                  <p>{coinOfDay?.attributes?.abstract || ""}</p>
                  <button>
                    <Link to={`/StoryReader?id=${coinOfDay.id}`}>
                      Learn more
                    </Link>
                  </button>
                </div>
                <div className="right">
                  {coinOfDayImageUrl && (
                    <img
                      src={joinUrl(uploadBaseURL, coinOfDayImageUrl)}
                      alt={coinOfDay?.attributes?.name || "coin_of_the_day"}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="catalog-section">
            <span className="anchor" id="anchor-2"></span>
            <h2>{contents[2]?.title || ""}</h2>
            <p>{contents[2]?.body || ""}</p>
          </div>

          <div className="catalog-section">
            <span className="anchor" id="anchor-3"></span>
            <h2>{contents[3]?.title || ""}</h2>
            <p>{contents[3]?.body || ""}</p>
          </div>

          <div className="catalog-section">
            <span className="anchor" id="anchor-4"></span>
            <h2>{contents[4]?.title || ""}</h2>

            <div className="logos">
              <a
                href="https://numismatics.org/search/"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  src={ans_logo}
                  alt="ans_logo"
                  style={{ width: "100px" }}
                />
              </a>

              <a
                href="https://www.smb.museum/museen-einrichtungen/muenzkabinett/home/"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  src={berlin_logo}
                  alt="berlin_logo"
                  style={{ width: "300px", paddingTop: "20px" }}
                />
              </a>

              <a
                href="https://www.bnf.fr/fr/departement-monnaies-medailles-antiques"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  src={french_logo}
                  alt="french_logo"
                  style={{ width: "100px", paddingBottom: "20px" }}
                />
              </a>

              <a
                href="https://rpc.ashmus.ox.ac.uk/"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  src={rpc_logo}
                  alt="rpc_logo"
                  style={{ width: "200px" }}
                />
              </a>
            </div>

            <p>{contents[4]?.body || ""}</p>

            <div className="catalog-VideoBox">
              {data?.video_url && (
                <ReactPlayer
                  url={data.video_url}
                  width="100%"
                  height="100%"
                  controls={true}
                  playing={false}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CoinCatalog;