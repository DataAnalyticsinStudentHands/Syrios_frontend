/**
 * End_Frame.jsx — Vite Migration Refactor (2026)
 *
 * Purpose:
 * Renders the ending frame for a story sequence, including:
 * - background image
 * - closing text
 * - calls to action for Stories and Evidence
 * - optional "Back to Top" button
 *
 * Refactor Summary:
 * 1. Renamed file from `.js` to `.jsx`
 *    - Required because this file contains JSX and Vite does not allow JSX in `.js`
 *
 * 2. Migrated environment variables
 *    - Replaced `process.env.REACT_APP_strapiURL` with `import.meta.env.VITE_STRAPI_URL`
 *
 * 3. Preserved existing behavior
 *    - Layout, links, background image behavior, and "Back to Top" behavior remain unchanged
 *
 * Notes:
 * - Uses react-bootstrap Container/Col layout
 * - Uses React Router Link for navigation
 * - Uses dangerouslySetInnerHTML through a local helper
 *
 * Environment Variables Required:
 * - VITE_STRAPI_URL
 *
 * Future Improvements:
 * - Move createMarkup to shared util consistently
 * - Replace empty fragment branches with null
 * - Add stronger null guards for nested background media data
 */

import { Container, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const baseURL = import.meta.env.VITE_STRAPI_URL;

function createMarkup(textTran) {
  return { __html: textTran };
}

const End_Frame = (props) => {
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
      <Container className="d-flex justify-content-center align-items-center my-5">
        <div
          onClick={props.toggleBottom}
          dangerouslySetInnerHTML={createMarkup(zone.text)}
          className="story-h3 text-center"
        />
      </Container>

      <Container className="d-flex justify-content-center align-items-center my-5">
        <p className="story-h2 text-center">Are you ready to learn more?</p>
      </Container>

      <Container className="d-flex justify-content-around align-items-center">
        <Col className="d-flex justify-content-around align-items-center">
          <Link to="/Stories">
            <button className="story-end-frame-button">Tell Me a Story</button>
          </Link>
        </Col>

        <Col className="d-flex justify-content-around align-items-center">
          <Link to="/Evidence">
            <button className="story-end-frame-button">Explore Coins</button>
          </Link>
        </Col>
      </Container>

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

export default End_Frame;