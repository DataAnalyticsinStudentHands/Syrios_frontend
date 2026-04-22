/**
 * Search.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders catalog search controls and result summary.
 *
 * Refactor Summary:
 * 1. Preserved Existing Behavior
 *    - Search UI and result summary remain unchanged
 *
 * 2. Fixed Input Event Handling
 *    - Replaced `onFocus` event listener registration with direct `onKeyDown`
 *    - Prevents duplicate keypress listeners from accumulating
 *
 * Notes:
 * - This component does not fetch API data directly
 * - No normalization changes are required here
 *
 * Future Improvements:
 * - Convert to controlled input state
 * - Add debounce for search updates
 * - Add clear-search button
 */

import React from "react";
import "./search.scss";

function Search(props) {
  const handleClick = (e) => {
    e.preventDefault();
    props.setSearchText(e.target.nextSibling.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      props.setSearchText(e.target.value);
    }
  };

  return (
    <div className='info'>
      {props.searchText ? <h2>Search results for '{props.searchText}'</h2> : null}

      <div className='sub-info'>
        <span>Similar in catalog: {props.coinsLength}</span>

        <div className='search'>
          <span className="icon-entypo-search" onClick={handleClick} />
          <input
            type='text'
            name='search'
            placeholder="Search by coin name, type, date, and more."
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
}

export default Search;