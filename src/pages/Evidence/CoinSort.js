import React, {useEffect, useState} from 'react';
import axios from 'axios';
import qs from 'qs';

import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer.js';
import OutsideClickHandler from 'src/utils/OutsideClickHandler.js';



function FindIndexInArray(arr, item) {
  if (arr == null || arr.constructor !== Array) return -1;
  let arr_len = arr.length;
  for (let i = 0; i < arr_len; i++) {
    if (arr[i] === item) {
      return i;
    }
  }
  return -1;
}

const CoinSortDropDown = (props) => {
  const [show, set_show] = useState(false);
  const [selection, set_selection] = useState(props.state);

  const CloseHandler = (e) => {
    set_show(false);
  }

  const OpenHandler = (e) => {
    set_show(true);
  }

  const Select = (e) => {
    set_selection(e.target.dataset.selection);
    set_show(false);
    props.set_state(e.target.dataset.selection);
  }

  let display_styling = {
    opacity: show ? 1 : 0,
    zIndex: show ? 1000 : -1000,
  };
  let selection_jsx = [];

  props.selections.forEach((e, index) => {
    selection_jsx.push(
      <div key={`coin_sort_dropdown_${e + index}`} className='coin-sort-dropdown-item' onClick={Select} data-selection={e}>
        <p data-selection={e} className='coin-sort-dropdown-item-text'>
          {e} { index === 0 &&
          <i className='coin-sort-dropdown-arrow' style={{position: 'absolute', right: '0', marginRight: '20px'}}/>
          }
        </p>
        <hr data-selection={e} className='coin-sort-dropdown-item-line-spacer' />
      </div>
    );
  });

  return (
    <div className='coin-sort-option'>
      <p className='coin-sort-dropdown-title-text'>
        {props.title}
      </p>
      <div className='coin-sort-dropdown-outermost-div'>
        <div className='coin-sort-dropdown-bar' onClick={OpenHandler}>
          <p className='coin-sort-dropdow-bar-text blue-text'>
            {selection}
          </p>
          <i className='coin-sort-dropdown-arrow'/>
        </div>
        <OutsideClickHandler show={show} onOutsideClick={CloseHandler}>
          <div className='coin-sort-dropdown' style={display_styling}>
            <div className='coin-sort-dropdown-items'>
              {selection_jsx}
            </div>
          </div>
        </OutsideClickHandler>
      </div>
    </div>
  );
}
const arrangement_selections = ['None', '1 x 1 Grid', '2 x 1 Grid', '3 x 1 Grid', '2 x 2 Grid', '3 x 2 Grid', '6 x 3 Grid'];
const arrangement_selections_query_relation = [0, 1, 2, 3, 4, 6, 18];
const sort_selections = ['None', 'Minting Date', 'Material', 'Issuing Authority', 'Governing Power', 'Size'];
const sort_selections_query_relation = ['', 'from_date:asc', 'material:asc', 'issuing_authority:asc', 'governing_power:asc', 'diameter:asc'];
const then_by_selections = ['None', 'Minting Date', 'Material', 'Issuing Authority', 'Governing Power', 'Size'];
const then_by_selections_query_relation = ['', 'from_date:asc', 'material:asc', 'issuing_authority:asc', 'governing_power:asc', 'diameter:asc'];
const filter_selections = ['None', 'Including', 'Excluding'];
const filter_selections_query_relation = [null, true, false];
const with_selections = ['None', 'Minting Date', 'Material', 'Issuing Authority', 'Governing Power', 'Size'];
const with_selections_query_relation = ['', 'from_date:asc', 'material:asc', 'issuing_authority:asc', 'governing_power:asc', 'diameter:asc'];
const of_kind_selections = ['None', 'God', 'Ruler', 'Female', 'Idea', 'Animal', 'Object', 'Nature', 'War/Weapon', 'Letter', 'Building', 'Other'];

function QueryBuilder(arrangement_selection, sort_selection, then_by_selection, filter_selection, with_selection, of_kind_selection, page) {
  let arrangement_selection_query = arrangement_selections_query_relation[FindIndexInArray(arrangement_selections, arrangement_selection)];
  let sort_selection_query = sort_selections_query_relation[FindIndexInArray(sort_selections, sort_selection)];
  let then_by_selection_query = then_by_selections_query_relation[FindIndexInArray(then_by_selections, then_by_selection)];
  let filter_selection_query = filter_selections_query_relation[FindIndexInArray(filter_selections, filter_selection)];
  let with_selection_query = with_selections_query_relation[FindIndexInArray(with_selections, with_selection)];
  // let of_kind_selections_query = FindIndexInArray(of_kind_selections, of_kind_selection); Gotta change this a bit
  
  let query = {
    pagination: {
      page: page,
      pageSize: arrangement_selection_query,
    }
  };

  if (sort_selection_query !== sort_selections_query_relation[0]) {
    query = {
      ...query,
      sort: [sort_selection_query],
    };
  }

  return qs.stringify(query);
}

const CoinSort = () => {
  const [is_loading, set_is_loading] = useState(true);

  const [arrangement_selection, set_arrangement_selection] = useState(arrangement_selections[0]);
  const [sort_selection, set_sort_selection] = useState(sort_selections[0]);
  const [then_by_selection, set_then_by_selection] = useState(then_by_selections[0]);
  const [filter_selection, set_filter_selection] = useState(filter_selections[0]);
  const [with_selection, set_with_selection] = useState(with_selections[0]);
  const [of_kind_selection, set_of_kind_selection] = useState(of_kind_selections[0]);

  const [go_right, set_go_right] = useState(false);
  const [go_left, set_go_left] = useState(false);

  const [scale_all, set_scale_all] = useState(false);
  const [rotate_all, set_rotate_all] = useState(false);

  /* Pagination variables */
  let page = 1;
  useEffect(() => {
    const query = QueryBuilder(arrangement_selection, sort_selection, then_by_selection, filter_selection, with_selection, of_kind_selection, page);
    console.log(`/api/coins?${query}`);
    axios.get(process.env.REACT_APP_strapiURL + `/api/coins?${query}`)
      .then((res, err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(res);
        }
      });
  }, [arrangement_selection, sort_selection, then_by_selection, with_selection, of_kind_selection, scale_all, rotate_all]);

  const [coin_sort_title, set_coin_sort_title] = useState(undefined);
  useEffect(() => {
    axios.get(process.env.REACT_APP_strapiURL + '/api/coin-sort')
      .then((res, err) => {
        if (err) {
          console.error(err);
        } else {
          let attri = res.data.data.attributes;
          set_coin_sort_title(attri.title);
          set_is_loading(false);
        }
      });
  });

  if (is_loading) {
    return (
      <>
        <LoadingPage />
        <Footer />
      </>
    );
  }

  return (
    <div id='coin-sort-wrapper'>
      <div className='navbar-spacer' />
      <div id='coin-sort-spacer' />
      <div className='story-h2 text-center'>
        {coin_sort_title}
      </div>
      <div id='coin-sort-options'>
        <CoinSortDropDown title='Arrange:' selections={arrangement_selections} state={arrangement_selection} set_state={set_arrangement_selection}/>
        <div className='coin-sort-menu-vr'>
          <div className='coin-sort-menu-vr-content'/>
        </div>
        <CoinSortDropDown title='Sort:' selections={sort_selections} state={sort_selection} set_state={set_sort_selection} />
        <CoinSortDropDown title='Then by:' selections={then_by_selections} state={then_by_selection} set_state={set_then_by_selection} />
        <div className='coin-sort-menu-vr'>
          <div className='coin-sort-menu-vr-content'/>
        </div>
        <CoinSortDropDown title='Filter:' selections={filter_selections} state={filter_selection} set_state={set_filter_selection} />
        <CoinSortDropDown title='With:' selections={with_selections} state={with_selection} set_state={set_with_selection} />
        <CoinSortDropDown title='Of Kind:' selections={of_kind_selections} state={of_kind_selection} set_state={set_of_kind_selection} />
        <div className='coin-sort-menu-vr'>
          <div className='coin-sort-menu-vr-content'/>
        </div>
        <div className='coin-sort-options-icons-div' onClick={() => {set_scale_all(!scale_all);}}>
          <i className='demo-icon icon-coin-scale coin-sort-options-icon'>&#xe834;</i>
          <p className='blue-text coin-sort-options-icon-text'>SCALE</p>
        </div>
        <div className='coin-sort-options-icons-div' onClick={() => {set_rotate_all(!rotate_all);}}>
          <i className='demo-icon icon-coin-rotate coin-sort-options-icon'>&#xe833;</i>
          <p className='blue-text coin-sort-options-icon-text'>FLIP</p>
        </div>
      </div>
      <Footer />
      <div style={{zIndex: -500, position: 'fixed', width: '100vw', height: '100vh', top: '0px', left: '0px'}} /> {/* This is to prevent invisible things from being clickable. Yes I should change the display, but animations are easier wriiten with this */}
    </div>
  );
}

export default CoinSort;
