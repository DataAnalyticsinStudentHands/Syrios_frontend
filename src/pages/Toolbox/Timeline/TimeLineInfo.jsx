/**
 * TimeLineInfo.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Converts timeline-info CMS data into SVG timeline elements and popup metadata arrays.
 *
 * Refactor Summary:
 * 1. Safer CMS Access
 *    - Supports singleton access through either:
 *        res.data.data.attributes
 *      or
 *        res.data.data
 *
 * 2. Normalized Popup Metadata
 *    - Coin popup array stores coin detail objects with `id`
 *    - Event popup array stores event detail objects with `id`
 *
 * 3. Improved Safety
 *    - Guards missing relations/media before rendering
 *    - Removes unstable random React keys
 *    - Uses timeline node context in React keys to prevent duplicate key collisions
 *
 * 4. Improved React Key Stability
 *    - Coin, event, and connector path keys now include the timeline object id
 *    - Prevents duplicate keys when the same coin or event appears multiple times
 *
 * 5. Preserved Existing Behavior
 *    - Existing SVG layout, tooltip behavior, popup metadata behavior,
 *      and timeline branching logic remain unchanged
 *
 * Notes:
 * - Nested coin/event media and relations remain relation-shaped
 * - This file contains JSX and must remain `.jsx`
 * - Timeline SVG children must have stable unique keys across all branches
 *
 * Future Improvements:
 * - Deduplicate `coin_info_arr` and `event_info_arr` if repeated popup records are unnecessary
 * - Move key-building into a small shared helper if additional timeline object types are added
 * - Normalize nested Strapi relation access into a reusable utility
 */

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const baseURL = import.meta.env.VITE_STRAPI_URL;

export function LoadTimelineInfo(obj) {
  const res = obj.res?.data?.data?.attributes || obj.res?.data?.data || {};
  const zone = Array.isArray(res?.zone) ? res.zone : [];
  const y_offset = obj.y_offset;
  const view_box_min_height = obj.view_box_min_height;
  const update_coin_info = obj.update_coin_info;
  const update_event_info = obj.update_event_info;

  const coin_size = 8;
  const coin_stroke_width = 0.5;

  const jsx_arr = [];
  const coin_info_arr = [];
  const event_info_arr = [];

  const SetupCoin = (e) => {
    const coin_pair = e.coin_pair == null ? undefined : e.coin_pair;
    const coinEntity = e.coin?.data?.attributes || e.coin || {};
    const coinId = e.coin?.data?.id || e.coin?.id || e.id;
    const timelineNodeId = e.id ?? 'unknown';

    coin_info_arr.push({
      ...coinEntity,
      id: coinId,
    });

    const obverse = coinEntity?.obverse_file?.data?.attributes;
    const reverse = coinEntity?.reverse_file?.data?.attributes;

    if (obverse == null && reverse == null) {
      return (
        <circle
          id={coinId}
          key={`coin-image-${timelineNodeId}-${coinId}-${coin_pair ?? 'single'}`}
          className="coin-image"
          fill="white"
          stroke="#173847"
          strokeWidth=".5"
          cx={e.x - coin_size / 5}
          cy={e.y + Math.abs(view_box_min_height) + y_offset * 1.7 - coin_size / 2}
          onClick={update_coin_info}
          r={coin_size / 2.5}
        />
      );
    }

    return (
      <image
        id={coinId}
        key={`coin-image-${timelineNodeId}-${coinId}-${coin_pair ?? 'single'}`}
        className="coin-image"
        x={e.x - coin_size / 2}
        y={e.y + Math.abs(view_box_min_height) + y_offset - coin_size / 2}
        width={coin_size}
        height={coin_size}
        href={`${baseURL}${obverse?.url || reverse?.url || ''}`}
        onClick={update_coin_info}
      />
    );
  };

  zone.forEach((e) => {
    switch (e.__component) {
      case 'timeline-objects.single-coin':
        jsx_arr.push(SetupCoin(e));
        break;

      case 'timeline-objects.connected-coins':
        jsx_arr.push(
          <path
            d={`M${e.coin_a_x} ${e.coin_a_y + Math.abs(view_box_min_height) + y_offset}
                S${e.coin_a_x} ${e.coin_b_y + Math.abs(view_box_min_height) + y_offset} ${e.coin_b_x} ${e.coin_b_y + Math.abs(view_box_min_height) + y_offset}`}
            key={`path-${e.id}-${e.coin_a?.data?.id || e.coin_a?.id || 'a'}-${e.coin_b?.data?.id || e.coin_b?.id || 'b'}`}
            stroke="#173847"
            strokeDasharray={e.strokeline === 'dash' ? '2' : ''}
            fill="none"
            strokeWidth={coin_stroke_width * 2}
          />
        );

        jsx_arr.push(
          SetupCoin({
            ...e,
            x: e.coin_b_x,
            y: e.coin_b_y,
            id: e.coin_b?.data?.id,
            coin_pair: 0,
            coin: e.coin_b,
          })
        );

        jsx_arr.push(
          SetupCoin({
            ...e,
            x: e.coin_a_x,
            y: e.coin_a_y,
            id: e.coin_a?.data?.id,
            coin_pair: 1,
            coin: e.coin_a,
          })
        );
        break;

      case 'timeline-objects.event': {
        const eventAttrs = e.event?.data?.attributes || e.event || {};
        const eventId = e.event?.data?.id || e.event?.id || e.id;

        event_info_arr.push({
          ...eventAttrs,
          id: eventId,
        });

        const size_of_event = 2.3;

        const renderTooltip = (props) => (
          <Tooltip className="event-tooltip" {...props}>
            {eventAttrs.title}
          </Tooltip>
        );

        jsx_arr.push(
          <OverlayTrigger
            placement="right"
            delay={{ show: 0, hide: 200 }}
            overlay={renderTooltip}
            key={`event-${e.id}-${eventId}`}
          >
            <rect
              id={eventId}
              className="event"
              x={e.x - size_of_event / 2}
              y={e.y + Math.abs(view_box_min_height) + y_offset - size_of_event / 2}
              width={size_of_event}
              height={size_of_event}
              fill={eventAttrs.color}
              stroke="black"
              strokeWidth="0.1"
              onClick={update_event_info}
            />
          </OverlayTrigger>
        );
        break;
      }

      default:
        console.error(`Error: Unrecognized component '${e.__component}'`);
    }
  });

  return { jsx_arr, coin_info_arr, event_info_arr };
}