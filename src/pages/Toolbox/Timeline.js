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
import OldLogo from 'src/assets/OldLogo.png';
import OldLogoColorless from 'src/assets/OldLogoColorless.png';
import 'src/components/constants.css';
import './Timeline.css';
import 'src/components/coinFlip.css';

const Timeline = () => {
  const [isLoadingInfo, set_isLoadingInfo] = useState(true);
  const [isLoadingBG, set_isLoadingBG] = useState(true);
  const [timelineBG, set_timelineBG] = useState(undefined);
  const [timelineInfo, set_timelineInfo] = useState(undefined);
  const [coinLocations, set_coinLocations] = useState(undefined);
  const [timelineDescription, set_timelineDescription] = useState(undefined);

  const coinSize = 8; // Size of coins on timeline
  const coinStrokeWidth = .5; // Stroke width of coins on timeline

  const colors = ['#7FA87F', '#F2D16B', '#B85828', '#486678', '#323029']

  useEffect(() => {
    if (isLoadingInfo || isLoadingBG) {
      // Asynchronous logic is good, but complicated.
      axios.get(process.env.REACT_APP_strapiURL + '/timeline-info')
        .then((res, error) => {
          if (error) {
            set_timelineDescription('Error loading timeline-info');
            set_timelineInfo('Error');
            set_isLoadingInfo(false);
          } else {
            set_timelineDescription(res.data.timeline_description);
            let timelineObjectIds = [];
            let tmpCoinLocationArr = [];

            res.data.zone.forEach((e) => {
              if (e.coin_reference !== undefined) {
                // setup coin locations and timeline object meta data
                timelineObjectIds.push(e.coin_reference._id);
                tmpCoinLocationArr.push({x: e.coin_reference.x_pos, y: e.coin_reference.y_date});
              }
            });

            timelineObjectIds = [...new Set(timelineObjectIds)]; // Remove duplicates
            tmpCoinLocationArr = [...new Set(tmpCoinLocationArr)];
            set_coinLocations(tmpCoinLocationArr);
            timelineObjectIds = timelineObjectIds.map(i => '_id=' + i).join('&');

            axios.get(process.env.REACT_APP_strapiURL + `/timeline-objects?${timelineObjectIds}`)
              .then((res, error) => {
                if (error) {
                  set_timelineInfo('error');
                  set_isLoadingInfo(false);
                } else {
                  let tmpTimelineInfo = [];
                  // get timeline object meta data in a 'workable' state
                  res.data.forEach((e) => {
                    switch(e.zone[0].__component) {
                      case 'timeline-objects.coin':
                        tmpTimelineInfo.push({
                          __component: e.__component,
                          x: e.x_pos,
                          y: e.y_date,
                          ...e.zone[0]
                        });
                        break;
                      default:
                        console.error(`Error: Unrecognized timeline component '${e.zone[0].__component}'`);
                        break;
                    }
                  });

                  set_timelineInfo(tmpTimelineInfo);
                  set_isLoadingInfo(false);
                }
              });
          }
        });

      // Asynchronous logic is good, but complicated.
      axios.get(process.env.REACT_APP_strapiURL + '/timelines?_limit=-1&_sort=y_date:ASC') // ordered query by ascending
        .then((res,error) => {
          if (error) {
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


            let minHeight = res.data[0].y_date; // We can assume index 0 is the smallest because it is ordered by ascending
            let maxHeight = res.data[res.data.length-1].y_date; // We can assume index last is the biggest because it is ordered by ascending
            let viewBoxHeight = Math.abs(maxHeight-minHeight); // The size of the viewbox

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
              startEndKeyPairSVGValues[i][0][4] = curveStyle + startEndKeyPairSVGValues[i][0][4];

              startEndKeyPairSVGValues[i][1][3] = 'L'+startEndKeyPairSVGValues[i][1][3];
            }

            // Push Pathing react-native-svg elements onto render array for react to load
            let jsxArr = [];
            let dVal = [];
            for (let i = 0; i < startEndKeyPairs.length; i++) {
              jsxArr.push(
                <Path
                  d={startEndKeyPairSVGValues[i][0].join("") + startEndKeyPairSVGValues[i][1].reverse().join("")}
                  stroke='none'
                  fill={colors[i]}
                  onClick={() => {
                    // Just proof of concept. We can use this to force an overlay with timeline object information on the object
                    console.log('display timelineobject information');
                  }}
                  key={`timeline_${jsxArr.length}`}
                  style={{
                    opacity: '0.6'
                  }}/>
              );
              dVal.push();
            } 
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

            jsxArr.push(
              <Rect
                key='timeline_double_white'
                x='33'
                y={`${yOffset+200}`}
                width='33'
                height={viewBoxHeight}
                stroke='none'
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

            var interval = setInterval(function() {
              if (isLoadingInfo && coinLocations !== undefined && timelineInfo !== undefined) {
                clearInterval(interval);

                coinLocations.forEach((e) => {
                  jsxArr.push(<Circle key={'Coin_background'+jsxArr.length} cx={e.x} cy={e.y + Math.abs(minHeight)+yOffset} r={0.6 * coinSize / 2} fill='white' stroke='#173847' strokeWidth={coinStrokeWidth}/>);
                });

                timelineInfo.forEach((e) => {
                  switch(e.__component) {
                    case 'timeline-objects.coin':
                      // Get the front facing image up and out.
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
                          console.log(coinMetaData);

                          let CoinInfo = document.getElementById('CoinInfo');
                          let CoinInfoGrid = document.getElementById('CoinInfoGrid');
                          let CoinImageDiv = document.getElementById('CoinImageDiv')
                          let CoinMainInfo = document.getElementById('CoinMainInfo')
                          let CoinImageType = document.getElementById('CoinImageType')
                          let CoinSourceMaterial = document.getElementById('CoinSourceMaterial');

                          // Coin Image
                          document.getElementById('CoinImageFront').src = process.env.REACT_APP_strapiURL + coinMetaData.coin_image_front.url;
                          document.getElementById('CoinImageBack').src = process.env.REACT_APP_strapiURL + coinMetaData.coin_image_back.url;

                          // Coin main info
                          document.getElementById('CoinMainInfoTitle').childNodes[0].innerHTML = `<span class='DarkBlueText'>${coinMetaData.name}</span>`;
                          document.getElementById('CoinMainInfoRegion').childNodes[0].innerHTML = `REGION: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.region}</span>`;
                          document.getElementById('CoinMainInfoState').childNodes[0].innerHTML = `STATE: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.state}</span>`;
                          document.getElementById('CoinMainInfoMint').childNodes[0].innerHTML = `MINT: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.mint}</span>`;
                          document.getElementById('CoinMainInfoAuthority').childNodes[0].innerHTML = `AUTHORITY: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.authority}</span>`;
                          document.getElementById('CoinMainInfoEra').childNodes[0].innerHTML = `ERA: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.era}</span>`;
                          document.getElementById('CoinMainInfoDate').childNodes[0].innerHTML = `DATE(S): <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.date}</span>`;
                          document.getElementById('CoinMainInfoCatalogueDate').childNodes[0].innerHTML = `CATALOGE DATE: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.cataloge_date}</span>`;
                          document.getElementById('CoinMainInfoMaterial').childNodes[0].innerHTML = `MATERIAL: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.material}</span>`;
                          document.getElementById('CoinMainInfoDenomination').childNodes[0].innerHTML = `DENOMINATION: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.denomination}</span>`;
                          document.getElementById('CoinMainInfoDiameter').childNodes[0].innerHTML = `DIAMETER: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.diameter}</span>`;
                          document.getElementById('CoinMainInfoCulturalConnections').childNodes[0].innerHTML = `CULTURAL CONNECTIONS: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.cultural_connections}</span>`;

                          // Coin Image Type
                          document.getElementById('CoinImageTypeObverse').childNodes[1].innerHTML = coinMetaData.obverse_type;
                          document.getElementById('CoinImageTypeObverseLegend').childNodes[1].innerHTML = coinMetaData.obverse_legend;
                          document.getElementById('CoinImageTypeReverse').childNodes[1].innerHTML = coinMetaData.reverse_type;
                          document.getElementById('CoinImageTypeReverseLegend').childNodes[1].innerHTML = coinMetaData.reverse_legend;

                          // Coin Source Material
                          document.getElementById('CoinSourceMaterialSourceImage').childNodes[1].innerHTML = coinMetaData.source_image;
                          console.log(document.getElementById('CoinSourceMaterialRightsHolder').childNodes[1]);
                          document.getElementById('CoinSourceMaterialRightsHolder').childNodes[1].innerHTML = coinMetaData.rights_holder;
                          document.getElementById('CoinSourceMaterialBibliography').childNodes[1].innerHTML = coinMetaData.bibliography;

                          CoinInfo.style.zIndex = '100';
                          setTimeout(() => {CoinInfo.style.opacity = 1}, 200);
                        }}
                      />
                      );
                      break;
                    default:
                      console.error(`Error: Unrecognized timeline component '${e.zone[0].__component}'`);
                      break;
                  }
                });

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

      {/*** Coin info that shows up when you click on a coin ***/}
      <div id='CoinInfo'>
        <i 
          id='CoinInfo-x-icon' 
          className='demo-icon icon-x-medium'
          onClick={(e) => {
            let dom = e.target.parentElement;
            dom.style.opacity = 0;
            setTimeout(() => {dom.style.zIndex = -100}, 1000);
          }}>
        &#xe838;</i>
        <div id='CoinInfoGrid'>
          <div id='CoinImageDiv'>
            <i 
              id='CoinInfoRotateButton' 
              className='demo-icon icon-coin-rotate'
              onClick={(e)=> {
                let dom = e.target;

                while (dom.className !== 'flip-box') {
                  dom = dom.nextSibling;
                }

                dom = dom.childNodes[0];

                while (dom.className !== 'flip-box-inner') {
                  dom = dom.nextSibling;
                }

                if (dom.style.transform === 'rotateY(180deg)') {
                  dom.style.transform = 'rotateY(0deg)'
                } else {
                  dom.style.transform = 'rotateY(180deg)';
                }
              }}>
              &#xe833;</i> 
            <div className='flip-box'>
              <div className='flip-box-inner'>
                <div className='flip-box-front'>
                  <img
                    id='CoinImageFront'
                    src={OldLogo}
                    alt='Logo'
                  />
                </div>
                <div className='flip-box-back'>
                  <img
                    id='CoinImageBack'
                    src={OldLogoColorless}
                    alt='Colorless logo'
                  />
                </div>
              </div>
            </div>
          </div>
          <div id='CoinMainInfo'>
            <div id='CoinMainInfoTitle'>
              <ReactMarkdown className='DarkBlueText text-start'>
                Syrios project Logo
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoRegion'>
              <ReactMarkdown className='DarkBlueText text-start'>
                REGION: 
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoState'>
              <ReactMarkdown className='DarkBlueText text-start'>
                STATE: 
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoMint'>
              <ReactMarkdown className='DarkBlueText text-start'>
                MINT: 
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoAuthority'>
              <ReactMarkdown className='DarkBlueText text-start'>
                AUTHORITY: 
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoEra'>
              <ReactMarkdown className='DarkBlueText text-start'>
                ERA: 
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoDate'>
              <ReactMarkdown className='DarkBlueText text-start'>
                DATE(S): 
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoCatalogueDate'>
              <ReactMarkdown className='DarkBlueText text-start'>
                CATALOGE DATE: 
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoMaterial'>
              <ReactMarkdown className='DarkBlueText text-start'>
                MATERIAL: 
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoDenomination'>
              <ReactMarkdown className='DarkBlueText text-start'>
                DENOMINATION: 
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoDiameter'>
              <ReactMarkdown className='DarkBlueText text-start'>
                DIAMETER: 
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoCulturalConnections'>
              <ReactMarkdown className='DarkBlueText text-start'>
                CULTURAL CONNECTIONS: 
              </ReactMarkdown>
            </div>
          </div>
          <div id='CoinImageType'>
            <div id='CoinImageTypeObverse'>
              <p className='GrayText text-center'>
                OBVERSE TYPE:
              </p>
              <ReactMarkdown className='DarkBlueText TimelineInfoDynamicText CoinImageTypeDynamicText text-center'>
                front
              </ReactMarkdown>
            </div>
            <div id='CoinImageTypeObverseLegend'>
              <p className='GrayText text-center'>
                OBVERSE LEGEND:
              </p>
              <ReactMarkdown className='DarkBlueText TimelineInfoDynamicText CoinImageTypeDynamicText text-center'>
                none
              </ReactMarkdown>
            </div>
            <div id='CoinImageTypeReverse'>
              <p className='GrayText text-center'>
                REVERSE TYPE:
              </p>
              <ReactMarkdown className='DarkBlueText TimelineInfoDynamicText CoinImageTypeDynamicText text-center'>
                back
              </ReactMarkdown>
            </div>
            <div id='CoinImageTypeReverseLegend'>
              <p className='GrayText text-center'>
                REVERSE LEGEND:
              </p>
              <ReactMarkdown className='DarkBlueText TimelineInfoDynamicText CoinImageTypeDynamicText text-center'>
                none
              </ReactMarkdown>
            </div>
          </div>
          <div id='CoinSourceMaterial'>
            <div id='CoinSourceMaterialGrid'>
              <div id='CoinSourceMaterialSourceImage'>
                <p className='GrayText text-start'>
                  SOURCE IMAGE:
                </p>
                <ReactMarkdown className='DarkBlueText TimelineInfoDynamicText CoinSourceMaterialDynamicText text-start'>
                  N/A
                </ReactMarkdown>
              </div>
              <div id='CoinSourceMaterialRightsHolder'>
                <p className='GrayText text-start'>
                  RIGHTS HOLDER:
                </p>
                <ReactMarkdown className='DarkBlueText TimelineInfoDynamicText CoinSourceMaterialDynamicText text-start'>
                  N/A
                </ReactMarkdown>
              </div>
              <div id='CoinSourceMaterialBibliography'>
                <p className='GrayText text-start'>
                  BIBLIOGRAPHY:
                </p>
                <ReactMarkdown className='DarkBlueText TimelineInfoDynamicText CoinSourceMaterialDynamicText text-start'>
                  N/A
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
      {Footer()}
    </div>
  );
}

export default Timeline;
