/**
 * Footer.jsx — Vite Migration Refactor (2026)
 *
 * Purpose:
 * Renders the footer and bottom drawer used for credits, image attributions,
 * and reading references.
 *
 * Refactor Summary:
 * 1. Renamed file from `.js` to `.jsx`
 *    - Required because this component returns JSX
 *
 * 2. Cleaned import path usage
 *    - Removed explicit `.js` extension from `Markup` import for Vite-safe resolution
 *
 * 3. Preserved behavior
 *    - Drawer behavior, toggle behavior, conditional rendering,
 *      reference formatting, and attribution links remain unchanged
 *
 * Notes:
 * - Uses `react-modern-drawer` and its stylesheet directly
 * - Uses `dangerouslySetInnerHTML` through `createMarkup`
 * - Assumes `references` and `imageReference` are arrays
 *
 * Future Improvements:
 * - Replace repeated conditional checks with a shared boolean
 * - Clean invalid `xs` props on non-Bootstrap layout elements
 * - Replace deprecated empty fragments with `null`
 * - Fix `overFlowY` typo to `overflowY` if scroll styling is needed
 */

import React from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import createMarkup from "src/utils/Markup";

const Footer = ({ references, imageReference, isBottomOpen, toggleBottom }) => {
  const hasReferences =
    (imageReference || references) &&
    (imageReference.length !== 0 || references.length !== 0);

  return (
    <>
      <div id="footer">
        <div
          id="footer-links"
          className="d-flex justify-content-center align-items-center mx-5"
        >
          <div xs={2} className="d-flex align-items-center justify-content-end mx-5">
            {hasReferences ? (
              <button
                className="footer-text reference-tag icon-entypo-arrow-thick-up"
                onClick={toggleBottom}
              >
                CREDITS & REFERENCES
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {hasReferences ? (
        <Drawer
          open={isBottomOpen}
          onClose={toggleBottom}
          direction="bottom"
          className="credits-and-references"
          size={"max-content"}
        >
          <button className="x-button reference-tag" onClick={toggleBottom}>
            &#xe839;
          </button>

          <div className="referenceContent" style={{ padding: "5% 10%" }}>
            <div className="col-4">
              <div className="references-h3 mb-3">Coin Images Courtesy of:</div>
              <div id="reference-content">
                {imageReference.map((ref, index) => {
                  return (
                    <div key={index} className="d-flex references-text my-5">
                      <a
                        href={ref.source_image}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {ref.right_holder}
                        <span className="icon-entypo-link-external" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="col-7">
              <div className="references-h3 mx-4 mb-3">
                To read more, check these out:
              </div>
              <div id="reference-content">
                {references.map((ref, index) => {
                  return (
                    <div
                      key={index}
                      className="d-flex references-text my-3"
                      style={{ overFlowY: "scroll" }}
                    >
                      <span xs={1} className="d-flex justify-content-end mx-5">
                        [{index + 1}]
                      </span>

                      {ref.split("http")[1] ? (
                        <div xs={11}>
                          <a
                            href={`http${ref.split("http")[1].split(".</div>")[0]}`}
                            dangerouslySetInnerHTML={createMarkup(ref.split("http")[0])}
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        </div>
                      ) : (
                        <div
                          xs={11}
                          dangerouslySetInnerHTML={createMarkup(ref.split("http")[0])}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Drawer>
      ) : null}
    </>
  );
};

export default Footer;