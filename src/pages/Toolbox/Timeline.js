import React, {useState, useEffect} from 'react';
import Svg, {
  Path,
  Text,
  Line,
} from 'react-native-svg';
import axios from 'axios';

import Footer from 'src/components/Footer.js';
import Navbar from 'src/components/Navbar.js';
import LoadingPage from 'src/components/LoadingPage.js';
import 'src/components/constants.css';
import './Timeline.css';

const Timeline = () => {
  const [loading, set_loading] = useState(true);
  const [page, set_page] = useState(undefined);

  const colors = ['#7FA87F', '#F2D16B', '#B85828', '#486678', '#323029']

  useEffect(() => {
    if (loading) {
      axios.get(process.env.REACT_APP_strapiURL + '/timelines?_limit=-1&_sort=y_date:ASC') // ordered query by ascending
        .then((res,error) => {
          if (error) {
            set_page(
              <div className='d-flex align-items-center justify-content-center' style={{paddingTop: '10%'}}>
                <p className='OrangeText text-center' style={{fontSize: '76px'}}>
                  Page failed to load. Try refreshing.
                </p>
              </div>
                  );
              set_loading(false);
            } else {
              // We are parsing object keys to get start and end dates to match
              // The XXX part of start_XXX_x and end_XXX_x must match case insensitive
              let keys = Object.keys(res.data[0]);
              let startEndKeyPairs = [];
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
               */
              let curveStyle = 'S';
              let yOffset = 5; // This is to offset some values to make stuff easier to see


              let minHeight = res.data[0].y_date; // We can assume index 0 is the smallest because it is ordered by ascending
              let maxHeight = res.data[res.data.length-1].y_date; // We can assume index last is the biggest because it is ordered by ascending

              // Setup X and Y containers for render
              let startEndKeyPairSVGValues = JSON.parse(JSON.stringify(startEndKeyPairs));
              for (let i = 0; i < startEndKeyPairSVGValues.length; i++) {
                startEndKeyPairSVGValues[i][0] = [];
                startEndKeyPairSVGValues[i][1] = [];
              }

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
                startEndKeyPairSVGValues[i][0][2] = startEndKeyPairSVGValues[i][0][2].replace(curveStyle, 'L');
                startEndKeyPairSVGValues[i][0][3] = curveStyle+startEndKeyPairSVGValues[i][0][3];
                
                startEndKeyPairSVGValues[i][1][3] = 'L'+startEndKeyPairSVGValues[i][1][3];
              }

              // Push Pathing react-native-svg elements onto render array for react to load
              let jsxArr = [];
              let dVal = [];
              for (let i = 0; i < startEndKeyPairs.length; i++) {
                jsxArr.push(
                  <>
                    <Path
                      d={startEndKeyPairSVGValues[i][0].join("") + startEndKeyPairSVGValues[i][1].reverse().join("")}
                      stroke={colors[i]}
                      fill={colors[i]}
                      strokeWidth="0.01"
                      style={{
                        opacity: '0.6'
                      }}/>
                  </>
                );
                dVal.push();
              } // End of Timeline big background color filler mapper


              // Need to setup lines at every 50 years with text. Need each 50 year point
              let y_datesMod50 = [];
              res.data.forEach((e) => {
                if (e.y_date % 50 === 0) {
                  y_datesMod50.push(e.y_date);
                }
              });

              y_datesMod50.forEach((e) => { // build jsxArr for y_date lines at every 50 years
                jsxArr.push(
                  <>
                    {(() => {
                      // This is how we biuld the dotted line
                      let jsxLineArr = [];
                      for (let i = 0.5; i < 93; i++) {
                        for (let j = 0; j < 1; j += 0.5) {
                          jsxLineArr.push(
                            <Line
                              stroke='#282828'
                              strokeWidth='0.1'
                              x1={`${i+j}`}
                              x2={`${i+j+0.1}`}
                              y1={`${e+Math.abs(minHeight)+yOffset}`}
                              y2={`${e+Math.abs(minHeight)+yOffset}`}
                            />
                          );
                        }
                      }

                      return jsxLineArr;
                    })()}
                    <Text
                      x='98%'
                      textAnchor='end'
                      fontWeight='thin'
                      y={`${e+Math.abs(minHeight)+yOffset+0.4}`}
                      className='GrayText'
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
                    <Line
                      stroke='#282828'
                      strokeWidth='0.1'
                      x1='100%'
                      x2='98.5%'
                      y1={`${e+Math.abs(minHeight)+yOffset}`}
                      y2={`${e+Math.abs(minHeight)+yOffset}`}
                    />
                  </>
                );
              });


              let viewBoxHeight = Math.abs(maxHeight-minHeight);
              set_page(
                <Svg 
                  height='100%' 
                  width='100%' 
                  viewBox={`0 0 100 ${viewBoxHeight}`}
                  style={{position: 'relative', top: '5em'}}>
                  {jsxArr}
                </Svg>
              );

              set_loading(false);
            }
        });
    }
  });


      // Render page here
      //
      // if loading is true, render loading page
      // else render timeline
      if (loading) {
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
              Scroll down to explore the history of Antioch, as told by its coins.
            </p>
          </div>
          {page}
          {Footer()}
        </div>
      );
}

export default Timeline;
