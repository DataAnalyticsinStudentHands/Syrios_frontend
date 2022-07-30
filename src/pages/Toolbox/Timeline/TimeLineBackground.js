import {
    Path,
    Text,
    Line,
    Rect,
  } from 'react-native-svg';
import { colors } from 'src/components/constants.js';

export function SetupTimelineBackground(obj) {
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
      if (e.y_date % 100 === 0) {
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
          x2={94}
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
          className='story-h3'
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