/**
 * CoinPaginate.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Handles client-side pagination for coin list views.
 *
 * Refactor Summary:
 * 1. Preserved Existing Behavior
 *    - Pagination logic, list rendering, and ReactPaginate integration remain unchanged
 *
 * 2. Improved Safety
 *    - Adds light guards for empty or undefined coin arrays
 *    - Prevents modulo math issues when `coins.length` is zero
 *
 * Notes:
 * - This component does not fetch API data directly
 * - No Strapi normalization changes are required here
 *
 * Future Improvements:
 * - Reset page offset when filter/search inputs change upstream
 * - Add page number display summary (e.g. "Showing 1–12 of 84")
 */

import React, { useState } from "react";
import List from "./List";
import ReactPaginate from "react-paginate";
import "./CoinPaginate.scss";

const CoinPaginate = (props) => {
  const [itemOffset, setItemOffset] = useState(0);

  const coins = props.coins || [];
  const coinsPerPage = props.coinsPerPage || 12;

  const endOffset = itemOffset + coinsPerPage;
  const currentCoins = coins.slice(itemOffset, endOffset);
  const pageCount = coins.length > 0 ? Math.ceil(coins.length / coinsPerPage) : 0;

  const handlePageClick = (event) => {
    if (coins.length === 0) {
      setItemOffset(0);
      return;
    }

    const newOffset = (event.selected * coinsPerPage) % coins.length;
    setItemOffset(newOffset);
  };

  return (
    <div className="CoinPaginate">
      <List coins={currentCoins} />
      <ReactPaginate
        containerClassName="pagination"
        nextLabel=""
        previousLabel=""
        previousLinkClassName={" icon-entypo-arrow-thick-left"}
        nextLinkClassName={" icon-entypo-arrow-thick-right"}
        disabledClassName={"disabled"}
        activeClassName={"active"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        renderOnZeroPageCount={null}
      />
    </div>
  );
};

export default CoinPaginate;