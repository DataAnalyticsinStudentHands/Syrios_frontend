import React, {useState, useEffect} from 'react';
import Svg, {
  Path,
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

  useEffect(() => {
    if (loading) {
      axios.get(process.env.REACT_APP_strapiURL + '/timelines?_limit=-1&_sort=y_date:ASC') // ordered query by ascending
        .then((res,error) => {
          if (error) {
            set_page(
              <div className='d-flex align-items-center justify-content-center' style={{paddingTop: '10%'}}>
                <p className='OrangeText text-center' style={{fontSize: '76px'}}>
                  Page failed to load. :(. Try refreshing.
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
               */

              let minHeight = res.data[0].y_date; // We can assume index 0 is the smallest because it is ordered by ascending
              let maxHeight = res.data[res.data.length-1].y_date; // We can assume index last is the biggest because it is ordered by ascending
              let startEndKeyPairSVGValues = JSON.parse(JSON.stringify(startEndKeyPairs));
              for (let i = 0; i < startEndKeyPairSVGValues.length; i++) {
                startEndKeyPairSVGValues[i][0] = '';
                startEndKeyPairSVGValues[i][1] = '';
              }

              res.data.forEach((e, index) => {
                for (let i = 0; i < startEndKeyPairs.length; i++) {
                  if (isNaN(e[startEndKeyPairSVGValues[i][0]]) || isNaN(e[startEndKeyPairSVGValues[i][1]])) {
                    continue;
                  }
                  startEndKeyPairSVGValues[i][0] = `C${e[startEndKeyPairs[i][0]]} ${e.y_date} `;
                  startEndKeyPairSVGValues[i][1] = `C${e[startEndKeyPairs[i][1]]} ${e.y_date} `;
                }
              });
              let viewBoxHeight = Math.abs(maxHeight-minHeight);
              set_page(
                <Svg height='100%' width='100%' viewBox={`0 0 100 ${viewBoxHeight}`}>
                  <Path
                    d={startEndKeyPairs[0][0]}
                    fill='red'
                    stroke='red'
                  />
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
          {page}
          {Footer()}
        </div>
      );
}

export default Timeline;
