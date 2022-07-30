import  {
    Path,
    Rect,
    Image,
    Circle
  } from 'react-native-svg';
  import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export function LoadTimelineInfo(obj) {
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
  
          const renderTooltip = (props) => (
            <Tooltip className="event-tooltip" {...props}>
              {e.event.data.attributes.title}
            </Tooltip>
          );
  
          jsx_arr.push(
            <OverlayTrigger
            placement="right"
            delay={{ show: 0, hide: 200 }}
            overlay={renderTooltip}
            key={`event-${e.event.data.id}`}
          >
            <Rect
              id={e.event.data.id}
              className='event'
              x={e.x - size_of_event / 2}
              y={e.y + Math.abs(view_box_min_height) + y_offset - size_of_event / 2}
              width={size_of_event}
              height={size_of_event}
              fill={e.event.data.attributes.color}
              stroke='black'
              strokeWidth='0.1'
              onClick={update_event_info}/>
            </OverlayTrigger>
          );
          break;
        default:
          console.error(`Error: Unrecognized component '${e.__component}'`);
      }
    });
  
    return { jsx_arr, coin_info_arr, event_info_arr };
  }