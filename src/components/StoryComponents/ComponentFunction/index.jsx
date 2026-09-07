/**
 * StoryComponents.jsx — Vite Migration Refactor (2026)
 *
 * Purpose:
 * Provides reusable components for rendering story content:
 * - HeadComponent
 * - TextComponent
 * - ImageComponent
 * - ImagesComponent
 *
 * Refactor Summary:
 * 1. Renamed file from `.js` to `.jsx` (contains JSX)
 * 2. Replaced `process.env.REACT_APP_strapiURL` with `import.meta.env.VITE_STRAPI_URL`
 * 3. Preserved all rendering logic and layout behavior
 *
 * Notes:
 * - Uses react-bootstrap layout
 * - Uses dangerouslySetInnerHTML via createMarkup
 *
 * Environment Variables:
 * - VITE_STRAPI_URL
 */

import { Container, Row, Col } from "react-bootstrap";

const baseURL = import.meta.env.VITE_STRAPI_URL;

function createMarkup(textTran) {
  return { __html: textTran };
}

export function IsEmptyOrWhiteSpace(str) {
  return str === null ? true : (str.match(/^\s*$/) || []).length > 0;
}

export const HeadComponent = (props) => {
  return (
    <Col>
      <div
        onClick={props.toggleBottom}
        dangerouslySetInnerHTML={createMarkup(props.storyMain)}
        className="story-h2 text-center"
      />
      <div
        onClick={props.toggleBottom}
        dangerouslySetInnerHTML={createMarkup(props.storyCaption)}
        className="story-text text-center"
      />
    </Col>
  );
};

export const TextComponent = (props) => {
  const component_background = {
    null: "",
    "light-white-background": "light-white-background",
    "light-blue-background": "light-blue-background",
    "light-yellow-background": "light-yellow-background",
    "light-green-background": "light-green-background",
  };

  const text = props.text;

  if (text?.text === "" || text?.text == null) {
    return (
      <Container className={component_background[text?.background_color]} style={{ padding: "20px" }}>
        <Row
          onClick={props.toggleBottom}
          dangerouslySetInnerHTML={createMarkup(text?.caption)}
          className="story-text text-center"
        />
      </Container>
    );
  }

  if (text.caption === "" || text.caption == null) {
    return (
      <Container className={component_background[text.background_color]} style={{ padding: "20px" }}>
        <Row
          onClick={props.toggleBottom}
          dangerouslySetInnerHTML={createMarkup(text?.text)}
          className="story-h3-blue text-center"
        />
      </Container>
    );
  }

  return (
    <Container className={component_background[text?.background_color]} style={{ padding: "20px" }}>
      <Row
        onClick={props.toggleBottom}
        dangerouslySetInnerHTML={createMarkup(text?.text)}
        className="quote-text text-center"
      />
      <Row
        onClick={props.toggleBottom}
        dangerouslySetInnerHTML={createMarkup(text?.caption)}
        className="quote-credit text-center"
      />
    </Container>
  );
};

export const ImageComponent = (props) => {
  const image = props.image;

  const component_background = {
    null: "",
    "light-blue-background": "light-blue-background",
    "light-yellow-background": "light-yellow-background",
  };

  // Coin Data
  if (image.image.data === null) {
    return (
      <Col className={image.caption_or_both ? component_background[image.background_color] : ""}>
        <Row className="justify-content-center align-items-center">
          <a href={image.coin.data.attributes.source_image} target="_blank" rel="noopener noreferrer">
            <img
              src={`${baseURL}${
                image.reverse_or_obverse
                  ? image.coin.data.attributes.obverse_file.data.attributes.url
                  : image.coin.data.attributes.reverse_file.data.attributes.url
              }`}
              alt={
                image.coin.data.attributes.obverse_file.data.alternativeText ?? "img"
              }
              style={{ width: props.image.image_size + "%" }}
            />
          </a>
        </Row>

        <Row className="justify-content-center">
          <div
            onClick={props.toggleBottom}
            dangerouslySetInnerHTML={createMarkup(image.caption)}
            className={`story-caption text-center mt-3 ${
              image.caption_or_both ? "" : component_background[image.background_color]
            }`}
            style={{ width: props.image.image_size + "%" }}
          />
        </Row>
      </Col>
    );
  }

  // Normal image
  return (
    <Col className={image.caption_or_both ? component_background[image.background_color] : ""}>
      <Row className="d-flex justify-content-center">
        {image.additional_link ? (
          <a href={image.additional_link} target="_blank" rel="noopener noreferrer">
            <img
              src={`${baseURL}${image.image.data.attributes.url}`}
              alt={image.image.data.attributes.alternativeText ?? "img"}
              style={{ width: props.image.image_size + "%" }}
            />
          </a>
        ) : (
          <img
            src={`${baseURL}${image.image.data.attributes.url}`}
            alt={image.image.data.attributes.alternativeText ?? "img"}
            style={{ width: props.image.image_size + "%" }}
          />
        )}
      </Row>

      <Row className="d-flex justify-content-center">
        <div
          onClick={props.toggleBottom}
          dangerouslySetInnerHTML={createMarkup(image.caption)}
          className={`story-caption text-center mt-3 ${
            image.caption_or_both ? "" : component_background[image.background_color]
          }`}
          style={{ width: props.image.image_size + "%" }}
        />
      </Row>
    </Col>
  );
};

export const ImagesComponent = (props) => {
  const imageJsx = [];

  props.images.forEach((image) => {
    imageJsx.push(
      <Col key={image.id}>
        <ImageComponent toggleBottom={props.toggleBottom} image={image} />
      </Col>
    );
  });

  return <Row className="d-flex justify-content-around">{imageJsx}</Row>;
};