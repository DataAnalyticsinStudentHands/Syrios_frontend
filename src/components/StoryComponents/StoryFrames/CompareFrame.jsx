/**
 * CompareFrame.jsx — Vite Migration Refactor (2026)
 *
 * Purpose:
 * Renders the story compare-slider frame for coin obverse/reverse comparison,
 * along with optional story text, heading content, background image,
 * and "back to top" navigation.
 *
 * Refactor Summary:
 * 1. Renamed file from `.js` to `.jsx`
 *    - Required because this file contains JSX and Vite does not allow JSX in `.js`
 *
 * 2. Migrated environment variables
 *    - Replaced `process.env.REACT_APP_strapiURL` with `import.meta.env.VITE_STRAPI_URL`
 *
 * 3. Preserved existing behavior
 *    - Compare slider behavior remains unchanged
 *    - Layout branching for head/text/image positioning remains unchanged
 *    - Background image rendering remains unchanged
 *    - "Back to top" button behavior remains unchanged
 *
 * Notes:
 * - Uses react-bootstrap layout
 * - Uses react-compare-slider
 * - Uses createMarkup for caption HTML rendering
 * - Assumes Strapi media paths are relative to the configured base URL
 *
 * Environment Variables Required:
 * - VITE_STRAPI_URL
 *
 * Future Improvements:
 * - Extract repeated CompareCoin usage into smaller layout helpers
 * - Add stronger null guards for nested Strapi media data
 * - Reduce duplicated JSX branches in CompareFrame
 */

import { Container, Row, Col } from "react-bootstrap";
import { HeadComponent, TextComponent } from "../ComponentFunction/index";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import createMarkup from "src/utils/Markup";

const baseURL = import.meta.env.VITE_STRAPI_URL;

const CompareCoin = (props) => {
  const coin_obverse_url =
    props.coin.coin.data.attributes.obverse_file.data.attributes.url;
  const coin_obverse_alt =
    props.coin.coin.data.attributes.obverse_file.data.attributes.alternativeText;

  const coin_reverse_url =
    props.coin.coin.data.attributes.reverse_file.data.attributes.url;
  const coin_reverse_alt =
    props.coin.coin.data.attributes.reverse_file.data.attributes.alternativeText;

  return (
    <Col>
      <Row className="justify-content-center align-items-center">
        <ReactCompareSlider
          {...props}
          itemOne={
            <ReactCompareSliderImage
              src={`${baseURL}${coin_obverse_url}`}
              alt={coin_obverse_alt}
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src={`${baseURL}${coin_reverse_url}`}
              alt={coin_reverse_alt}
            />
          }
          style={{
            display: "flex",
            width: "25vmax",
          }}
        />
      </Row>

      <Row className="justify-content-center align-items-center">
        <div
          onClick={props.toggleBottom}
          dangerouslySetInnerHTML={createMarkup(props.coin.coin_caption)}
          className={`story-caption text-center ${
            props.coin.caption_background ? "light-blue-background" : ""
          }`}
          style={{ width: "26vmax" }}
        />
      </Row>
    </Col>
  );
};

const CompareFrame = (props) => {
  const zone = props.zone;

  return (
    <div
      className="section stories-background"
      style={{
        backgroundImage:
          zone.background.data === null
            ? null
            : `url(${baseURL}${zone.background.data.attributes.url})`,
      }}
    >
      {zone.head.updown_switch ? (
        <Container>
          {zone.cc_text.text === "" && zone.cc_text.caption === "" ? (
            <Row className="d-flex justify-content-center align-items-center">
              <Col
                xs={`${zone.image_grid}`}
                className="d-flex justify-content-center"
              >
                <CompareCoin coin={zone.cc_coin} />
              </Col>
            </Row>
          ) : (
            <Row className="d-flex justify-content-center align-items-center">
              {zone.left_right_switch ? (
                <>
                  <Col>
                    <TextComponent
                      toggleBottom={props.toggleBottom}
                      text={zone.cc_text}
                    />
                  </Col>
                  <Col
                    xs={`${zone.image_grid}`}
                    className="d-flex justify-content-center"
                  >
                    <CompareCoin coin={zone.cc_coin} />
                  </Col>
                </>
              ) : (
                <>
                  <Col
                    xs={`${zone.image_grid}`}
                    className="d-flex justify-content-center"
                  >
                    <CompareCoin coin={zone.cc_coin} />
                  </Col>
                  <Col>
                    <TextComponent
                      toggleBottom={props.toggleBottom}
                      text={zone.cc_text}
                    />
                  </Col>
                </>
              )}
            </Row>
          )}

          <Row className="d-flex justify-content-center mt-5">
            <HeadComponent
              toggleBottom={props.toggleBottom}
              storyMain={zone.head.head_main}
              storyCaption={zone.head.head_caption}
            />
          </Row>
        </Container>
      ) : (
        <Container>
          <Row className="d-flex justify-content-center mb-5">
            <HeadComponent
              toggleBottom={props.toggleBottom}
              storyMain={zone.head.head_main}
              storyCaption={zone.head.head_caption}
            />
          </Row>

          {zone.cc_text.text === "" && zone.cc_text.caption === "" ? (
            <Row className="d-flex justify-content-center align-items-center">
              <Col
                xs={`${zone.image_grid}`}
                className="d-flex justify-content-center"
              >
                <CompareCoin coin={zone.cc_coin} />
              </Col>
            </Row>
          ) : (
            <Row className="d-flex justify-content-center align-items-center">
              {zone.left_right_switch ? (
                <>
                  <Col
                    xs={`${zone.image_grid}`}
                    className="d-flex justify-content-center"
                  >
                    <CompareCoin coin={zone.cc_coin} />
                  </Col>
                </>
              ) : (
                <>
                  <Col
                    xs={`${zone.image_grid}`}
                    className="d-flex justify-content-center"
                  >
                    <CompareCoin coin={zone.cc_coin} />
                  </Col>
                  <Col>
                    <TextComponent
                      toggleBottom={props.toggleBottom}
                      text={zone.cc_text}
                    />
                  </Col>
                </>
              )}
            </Row>
          )}
        </Container>
      )}

      {props.index === 0 ? null : (
        <button
          onClick={() => props.fullpageApi.moveTo(1)}
          className="back-to-top"
        >
          BACK TO TOP <b className="back-to-top-icon">&#xe807;</b>
        </button>
      )}
    </div>
  );
};

export default CompareFrame;