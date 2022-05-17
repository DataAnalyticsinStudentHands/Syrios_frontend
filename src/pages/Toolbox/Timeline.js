import React, {useState, useEffect} from 'react';
import Svg, {
  Path,
  Text,
  Line,
  Rect,
  Image,
  Circle
} from 'react-native-svg';
import axios from 'axios';

import { createMarkup } from 'src/utils/Markup.js';
import Footer from 'src/components/Footer.js';
import Navbar from 'src/components/Navbar.js';
import LoadingPage from 'src/components/LoadingPage.js';
import CoinInfo from 'src/components/coin/CoinInfo.js';
import EventInfo from 'src/components/event/Event.js';
import { colors } from 'src/components/constants.js';

import 'src/components/constants.css';
import './Timeline.css';



var coins = undefined; // idk why I can't use useState, but I can't. useState becomes undefined for whatever reason, but a pure JS object doesn't.
var events = undefined; // idk why I can't use useState, but I can't. useState becomes undefined for whatever reason, but a pure JS object doesn't.
const default_coin_data = {
  "reverse_type": "Tyche holding sceptre and cornucopia",
  "mint": "Antioch",
  "to_date": -150,
  "material": "Silver",
  "denomination": "Tetradrachm",
  "obverse_legend": "None",
  "reverse_legend": "ΒΑΣΙΛΕΩΣ ΔΗΜΗΤΡΙΟΥ",
  "obverse_type": "Demetrius I",
  "issuing_authority": "Royal",
  "diameter": 29,
  "createdAt": "2022-05-09T19:17:41.794Z",
  "updatedAt": "2022-05-09T19:48:01.929Z",
  "coin_id": "antioch_silver_demetrius1_tyche",
  "modern_country": "Syria",
  "ancient_territory": "Syria",
  "mint_nomisma_uri": "http://nomisma.org/id/antiocheia_syria",
  "mint_modern_name": "Antakya",
  "longitude": 36.2,
  "latitude": 36.16,
  "date_range": "c. 162 BCE-150 BCE",
  "from_date": -162,
  "governing_power": "Seleucid",
  "nomisma_obverse_uri": "http://nomisma.org/id/demetrius_i_soter",
  "nomisma_reverse_uri": "http://nomisma.org/id/tyche",
  "language": "Greek",
  "source_image": "http://numismatics.org/collection/1950.84.7?lang=en",
  "stable_id": null,
  "wikidata": null,
  "right_holder": "American Numsimatic Society - 1950.84.7",
  "ref1": "Seleucid Coins 1.1, no. 1633-4",
  "ref2": null,
  "has_image": true,
  "obverse_file": {
    "data": {
      "id": 816,
      "attributes": {
        "name": "7b9d83483f17c053bdd9226b607154e1.png",
        "alternativeText": "7b9d83483f17c053bdd9226b607154e1.png",
        "caption": "7b9d83483f17c053bdd9226b607154e1.png",
        "width": 600,
        "height": 601,
        "formats": {
          "small": {
            "ext": ".png",
            "url": "/uploads/small_7b9d83483f17c053bdd9226b607154e1_452122071f.png",
            "hash": "small_7b9d83483f17c053bdd9226b607154e1_452122071f",
            "mime": "image/png",
            "name": "small_7b9d83483f17c053bdd9226b607154e1.png",
            "path": null,
            "size": 489.31,
            "width": 499,
            "height": 500
          },
          "thumbnail": {
            "ext": ".png",
            "url": "/uploads/thumbnail_7b9d83483f17c053bdd9226b607154e1_452122071f.png",
            "hash": "thumbnail_7b9d83483f17c053bdd9226b607154e1_452122071f",
            "mime": "image/png",
            "name": "thumbnail_7b9d83483f17c053bdd9226b607154e1.png",
            "path": null,
            "size": 53.76,
            "width": 156,
            "height": 156
          }
        },
        "hash": "7b9d83483f17c053bdd9226b607154e1_452122071f",
        "ext": ".png",
        "mime": "image/png",
        "size": 214.82,
        "url": "/uploads/7b9d83483f17c053bdd9226b607154e1_452122071f.png",
        "previewUrl": null,
        "provider": "local",
        "provider_metadata": null,
        "createdAt": "2022-04-14T13:47:45.853Z",
        "updatedAt": "2022-04-14T13:47:45.853Z"
      }
    }
  },
  "reverse_file": {
    "data": {
      "id": 1510,
      "attributes": {
        "name": "eecaa68a86a7d889cba45f21ba821a9a.png",
        "alternativeText": "eecaa68a86a7d889cba45f21ba821a9a.png",
        "caption": "eecaa68a86a7d889cba45f21ba821a9a.png",
        "width": 600,
        "height": 596,
        "formats": {
          "small": {
            "ext": ".png",
            "url": "/uploads/small_eecaa68a86a7d889cba45f21ba821a9a_4cf4dcbc1c.png",
            "hash": "small_eecaa68a86a7d889cba45f21ba821a9a_4cf4dcbc1c",
            "mime": "image/png",
            "name": "small_eecaa68a86a7d889cba45f21ba821a9a.png",
            "path": null,
            "size": 526.33,
            "width": 500,
            "height": 497
          },
          "thumbnail": {
            "ext": ".png",
            "url": "/uploads/thumbnail_eecaa68a86a7d889cba45f21ba821a9a_4cf4dcbc1c.png",
            "hash": "thumbnail_eecaa68a86a7d889cba45f21ba821a9a_4cf4dcbc1c",
            "mime": "image/png",
            "name": "thumbnail_eecaa68a86a7d889cba45f21ba821a9a.png",
            "path": null,
            "size": 58.31,
            "width": 157,
            "height": 156
          }
        },
        "hash": "eecaa68a86a7d889cba45f21ba821a9a_4cf4dcbc1c",
        "ext": ".png",
        "mime": "image/png",
        "size": 235.95,
        "url": "/uploads/eecaa68a86a7d889cba45f21ba821a9a_4cf4dcbc1c.png",
        "previewUrl": null,
        "provider": "local",
        "provider_metadata": null,
        "createdAt": "2022-04-14T13:57:53.247Z",
        "updatedAt": "2022-04-14T13:57:53.247Z"
      }
    }
  },
  "type_category": [
    {
      "id": 1,
      "type_category": "Ruler"
    },
    {
      "id": 3,
      "type_category": "God"
    },
    {
      "id": 2,
      "type_category": "Object"
    }
  ]
};

const default_event_data = {
  "title": "Alexander the Great Dies",
  "tags": "Greek, Political",
  "text": "<p>In 323 BCE, Alexander the Great died from an illness while in the city of Babylon.&nbsp;</p>\n<p><em>[Alexander's soldiers] longed to see him...most from grief and longing for their King pressed in to see Alexander. They say that he was already speechless as the army filed past; yet he greeted one and all, raising his head, though with difficulty, and signing to them with his eyes... Alexander shortly afterwards breathed his last... Some have recorded that his friends asked him to whom he left his kingdom; and replied, \"to the best.\"</em> -Arrian, <em>Anabsis of Alexander</em> 7.26&nbsp;</p>",
  "TypeCategory": null,
  "color": "#987818",
  "createdAt": "2022-04-18T17:11:02.281Z",
  "updatedAt": "2022-04-18T17:11:02.281Z"
};


function SetupTimelineBackground(obj) {
  let res = obj.res.data;
  let y_offset = obj.y_offset;
  // Push background backdrop react-native-svg elements onto render array for react to load
  let jsx_arr = [];
  let view_box_min_height = 0;
  let view_box_total_height = 0;

  // We are parsing object keys to get start and end dates to match
  // The XXX part of start_XXX_x and end_XXX_x must match case insensitive
  let keys = Object.keys(res.data[0].attributes);
  let start_end_key_pairs = [];

  // We need to get our keys and put then in a start end key pairs so we can process the data
  keys.forEach((e) => {
    if (e.toLowerCase().includes('end') || e.toLowerCase().includes('start')) {
      let identifier = e.substring(e.indexOf('_')+1, e.lastIndexOf('_')).toLowerCase();
      let pushed = false;
      // push it to a double array of Nx2 size.
      start_end_key_pairs.forEach((ee) => {
        ee.forEach((eee) => { // Lol eee. I was about to add another e for fun.
          if (eee.toLowerCase().includes(identifier)) {
            ee.push(e);
            pushed=true;
          }
        });
      });
      // For new end or start x dates
      if (!pushed) {
        start_end_key_pairs.push([e]);
      }
    }
  });

  // By here, the object keys for start and end date should be ordered. Yes this is a O(n^3) algorithm, but idc. data set should be relatively small

  /* Objective: format data into react-native-svg freindly path for automatic interpolation with bezier curves.
   *
   * Wiki:
   * https://github.com/react-native-svg/react-native-svg#path 
   *
   * Basically we are building the d element in the pathing for react-native-svg    
   * example d element:
   * d="M25 10 L98 65 L70 25 L16 77 L11 30 L0 4 L90 50 L50 10 L11 22 L77 95 L20 25"
   * M means move to 25, 10 (x,y). Then L98 65 means line to (98,65), etc...
   * I'm just building that string up.
   *
   *
   * Curve styles:
   *
   * M = moveto
   * L = lineto
   * H = horizontal lineto
   * V = vertical lineto
   * C = curveto
   * S = smooth curveto
   * Q = quadratic Bézier curve
   * T = smooth quadratic Bézier curveto
   * A = elliptical Arc
   * Z = closepath
   *
   * Noticed that Q works the best. Some of the other options tend to have "problems"
   */
  let curve_style = 'Q';


  // Min and Maxheight are useful to let us offset negative dates and move it downwards because react-native-svg doesn't like using negative numbers
  // This makes it easy for react-native-svg to start at 0 for y value
  let min_height = (res.data[0].attributes.y_date); // We can assume index 0 is the smallest because it is ordered by ascending
  let max_height = (res.data[res.data.length-1].attributes.y_date); // We can assume index last is the biggest because it is ordered by ascending
  let view_box_height = (Math.abs(min_height-max_height)); // The size of the viewbox
  view_box_min_height = min_height;
  view_box_total_height = view_box_height;
  // Setup X and Y containers for render
  let start_end_key_pair_svg_values = JSON.parse(JSON.stringify(start_end_key_pairs));
  for (let i = 0; i < start_end_key_pair_svg_values.length; i++) {
    start_end_key_pair_svg_values[i][0] = [];
    start_end_key_pair_svg_values[i][1] = [];
  }

  // This is where the magic happens for setting up the background curves
  res.data.forEach((e, index) => {
    e = e.attributes; // This is to make querying the value e easier since all the important information is in the attrubutes
    for (let i = 0; i < start_end_key_pairs.length; i++) {
      if (e[start_end_key_pairs[i][0]] === null || e[start_end_key_pairs[i][1]] === null || isNaN(e[start_end_key_pairs[i][0]]) || isNaN(e[start_end_key_pairs[i][1]])) { // Avoid null points. These get ugly if we aren't careful
        continue;
      }

      if (start_end_key_pair_svg_values[i][0] === undefined || start_end_key_pair_svg_values[i][0].length === 0) { // If this is a "new" timeline object (meaning everything else for it was undefined up until this point), move to.
        start_end_key_pair_svg_values[i][0].push(`M${e[start_end_key_pairs[i][0]]} ${e.y_date + Math.abs(min_height)+y_offset} `);
        start_end_key_pair_svg_values[i][1].push(`${e[start_end_key_pairs[i][1]]} ${e.y_date + Math.abs(min_height)+y_offset} `);
      } else if (start_end_key_pair_svg_values[i][0].length === 1) { // If this timeline object was "recently" made (the above statement), make it have the proper curve style
        start_end_key_pair_svg_values[i][0].push(`${curve_style}${e[start_end_key_pairs[i][0]]} ${e.y_date + Math.abs(min_height)+y_offset} `);
        start_end_key_pair_svg_values[i][1].push(`${curve_style}${e[start_end_key_pairs[i][1]]} ${e.y_date + Math.abs(min_height)+y_offset} `);
      } else { // If this timeline object is done being made and just needs to continue output dates, do that
        start_end_key_pair_svg_values[i][0].push(`${e[start_end_key_pairs[i][0]]} ${e.y_date + Math.abs(min_height)+y_offset} `);
        start_end_key_pair_svg_values[i][1].push(`${e[start_end_key_pairs[i][1]]} ${e.y_date + Math.abs(min_height)+y_offset} `);
      }
    }
  });

  // This fix is to FORCE svg-react-native to draw lines at the very top of the timeline for those timeline objects that start at the top of the timeline
  // Without this, there is a slanted line at the top of the timeline for timeline objects. Other objects face this problem, but it isn't as bad of a problem unless it is at the top
  for (let i = 0; i < start_end_key_pair_svg_values.length; i++) {                 
    if (parseInt(start_end_key_pair_svg_values[i][0][0].substring(start_end_key_pair_svg_values[i][0][0].indexOf(' ')))+min_height-6 > min_height) {
      continue;
    }
    start_end_key_pair_svg_values[i][0][1] = start_end_key_pair_svg_values[i][0][1].replace(curve_style, 'L');
    start_end_key_pair_svg_values[i][0][4] = curve_style + start_end_key_pair_svg_values[i][0][4];

    start_end_key_pair_svg_values[i][1][3] = 'L'+start_end_key_pair_svg_values[i][1][3];
  }
  for (let i = 0; i < start_end_key_pairs.length; i++) {
    jsx_arr.push(
      <Path
        d={start_end_key_pair_svg_values[i][0].join("") + start_end_key_pair_svg_values[i][1].reverse().join("")}
        stroke='none'
        fill={colors.find_color(start_end_key_pairs[i][0])}
        key={`timeline_${jsx_arr.length}`}
        style={{
          opacity: '0.6'
        }}/>
    );
  }



  /* ********************************************************************************************** *
   * The next part is just prettyfier code                                                          *
   * This isn't 100% necessary, but good to have                                                    *
   * ********************************************************************************************** */

  // This is that slightly white background you see in the middle of the screen
  jsx_arr.push(                
    <Rect
      key='timeline_white'
      x='33'
      y={`${y_offset}`}
      width='33'
      height={view_box_height}
      stroke='none'
      fill='rgba(255,255,255,0.3)'/>
  );
  // This is how I get the bottom half of that slightly white background to be more opaque, by putting another one on top of it at the appropriate y level
  jsx_arr.push(
    <Rect
      key='timeline_double_white'
      x='33'
      y={`${y_offset+200}`}
      width='33'
      height={view_box_height}
      stroke='black'
      strokeWidth='0.06'
      fill='rgba(255,255,255,0.3)'/>
  );
  // End of Timeline big background color filler mapper


  // Need to setup lines at every 50 years with text. Need each 50 year point
  let y_dates_mod_50 = [];
  res.data.forEach((e) => {
    e = e.attributes;
    if (e.y_date % 50 === 0) {
      y_dates_mod_50.push(e.y_date);
    }
  });

  y_dates_mod_50.forEach((e) => { // build jsx_arr for y_date lines at every 50 years

    // Dotted lines
    jsx_arr.push(
      <Line
        key={`dottedLine_${jsx_arr.length}`}
        stroke='black'
        strokeDasharray='0.1, 0.2'
        strokeWidth='0.1'
        x1={0}
        x2={93}
        y1={e+Math.abs(min_height)+y_offset}
        y2={e+Math.abs(min_height)+y_offset}
      />
    );

    // The text you see every 50 years and the one hyphen at the end of the screen
    jsx_arr.push(
      <Text
        x='98%'
        textAnchor='end'
        fontWeight='thin'
        y={`${e+Math.abs(min_height)+y_offset+0.4}`}
        className='gray-text'
        key={`text_${jsx_arr.length}`}
        style={{fontSize: '1px'}}>
        {(() => {
          // BCE vs CE or BC vs AD. Whatever you like.
          if (e < 0) {
            return `${Math.abs(e)} BCE`;
          } else {
            return `${Math.abs(e)} CE`;
          }
        })()}
      </Text>
    );
    jsx_arr.push(
      <Line
        stroke='#282828'
        strokeWidth='0.1'
        key={`dash_${jsx_arr.length}`}
        x1='100%'
        x2='98.5%'
        y1={`${e+Math.abs(min_height)+y_offset}`}
        y2={`${e+Math.abs(min_height)+y_offset}`}
      />
    );
  });

  return { jsx_arr, view_box_min_height, view_box_total_height };
}

function LoadTimelineInfo(obj) {
  let res = obj.res.data.data.attributes;
  let y_offset = obj.y_offset;
  let view_box_min_height = obj.view_box_min_height;
  let update_coin_info = obj.update_coin_info;
  let update_event_info = obj.update_event_info;
  const coin_size = 8; // Size of coins on timeline
  const coin_stroke_width = .5; // Stroke width of coins on timeline
  let jsx_arr = [];
  let coin_info_arr = [];
  let event_info_arr = [];

  const SetupCoin = (e) => {
    const coin_pair = e.coin_pair == null ? undefined : e.coin_pair;
    let coin_info = e.coin.data.attributes;
    coin_info_arr.push({
      ...coin_info,
      id: e.id,
    });

    if (coin_info.obverse_file.data == null && coin_info.reverse_file.data == null) 
      return (
        <Circle
          id={e.id}
          key={`coin_image${e.id}${coin_pair}`}
          className='coin-image'
          fill='white'
          stroke='#173847'
          strokeWidth='.5'
          cx={e.x - coin_size / 5}
          cy={e.y + Math.abs(view_box_min_height) + y_offset * 1.7 - coin_size / 2}
          onClick={update_coin_info}
          r={coin_size / 2.5}
        />
      );

    return (
      <Image
        id={e.id}
        key={`coin_image_${e.id}${coin_pair}`}
        className='coin-image'
        x={e.x - coin_size / 2}
        y={e.y + Math.abs(view_box_min_height) + y_offset - coin_size / 2}
        width={coin_size}
        height={coin_size}
        href={`${process.env.REACT_APP_strapiURL}${coin_info.obverse_file.data.attributes.url}`}
        onClick={update_coin_info}/>
    );
  };

  res.zone.forEach((e) => {
    switch (e.__component) {
      case 'timeline-objects.single-coin':
        jsx_arr.push(SetupCoin(e));
        break;
      case 'timeline-objects.connected-coins':
        jsx_arr.push(
          <Path
            d={`M${e.coin_a_x} ${e.coin_a_y+Math.abs(view_box_min_height)+y_offset} S${e.coin_a_x} ${e.coin_b_y+Math.abs(view_box_min_height)+y_offset} ${e.coin_b_x} ${e.coin_b_y+Math.abs(view_box_min_height)+y_offset}`}
            key={`path_${e.id}`}
            stroke='#173847'
            fill='none'
            strokeWidth={coin_stroke_width*2}
          />
        );

        jsx_arr.push(SetupCoin({
          ...e,
          x: e.coin_b_x,
          y: e.coin_b_y,
          id: e.coin_b.data.id,
          coin_pair: 0,
          coin: e.coin_b
        }));
        jsx_arr.push(SetupCoin({
          ...e,
          x: e.coin_a_x,
          y: e.coin_a_y,
          id: e.coin_a.data.id,
          coin_pair: 1,
          coin: e.coin_a
        }));
        break;
      case 'timeline-objects.event':
        event_info_arr.push(e.event);
        let size_of_event = 2.3;

        jsx_arr.push(
          <Rect
            id={e.event.data.id}
            key={`event${e.event.data.id}`}
            className='event'
            x={e.x - size_of_event / 2}
            y={e.y + Math.abs(view_box_min_height) + y_offset - size_of_event / 2}
            width={size_of_event}
            height={size_of_event}
            fill={e.event.data.attributes.color}
            stroke='black'
            strokeWidth='0.1'
            onClick={update_event_info}/>
        );
        break;
      default:
        console.error(`Error: Unrecognized component '${e.__component}'`);
    }
  });

  return { jsx_arr, coin_info_arr, event_info_arr };
}

const Timeline = () => {
  const [timeline_background_is_loading, set_timeline_background_is_loading] = useState(true);
  const [timeline_info_is_loading, set_timeline_info_is_loading] = useState(true);
  const [timeline_background, set_timeline_background] = useState(undefined); // This is just the background colors, with the dotted lines and numbering on the right hand side
  const [timeline_description, set_timeline_description] = useState(undefined); // This is the description at the top of the page
  const [timeline_events_and_coins, set_timeline_events_and_coins] = useState(undefined); // This is the event and coins pop ups you see that you can interact with
  // These are the view box dimensions
  const [view_box_min_height, set_view_box_min_height] = useState(0);
  const [view_box_total_height, set_view_box_total_height] = useState(0);
  const y_offset = 5;

  // Coin info setup here. 
  const [show_coin_info, set_show_coin_info] = useState(false);
  const coin_info_popup_close_handler = (e) => { // This is used to show / remove popup on certain conditions
    set_show_coin_info(e);
  };
  const [coin_meta_data, set_coin_meta_data] = useState(default_coin_data);
  const update_coin_info = (img_dom_obj) => { // This is a function that is passed to the image comp per coin image and is called each time to update coin info if on click
    let id = parseInt(img_dom_obj.target.id);

    // Run update through here
    set_coin_meta_data(coins.filter(e => {
      return e.id === id;
    })[0]);
    set_show_coin_info(true);
  };

  // Event info setup here.
  const [show_event_info, set_show_event_info] = useState(false);
  const event_info_popup_close_handler = (e) => {
    set_show_event_info(e);
  };

  const [event_meta_data, set_event_meta_data] = useState(default_event_data);
  const update_event_info = (event_dom_obj) => {
    let id = parseInt(event_dom_obj.target.id);

    // update event meta data
    set_event_meta_data(events.filter(e => {
      return e.data.id === id;
    })[0].data.attributes);
    set_show_event_info(true);
  };

  useEffect(() => {
    // This is the background
    if (timeline_background_is_loading) {
      axios.get(process.env.REACT_APP_strapiURL + '/api/timelines')
        .then((res, err) => {
          if (err) {
            console.error(err);
            return;
          }
          let result_from_setup_timeline_background = SetupTimelineBackground({res,err, y_offset, });

          set_view_box_total_height(result_from_setup_timeline_background.view_box_total_height);
          set_view_box_min_height(result_from_setup_timeline_background.view_box_min_height);
          set_timeline_background(result_from_setup_timeline_background.jsx_arr);
          set_timeline_background_is_loading(false);
        });
    }

    // This is the coins and events and connecting stuff **********************
    if (timeline_info_is_loading) {
      axios.get(process.env.REACT_APP_strapiURL + '/api/timeline-info')
        .then((res, err) => {
          if (err) {
            console.error(err);
          } else {
            set_timeline_description(res.data.data.attributes.text);

            var timeline_info_interval = setInterval(function() {
              if (!timeline_background_is_loading) {
                clearInterval(timeline_info_interval);

                let tmp = LoadTimelineInfo({res, y_offset, view_box_min_height, coins, events, update_coin_info, update_event_info});

                set_timeline_events_and_coins(tmp.jsx_arr);
                coins = tmp.coin_info_arr;
                events = tmp.event_info_arr;
                set_timeline_info_is_loading(false);
              }
            }, 200);
          }
        });
    }
  });

  if (timeline_info_is_loading && timeline_background_is_loading) {
    return (
      <>
        <Navbar />
        <LoadingPage />
        <Footer />
      </>
    );
  }

  return (
    <div id='Timeline'>
      <Navbar />
      <div className='d-flex align-items-center justify-content-center' style={{position: 'relative', top: '8em'}}>
        <p className='blue-text text-center' style={{fontSize:'3em'}}>
          TIMELINE
        </p>
      </div>
      <div className='d-flex align-items-center justify-content-center gray-text text-center' style={{position: 'relative', top: '6em', fontStyle:'italic'}}>
        <div dangerouslySetInnerHTML={createMarkup(timeline_description)} />
      </div>
      <Svg
        height='100%'
        width='100%'
        viewBox={`0 0 100 ${view_box_total_height}`}
        style={{position: 'relative', top: '5em'}}>
        {timeline_background}
        {timeline_events_and_coins}
      </Svg>
      <CoinInfo 
        onClose={coin_info_popup_close_handler}
        show={show_coin_info}
        coinMetaData={coin_meta_data}
      />
      <EventInfo
        onClose={event_info_popup_close_handler}
        show={show_event_info}
        eventMetaData={event_meta_data}
      />
      <Footer />
    </div>
  );
}

export default Timeline;
