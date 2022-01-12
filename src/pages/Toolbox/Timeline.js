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
import ReactMarkdown from 'react-markdown';

import Footer from 'src/components/Footer.js';
import Navbar from 'src/components/Navbar.js';
import LoadingPage from 'src/components/LoadingPage.js';
import CoinInfo, { UpdateAndShowCoinInfo } from 'src/components/coin/CoinInfo.js';

import 'src/components/constants.css';
import './Timeline.css';

const Timeline = () => {
  const [isLoadingInfo, set_isLoadingInfo] = useState(true);
  const [isLoadingBG, set_isLoadingBG] = useState(true);
  const [timelineBG, set_timelineBG] = useState(undefined);
  const [timelineInfo, set_timelineInfo] = useState(undefined);
  const [coinLocations, set_coinLocations] = useState(undefined);
  const [coinTreeConnections, set_coinTreeConnections] = useState(undefined);
  const [timelineDescription, set_timelineDescription] = useState(undefined);

  const coinSize = 8; // Size of coins on timeline
  const coinStrokeWidth = .5; // Stroke width of coins on timeline

  const colors = ['#7FA87F', '#F2D16B', '#B85828', '#486678', '#323029']

  useEffect(() => {
    if (isLoadingInfo) {
      /*
       * We need data on what timeline objects to be outputted.
       * Also, we need data on timeline trees
       *
       */
      axios.get(process.env.REACT_APP_strapiURL + '/timeline-info') // Fetch data from timeline-info
        .then((res, error) => {
          if (error) { // If error, skip and set variables so background can load atleast
            set_timelineDescription('Error loading timeline-info');
            set_timelineInfo('Error');
            set_coinLocations('error');
            set_isLoadingInfo(false);
          } else {
            set_timelineDescription(res.data.timeline_description);
            let timelineObjectIds = [];
            let tmpCoinLocationArr = [];
            let tmpCoinTreeConnections = [];

            res.data.zone.forEach((e) => {
              // Different timeline components require different rendering methods
              switch(e.__component) {
                case 'timeline-objects.coin-reference-singular':
                  // setup coin locations and coin object meta data
                  timelineObjectIds.push(e.coin_reference._id);
                  tmpCoinLocationArr.push({x: e.coin_reference.x_pos, y: e.coin_reference.y_date});
                  break;
                case 'timeline-objects.coin-reference':
                  // Setup coin locations, coin object meta deta, and Connecting nodes line between coins
                  timelineObjectIds.push(e.child._id);
                  tmpCoinLocationArr.push({x: e.child.x_pos, y: e.child.y_date});
                  timelineObjectIds.push(e.parent._id);
                  tmpCoinLocationArr.push({x: e.parent.x_pos, y: e.parent.y_date});
                  tmpCoinTreeConnections.push(
                    {
                      x1: e.parent.x_pos,
                      x2: e.child.x_pos,
                      y1: e.parent.y_date,
                      y2: e.child.y_date,
                      key: `tmpCoinTreeConnections_${tmpCoinTreeConnections.length}`
                    }
                  );

                  break;
                default:
                  console.error(`Unknown timeline-info component: ${e.__component}`); // Nice to have errors so you know where things fail if they do
                  break;
              }
            });

            timelineObjectIds = [...new Set(timelineObjectIds)]; // Remove duplicates
            tmpCoinLocationArr = [...new Set(tmpCoinLocationArr)];
            tmpCoinLocationArr = [... new Set(tmpCoinLocationArr)];
            set_coinTreeConnections(tmpCoinTreeConnections);
            set_coinLocations(tmpCoinLocationArr);
            timelineObjectIds = timelineObjectIds.map(i => '_id=' + i).join('&');


            axios.get(process.env.REACT_APP_strapiURL + `/timeline-objects?${timelineObjectIds}`)
              .then((res, error) => {
                if (error) { // If error, skip and set variables so background can load atleast
                  set_timelineInfo('error');
                  set_isLoadingInfo(false);
                } else {
                  let tmpTimelineInfo = [];
                  // get timeline object meta data in a 'workable' state
                  res.data.forEach((e) => {
                    switch(e.zone[0].__component) {
                      case 'timeline-objects.coin':
                        // Coin object meta data
                        tmpTimelineInfo.push({
                          __component: e.__component,
                          x: e.x_pos,
                          y: e.y_date,
                          ...e.zone[0]
                        });
                        break;
                      default:
                        console.error(`Error: Unrecognized timeline component '${e.zone[0].__component}'`); // Nice to have errors so you know where things fail if they do
                        break;
                    }
                  });

                  set_timelineInfo(tmpTimelineInfo);
                  set_isLoadingInfo(false);
                }
              });
          }
        });
    }

    if (isLoadingInfo || isLoadingBG) {
      // This is probably the most confusing code I have ever written
      axios.get(process.env.REACT_APP_strapiURL + '/timelines?_limit=-1&_sort=y_date:ASC') // ordered query by ascending
        .then((res,error) => {
          if (error) { // An error telling users that hey, somethings wrong. lol
            set_timelineBG(
              <div className='d-flex align-items-center justify-content-center' style={{paddingTop: '10%'}}>
                <p className='OrangeText text-center' style={{fontSize: '76px'}}>
                  Page failed to load. Try refreshing.
                </p>
              </div>
            );
            set_isLoadingBG(false);
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
             * Noticed that S works the best. Some of the other options tend to have "problems"
             */
            let curveStyle = 'Q';
            let yOffset = 5; // This is to offset some values to make stuff easier to see


            // Min and Maxheight are useful to let us offset negative dates and move it downwards because react-native-svg doesn't like using negative numbers, nor do I. 
            // This makes it easy for react-native-svg to start at 0 for y value
            let minHeight = res.data[0].y_date; // We can assume index 0 is the smallest because it is ordered by ascending
            let maxHeight = res.data[res.data.length-1].y_date; // We can assume index last is the biggest because it is ordered by ascending
            let viewBoxHeight = Math.abs(maxHeight-minHeight); // The size of the viewbox

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
            let dVal = [];
            for (let i = 0; i < startEndKeyPairs.length; i++) {
              let color = colors[i];
              if (startEndKeyPairs[i][0].includes('roman'))
                color = colors[2];
              else if (startEndKeyPairs[i][0].includes('greek'))
                color = colors[1];
              else if (startEndKeyPairs[i][0].includes('eastern'))
                color = colors[0];
              jsxArr.push(
                <Path
                  d={startEndKeyPairSVGValues[i][0].join("") + startEndKeyPairSVGValues[i][1].reverse().join("")}
                  stroke='none'
                  fill={color}
                  key={`timeline_${jsxArr.length}`}
                  style={{
                    opacity: '0.6'
                  }}/>
              );
              dVal.push();
            }

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

            // This interval was placed to FORCE javascript to wait for the previous axios call for timeline information to finish.
            // To be honest, I could put the interval outside of this axios call and wait for both backdrop and timeline-object information to be retrived.
            // I'm just too lazy to move the code around and hope that this is understandable.
            var interval = setInterval(function() {
              if (isLoadingInfo && coinLocations !== undefined && timelineInfo !== undefined) {
                clearInterval(interval); // Stop setInterval once the above is defined 

                if (Array.isArray(coinLocations)) {
                  coinTreeConnections.forEach((e) => {
                    jsxArr.push(
                      <Path
                        d={`M${e.x1} ${e.y1+Math.abs(minHeight)+yOffset} S${e.x1} ${e.y2+Math.abs(minHeight)+yOffset} ${e.x2} ${e.y2+Math.abs(minHeight)+yOffset}`}
                        key={e.key}
                        stroke='#173847'
                        fill='none'
                        strokeWidth={coinStrokeWidth*2}
                      />);
                  });

                  coinLocations.forEach((e) => {
                    jsxArr.push(<Circle key={'Coin_background'+jsxArr.length} cx={e.x} cy={e.y + Math.abs(minHeight)+yOffset} r={0.6 * coinSize / 2} fill='white' stroke='#173847' strokeWidth={coinStrokeWidth}/>);
                  });

                  // Last part is to take the previous axios call to timeline-objects and put that information on TOP of the backdrop. 
                  // This in react-native-svg are rendered in order of where they are pushed into the array jsxArr.
                  // All this information NEEDS to be on TOP.
                  timelineInfo.forEach((e) => {
                    switch(e.__component) {
                      case 'timeline-objects.coin':
                        // push the front coin image onto the jsxArr with onClick event that changes CoinInfo data and brings it visible
                        jsxArr.push(<Image
                          id={e._id}
                          key={`coin_image${jsxArr.length}`}
                          className='CoinImage'
                          x={e.x - coinSize / 2}
                          y={e.y + Math.abs(minHeight) + yOffset - coinSize / 2}
                          width={coinSize}
                          height={coinSize}
                          href={`${process.env.REACT_APP_strapiURL}${e.coin_image_front.url}`}
                          onClick={(e) => {
                            // This magic here is how CoinInfo gets defined and displayed
                            let dom = e.target;
                            var coinMetaData = timelineInfo.filter(obj => {
                              return obj._id === dom.id;
                            })[0];

                            UpdateAndShowCoinInfo(coinMetaData);
                          }}
                        />
                        );
                        break;
                      default:
                        console.error(`Error: Unrecognized timeline component '${e.zone[0].__component}'`);
                        break;
                    }
                  });

                }

                // Set the viewBox and put all elements in jsxArr into the render box. Order matters
                set_timelineBG(
                  <Svg 
                    height='100%' 
                    width='100%' 
                    viewBox={`0 0 100 ${viewBoxHeight}`}
                    style={{position: 'relative', top: '5em'}}>
                    {jsxArr}
                  </Svg>
                );
                set_isLoadingBG(false);
              }
            }, 200); 
          }
        });
    }
  });


  // Render page here
  //
  // if isLoading is true, render isLoading page
  // else render timeline
  if (isLoadingInfo || isLoadingBG) {
    return (
      <div id='Timeline'>
        {Navbar()}
        {LoadingPage()}
        {Footer()}
      </div>
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
      {timelineBG}
      {CoinInfo()}
      {Footer()}
    </div>
  );
}

export default Timeline;
