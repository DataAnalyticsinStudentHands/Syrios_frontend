import React, {useState, useEffect} from 'react';
import Svg, {
  Path,
  Text,
  Line,
  Rect,
  Image
} from 'react-native-svg';
import axios from 'axios';

import { createMarkup } from 'src/utils/markup.js';
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
const defaultCoinData = {
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

const defaultEventData = {
  "title": "Alexander the Great Dies",
  "tags": "Greek, Political",
  "text": "<p>In 323 BCE, Alexander the Great died from an illness while in the city of Babylon.&nbsp;</p>\n<p><em>[Alexander's soldiers] longed to see him...most from grief and longing for their King pressed in to see Alexander. They say that he was already speechless as the army filed past; yet he greeted one and all, raising his head, though with difficulty, and signing to them with his eyes... Alexander shortly afterwards breathed his last... Some have recorded that his friends asked him to whom he left his kingdom; and replied, \"to the best.\"</em> -Arrian, <em>Anabsis of Alexander</em> 7.26&nbsp;</p>",
  "TypeCategory": null,
  "color": "#987818",
  "createdAt": "2022-04-18T17:11:02.281Z",
  "updatedAt": "2022-04-18T17:11:02.281Z"
};


function setupTimelineBackground(obj) {
  let res = obj.res.data;
  let yOffset = obj.yOffset;
  // Push background backdrop react-native-svg elements onto render array for react to load
  let jsxArr = [];
  let viewBoxMinHeight = 0;
  let viewBoxTotalHeight = 0;

  // We are parsing object keys to get start and end dates to match
  // The XXX part of start_XXX_x and end_XXX_x must match case insensitive
  let keys = Object.keys(res.data[0].attributes);
  let startEndKeyPairs = [];

  // We need to get our keys and put then in a start end key pairs so we can process the data
  keys.forEach((e) => {
    if (e.toLowerCase().includes('end') || e.toLowerCase().includes('start')) {
      let identifier = e.substring(e.indexOf('_')+1, e.lastIndexOf('_')).toLowerCase();
      let pushed = false;
      // push it to a double array of Nx2 size.
      startEndKeyPairs.forEach((ee) => {
        ee.forEach((eee) => { // Lol eee. I was about to add another e for fun.
          if (eee.toLowerCase().includes(identifier)) {
            ee.push(e);
            pushed=true;
          }
        });
      });
      // For new end or start x dates
      if (!pushed) {
        startEndKeyPairs.push([e]);
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
  let curveStyle = 'Q';


  // Min and Maxheight are useful to let us offset negative dates and move it downwards because react-native-svg doesn't like using negative numbers
  // This makes it easy for react-native-svg to start at 0 for y value
  let minHeight = (res.data[0].attributes.y_date); // We can assume index 0 is the smallest because it is ordered by ascending
  let maxHeight = (res.data[res.data.length-1].attributes.y_date); // We can assume index last is the biggest because it is ordered by ascending
  let viewBoxHeight = (Math.abs(minHeight-maxHeight)); // The size of the viewbox
  viewBoxMinHeight = minHeight;
  viewBoxTotalHeight = viewBoxHeight;
  // Setup X and Y containers for render
  let startEndKeyPairSVGValues = JSON.parse(JSON.stringify(startEndKeyPairs));
  for (let i = 0; i < startEndKeyPairSVGValues.length; i++) {
    startEndKeyPairSVGValues[i][0] = [];
    startEndKeyPairSVGValues[i][1] = [];
  }

  // This is where the magic happens for setting up the background curves
  res.data.forEach((e, index) => {
    e = e.attributes; // This is to make querying the value e easier since all the important information is in the attrubutes
    for (let i = 0; i < startEndKeyPairs.length; i++) {
      if (e[startEndKeyPairs[i][0]] === null || e[startEndKeyPairs[i][1]] === null || isNaN(e[startEndKeyPairs[i][0]]) || isNaN(e[startEndKeyPairs[i][1]])) { // Avoid null points. These get ugly if we aren't careful
        continue;
      }

      if (startEndKeyPairSVGValues[i][0] === undefined || startEndKeyPairSVGValues[i][0].length === 0) { // If this is a "new" timeline object (meaning everything else for it was undefined up until this point), move to.
        startEndKeyPairSVGValues[i][0].push(`M${e[startEndKeyPairs[i][0]]} ${e.y_date + Math.abs(minHeight)+yOffset} `);
        startEndKeyPairSVGValues[i][1].push(`${e[startEndKeyPairs[i][1]]} ${e.y_date + Math.abs(minHeight)+yOffset} `);
      } else if (startEndKeyPairSVGValues[i][0].length === 1) { // If this timeline object was "recently" made (the above statement), make it have the proper curve style
        startEndKeyPairSVGValues[i][0].push(`${curveStyle}${e[startEndKeyPairs[i][0]]} ${e.y_date + Math.abs(minHeight)+yOffset} `);
        startEndKeyPairSVGValues[i][1].push(`${curveStyle}${e[startEndKeyPairs[i][1]]} ${e.y_date + Math.abs(minHeight)+yOffset} `);
      } else { // If this timeline object is done being made and just needs to continue output dates, do that
        startEndKeyPairSVGValues[i][0].push(`${e[startEndKeyPairs[i][0]]} ${e.y_date + Math.abs(minHeight)+yOffset} `);
        startEndKeyPairSVGValues[i][1].push(`${e[startEndKeyPairs[i][1]]} ${e.y_date + Math.abs(minHeight)+yOffset} `);
      }
    }
  });

  // This fix is to FORCE svg-react-native to draw lines at the very top of the timeline for those timeline objects that start at the top of the timeline
  // Without this, there is a slanted line at the top of the timeline for timeline objects. Other objects face this problem, but it isn't as bad of a problem unless it is at the top
  for (let i = 0; i < startEndKeyPairSVGValues.length; i++) {                 
    if (parseInt(startEndKeyPairSVGValues[i][0][0].substring(startEndKeyPairSVGValues[i][0][0].indexOf(' ')))+minHeight-6 > minHeight) {
      continue;
    }
    startEndKeyPairSVGValues[i][0][1] = startEndKeyPairSVGValues[i][0][1].replace(curveStyle, 'L');
    startEndKeyPairSVGValues[i][0][4] = curveStyle + startEndKeyPairSVGValues[i][0][4];

    startEndKeyPairSVGValues[i][1][3] = 'L'+startEndKeyPairSVGValues[i][1][3];
  }
  for (let i = 0; i < startEndKeyPairs.length; i++) {
    jsxArr.push(
      <Path
        d={startEndKeyPairSVGValues[i][0].join("") + startEndKeyPairSVGValues[i][1].reverse().join("")}
        stroke='none'
        fill={colors.findColor(startEndKeyPairs[i][0])}
        key={`timeline_${jsxArr.length}`}
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
  jsxArr.push(                
    <Rect
      key='timeline_white'
      x='33'
      y={`${yOffset}`}
      width='33'
      height={viewBoxHeight}
      stroke='none'
      fill='rgba(255,255,255,0.3)'/>
  );
  // This is how I get the bottom half of that slightly white background to be more opaque, by putting another one on top of it at the appropriate y level
  jsxArr.push(
    <Rect
      key='timeline_double_white'
      x='33'
      y={`${yOffset+200}`}
      width='33'
      height={viewBoxHeight}
      stroke='black'
      strokeWidth='0.06'
      fill='rgba(255,255,255,0.3)'/>
  );
  // End of Timeline big background color filler mapper


  // Need to setup lines at every 50 years with text. Need each 50 year point
  let y_datesMod50 = [];
  res.data.forEach((e) => {
    e = e.attributes;
    if (e.y_date % 50 === 0) {
      y_datesMod50.push(e.y_date);
    }
  });

  y_datesMod50.forEach((e) => { // build jsxArr for y_date lines at every 50 years

    // Dotted lines
    jsxArr.push(
      <Line
        key={`dottedLine_${jsxArr.length}`}
        stroke='black'
        strokeDasharray='0.1, 0.2'
        strokeWidth='0.1'
        x1={0}
        x2={93}
        y1={e+Math.abs(minHeight)+yOffset}
        y2={e+Math.abs(minHeight)+yOffset}
      />
    );

    // The text you see every 50 years and the one hyphen at the end of the screen
    jsxArr.push(
      <Text
        x='98%'
        textAnchor='end'
        fontWeight='thin'
        y={`${e+Math.abs(minHeight)+yOffset+0.4}`}
        className='GrayText'
        key={`text_${jsxArr.length}`}
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
    jsxArr.push(
      <Line
        stroke='#282828'
        strokeWidth='0.1'
        key={`dash_${jsxArr.length}`}
        x1='100%'
        x2='98.5%'
        y1={`${e+Math.abs(minHeight)+yOffset}`}
        y2={`${e+Math.abs(minHeight)+yOffset}`}
      />
    );
  });

  return { jsxArr, viewBoxMinHeight, viewBoxTotalHeight };
}

function loadTimelineInfo(obj) {
  let res = obj.res.data.data.attributes;
  let yOffset = obj.yOffset;
  let viewBoxMinHeight = obj.viewBoxMinHeight;
  let updateCoinInfo = obj.updateCoinInfo;
  let updateEventInfo = obj.updateEventInfo;
  const coinSize = 8; // Size of coins on timeline
  const coinStrokeWidth = .5; // Stroke width of coins on timeline
  let jsxArr = [];
  let coinInfoArr = [];
  let eventInfoArr = [];

  const SetupCoin = (e) => {
    coinInfoArr.push(e);
    return (
      <Image
        id={e.id}
        key={`coin_image${e.id}`}
        className='CoinImage'
        x={e.x - coinSize / 2}
        y={e.y + Math.abs(viewBoxMinHeight) + yOffset - coinSize / 2}
        width={coinSize}
        height={coinSize}
        href={`${process.env.REACT_APP_strapiURL}${e.coin.obverseFile.url}`}
        onClick={updateCoinInfo}/>
    );
  };

  res.zone.forEach((e) => {
    switch (e.__component) {
      case 'timeline-objects.coin-reference-singular':
        jsxArr.push(SetupCoin(e));
        break;
      case 'timeline-objects.coin-reference':
        jsxArr.push(
          <Path
            d={`M${e.parent_x} ${e.parent_y+Math.abs(viewBoxMinHeight)+yOffset} S${e.parent_x} ${e.child_y+Math.abs(viewBoxMinHeight)+yOffset} ${e.child_x} ${e.child_y+Math.abs(viewBoxMinHeight)+yOffset}`}
            key={`path${e.id}`}
            stroke='#173847'
            fill='none'
            strokeWidth={coinStrokeWidth*2}
          />
        );

        jsxArr.push(SetupCoin({
          ...e,
          x: e.coin_b_x,
          y: e.coin_b_y,
          id: e.coin_b.id,
          coin: e.coin_b
        }));
        jsxArr.push(SetupCoin({
          ...e,
          x: e.coin_a_x,
          y: e.coin_a_y,
          id: e.coin_a.id,
          coin: e.coin_a
        }));
        break;
      case 'timeline-objects.event':
        eventInfoArr.push(e.event);
        let sizeOfEvent = 2.3;

        jsxArr.push(
          <Rect
            id={e.event.data.id}
            key={`event${e.event.data.id}`}
            className='Event'
            x={e.x - sizeOfEvent / 2}
            y={e.y + Math.abs(viewBoxMinHeight) + yOffset - sizeOfEvent / 2}
            width={sizeOfEvent}
            height={sizeOfEvent}
            fill={e.event.data.attributes.color}
            stroke='black'
            strokeWidth='0.1'
            onClick={updateEventInfo}/>
        );
        break;
      default:
        console.error(`Error: Unrecognized component '${e.__component}'`);
    }
  });

  return { jsxArr, coinInfoArr, eventInfoArr };
}

const Timeline = () => {
  const [timelineBackgroundIsLoading, set_timelineBackgroundIsLoading] = useState(true);
  const [timelineInfoIsLoading, set_timelineInfoIsLoading] = useState(true);
  const [timelineBackground, set_timelineBackground] = useState(undefined); // This is just the background colors, with the dotted lines and numbering on the right hand side
  const [timelineDescription, set_timelineDescription] = useState(undefined); // This is the description at the top of the page
  const [timelineEventsAndCoins, set_timelineEventsAndCoins] = useState(undefined); // This is the event and coins pop ups you see that you can interact with
  // These are the view box dimensions
  const [viewBoxMinHeight, set_viewBoxMinHeight] = useState(0);
  const [viewBoxTotalHeight, set_viewBoxTotalHeight] = useState(0);
  const yOffset = 5;

  // Coin info setup here. 
  const [showCoinInfo, set_showCoinInfo] = useState(false);
  const coinInfoPopupCloseHandler = (e) => { // This is used to show / remove popup on certain conditions
    set_showCoinInfo(e);
  };
  const [coinMetaData, set_coinMetaData] = useState(defaultCoinData);
  const updateCoinInfo = (imgDomObj) => { // This is a function that is passed to the image comp per coin image and is called each time to update coin info if on click
    let dom = imgDomObj.target;

    let tmpCoinMetaData = coins.filter(e => {
      return e.id === dom.id;
    })[0].coin;

    // Run update through here
    set_showCoinInfo(true);
    set_coinMetaData(tmpCoinMetaData);
  };

  // Event info setup here.
  const [showEventInfo, set_showEventInfo] = useState(false);
  const eventInfoPopupCloseHandler = (e) => {
    set_showEventInfo(e);
  };

  const [eventMetaData, set_eventMetaData] = useState(defaultEventData);
  const updateEventInfo = (eventDomObj) => {
    let dom = eventDomObj.target;

    let tmpEventMetaData = events.filter(e => {
      return e.data.id === dom.id;
    })[0].data.attributes;

    set_eventMetaData(tmpEventMetaData);
    set_showEventInfo(true);
  };

  useEffect(() => {
    // This is the background
    if (timelineBackgroundIsLoading) {
      axios.get(process.env.REACT_APP_strapiURL + '/api/timelines')
        .then((res, err) => {
          if (err) {
            console.error(err);
            return;
          }
          let resultFromSetupTimelineBackground = setupTimelineBackground({res,err, yOffset, });

          set_viewBoxTotalHeight(resultFromSetupTimelineBackground.viewBoxTotalHeight);
          set_viewBoxMinHeight(resultFromSetupTimelineBackground.viewBoxMinHeight);
          set_timelineBackground(resultFromSetupTimelineBackground.jsxArr);
          set_timelineBackgroundIsLoading(false);
        });
    }



    // This is the coins and events and connecting stuff **********************
    if (timelineInfoIsLoading) {
      axios.get(process.env.REACT_APP_strapiURL + '/api/timeline-info')
        .then((res, err) => {
          if (err) {
            console.error(err);
          } else {
            set_timelineDescription(res.data.data.attributes.text);

            var timelineInfoInterval = setInterval(function() {
              if (!timelineBackgroundIsLoading) {
                clearInterval(timelineInfoInterval);

                let tmpTimelineInfo = loadTimelineInfo({res, yOffset, viewBoxMinHeight, coins, events, updateCoinInfo, updateEventInfo});

                set_timelineEventsAndCoins(tmpTimelineInfo.jsxArr);
                coins = tmpTimelineInfo.coinInfoArr;
                events = tmpTimelineInfo.eventInfoArr;
                set_timelineInfoIsLoading(false);
              }
            }, 200);
          }
        });
    }
  });

  if (timelineInfoIsLoading && timelineBackgroundIsLoading) {
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
        <p className='BlueText text-center' style={{fontSize:'3em'}}>
          TIMELINE
        </p>
      </div>
      <div className='d-flex align-items-center justify-content-center GrayText text-center' style={{position: 'relative', top: '6em', fontStyle:'italic'}}>
        <div dangerouslySetInnerHTML={createMarkup(timelineDescription)} />
      </div>
      <Svg
        height='100%'
        width='100%'
        viewBox={`0 0 100 ${viewBoxTotalHeight}`}
        style={{position: 'relative', top: '5em'}}>
        {timelineBackground}
        {timelineEventsAndCoins}
      </Svg>
      <CoinInfo 
        onClose={coinInfoPopupCloseHandler}
        show={showCoinInfo}
        CoinMetaData={coinMetaData}/>
      <EventInfo
        onClose={eventInfoPopupCloseHandler}
        show={showEventInfo}
        EventMetaData={eventMetaData}/>
      <Footer />
    </div>
  );
}

export default Timeline;
