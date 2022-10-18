import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

import LoadingPage from 'src/components/loadingPage/LoadingPage.js';
import FeedBackicon from 'src/components/constant/FeedBackIcon.js';
import { CoinGrid } from './CoinSortCoinGrid.js';
import CoinSortDropDown from './CoinSortDropDown.js';

import {
  DefaultCoinPileGraphingStategy, 
  GaussianDeviationOnValue, 
  SimplyMappedCoin,
  CoinPileLocations
} from './CoinUtils.js';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import coinSortRequest from 'src/api/coin-sort'
// Praise be god to the next maintaner. 
// You have been blessed

// This is a set of constant values that relate to enumerations and data inside of strapi.
// You can't fetch enumerations so you must do it this way.
// Keep in mind, if you change the coins enumeration, it will also break this
// const arrangement_selections = ['None', '1 x 1 Grid', '2 x 1 Grid', '3 x 1 Grid', '2 x 2 Grid', '3 x 2 Grid', '6 x 3 Grid'];
// const arrangement_selections_query_relation = [0, 1, 2, 3, 4, 6, 18];
const sort_selections = ['None', 'Minting Date', 'Material', 'Issuing Authority', 'Governing Power', 'Size'];
// const sort_selections_query_relation = ['', 'from_date', 'material', 'issuing_authority', 'governing_power.data.attributes.governing_power', 'diameter'];
const then_by_selections = ['None', 'Minting Date', 'Material', 'Issuing Authority', 'Governing Power', 'Size'];
// const then_by_selections_query_relation = ['', 'from_date', 'material', 'issuing_authority', 'governing_power.data.attributes.governing_power', 'diameter'];
const filter_selections = ['None', 'Including', 'Excluding'];
const filter_selections_query_relation = [null, true, false];
const with_selections = ['None', 'Minting Date', 'Material', 'Issuing Authority', 'Governing Power', 'Size'];
// const with_selections_query_relation = ['', 'from_date', 'material', 'issuing_authority', 'governing_power.data.attributes.governing_power', 'diameter'];
const of_kind_no_selections = ['None'];

// const of_kind_from_date_selections = [
// 'None',
// 'past - 450 B.C.E',
// '450 B.C.E - 350 B.C.E',
// '350 B.C.E - 250 B.C.E',
// '250 B.C.E - 150 B.C.E',
// '150 B.C.E - 50 B.C.E',
// '50 B.C.E - 50 C.E.',
// '50 C.E - 150 C.E',
// '150 C.E - 250 C.E',
// '250 C.E - 350 C.E',
// '350 C.E - 450 C.E',
// '450 C.E - present',
// ];

const of_kind_from_date_selections = [
  'None',
  'before - 500 B.C.E',
  '500 B.C.E - 401 B.C.E',
  '400 B.C.E - 301 B.C.E',
  '300 B.C.E - 201 B.C.E',
  '200 B.C.E - 101 B.C.E',
  '100 B.C.E - 1 B.C.E',
  '1 C.E - 99 C.E',
  '100 C.E - 199 C.E',
  '200 C.E - 299 C.E',
  '300 C.E - 399 C.E',
  '400 C.E - present',
  ];

// const of_kind_from_date_query_relation = [
//   {gte: -2147483648, lte: 2147483647},
//   {gte: -2147483648, lte: -450},
//   {gte: -450, lte: -350},
//   {gte: -350, lte: -250},
//   {gte: -250, lte: -150},
//   {gte: -150, lte: -50},
//   {gte: -50, lte: 50},
//   {gte: 50, lte: 150},
//   {gte: 150, lte: 250},
//   {gte: 250, lte: 350},
//   {gte: 350, lte: 450},
//   {gte: 450, lte: 2147483647},
// ];

const of_kind_from_date_query_relation = [
  {gte: -2147483648, lte: 2147483647},
  {gte: -2147483648, lte: -500},
  {gte: -500, lte: -401},
  {gte: -400, lte: -301},
  {gte: -300, lte: -201},
  {gte: -200, lte: -101},
  {gte: 1, lte: 99},
  {gte: 100, lte: 199},
  {gte: 200, lte: 299},
  {gte: 300, lte: 399},
  {gte: 400, lte: 2147483647},
];
const of_kind_material_selections = ['None','Gold','Silver','Bronze','Orichalcum','Uncertain'];
const of_kind_issuing_authority_selections = ['None','Royal','Imperial','Provincial','Civic','Uncertain',];
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

// This displays the individual coins on the screen.
const Coin = (props) => {
  const thumbnail_scale = 2;
  let x = props.x * props.dimensions.width;
  let y = props.y * props.dimensions.height;
  let width = props.coinMetaData.attributes.diameter * thumbnail_scale; // This is how we get the differently sized coins showing up properly
  if ((x + width) > props.dimensions.width) x = props.dimensions.width - width;
  if ((y + width) > props.dimensions.height) y = props.dimensions.height - width;
  if (x < 0) x = 0;
  if (y < 0) y = 0;

  if (!props.display) { // If display is false, send to shadow realm
    x = -10000;
    y = -10000;
  }

  // const handleClick = () => {
  //   console.log("This coin is CLicked")
  //   props.setDraggedCoinId(props.id);
  // };

  const Drag = () => {
    // console.log("This coin is Gragged")
    props.setDraggedCoinId(props.id);
  };

  return (
    <div 
      className='coin-sort-pile-coin' 
      style={{top: `${y}px`, left: `${x}px`}} 
      onDrag={Drag}
      >
      <img
        id={`coin-sort-${props.id}`}
        className='coin-sort-pile-coin-image'
        src={process.env.REACT_APP_strapiURL+props.coinMetaData.attributes.obverse_file.data.attributes.formats.thumbnail.url} 
        alt={props.coinMetaData.attributes.obverse_file.data.attributes.alternativeText}
        width={width}
      />
    </div>
  );
}; 


// This is the function the plots EVERY coin and sticks together all the pile logic. 
// The first this it does is setup default positioning. This is so coins_pos is insured to be defined for filtration.
// The next thing done is sorting the coins into different piles. 
// The last thing done is filtering the coins based on the coin sort options
function ComputeCoinPos(coins, sort_selection, then_by_selection, filter_selection, with_selection, of_kind_selection) {
  if (!Array.isArray(coins)) return null;

  // perform default positioning
  let coins_pos = new Map(coins.map((coin, index) => [coin.id, {
    index: index,
    ...DefaultCoinPileGraphingStategy(coin),
    display: true,
  }]));

  // peform sorting
  if (sort_selection !== sort_selections[0]) {
    let tmp_coins = coins.map((coin, index) => (SimplyMappedCoin(coin, index)));

    // ********* SORT BY ********** //
    // Setup what kind of query we are using. 
    // It'll be either Minting date, material, governing_power, issuing_authority, or size.
    // minting date, and size are bracket types. the other are match types.
    let key = undefined;
    let query_selection = undefined;
    let is_match_type = true;
    switch (sort_selection) {
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
        console.error("No sort selection option", sort_selection);
    }

    // Make the coin piles.
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
    coin_piles = coin_piles.filter((arr) => (arr.length !== 0)); // We have our coins per coin pile
    let pile_locations = CoinPileLocations(coin_piles.length); // We have our coin pile locations 
    
    // ********** THEN BY SORTING ********** //
    if (then_by_selection !== then_by_selections[0]) {
      key = undefined;
      query_selection = undefined;
      is_match_type = true;
      switch (then_by_selection) {
        case then_by_selections[1]: // Minting Date
          key = 'from_date';
          query_selection = of_kind_from_date_query_relation;
          is_match_type = false;
          break;
        case then_by_selections[2]: // Material
          key = 'material';
          query_selection = of_kind_material_selections;
          is_match_type = true;
          break;
        case then_by_selections[3]: // Issuing Authority
          key = 'issuing_authority';
          query_selection = of_kind_issuing_authority_selections;
          is_match_type = true;
          break;
        case then_by_selections[4]: // Governing Power
          key = 'governing_power';
          query_selection = of_kind_governing_power_selections;
          is_match_type = true;
          break;
        case then_by_selections[5]: // Size
          key = 'size';
          query_selection = of_kind_size_query_relation;
          is_match_type = false;
          break;
        default:
          console.error("No sort selection option", sort_selection);
      }

      let new_pile_locations = [];
      let new_coin_piles = [];
      for (let i = 0; i < pile_locations.length; i++) {
        let sort_by_coin_pile = coin_piles[i];
        let then_by_new_coin_piles = [];
        for (let j = 0; j < query_selection.length; j++) {
          if (j === 0) continue; // skip default case.
          let query = query_selection[j];
          let new_coin_pile = [];
          for (let k = 0; k < sort_by_coin_pile.length; k++) {
            let coin = sort_by_coin_pile[k];
            if (is_match_type && coin[key]?.toLowerCase().includes(query.toLowerCase())) {
              new_coin_pile.push(coin);
            } else if (coin[key] >= query.gte && 
              coin[key] <= query.lte) {
              new_coin_pile.push(coin);
            }
          }
          then_by_new_coin_piles.push(new_coin_pile);
        }

        const distance_from_center = .040;
        let center = pile_locations[i];
        let degrees_between_pile = 360 / then_by_new_coin_piles.length;
        for (let j = 0; j < then_by_new_coin_piles.length; j++) {
          new_pile_locations.push({
            x: distance_from_center * Math.cos(degrees_between_pile * j) + center.x,
            y: distance_from_center * Math.sin(degrees_between_pile * j) + center.y,
          });
        }

        new_coin_piles.push(then_by_new_coin_piles);
      }

      coin_piles = new_coin_piles.flat();
      pile_locations = new_pile_locations.flat();
    }

    // set the sorted coins.
    let new_coin_pos = new Map();
    const coin_deviation_in_pile = then_by_selection === then_by_selections[0] ? .15 : .075; // If then by is selected, make the deviation smaller
    for (let i = 0; i < pile_locations.length; i++) {
      let more_mapped_coins = coin_piles[i].map((coin) => ([
        coin.id,
        {
          index: coin.props_index,
          x: GaussianDeviationOnValue(pile_locations[i].x, coin_deviation_in_pile),
          y: GaussianDeviationOnValue(pile_locations[i].y, coin_deviation_in_pile),
          display: true,
        }
      ]));
      new_coin_pos = new Map([...new_coin_pos, ...more_mapped_coins]);
    }

    coins_pos = new_coin_pos;
  } 

  // perform filtering
  if (filter_selection !== filter_selections[0] && with_selection !== with_selections[0]) { // Selected none, do nothing
    let filter_include = filter_selections_query_relation[filter_selections.findIndex((str) => str === filter_selection)];
    // Setup what kind of query we are using. 
    // It'll be either Minting date, material, governing_power, issuing_authority, or size.
    // minting date, and size are bracket types. the other are match types.
    let coin_key = undefined;
    let query = undefined;
    switch (with_selection) {
      case with_selections[1]: // Minting Date
        coin_key = 'from_date';
        query = of_kind_from_date_query_relation[of_kind_from_date_selections.findIndex((e) => e === of_kind_selection)];
        break;
      case with_selections[2]: // Material
        coin_key = 'material';
        break;
      case with_selections[3]: // Issuing Authority
        coin_key = 'issuing_authority';
        break;
      case with_selections[4]: // Governing Power
        coin_key = 'governing_power';
        break;
      case with_selections[5]: // Size
        coin_key = 'size';
        query = of_kind_size_query_relation[of_kind_size_selections.findIndex((e) => e === of_kind_selection)];
        break;
      default:
        console.error("No sort selection option", with_selection);
    }

    // We will get the coins that we want to filter out and set their display to false
    let new_coins_pos = (
      coins_pos == null ? null : new Map(Array.from(coins_pos).map((coin_pos) => {
        let coin = SimplyMappedCoin(coins[coin_pos[1].index], coin_pos[1].index);
        let does_include = filter_include;
        // If it crashes, don't include them to be shown
        try {
          if (query == null) {
            does_include = coin[coin_key]?.toLowerCase()?.includes(of_kind_selection.toLowerCase()) ?? filter_include;
          } else {
            does_include = coin[coin_key] >= query.gte && coin[coin_key] <= query.gte;
          }
        } catch (err) {}

        if ((filter_include && !does_include) || (!filter_include && does_include)) {
          coin_pos[1].display = false;
        } else { 
          coin_pos[1].display = true;
        }
        return coin_pos;
      }))
    );

    coins_pos = new_coins_pos;
  }
  
  return coins_pos;
}

// This is the coins scattering techniques.
const CoinPile = (props) => {
  const coin_wrapper_ref = useRef();

  // Update coins_pos with ComputeCoinPos
  const [coins_pos, set_coins_pos] = useState(undefined);
  useEffect(() => {
    set_coins_pos(
      ComputeCoinPos(
        props.coins, 
        props.sortSelection, 
        props.thenBySelection, 
        props.filterSelection, 
        props.withSelection, 
        props.ofKindSelection
      )
    );
  }, [props.coins, props.sortSelection, props.thenBySelection, props.filterSelection, props.withSelection, props.ofKindSelection]);

  // Update dimensions on screen resize. Very expensive, so setting dimensions only once is better
  const [dimensions, set_dimensions] = useState({width: 0, height: 0});
  useEffect(() => {
    const HandleResize = () => {
      set_dimensions({width: coin_wrapper_ref?.current?.clientWidth ?? 0, height: coin_wrapper_ref?.current?.clientHeight ?? 0});
    }
    window.addEventListener("resize", HandleResize);
  }, []);

  // This sets the dimensions to be the same as the ref
  useEffect(() => {
    set_dimensions({width: coin_wrapper_ref?.current?.clientWidth ?? 0, height: coin_wrapper_ref?.current?.clientHeight ?? 0});
  }, [coin_wrapper_ref]);

  return (
    <div className='coin-sort-pile-wrapper' ref={coin_wrapper_ref}>
      <div className='coin-sort-pile'>
        {props.coins?.map((coin) => (
          <Coin 
            id={coin.id}
            key={coin.id} 
            coinMetaData={coin}
            dimensions={dimensions} 
            display={coins_pos?.get(coin.id)?.display ?? true}
            x={coins_pos?.get(coin.id)?.x} 
            y={coins_pos?.get(coin.id)?.y} 
            setDraggedCoinId={props.setDraggedCoinId}
          />))
        }
      </div>
    </div>
  );
}

// This holds the title, help icon, and the dropdown inside the coin sort options toolbox

const CoinSort = () => {
  const [is_loading, set_is_loading] = useState(true);

  // coins are all of the coins with their type_category, obverse_file, and governing_power relations
  const [coins, set_coins] = useState(undefined);
  const [has_fetched_coins, set_has_fetched_coins] = useState(false);

  // This is for the coin grid. Need to put the logic here because the scale all and rotate all buttons are in the coin sort options.
  const [scale_all, set_scale_all] = useState(false);
  const [rotate_all, set_rotate_all] = useState(false);
  // Need to make the buttons dissappear and reappear if coin grid is active
  const [show_scale_and_rotate, set_show_scale_and_rotate] = useState(false);
  const ShowScaleAndRotate = (is_show) => { set_show_scale_and_rotate(is_show); }

  // gets the currently dragged coin id
  const [dragged_coin_id, set_dragged_coin_id] = useState(undefined);
  const SetDraggedCoinId = (coin_id) => { set_dragged_coin_id(coin_id) };

  // const [sortCoinID, setSortCoinID] = useState("")

  const [sort_selection, set_sort_selection] = useState(sort_selections[0]);
  const [then_by_selection, set_then_by_selection] = useState(then_by_selections[0]);
  const [filter_selection, set_filter_selection] = useState(filter_selections[0]);
  const [with_selection, set_with_selection] = useState(with_selections[0]);
  const [of_kind_selection, set_of_kind_selection] = useState(of_kind_no_selections[0]);
  
  const [of_kind_selections, set_of_kind_selections] = useState(of_kind_no_selections);

  // Fetch ALL the coins and ALL their data.
  useEffect(() => {
    const FetchCoins = async () => {
      let res = await coinSortRequest.coinFectAll()
      if (Array.isArray(res?.data?.data)) {
        let data = res.data.data.filter((coin) => {return coin?.attributes?.obverse_file?.data?.attributes?.formats?.thumbnail?.url != null;});
        set_coins(data);
        set_has_fetched_coins(true);} 
      else {console.error("Cannot parse result!\n", res);}
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

  const [coinSortData, setCoinSortData] = useState([])
  useEffect(() => {
    async function fectCoinSortData(){
      let result = await coinSortRequest.coinSortFind()
      setCoinSortData(result.data.data.attributes)
      set_is_loading(false);
    }

    fectCoinSortData()
  });

  // Useeffect that listens to changes on then_by_selection, and sort_selection, and displays the clear button if either then_by or sort_by have non-default content 
  const [show_sort_clear_button, set_show_sort_clear_button] = useState(false);
  useEffect(() => {
    if (sort_selection !== sort_selections[0] || then_by_selection !== then_by_selections[0]) {
      set_show_sort_clear_button(true);
    } else {
      set_show_sort_clear_button(false);
    }
  }, [sort_selection, then_by_selection]);

  // Useeffect that listens to changes on of_kind_selection, filter_selection, and with_selection, and displays the clear button if either of_kind_selection, filter_selection, or with_selection have non-default content 
  const [show_filter_clear_button, set_show_filter_clear_button] = useState(false);
  useEffect(() => {
    if (filter_selection !== filter_selections[0] || with_selection !== with_selections[0] || of_kind_selection !== of_kind_selections[0]) {
      set_show_filter_clear_button(true);
    } else {
      set_show_filter_clear_button(false);
    }
  }, [filter_selection, with_selection, of_kind_selection, of_kind_selections]);


  // useEffect(() => {
  //     let x = 0;
  //     let y = 0;
  //     const mouseDownHandler = function (e) {
  //       if(e.path[0].className === "coin-sort-pile-coin-image" || e.path[0].className ==="test-draggable"){
  //         // Get the current mouse position
  //         x = e.clientX;
  //         y = e.clientY;
  //         // Attach the listeners to `document`
  //         document.addEventListener('mousemove', mouseMoveHandler);
  //         document.addEventListener('mouseup', mouseUpHandler);
  //       }
  //     };
  //     const mouseMoveHandler = function (e) {
  //         // How far the mouse has been moved
  //         const dx = e.clientX - x;
  //         const dy = e.clientY - y;
  //         // Set the position of element
  //         e.target.style.top = `${e.target.offsetTop + dy}px`;
  //         e.target.style.left = `${e.target.offsetLeft + dx}px`;
  //         e.target.style.zIndex = `2`;
  //         // Reassign the position of mouse
  //         x = e.clientX;
  //         y = e.clientY;
  //     };
  //     const mouseUpHandler = function () {
  //         // Remove the handlers of `mousemove` and `mouseup`
  //         document.removeEventListener('mousemove', mouseMoveHandler);
  //         document.removeEventListener('mouseup', mouseUpHandler);
  //     };
  //     window.addEventListener('mousedown', mouseDownHandler);
  // }, []);


// console.log(dragged_coin_id)
  if (is_loading) {return (<LoadingPage />);}

  return (
    <>
    <FeedBackicon formfor='coinpile'/>
      <div id='coin-pile-page'>
        <center>
          <h1>Coins in a Pile</h1>
          <h3 className='mb-5 pb-5'>Explore the SYRIOS Collection</h3>
        </center>
        <div style={{width:"50%", marginLeft:"25%"}}>
          <ol>
            <li className='story-text mb-5'>Drag coins from the pile on the edges into this center area to study them more closely.</li>
            <li className='story-text mb-5'>Click on a coin to see complete details.</li>
            <li className='story-text mb-5'>Use the tools, below, to arrange, sort, and filter the coins to identify the patterns and discover the hidden stories that connect them to each other and to us.</li>
          </ol>
        </div>
        <div id='coin-sort-wrapper'>
          <div className='navbar-spacer' />
          {/* <div id='coin-sort-spacer' /> */}
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
          {/* <div id='coin-sort-title' className='story-h1 text-center'>
            Coins in a Pile
          </div> */}
          {/* Coin sort options */}
          <div id='coin-sort-options-wrapper'>
            <div id='coin-sort-options'>
              <CoinSortDropDown
                title='Sort:'
                selections={sort_selections}
                state={sort_selection}
                setState={set_sort_selection}
                toolTips={coinSortData.sort_tool_tips}
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
                toolTips={coinSortData.filter_tool_tips}
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
              {(() => {
                if (show_scale_and_rotate) {
                  const renderTooltipScale = (props) => (
                    <Tooltip id="button-tooltip" {...props}>
                      scale to size
                    </Tooltip>
                  );
                  const renderTooltipFlip = (props) => (
                    <Tooltip id="button-tooltip" {...props}>
                      flip the coin
                    </Tooltip>
                  );
                  return (
                  <>
                    <div className='coin-sort-menu-vr'>
                      <div className='coin-sort-menu-vr-content'/>
                    </div>
                    <div className='coin-sort-options-icons-div' onClick={() => {set_scale_all(!scale_all);}}>
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltipScale}
                    >
                      <div className=' coin-sort-options-icon'>
                        scale<span className='icon-syrios-coin-scale'/>
                      </div>
                    </OverlayTrigger>
                    </div>
                    <div className='coin-sort-options-icons-div' onClick={() => {set_rotate_all(!rotate_all);}}>
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltipFlip}
                    >
                      <div className=' coin-sort-options-icon'>
                        flip<span className='icon-syrios-coin-rotate'/>
                      </div>
                    </OverlayTrigger>
                    </div>
                  </>
                  );}
              })
              ()}
            </div>
          </div>
          <CoinGrid
            coinToAdd={dragged_coin_id}
            rotateAll={rotate_all}
            scaleAll={scale_all}
            showScaleAndRotate={ShowScaleAndRotate}
          />
          {/* This is to prevent invisible things from being clickable. Yes I should change the display, but animations are easier wriiten with this */}
          <div style={{zIndex: -100, position: 'fixed', width: '100vw', height: '100vh', top: '0px', left: '0px'}} />       
        </div>
      </div>
    </>
  );
}

export default CoinSort;
