import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import qs from 'qs';

import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer.js';
import OutsideClickHandler from 'src/utils/OutsideClickHandler.js';
import { ToolTipsBoxJSX } from './CoinSortExtraFunctions.js';



// Praise be god to the next maintaner. 
// You have been blessed

// This is a set of constant values that relate to enumerations and data inside of strapi.
// You can't fetch enumerations so you must do it this way.
// Keep in mind, if you change the coins enumeration, it will also break this
const arrangement_selections = ['None', '1 x 1 Grid', '2 x 1 Grid', '3 x 1 Grid', '2 x 2 Grid', '3 x 2 Grid', '6 x 3 Grid'];
const arrangement_selections_query_relation = [0, 1, 2, 3, 4, 6, 18];
const sort_selections = ['None', 'Minting Date', 'Material', 'Issuing Authority', 'Governing Power', 'Size'];
const sort_selections_query_relation = ['', 'from_date', 'material', 'issuing_authority', 'governing_power.data.attributes.governing_power', 'diameter'];
const then_by_selections = ['None', 'Minting Date', 'Material', 'Issuing Authority', 'Governing Power', 'Size'];
const then_by_selections_query_relation = ['', 'from_date', 'material', 'issuing_authority', 'governing_power.data.attributes.governing_power', 'diameter'];
const filter_selections = ['None', 'Including', 'Excluding'];
const filter_selections_query_relation = [null, true, false];
const with_selections = ['None', 'Minting Date', 'Material', 'Issuing Authority', 'Governing Power', 'Size'];
const with_selections_query_relation = ['', 'from_date', 'material', 'issuing_authority', 'governing_power.data.attributes.governing_power', 'diameter'];
const of_kind_no_selections = ['None'];
const of_kind_from_date_selections = [
'None',
'past - 450 B.C.E',
'450 B.C.E - 350 B.C.E',
'350 B.C.E - 250 B.C.E',
'250 B.C.E - 150 B.C.E',
'150 B.C.E - 50 B.C.E',
'50 B.C.E - 50 C.E.',
'50 C.E - 150 C.E',
'150 C.E - 250 C.E',
'250 C.E - 350 C.E',
'350 C.E - 450 C.E',
'450 C.E - present',
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

const Coin = (props) => {
  const thumbnail_scale = 2;
  let x = props.x * props.dimensions.width;
  let y = props.y * props.dimensions.height;
  let width = props.coinMetaData.attributes.diameter * thumbnail_scale;

  if ((x + width) > props.dimensions.width) x = props.dimensions.width - width;
  if ((y + width) > props.dimensions.height) y = props.dimensions.height - width;
  if (x < 0) x = 0;
  if (y < 0) y = 0;

  if (!props.display) {
    x = -10000;
    y = -10000;
  }

  const Drag = () => {
    props.setDraggedCoinId(props.coinId);
  };
  return (
    <div 
      className='coin-sort-pile-coin' 
      style={{top: `${y}px`, left: `${x}px`}} 
      onDrag={Drag}>
      <img 
        className='coin-sort-pile-coin-image'
        src={process.env.REACT_APP_strapiURL+props.coinMetaData.attributes.obverse_file.data.attributes.formats.thumbnail.url} 
        alt={props.coinMetaData.attributes.obverse_file.data.attributes.alternativeText}
        width={width}
      />
    </div>
  );
}; const DefaultCoinPileGraphingStategy = (coin) => {
  let y = Math.random();
  const CoinSortGraphingFormula = (x) => {
    return -4 * Math.pow(x - 0.5, 4) + 1.5 * Math.pow(x - 0.5, 2) + .2;
  };
  let x = Math.random() * CoinSortGraphingFormula(y);

  if (coin.id % 2 === 0) {
    x = 1 - x;
  } 
  return {
    x: x,
    y: y,
  };
}

// Randomly selects numbers from a Gaussian distribution between (0, 1)
function randn_bm() {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
  return num
}

// This function adds deviation to make the original value a little messier
const GaussianDeviationOnValue = (val, deviation) => {
  let min = val - deviation;
  let max = val + deviation;
  return randn_bm() * (max - min) + min;
}

// This evenly distrubutes the pile locations along the left, bottom, and right side of the CoinPile div.
const CoinPileLocations = (arr_length) => {
  const deviation = .1;
  const bottom_start_point = .1;
  const bottom_end_point = 1;
  const side_start_point = .1;
  const side_end_point = .8;
  let num_piles_bottom = 0, num_piles_on_sides = 0;
  if (arr_length % 3 === 0) {
    num_piles_on_sides = arr_length / 3;
    num_piles_bottom = arr_length / 3;
  } else if (arr_length % 3 === 1) {
    num_piles_on_sides = Math.floor(arr_length / 3);
    num_piles_bottom = Math.ceil(arr_length / 3);
  } else {
    num_piles_bottom = Math.ceil(arr_length / 3) + 1;
    num_piles_on_sides = Math.floor(arr_length / 3);
  }

  if (arr_length === 2) {
    num_piles_bottom = 0;
    num_piles_on_sides = 1;
  } else if (arr_length === 1) {
    num_piles_bottom = 1;
    num_piles_on_sides = 0;
  }

  let bottom_points = [];
  for (let i = bottom_start_point; i < bottom_end_point && num_piles_bottom !== 0; i += (bottom_end_point - bottom_start_point) / num_piles_bottom) {
    bottom_points.push({x: i, y: GaussianDeviationOnValue(.8, deviation)});
  }
  let left_side_points = [];
  let right_side_points = [];
  for (let i = side_start_point; i < side_end_point && num_piles_on_sides !== 0; i += (side_end_point - side_start_point) / num_piles_on_sides) {
    left_side_points.push({ x: GaussianDeviationOnValue(.15, deviation), y: i });
    right_side_points.push({ x: GaussianDeviationOnValue(.95, deviation), y: i });
  }
  right_side_points = right_side_points.reverse();

  return left_side_points.concat(bottom_points).concat(right_side_points);
}

function SimplyMappedCoin(coin, index) {
  return {
    props_index: index,
    id: coin.id,
    from_date: coin.attributes.from_date,
    material: coin.attributes.material,
    issuing_authority: coin.attributes.issuing_authority,
    governing_power: coin.attributes.governing_power?.data?.attributes?.governing_power, // for some reason, it be bugging with governing_power. The ?. operator fixes it
    size: coin.attributes.diameter
  };
}

// This is the coins scattering techniques.
const CoinPile = (props) => {
  const coin_wrapper_ref = useRef();
  const [coins_pos, set_coins_pos] = useState(undefined);
  useEffect(() => {
    if (Array.isArray(props.coins)) {
      if (props.sortSelection === sort_selections[0]) {
        set_coins_pos(new Map(props.coins.map((coin, index) => [coin.id, {
          index: index,
          ...DefaultCoinPileGraphingStategy(coin)
        }])));
      }

      if (props.sortSelection !== sort_selections[0]) {
        let tmp_coins = props.coins.map((coin, index) => (SimplyMappedCoin(coin, index)));
        ;
        // Setup what kind of query we are using. 
        // It'll be either Minting date, material, governing_power, issuing_authority, or size.
        // minting date, and size are bracket types. the other are match types.
        let key = undefined;
        let query_selection = undefined;
        let is_match_type = true;
        switch (props.sortSelection) {
          case sort_selections[1]: // Minting Date
            key = 'from_date';
            query_selection = of_kind_from_date_query_relation;
            is_match_type = false;
            break;
          case sort_selections[2]: // Material
            key = 'material';
            query_selection = of_kind_material_selections;
            is_match_type = true;
            break;
          case sort_selections[3]: // Issuing Authority
            key = 'issuing_authority';
            query_selection = of_kind_issuing_authority_selections;
            is_match_type = true;
            break;
          case sort_selections[4]: // Governing Power
            key = 'governing_power';
            query_selection = of_kind_governing_power_selections;
            is_match_type = true;
            break;
          case sort_selections[5]: // Size
            key = 'size';
            query_selection = of_kind_size_query_relation;
            is_match_type = false;
            break;
          default:
            console.error("No sort selection option", props.sortSelection);
        }
        // Make the coin piles. Order doesn't matter.
        let coin_piles = [];
        for (let index = 0; index < query_selection.length; index++) {
          let query = query_selection[index];
          if (index === 0) continue; // Skip piling default case

          let coin_pile = [];
          for (let i = 0; i < tmp_coins.length; i++) { // Find the correct pile to put the coin in
            if (is_match_type && tmp_coins[i][key]?.toLowerCase().includes(query.toLowerCase())) {
              coin_pile.push(tmp_coins[i]);
            } else if (tmp_coins[i][key] >= query.gte && 
              tmp_coins[i][key] <= query.lte) {
              coin_pile.push(tmp_coins[i]);
            }             
          }
          coin_piles.push(coin_pile);
        };
        coin_piles = coin_piles.filter((arr) => (arr.length !== 0));

        // set the sorted coins.
        let new_coin_pos = new Map();
        let pile_locations = CoinPileLocations(coin_piles.length);
        const coin_deviation_in_pile = .15;
        for (let i = 0; i < pile_locations.length; i++) {
          let more_mapped_coins = coin_piles[i].map((coin, index) => ([
            coin.id, 
            {
              index: index,
              x: GaussianDeviationOnValue(pile_locations[i].x, coin_deviation_in_pile),
              y: GaussianDeviationOnValue(pile_locations[i].y, coin_deviation_in_pile),
            }
          ]));
          new_coin_pos = new Map([...new_coin_pos, ...more_mapped_coins]);
        }
        set_coins_pos(new_coin_pos);
      } 
    }
  }, [props.coins, props.sortSelection, props.thenBySelection, props.filterSelection, props.ofKindSelection, props.withSelection]);

  useEffect(() => {
    if (props.filterSelection !== filter_selections[0] && props.withSelection !== with_selections[0]) { // Selected none, do nothing
      let filter_include = filter_selections_query_relation[filter_selections.findIndex((str) => str === props.filterSelection)];
      // Setup what kind of query we are using. 
      // It'll be either Minting date, material, governing_power, issuing_authority, or size.
      // minting date, and size are bracket types. the other are match types.
      let key = undefined;
      let query = undefined;
      switch (props.withSelection) {
        case with_selections[1]: // Minting Date
          key = 'from_date';
          query = of_kind_from_date_query_relation[of_kind_from_date_selections.findIndex((e) => e === props.ofKindSelection)];
          break;
        case with_selections[2]: // Material
          key = 'material';
          break;
        case with_selections[3]: // Issuing Authority
          key = 'issuing_authority';
          break;
        case with_selections[4]: // Governing Power
          key = 'governing_power';
          break;
        case with_selections[5]: // Size
          key = 'size';
          query = of_kind_size_query_relation[of_kind_size_selections.findIndex((e) => e === props.ofKindSelection)];
          break;
        default:
          console.error("No sort selection option", props.withSelection);
      }

      // We will get the coins that we want to filter out and set their display to false
      set_coins_pos(
        coins_pos == null ? null : new Map(Array.from(coins_pos).map((coin_pos) => {
          let coin = SimplyMappedCoin(props.coins[coin_pos[1].index], coin_pos[1].index);
          let does_include = false;
          // idgaf anymore. Just if it crashes, don't include them to be shown
          try {
            if (query == null) {
              does_include = coin[key]?.toLowerCase()?.includes(props.ofKindSelection.toLowerCase()) ?? false;
            } else {
              does_include = coin[key] >= query.gte && coin[key] <= query.gte;
            }
          } catch (err) {}
          if ((filter_include && !does_include) || (!filter_include && does_include)) {
            coin_pos[1].display = false;
          } else { 
            coin_pos[1].display = true;
          }
          return {
            ...coin_pos,
          };
        }))
      );
    }
  }, [props.coins, props.sortSelection, props.thenBySelection, props.filterSelection, props.withSelection, props.ofKindSelection]);

  const [dimensions, set_dimensions] = useState({width: 0, height: 0});
  useEffect(() => {
    const HandleResize = () => {
      set_dimensions({width: coin_wrapper_ref?.current?.clientWidth ?? 0, height: coin_wrapper_ref?.current?.clientHeight ?? 0});
    }
    window.addEventListener("resize", HandleResize);
  }, []);

  useEffect(() => {
    set_dimensions({width: coin_wrapper_ref?.current?.clientWidth ?? 0, height: coin_wrapper_ref?.current?.clientHeight ?? 0});
  }, [coin_wrapper_ref]);

  return (
    <div className='coin-sort-pile-wrapper' ref={coin_wrapper_ref}>
      <div className='coin-sort-pile'>
        {props.coins?.map((coin) => (<Coin 
          key={coin.id} 
          coinMetaData={coin}
          dimensions={dimensions} 
          display={coins_pos?.get(coin.id)?.display ?? true}
          x={coins_pos?.get(coin.id)?.x} 
          y={coins_pos?.get(coin.id)?.y} 
          setDraggedCoinId={props.setDraggedCoinId}
        />))}
      </div>
    </div>
  );
}

const CoinSortDropDown = (props) => {
  const [show, set_show] = useState(false);
  const [show_tool_tips, set_show_tool_tips] = useState(false);

  const CloseHandler = () => {
    set_show(false);
  }

  const OpenHandler = () => {
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
    <div 
      key={`coin_sort_dropdown_${e + index}`} 
      className='coin-sort-dropdown-item' 
      onClick={Select} 
      data-selection={e}>
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
        {props.title}{(() => {
          if (props.toolTips != null) { 
            return (<i 
              className='demo-icon icon-info coin-sort-info-icon'
              onClick={() => {
                set_show_tool_tips(!show_tool_tips);
              }}>&#xe817;</i>
            );
          } else {
            return <></>;
          }
        })()}
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
        {(() => {
          if (props.clearTitle != null && props.showClear) {
            return (
              <div 
                className='coin-sort-clear-button' 
                onClick={props.clear}>
                <i className="demo-icon icon-warning">&#xe82c;</i>{props.clearTitle}
              </div>
            );
          } else {
            return <></>;
          }
        })()}
      </div>
      {(() => {
        if (props.toolTips) { 
          return <ToolTipsBoxJSX
            show={show_tool_tips}
            onClose={(e) => {set_show_tool_tips(e);}} 
            toolTips={props.toolTips}
          />;
        } else {
          return <></>;
        }
      })()}
    </div>
  );
}
const CoinSort = () => {
  const [is_loading, set_is_loading] = useState(true);

  const [coins, set_coins] = useState(undefined);
  const [has_fetched_coins, set_has_fetched_coins] = useState(false);

  /*
  const [scale_all, set_scale_all] = useState(false);
  const [rotate_all, set_rotate_all] = useState(false); */

  const [dragged_coin_id, set_dragged_coin_id] = useState(undefined);
  const SetDraggedCoinId = (coin_id) => { set_dragged_coin_id(coin_id) };

  const [arrangement_selection, set_arrangement_selection] = useState(arrangement_selections[0]);
  const [sort_selection, set_sort_selection] = useState(sort_selections[0]);
  const [then_by_selection, set_then_by_selection] = useState(then_by_selections[0]);
  const [filter_selection, set_filter_selection] = useState(filter_selections[0]);
  const [with_selection, set_with_selection] = useState(with_selections[0]);
  const [of_kind_selection, set_of_kind_selection] = useState(of_kind_no_selections[0]);

  const [of_kind_selections, set_of_kind_selections] = useState(of_kind_no_selections);

  // Fetch ALL the coins and ALL their data.
  useEffect(() => {
    const FetchCoins = async () => { // Yay, async await
      let query = qs.stringify({
        populate: [
          'obverse_file',
          'governing_power',
          'type_category',
        ],
        pagination: {
          page: 1,
          pageSize: 2147483647,
        }
      });

      let res = await axios.get(`${process.env.REACT_APP_strapiURL}/api/coins?${query}`);
      if (Array.isArray(res?.data?.data)) {
        let data = res.data.data.filter((coin) => {
          return coin?.attributes?.obverse_file?.data?.attributes?.formats?.thumbnail?.url != null;
        });
        set_coins(data);
        set_has_fetched_coins(true);
      } else {
        console.error("Cannot parse result!\n", res);
      }
    }

    if (!has_fetched_coins) {
      FetchCoins();
    }
  }, [has_fetched_coins]);


  // different with_selections have different of_kind_selections. Need to choose the correct one based on the string.
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

  // Set preliminary information about the tools on the page. Like the title, tool tips, etc...
  const [coin_sort_title, set_coin_sort_title] = useState(undefined);
  const [tutorial_content, set_tutorial_content] = useState(undefined);
  const [empty_query_content, set_empty_query_content] = useState(undefined);
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
            set_tutorial_content(attri.main_text);
            set_empty_query_content(attri.no_result_from_query_text);
            set_arrangement_tool_tips(attri.arrangement_tips);
            set_sort_tool_tips(attri.sorting_tips);
            set_filter_tool_tips(attri.filtering_tips);
            set_is_loading(false);
          }
        });
  });

  // Useeffect that listens to changes on then_by_selection, and sort_selection, and displays the clear button if either then_by or sort_by have non-default content 
  const [show_sort_clear_button, set_show_sort_clear_button] = useState(false);
  useEffect(() => {
    if (sort_selection !== sort_selections[0] || 
      then_by_selection !== then_by_selections[0]) {
      set_show_sort_clear_button(true);
    } else {
      set_show_sort_clear_button(false);
    }
  }, [sort_selection, then_by_selection]);

  // Useeffect that listens to changes on of_kind_selection, filter_selection, and with_selection, and displays the clear button if either of_kind_selection, filter_selection, or with_selection have non-default content 
  const [show_filter_clear_button, set_show_filter_clear_button] = useState(false);
  useEffect(() => {
    if (filter_selection !== filter_selections[0] || 
      with_selection !== with_selections[0] ||
      of_kind_selection !== of_kind_selections[0]) {
      set_show_filter_clear_button(true);
    } else {
      set_show_filter_clear_button(false);
    }
  }, [filter_selection, with_selection, of_kind_selection, of_kind_selections]);

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
      <div id='coin-sort-title' className='story-h2 text-center'>
        {coin_sort_title}
      </div>
      {/* CoinPile (fixed position) */}
      <CoinPile 
        coins={coins} 
        setDraggedCoinId={SetDraggedCoinId} 
        sortSelection={sort_selection}
        thenBySelection={then_by_selection}
        filterSelection={filter_selection}
        withSelection={with_selection}
        ofKindSelection={of_kind_selection}
      />
      {/* Coin sort options */}
      <div id='coin-sort-options-wrapper'>
        <div id='coin-sort-options'>
          <CoinSortDropDown
            title='Sort:'
            selections={sort_selections}
            state={sort_selection}
            setState={set_sort_selection}
            toolTips={sort_tool_tips}
            showClear={show_sort_clear_button}
            clearTitle='Clear Sort'
            clear={() => {
              set_sort_selection(sort_selections[0]);
              set_then_by_selection(then_by_selections[0]);
              set_show_sort_clear_button(false);
            }}
          />
          <CoinSortDropDown
            title='Then by:'
            selections={then_by_selections}
            state={then_by_selection}
            setState={set_then_by_selection}
          />
          <div className='coin-sort-menu-vr'>
            <div className='coin-sort-menu-vr-content'/>
          </div>
          <CoinSortDropDown
            title='Filter:'
            selections={filter_selections}
            state={filter_selection}
            setState={set_filter_selection}
            toolTips={filter_tool_tips}
            showClear={show_filter_clear_button}
            clearTitle='Clear Filter'
            clear={() => {
              set_filter_selection(filter_selections[0]);
              set_with_selection(with_selections[0]);
              set_of_kind_selection(of_kind_selections[0]);
              set_show_filter_clear_button(false);
            }}
          />
          <CoinSortDropDown
            title='With:'
            selections={with_selections}
            state={with_selection}
            setState={set_with_selection}
          />
          <CoinSortDropDown
            title='Of Kind:'
            selections={of_kind_selections}
            state={of_kind_selection}
            setState={set_of_kind_selection}
          />
        </div>
      </div>
      {/* This is to prevent invisible things from being clickable. Yes I should change the display, but animations are easier wriiten with this */}
      <div style={{zIndex: -100, position: 'fixed', width: '100vw', height: '100vh', top: '0px', left: '0px'}} />       <Footer />
    </div>
  );
}

export default CoinSort;
