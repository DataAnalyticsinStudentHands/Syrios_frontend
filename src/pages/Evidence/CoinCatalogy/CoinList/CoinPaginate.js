import React,{useState} from "react";
import List from "./List";
import ReactPaginate from "react-paginate";
import "./CoinPaginate.scss"
const CoinPaginate = (props) => {
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + props.coinsPerPage;
  const currentCoins = props.coins.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(props.coins.length / props.coinsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * props.coinsPerPage) % props.coins.length;
    setItemOffset(newOffset);
  };

  return (
    <div className="CoinPaginate">
        <List coins = {currentCoins}/>
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
