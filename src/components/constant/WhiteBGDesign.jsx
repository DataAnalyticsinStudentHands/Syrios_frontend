/**
 * WhiteBGDesign.jsx — Vite Migration Refactor (2026)
 *
 * Purpose:
 * Renders a centered white-background card with:
 * - clickable image (router link)
 * - title
 * - HTML-formatted subtext
 *
 * Refactor Summary:
 * 1. Renamed file from `.js` to `.jsx`
 *    - Required because this component returns JSX
 *
 * 2. Migrated environment variables
 *    - Replaced `process.env.REACT_APP_strapiURL` with `import.meta.env.VITE_STRAPI_URL`
 *
 * 3. Preserved behavior
 *    - Layout, styling, routing, and HTML rendering remain unchanged
 *
 * Notes:
 * - Uses `dangerouslySetInnerHTML` via `createMarkup`
 * - Assumes Strapi media URLs are relative paths
 * - Uses React Router `Link`
 *
 * Environment Variables Required:
 * - VITE_STRAPI_URL
 *
 * Future Improvements:
 * - Replace `<center>` (deprecated HTML) with CSS flexbox
 * - Add alt text support via props
 * - Add validation for `props.imageSrc`
 */

import { Link } from "react-router-dom";
import createMarkup from "src/utils/Markup";

const baseURL = import.meta.env.VITE_STRAPI_URL;

export const WhiteBGDesign = (props) => {
  return (
    <center>
      <Link to={props.link}>
        <img
          alt={"missing alt"}
          src={`${baseURL}${props.imageSrc}`}
          style={{
            height: props.height ?? "auto",
            width: props.width ?? "auto",
          }}
          className="bg-white p-3"
        />
      </Link>

      <h4 className="mt-5">{props.title}</h4>

      <p
        className="story-caption"
        dangerouslySetInnerHTML={createMarkup(props.subtext)}
      />
    </center>
  );
};