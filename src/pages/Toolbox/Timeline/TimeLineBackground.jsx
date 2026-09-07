/**
 * TimeLineBackground.jsx — Vite Migration Refactor (2026)
 *
 * Changes:
 * - `.js` → `.jsx`
 * - removed `react-native-svg` imports in favor of native SVG tags
 * - removed `.js` extension from local import
 *
 * All logic preserved.
 */

import { colors } from 'src/pages/Toolbox/Timeline/constants';

export function SetupTimelineBackground(obj) {
  let res = obj.res.data;
  let y_offset = obj.y_offset;
  let jsx_arr = [];
  let view_box_min_height = 0;
  let view_box_total_height = 0;

  let keys = Object.keys(res.data[0].attributes);
  let start_end_key_pairs = [];

  keys.forEach((e) => {
    if (e.toLowerCase().includes('end') || e.toLowerCase().includes('start')) {
      let identifier = e.substring(e.indexOf('_') + 1, e.lastIndexOf('_')).toLowerCase();
      let pushed = false;

      start_end_key_pairs.forEach((ee) => {
        ee.forEach((eee) => {
          if (eee.toLowerCase().includes(identifier)) {
            ee.push(e);
            pushed = true;
          }
        });
      });

      if (!pushed) {
        start_end_key_pairs.push([e]);
      }
    }
  });

  let curve_style = 'Q';

  let min_height = res.data[0].attributes.y_date;
  let max_height = res.data[res.data.length - 1].attributes.y_date;
  let view_box_height = Math.abs(min_height - max_height);
  view_box_min_height = min_height;
  view_box_total_height = view_box_height;

  let start_end_key_pair_svg_values = JSON.parse(JSON.stringify(start_end_key_pairs));
  for (let i = 0; i < start_end_key_pair_svg_values.length; i++) {
    start_end_key_pair_svg_values[i][0] = [];
    start_end_key_pair_svg_values[i][1] = [];
  }

  res.data.forEach((e) => {
    e = e.attributes;
    for (let i = 0; i < start_end_key_pairs.length; i++) {
      if (
        e[start_end_key_pairs[i][0]] === null ||
        e[start_end_key_pairs[i][1]] === null ||
        isNaN(e[start_end_key_pairs[i][0]]) ||
        isNaN(e[start_end_key_pairs[i][1]])
      ) {
        continue;
      }

      if (
        start_end_key_pair_svg_values[i][0] === undefined ||
        start_end_key_pair_svg_values[i][0].length === 0
      ) {
        start_end_key_pair_svg_values[i][0].push(
          `M${e[start_end_key_pairs[i][0]]} ${e.y_date + Math.abs(min_height) + y_offset} `
        );
        start_end_key_pair_svg_values[i][1].push(
          `${e[start_end_key_pairs[i][1]]} ${e.y_date + Math.abs(min_height) + y_offset} `
        );
      } else if (start_end_key_pair_svg_values[i][0].length === 1) {
        start_end_key_pair_svg_values[i][0].push(
          `${curve_style}${e[start_end_key_pairs[i][0]]} ${e.y_date + Math.abs(min_height) + y_offset} `
        );
        start_end_key_pair_svg_values[i][1].push(
          `${curve_style}${e[start_end_key_pairs[i][1]]} ${e.y_date + Math.abs(min_height) + y_offset} `
        );
      } else {
        start_end_key_pair_svg_values[i][0].push(
          `${e[start_end_key_pairs[i][0]]} ${e.y_date + Math.abs(min_height) + y_offset} `
        );
        start_end_key_pair_svg_values[i][1].push(
          `${e[start_end_key_pairs[i][1]]} ${e.y_date + Math.abs(min_height) + y_offset} `
        );
      }
    }
  });

  for (let i = 0; i < start_end_key_pair_svg_values.length; i++) {
    if (
      parseInt(
        start_end_key_pair_svg_values[i][0][0].substring(
          start_end_key_pair_svg_values[i][0][0].indexOf(' ')
        )
      ) +
        min_height -
        6 >
      min_height
    ) {
      continue;
    }
    start_end_key_pair_svg_values[i][0][1] = start_end_key_pair_svg_values[i][0][1].replace(
      curve_style,
      'L'
    );
    start_end_key_pair_svg_values[i][0][4] =
      curve_style + start_end_key_pair_svg_values[i][0][4];

    start_end_key_pair_svg_values[i][1][3] =
      'L' + start_end_key_pair_svg_values[i][1][3];
  }

  for (let i = 0; i < start_end_key_pairs.length; i++) {
    jsx_arr.push(
      <path
        d={
          start_end_key_pair_svg_values[i][0].join('') +
          start_end_key_pair_svg_values[i][1].reverse().join('')
        }
        stroke="none"
        fill={colors(start_end_key_pairs[i][0])}
        key={`timeline_${jsx_arr.length}`}
        style={{
          opacity: '0.6',
        }}
      />
    );
  }

  jsx_arr.push(
    <rect
      key="timeline_white"
      x="33"
      y={`${y_offset}`}
      width="33"
      height={view_box_height}
      stroke="none"
      fill="rgba(255,255,255,0.3)"
    />
  );

  jsx_arr.push(
    <rect
      key="timeline_double_white"
      x="33"
      y={`${y_offset + 150}`}
      width="33"
      height={view_box_height}
      stroke="black"
      strokeWidth="0.06"
      fill="rgba(255,255,255,0.3)"
    />
  );

  let y_dates_mod_50 = [];
  res.data.forEach((e) => {
    e = e.attributes;
    if (e.y_date % 50 === 0) {
      y_dates_mod_50.push(e.y_date);
    }
  });

  y_dates_mod_50.forEach((e) => {
    jsx_arr.push(
      <line
        key={`dottedLine_${jsx_arr.length}`}
        stroke="black"
        strokeDasharray="0.1, 0.2"
        strokeWidth="0.1"
        x1={0}
        x2={94}
        y1={e + Math.abs(min_height) + y_offset}
        y2={e + Math.abs(min_height) + y_offset}
      />
    );

    jsx_arr.push(
      <text
        id={
          e < 0 ? `${Math.abs(e)}BCE` : `${Math.abs(e)}CE`
        }
        x="98%"
        textAnchor="end"
        fontWeight="thin"
        y={`${e + Math.abs(min_height) + y_offset + 0.4}`}
        className="story-h3"
        key={`text_${jsx_arr.length}`}
        style={{ fontSize: '1px' }}
      >
        {e < 0 ? `${Math.abs(e)} BCE` : `${Math.abs(e)} CE`}
      </text>
    );

    jsx_arr.push(
      <line
        stroke="#282828"
        strokeWidth="0.1"
        key={`dash_${jsx_arr.length}`}
        x1="100%"
        x2="98.5%"
        y1={`${e + Math.abs(min_height) + y_offset}`}
        y2={`${e + Math.abs(min_height) + y_offset}`}
      />
    );
  });

  return { jsx_arr, view_box_min_height, view_box_total_height };
}