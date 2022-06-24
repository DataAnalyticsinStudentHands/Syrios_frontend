import React, {useEffect, useState } from 'react';
import axios from 'axios';
import qs from 'qs';

import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer.js';
import OutsideClickHandler from 'src/utils/OutsideClickHandler.js';
import CoinInfo, { CoinAlt } from 'src/components/coin/CoinInfo.js';
import Markup from 'src/utils/Markup.js';



// Praise be god to the next maintaner. 
// You have been blessed

// This is a set of constant values that relate to enumerations and data inside of strapi.
// You can't fetch enumerations so you must do it this way.
// Keep in mind, if you change the coins enumeration, it will also break this
const arrangement_selections = ['None', '1 x 1 Grid', '2 x 1 Grid', '3 x 1 Grid', '2 x 2 Grid', '3 x 2 Grid', '6 x 3 Grid'];
const arrangement_selections_query_relation = [0, 1, 2, 3, 4, 6, 18];
const sort_selections = ['None', 'Minting Date', 'Material', 'Issuing Authority', 'Governing Power', 'Size'];
const sort_selections_query_relation = ['', 'from_date:asc', 'material:asc', 'issuing_authority:asc', 'governing_power.governing_power:asc', 'diameter:asc'];
const then_by_selections = ['None', 'Minting Date', 'Material', 'Issuing Authority', 'Governing Power', 'Size'];
const then_by_selections_query_relation = ['', 'from_date:asc', 'material:asc', 'issuing_authority:asc', 'governing_power.governing_power:asc', 'diameter:asc'];
const filter_selections = ['None', 'Including', 'Excluding'];
const filter_selections_query_relation = [null, true, false];
const with_selections = ['None', 'Minting Date', 'Material', 'Issuing Authority', 'Governing Power', 'Size'];
const with_selections_query_relation = ['', 'from_date', 'material', 'issuing_authority', 'governing_power][governing_power', 'diameter'];
const of_kind_no_selections = ['None'];
const of_kind_from_date_selections = [
'None',
'past - 450 B.C.E',
'450 B.C.E - 350 B.C.E',
'350 B.C.E - 250 B.C.E',
'250 B.C.E - 150 B.C.E',
'150 B.C.E - 50 B.C.E',
'50 B.C.E - 50 C.E.',
'50 B.C.E - 150 B.C.E',
'150 B.C.E - 250 B.C.E',
'250 B.C.E - 350 B.C.E',
'350 B.C.E - 450 B.C.E',
'450 B.C.E - present',
];
const of_kind_from_date_query_relation = [
  {gte: -2147483648, lte: 2147483647},
  {gte: -2147483648, lte: -450},
  {gte: -450, lte: -350},
  {gte: -350, lte: -250},
  {gte: -250, lte: -150},
  {gte: -150, lte: -50},
  {gte: -50, lte: 50},
  {gte: 50, lte: 150},
  {gte: 150, lte: 250},
  {gte: 250, lte: 350},
  {gte: 350, lte: 450},
  {gte: 450, lte: 2147483647},
];
const of_kind_material_selections = [
  'None',
  'Gold',
  'Silver',
  'Bronze',
  'Orichalcum',
  'Uncertain',
];
const of_kind_issuing_authority_selections = [
  'None',
  'Royal',
  'Imperial',
  'Provincial',
  'Civic',
  'Uncertain',
];
const of_kind_governing_power_selections = [];
(async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_strapiURL}/api/governing-powers`);
  let arr = data.data.map(({ attributes }) => attributes.governing_power);
  of_kind_governing_power_selections.push('None', ...arr);
})();
const of_kind_size_selections = [
  'None',
  '1mm - 10mm',
  '10mm - 15mm',
  '15mm - 20mm',
  '20mm - 25mm',
  '25mm - 30mm',
  '30mm - 35mm',
  '35mm - 40mm',
  '40mm - 50mm',
  'Uncertain',
];
const of_kind_size_query_relation = [
  {gte: -2147483648, lte: 2147483647},
  {gte: 1, lte: 10},
  {gte: 10, lte: 15},
  {gte: 15, lte: 20},
  {gte: 20, lte: 25},
  {gte: 25, lte: 30},
  {gte: 30, lte: 35},
  {gte: 35, lte: 40},
  {gte: 40, lte: 50},
  {gte: null, lte: null},
];

const CoinSortDropDown = (props) => {
  const [show, set_show] = useState(false);

  const CloseHandler = (e) => {
    set_show(false);
  }

  const OpenHandler = (e) => {
    set_show(true);
  }

  const Select = (e) => {
    set_show(false);
    props.setState(e.target.dataset.selection);
  }

  let display_styling = {
    opacity: show ? 1 : 0,
    zIndex: show ? 1000 : -1000,
  };
  let selection_jsx = props.selections.map((e, index) => (
    <div key={`coin_sort_dropdown_${e + index}`} className='coin-sort-dropdown-item' onClick={Select} data-selection={e}>
      <p data-selection={e} className='coin-sort-dropdown-item-text'>
        {e} { index === 0 &&
        <i className='coin-sort-dropdown-arrow' style={{position: 'absolute', right: '0', marginRight: '20px'}}/>
        }
      </p>
      <hr data-selection={e} className='coin-sort-dropdown-item-line-spacer' />
    </div>
  ));

  return (
    <div className='coin-sort-option'>
      <p className='coin-sort-dropdown-title-text'>
        {props.title}
      </p>
      <div className='coin-sort-dropdown-outermost-div'>
        <div className='coin-sort-dropdown-bar' onClick={OpenHandler}>
          <p className='coin-sort-dropdow-bar-text blue-text'>
            {props.state}
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

function QueryBuilder(arrangement_selection, sort_selection, then_by_selection, filter_selection, with_selection, of_kind_selection, page) {
  let arrangement_selection_query = arrangement_selections_query_relation[arrangement_selections.indexOf(arrangement_selection)];
  let sort_selection_query = sort_selections_query_relation[sort_selections.indexOf(sort_selection)];
  let then_by_selection_query = then_by_selections_query_relation[then_by_selections.indexOf(then_by_selection)];
  let filter_selection_query = filter_selections_query_relation[filter_selections.indexOf(filter_selection)];
  let with_selection_query = with_selections_query_relation[with_selections.indexOf(with_selection)];
  let of_kind_selection_query;
  switch(with_selection_query) {
    case 'none':
      of_kind_selection_query = null;
      break;
    case 'from_date':
      of_kind_selection_query = of_kind_from_date_query_relation[of_kind_from_date_selections.indexOf(of_kind_selection)];
      break;
    case 'material':
      of_kind_selection_query = of_kind_material_selections[of_kind_material_selections.indexOf(of_kind_selection)];
      break;
    case 'issuing_authority':
      of_kind_selection_query = of_kind_issuing_authority_selections[of_kind_issuing_authority_selections.indexOf(of_kind_selection)];
      break;
    case 'governing_power][governing_power':
      of_kind_selection_query = of_kind_governing_power_selections[of_kind_governing_power_selections.indexOf(of_kind_selection)];
      break;
    case 'diameter':
      of_kind_selection_query = of_kind_size_query_relation[of_kind_size_selections.indexOf(of_kind_selection)];
      break;
    case '':
      break;
    default:
      console.error('No with selection:', with_selection_query);
  }

  let query = {
    pagination: {
      page: page,
      pageSize: arrangement_selection_query,
    }
  };

  if (sort_selection_query != null && sort_selection_query !== sort_selections_query_relation[0]) {
    if (then_by_selection_query != null && then_by_selection_query !== then_by_selections_query_relation[0]) {
      query = {
        ...query,
        sort: [sort_selection_query, then_by_selection_query],
      };
    } else {
      query = {
        ...query,
        sort: [sort_selection_query],
      };
    }
  }

  if (filter_selection_query != null && of_kind_selection_query != null) {
    switch(with_selection_query) {
      case 'none':
        break;
      case 'from_date':
      case 'diameter':
        if (filter_selection_query) {
          if (of_kind_selection_query?.gte == null || of_kind_selection_query?.lte == null) {
            query = {
              ...query,
              filters: {
                [with_selection_query]: {
                  $null: true
                }
              }
            };
          } else {
            query = {
              ...query,
              filters: {
                [with_selection_query]: {
                  $gte: of_kind_selection_query.gte,
                  $lte: of_kind_selection_query.lte,
                }
              }
            };
          }
        } else {
          if (of_kind_selection_query?.gte == null || of_kind_selection_query?.lte == null) {
            query = {
              ...query,
              filters: {
                [with_selection_query]: {
                  $notNull: true
                }
              }
            };
          } else {
            query = {
              ...query,
              filters: {
                $or: [{
                  [with_selection_query]: {
                    $gt: of_kind_selection_query.lte,
                  }},
                  {[with_selection_query]: {
                    $lt: of_kind_selection_query.gte,
                  }
                  }]
              }
            };
          }
        }
        break;
      case 'material':
      case 'issuing_authority':
      case 'governing_power][governing_power':
        if (filter_selection_query) {
          query = {
            ...query,
            filters: {
              [with_selection_query]: {
                $eq: of_kind_selection_query,
              }
            }
          }
        } else {
          query = {
            ...query,
            filters: {
              [with_selection_query]: {
                $ne: of_kind_selection_query,
              }
            }
          }
        }
        break;
      case '':
        break;
      default:
        console.error('No with selection:', with_selection_query);
    }
  }

  return qs.stringify(query);
}

const CoinScaleAndFlip = (props) => {
  const [coin_rotation, set_coin_rotation] = useState('rotateY(0deg)');
  const [img_height, set_img_height] = useState('100%');
  const [dotted_circle_height, set_dotted_circle_height] = useState('0%');
  const [is_img_scaled, set_is_img_scaled] = useState(false);
  const [size_diameter_jsx, set_size_diameter_jsx] = useState('0');
  
  const [show_coin_info, set_show_coin_info] = useState(false);
  const CoinInfoPopupCloseHandler = (e) => { // This is used to show / remove popup on certain conditions
    set_show_coin_info(e);
  };


  const ResetCoin = () => {
    set_coin_rotation('rotateY(0deg)');
    set_img_height('100%');
    set_dotted_circle_height('0%');
    set_is_img_scaled(false);
  };

  useEffect(() => {
    ResetCoin();
  }, [props.coinMetaData]);

  useEffect(() => {
    if (is_img_scaled)
      set_size_diameter_jsx('.8em');
    else
      set_size_diameter_jsx('0');
  }, [is_img_scaled, props.coinMetaData.diameter]);

  const ScaleCoin = () => {
    if (is_img_scaled) {
      set_dotted_circle_height('0%');
      set_img_height('100%');
    } else {
      set_dotted_circle_height('80%');

      // I did some tricky math to get these numbers. 
      // jk it's just proportionalities with the dotted circle's height and the 
      // fact that the dotted circle is 50mm
      const box_percent = 100;
      const box_height_mm = 62.5;
      let height_of_coin_percent = (box_percent / box_height_mm) * props.coinMetaData.diameter;

      if (height_of_coin_percent == null || height_of_coin_percent === 0) {
        height_of_coin_percent = 5;
      }

      set_img_height(`${height_of_coin_percent}%`);
    }

    set_is_img_scaled(!is_img_scaled);
  };

  const RotateCoin = () => {
    if (coin_rotation.includes('(0deg)')) {
      set_coin_rotation('rotateY(180deg)');
    } else {
      set_coin_rotation('rotateY(0deg)');
    }
  };

  useEffect(() => {
    if (props.rotate) {
      set_coin_rotation('rotateY(180deg)');
    } else {
      set_coin_rotation('rotateY(0deg)');
    }
  }, [props.rotate]);

  useEffect(() => {
    if (props.scale && !is_img_scaled) {
      ScaleCoin();
    } else if (!props.scale && is_img_scaled) {
      ScaleCoin();
    }
  }, [props.scale]);

  if (props.coinMetaData.obverse_file.data == null || props.coinMetaData.reverse_file.data == null)
    return (
      <div className='coin-image-box'>
        <div className='coin-info-no-image coin-info-dark-text'>
          No image
        </div>
      </div>
    );

  return (
    <div className='coin-image-box coin-sort-grid-cell-image-box'>
      <div className='coin-info-dotted-circle' style={{height: dotted_circle_height}}/>
      <div className='coin-info-image-diameter-box coin-info-dark-text' style={{fontSize: size_diameter_jsx}}>
        {props.coinMetaData.diameter == null ? 'N/A' : `${props.coinMetaData.diameter}mm`}
      </div>
      <div className='flip-box coin-sort-grid-cell-flip-box' onClick={() => {set_show_coin_info(true)}}>
        <div className='flip-box-inner' style={{ transform: coin_rotation }}>
          <div className='flip-box-front'>
            <img
              alt={CoinAlt(props.coinMetaData.obverse_file.data.attributes)}
              className='coin-info-image-flip coin-info-image-flip-front'
              src={process.env.REACT_APP_strapiURL + props.coinMetaData.obverse_file.data.attributes.url}
              height={img_height}
            />
          </div>
          <div className='flip-box-back'>
            <img
              alt={CoinAlt(props.coinMetaData.obverse_file.data.attributes)}
              className='coin-info-image-flip coin-info-image-flip-back'
              src={process.env.REACT_APP_strapiURL + props.coinMetaData.reverse_file.data.attributes.url}
              height={img_height}
            />
          </div>
        </div>
      </div>
      {/*** Scale and Rotate button. MUST be rendered after coin image ***/}
      <div className='coin-sort-grid-cell-icons-div'>
        <i
          className='demo-icon coin-info-icon-rotate'
          onClick={RotateCoin}>
          &#xe833;
        </i>   
        <i
          className='demo-icon coin-info-scale-icon'
          onClick={ScaleCoin}>
          &#xe834;
        </i>
      </div>
      <CoinInfo onClose={CoinInfoPopupCloseHandler} show={show_coin_info} coinMetaData={props.coinMetaData} />
    </div>
  );
}

const CoinGridProgressBar = (props) => {
  return (
    <div id='coin-sort-grid-progress-bar-wrapper'>
      <div id='coin-sort-grid-progress-bar'>
        <div id='coin-sort-grid-progress-bar-progress-status' style={{width: `${(props.currentPagination / props.maxPage) * 100}%`}}>
        </div>
        <div id='coin-sor-grid-progress-bar-on-click-hover' onClick={(e) => {
          let DOMRect = e.target.getBoundingClientRect(); 
          let mouse_x_relative_to_DOM_pos = e.clientX - DOMRect.left;
          let mouse_x_as_percent_of_DOM_width = mouse_x_relative_to_DOM_pos / DOMRect.width;
          props.setPagination(Math.round(mouse_x_as_percent_of_DOM_width * props.maxPage));
        }}/>
      </div>
    </div>
  );
}

// This will have 6 different layout options
// 1 x 1
// 2 x 1
// 3 x 1
// 2 x 2
// 3 x 2
// 6 x 3
const CoinGrid = (props) => {
  if (props.coins == null) {
    return (
      <div>
      </div>
    );
  }

  const FetchCoinsJSXarr = (css_id) => { 
    return props.coins.map((coin, index) => (
      <CoinScaleAndFlip id={`${css_id}${index+1}`} className={`${css_id}styling`} key={index} coinMetaData={coin.attributes} rotate={props.rotateAll} scale={props.scaleAll}/>
    ));
  }
  let jsx = undefined;
  switch (props.arrangementSelection) {
    case '6 x 3 Grid':
      jsx = (   
        <div id='coin-sort-grid-6x3-arrangement'>
          {FetchCoinsJSXarr('coin-sort-grid-6x3-cell-')}
        </div>
      );
      break;
    case '3 x 2 Grid':
      jsx = (
        <div id='coin-sort-grid-3x2-arrangement'>
          {FetchCoinsJSXarr('coin-sort-grid-3x2-cell-')}
        </div>
      );
      break;
    case '2 x 2 Grid':
      jsx = (
        <div id='coin-sort-grid-2x2-arrangement'>
          {FetchCoinsJSXarr('coin-sort-grid-2x2-cell-')}
        </div>
      );
      break;
    case '3 x 1 Grid':
      jsx = (
        <div id='coin-sort-grid-3x1-arrangement'>
          {FetchCoinsJSXarr('coin-sort-grid-3x1-cell-')}
        </div>
      );
      break;
    case '2 x 1 Grid':
      jsx = (
        <div id='coin-sort-grid-2x1-arrangement'>
          {FetchCoinsJSXarr('coin-sort-grid-2x1-cell-')}
        </div>
      );
      break;
    case '1 x 1 Grid':
      jsx = (
        <div id='coin-sort-grid-1x1-arrangement'>
          {FetchCoinsJSXarr('coins-sort-grid-1x1-cell-')}
        </div>
      );
      break;
    default:
      console.error('No', props.arrangement_selection, 'grid arrangement.');
  }
  return (
    <>
      <div id='coin-sort-grid-arrangement-wrapper'>
        <i className='coin-sort-pagination-arrow left' onClick={() => {props.goLeft()}} />
        {jsx}
        <i className='coin-sort-pagination-arrow right' onClick={() => {props.goRight()}} />
      </div>
      <CoinGridProgressBar maxPage={props.maxPage} currentPagination={props.currentPagination} setPagination={props.setPagination} />
    </>

  );
}

const TutorialText = (props) => {
  return (
    <div id='coin-sort-tutorial-text-wrapper'>
      <div id='coin-sort-tutorial-text'>
        <div id='coin-sort-tutorial-text-title'>
          {props.title}
        </div>
        <div id='coin-sort-tutorial-text' dangerouslySetInnerHTML={Markup(props.tutorialText)}/>
      </div>
    </div>
  );
}

function ToolTipsBoxJSX(tool_tips) {
  return (
    <div>
    </div>
  );
}

const CoinSort = () => {
  const [is_loading, set_is_loading] = useState(true);

  const [coins, set_coins] = useState(undefined);

  const [scale_all, set_scale_all] = useState(false);
  const [rotate_all, set_rotate_all] = useState(false);

  const [arrangement_selection, set_arrangement_selection] = useState(arrangement_selections[0]);
  const [sort_selection, set_sort_selection] = useState(sort_selections[0]);
  const [then_by_selection, set_then_by_selection] = useState(then_by_selections[0]);
  const [filter_selection, set_filter_selection] = useState(filter_selections[0]);
  const [with_selection, set_with_selection] = useState(with_selections[0]);
  const [of_kind_selection, set_of_kind_selection] = useState(of_kind_no_selections[0]);

  const [of_kind_selections, set_of_kind_selections] = useState(of_kind_no_selections);

  /* Pagination variables */
  const [page, set_page] = useState(0); // If page is set to 0, show the tutorial text
  const [max_page, set_max_page] = useState(0);

  const PaginateCoins = (paginate_left) => { // true for left, false for right
    set_scale_all(false);
    set_rotate_all(false);
    if (arrangement_selection === arrangement_selections[0]) {
      set_page(0);
    }
    if (paginate_left) {
      if (page - 1 <= 0) set_page(max_page ?? 0);
      else set_page(page - 1);
    } else {
      if (page === max_page) set_page(0);
      else set_page(page + 1);
    }
  }

  useEffect(() => {
    if (arrangement_selection === arrangement_selections[0]) {
      set_page(0);
    } else {
      set_page((page <= 0) ? 1 : page);
    }

    if (page !== 0) { // Query
      const query = QueryBuilder(arrangement_selection, sort_selection, then_by_selection, filter_selection, with_selection, of_kind_selection, page);
      axios.get(process.env.REACT_APP_strapiURL + `/api/coins?${query}`)
        .then((res, err) => {
          if (err) {
            console.error(err);
          } else {
            set_coins(res.data.data);
            set_max_page(res.data.meta.pagination.pageCount);
            if (page > max_page && max_page !== 0) set_page(max_page);
            set_rotate_all(false);
            set_scale_all(false);
          }
        });
    }   }, [arrangement_selection, sort_selection, then_by_selection, filter_selection, with_selection, of_kind_selection, page, max_page]);

  useEffect(() => {
    set_of_kind_selections(() => {
      switch(with_selection) {
        case 'None':
          set_of_kind_selection(of_kind_no_selections[0]);
          return of_kind_no_selections;
        case 'Minting Date':
          set_of_kind_selection(of_kind_from_date_selections[0]);
          return of_kind_from_date_selections;
        case 'Material':
          set_of_kind_selection(of_kind_material_selections[0]);
          return of_kind_material_selections;
        case 'Issuing Authority':
          set_of_kind_selection(of_kind_issuing_authority_selections[0]);
          return of_kind_issuing_authority_selections;
        case 'Governing Power':
          set_of_kind_selection(of_kind_governing_power_selections[0]);
          return of_kind_governing_power_selections;
        case 'Size':
          set_of_kind_selection(of_kind_size_selections[0]);
          return of_kind_size_selections;
        default:
          set_of_kind_selection(of_kind_no_selections[0]);
          return of_kind_no_selections;
      };
    });
  }, [with_selection]);

  const [coin_sort_title, set_coin_sort_title] = useState(undefined);
  const [tutorial_text_title, set_tutorial_text_title] = useState(undefined);
  const [tutorial_text, set_tutorial_text] = useState(undefined);
  const [arrangement_tool_tips, set_arrangement_tool_tips] = useState(undefined);
  const [sort_tool_tips, set_sort_tool_tips] = useState(undefined);
  const [filter_tool_tips, set_filter_tool_tips] = useState(undefined);
  useEffect(() => {
    if (is_loading)
      axios.get(process.env.REACT_APP_strapiURL + '/api/coin-sort')
        .then((res, err) => {
          if (err) {
            console.error(err);
          } else {
            let attri = res.data.data.attributes;
            set_coin_sort_title(attri.title);
            set_tutorial_text_title(attri.tutorial_text_title);
            set_tutorial_text(attri.tutorial_text);
            set_arrangement_tool_tips(ToolTipsBoxJSX(attri.arrangement_tips));
            set_sort_tool_tips(ToolTipsBoxJSX(attri.sorting_tips));
            set_filter_tool_tips(ToolTipsBoxJSX(attri.filtering_tips));
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
      <div id='coin-sort-options-wrapper'>
        <div id='coin-sort-options'>
          <CoinSortDropDown title='Arrange:' selections={arrangement_selections} state={arrangement_selection} setState={set_arrangement_selection} toolTips={arrangement_tool_tips}/>
          <div className='coin-sort-menu-vr'>
            <div className='coin-sort-menu-vr-content'/>
          </div>
          <CoinSortDropDown title='Sort:' selections={sort_selections} state={sort_selection} setState={set_sort_selection} toolTips={sort_tool_tips}/>
          <CoinSortDropDown title='Then by:' selections={then_by_selections} state={then_by_selection} setState={set_then_by_selection} />
          <div className='coin-sort-menu-vr'>
            <div className='coin-sort-menu-vr-content'/>
          </div>
          <CoinSortDropDown title='Filter:' selections={filter_selections} state={filter_selection} setState={set_filter_selection} toolTips={filter_tool_tips}/>
          <CoinSortDropDown title='With:' selections={with_selections} state={with_selection} setState={set_with_selection} />
          <CoinSortDropDown title='Of Kind:' selections={of_kind_selections} state={of_kind_selection} setState={set_of_kind_selection} />
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
      </div>
      {(() => {
        if (page !== 0) {
          return (
            <CoinGrid coins={coins} arrangementSelection={arrangement_selection} rotateAll={rotate_all} scaleAll={scale_all} goRight={() => {PaginateCoins(false)}} goLeft={() => {PaginateCoins(true)}} setPagination={set_page} currentPagination={page} maxPage={max_page}/>
          )
        } else {
          return (
            <>
              <div id='coin-sort-spacer' />
              <div id='coin-sort-spacer' />
              <div id='coin-sort-spacer' />
              <div id='coin-sort-spacer' />
              <TutorialText title={tutorial_text_title} tutorialText={tutorial_text} />
            </>
          )
        }
      })()}
      <Footer />
      <div style={{zIndex: -500, position: 'fixed', width: '100vw', height: '100vh', top: '0px', left: '0px'}} /> {/* This is to prevent invisible things from being clickable. Yes I should change the display, but animations are easier wriiten with this */}
    </div>
  );
}

export default CoinSort;
