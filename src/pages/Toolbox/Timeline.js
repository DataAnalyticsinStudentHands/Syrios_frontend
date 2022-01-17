import React, {useState, useEffect} from 'react';
import Svg, {
  Path,
  Text,
  Line,
  Rect,
  Circle,
  Image
} from 'react-native-svg';
import axios from 'axios';

import Footer from 'src/components/Footer.js';
import Navbar from 'src/components/Navbar.js';
import LoadingPage from 'src/components/LoadingPage.js';
import CoinInfo, { UpdateAndShowCoinInfo } from 'src/components/coin/CoinInfo.js';
import EventInfo, { UpdateAndShowEventInfo } from 'src/components/event/Event.js';
import { colors } from 'src/components/constants.js';

import 'src/components/constants.css';
import './Timeline.css';



const Timeline = () => {
  const [isLoading, set_isLoading] = useState(true);
  const [timeline, set_timeline] = useState(undefined); // This is the entire timeline svg object
  const [timelineBackground, set_timelineBackground] = useState(undefined); // This is just the background colors, with the dotted lines and numbering on the right hand side
  const [timelineBackgroundIsLoading, set_timelineBackgroundIsLoading] = useState(true); // Set false when timeline background is done loading.
  const [timelineDescription, set_timelineDescription] = useState(undefined); // This is the description at the top of the page
  const [timelineInfo, set_timelineInfo] = useState(undefined); // This is the coin and event data
  const [timelineEventsAndCoins, set_timelineEventsAndCoins] = useState(undefined); // This is the event and coins pop ups you see that you can interact with
  const [timelineEventsAndCoinsIsLoading , set_timelineEventsAndCoinsIsLoading] = useState(true); // Set false once timelineEventsAndCoins is done loading
  let coins = undefined; // idk why I can't use useState, but I can't. useState becomes undefined for whatever reason, but a pure JS object doesn't.
  let events = undefined; // idk why I can't use useState, but I can't. useState becomes undefined for whatever reason, but a pure JS object doesn't.
  // These are the view box dimensions
  const [viewBoxMinHeight, set_viewBoxMinHeight] = useState(0);
  const [viewBoxMaxHeight, set_viewBoxMaxHeight] = useState(0);
  const [viewBoxTotalHeight, set_viewBoxTotalHeight] = useState(0);
  const [viewBoxDimensionsisLoading, set_viewBoxDimensionsisLoading] = useState(true); // set false once done loading
  const coinSize = 8; // Size of coins on timeline
  const coinStrokeWidth = .5; // Stroke width of coins on timeline
  const yOffset = 5;

  useEffect(() => {
    if (isLoading) {
      // This is the background
      axios.get(process.env.REACT_APP_strapiURL + '/timelines?_limit=-1&_sort=y_date:ASC')
        .then((res, err) => {
          if (err) {
            console.error(err);
          } else {
            // We are parsing object keys to get start and end dates to match
            // The XXX part of start_XXX_x and end_XXX_x must match case insensitive
            let keys = Object.keys(res.data[0]);
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
            let minHeight = (res.data[0].y_date); // We can assume index 0 is the smallest because it is ordered by ascending
            let maxHeight = (res.data[res.data.length-1].y_date); // We can assume index last is the biggest because it is ordered by ascending
            let viewBoxHeight = (Math.abs(res.data[0].y_date-res.data[res.data.length-1].y_date)); // The size of the viewbox
            set_viewBoxMaxHeight(maxHeight);
            set_viewBoxMinHeight(minHeight);
            set_viewBoxTotalHeight(viewBoxHeight);
            set_viewBoxDimensionsisLoading(false);
            // Setup X and Y containers for render
            let startEndKeyPairSVGValues = JSON.parse(JSON.stringify(startEndKeyPairs));
            for (let i = 0; i < startEndKeyPairSVGValues.length; i++) {
              startEndKeyPairSVGValues[i][0] = [];
              startEndKeyPairSVGValues[i][1] = [];
            }

            // This is where the magic happens for setting up the background curves
            res.data.forEach((e, index) => {
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

            // Push background backdrop react-native-svg elements onto render array for react to load
            let jsxArr = [];
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
              if (e.y_date % 50 === 0) {
                y_datesMod50.push(e.y_date);
              }
            });

            y_datesMod50.forEach((e) => { // build jsxArr for y_date lines at every 50 years

              for (let i = 0.5; i < 93; i++) {
                for (let j = 0; j < 1; j += 0.5) {
                  // Thos dotted lines you see every 50 years
                  jsxArr.push(
                    <Line
                      stroke='#282828'
                      strokeWidth='0.1'
                      key={`dot_${jsxArr.length}_${i}_${j}`}
                      x1={`${i+j}`}
                      x2={`${i+j+0.1}`}
                      y1={`${e+Math.abs(minHeight)+yOffset}`}
                      y2={`${e+Math.abs(minHeight)+yOffset}`}
                    />
                  );
                }
              }

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
            set_timelineBackground(jsxArr);
            set_timelineBackgroundIsLoading(false);
          }
        });



      // This is the coins and events and connecting stuff **********************
      axios.get(process.env.REACT_APP_strapiURL + '/timeline-info')
        .then((res, err) => {
          if (err) {
            console.error(err);
          } else {
            set_timelineDescription(res.data.timeline_description);
            
            let jsxArr = [];
            let coinInfoArr = [];
            let eventInfoArr = [];
            var timelineInfoInterval = setInterval(function() {
              if (!viewBoxDimensionsisLoading) {
                clearInterval(timelineInfoInterval);

                const SetupCoin = (e) => { 
                  coinInfoArr.push(e);
                  return (
                    <Image
                      id={e._id}
                      key={`coin_image${e._id}`}
                      className='CoinImage'
                      x={e.x - coinSize / 2}
                      y={e.y + Math.abs(viewBoxMinHeight) + yOffset - coinSize / 2}
                      width={coinSize}
                      height={coinSize}
                      href={`${process.env.REACT_APP_strapiURL}${e.coin.obverseFile.url}`}
                      onClick={(imgDomObj) => {
                        let dom = imgDomObj.target;

                        let coinMetaData = coins.filter(e => {
                          return e._id === dom.id;
                        })[0].coin;

                        UpdateAndShowCoinInfo(coinMetaData);
                      }}/>
                  );
                };

                res.data.zone.forEach((e) => {
                  switch (e.__component) {
                    case 'timeline-objects.coin-reference-singular':
                      jsxArr.push(SetupCoin(e));
                      break;
                    case 'timeline-objects.coin-reference':
                      jsxArr.push(
                      <Path
                        d={`M${e.parent_x} ${e.parent_y+Math.abs(viewBoxMinHeight)+yOffset} S${e.parent_x} ${e.child_y+Math.abs(viewBoxMinHeight)+yOffset} ${e.child_x} ${e.child_y+Math.abs(viewBoxMinHeight)+yOffset}`}
                        key={`path${e._id}`}
                        stroke='#173847'
                        fill='none'
                        strokeWidth={coinStrokeWidth*2}
                      />
                      );

                      jsxArr.push(SetupCoin({
                        ...e,
                        x: e.child_x,
                        y: e.child_y,
                        _id: e.child._id,
                        coin: e.child
                      }));
                      jsxArr.push(SetupCoin({
                        ...e,
                        x: e.parent_x,
                        y: e.parent_y,
                        _id: e.parent._id,
                        coin: e.parent
                      }));
                      break;
                    case 'timeline-objects.event-ref':
                      eventInfoArr.push(e.event);
                      let sizeOfEvent = 2.3;
                      
                      jsxArr.push(
                        <Rect
                          id={e.event._id}
                          key={`event${e.event._id}`}
                          className='Event'
                          x={e.x - sizeOfEvent / 2}
                          y={e.y + Math.abs(viewBoxMinHeight) + yOffset - sizeOfEvent / 2}
                          width={sizeOfEvent}
                          height={sizeOfEvent}
                          fill={e.event.color}
                          stroke='black'
                          strokeWidth='0.1'
                          onClick={(eventDomObj)=> {
                            let dom = eventDomObj.target;
                            
                            let eventMetaData = events.filter(e => {
                              return e._id === dom.id;
                            })[0];

                            UpdateAndShowEventInfo(eventMetaData);
                          }}/>
                      );
                      break;
                    default:
                      console.error(`Error: Unrecognized component '${e.__component}'`);
                  }
                });

                set_timelineEventsAndCoins(jsxArr);
                coins = coinInfoArr;
                events = eventInfoArr;
                set_timelineEventsAndCoinsIsLoading(false);
              }
            }, 200);
          }
        });



      // This is where all the information gets connected
      var timelineInterval = setInterval(function() {
        if (timelineBackground !== undefined && timelineEventsAndCoins !== undefined) {
          clearInterval(timelineInterval);

          set_timeline(
            <Svg
              height='100%'
              width='100%'
              viewBox={`0 0 100 ${viewBoxTotalHeight}`}
              style={{position: 'relative', top: '5em'}}>
              {timelineBackground}
              {timelineEventsAndCoins}
            </Svg>
          );
          set_isLoading(false); 
        }
      }, 400);
    }
  });

  if (isLoading) {
    return (
      <>
        {Navbar()}
        {LoadingPage()}
        {Footer()}
      </>
    );
  }
  
  return (
    <div id='Timeline'>
      {Navbar()}
      <div className='d-flex align-items-center justify-content-center' style={{position: 'relative', top: '8em'}}>
        <p className='BlueText text-center' style={{fontSize:'3em'}}>
          TIMELINE
        </p>
      </div>
      <div className='d-flex align-items-center justify-content-center' style={{position: 'relative', top: '6em'}}>
        <p className='GrayText text-center' style={{fontStyle:'italic'}}>
          {timelineDescription}
        </p>
      </div>
      {timeline}
      {CoinInfo()}
      {EventInfo()}
      {Footer()}
    </div>
  );
}

export default Timeline;
