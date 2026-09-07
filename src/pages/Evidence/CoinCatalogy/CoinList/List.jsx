/**
 * List.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders the paginated list of coin cards.
 *
 * Refactor Summary:
 * 1. Preserved Existing Behavior
 *    - Layout and mapping behavior remain unchanged
 *
 * 2. Improved Card Compatibility
 *    - Passes the full coin object into `Card`
 *    - Allows `Card.jsx` to handle both:
 *        • raw Strapi collection rows (`coin.attributes`)
 *        • normalized/hybrid coin objects
 *
 * Notes:
 * - This component does not fetch API data directly
 * - No normalization changes are required here
 *
 * Future Improvements:
 * - Add empty-state UI when there are no coins to render
 */

import React from "react";
import "./List.scss";
import { Card } from "./Card";

const List = (props) => {
  return (
    <div className="list">
      {props.coins?.map((coin) => {
        return <Card coin={coin} id={coin?.id} key={coin?.id} />;
      })}
    </div>
  );
};

export default List;