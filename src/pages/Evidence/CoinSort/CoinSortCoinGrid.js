import React, { useEffect, useState } from 'react';
import qs from 'qs';
import axios from 'axios';

import CoinInfo, { CoinAlt } from 'src/components/coin/CoinInfo.js';

export const CoinScaleAndFlip = (props) => {
  const [coin_rotation, set_coin_rotation] = useState('rotateY(0deg)');
  const [img_height, set_img_height] = useState('100%');
  const [dotted_circle_height, set_dotted_circle_height] = useState('0%');
  const [is_img_scaled, set_is_img_scaled] = useState(false);
  const [size_diameter_jsx, set_size_diameter_jsx] = useState('0');

  const [show_coin_info, set_show_coin_info] = useState(false);
  const CoinInfoPopupCloseHandler = (e) => { // This is used to show / remove popup on certain conditions
    set_show_coin_info(e);
  };


  const ResetCoin = () => {
    set_coin_rotation('rotateY(0deg)');
    set_img_height('100%');
    set_dotted_circle_height('0%');
    set_is_img_scaled(false);
  };

  useEffect(() => {
    ResetCoin();
  }, [props.coinMetaData]);

  useEffect(() => {
    if (is_img_scaled)
      set_size_diameter_jsx('.8em');
    else
      set_size_diameter_jsx('0');
  }, [is_img_scaled, props.coinMetaData.diameter]);

  const ScaleCoin = () => {
    if (is_img_scaled) {
      set_dotted_circle_height('0%');
      set_img_height('100%');
    } else {
      set_dotted_circle_height('80%');

      // I did some tricky math to get these numbers. 
      // jk it's just proportionalities with the dotted circle's height and the 
      // fact that the dotted circle is 50mm
      const box_percent = 100;
      const box_height_mm = 62.5;
      let height_of_coin_percent = (box_percent / box_height_mm) * props.coinMetaData.diameter;

      if (height_of_coin_percent == null || height_of_coin_percent === 0) {
        height_of_coin_percent = 5;
      }

      set_img_height(`${height_of_coin_percent}%`);
    }

    set_is_img_scaled(!is_img_scaled);
  };

  const RotateCoin = () => {
    if (coin_rotation.includes('(0deg)')) {
      set_coin_rotation('rotateY(180deg)');
    } else {
      set_coin_rotation('rotateY(0deg)');
    }
  };

  useEffect(() => {
    if (props.rotate) {
      set_coin_rotation('rotateY(180deg)');
    } else {
      set_coin_rotation('rotateY(0deg)');
    }
  }, [props.rotate]);

  useEffect(() => {
    if ((props.scale && !is_img_scaled) || (!props.scale && is_img_scaled)) {
      ScaleCoin();
    }
  }, [props.scale]);

  if (props.coinMetaData.obverse_file.data == null || props.coinMetaData.reverse_file.data == null)
    return (
      <div className='coin-image-box'>
        <div className='coin-info-no-image coin-info-dark-text'>
          No image
        </div>
      </div>
    );

  return (
    <div id={props.id} className={props.className}>
      <div className='coin-image-box coin-sort-grid-cell-image-box'>
        <div className='coin-info-dotted-circle' style={{height: dotted_circle_height}}/>
        <div className='coin-info-image-diameter-box coin-info-dark-text' style={{fontSize: size_diameter_jsx}}>
          {props.coinMetaData.diameter == null ? 'N/A' : `${props.coinMetaData.diameter}mm`}
        </div>
        <div className='flip-box coin-sort-grid-cell-flip-box' onClick={() => {set_show_coin_info(true)}}>
          <div className='flip-box-inner' style={{ transform: coin_rotation }}>
            <div className='flip-box-front'>
              <img
                alt={CoinAlt(props.coinMetaData.obverse_file.data.attributes)}
                className='coin-info-image-flip coin-info-image-flip-front'
                src={process.env.REACT_APP_strapiURL + props.coinMetaData.obverse_file.data.attributes.url}
                height={img_height}
              />
            </div>
            <div className='flip-box-back'>
              <img
                alt={CoinAlt(props.coinMetaData.obverse_file.data.attributes)}
                className='coin-info-image-flip coin-info-image-flip-back'
                src={process.env.REACT_APP_strapiURL + props.coinMetaData.reverse_file.data.attributes.url}
                height={img_height}
              />
            </div>
          </div>
        </div>
        {/*** Scale and Rotate button. MUST be rendered after coin image ***/}
        <div className='coin-sort-grid-cell-icons-div'>
          <i
            className='demo-icon coin-info-icon-rotate'
            onClick={RotateCoin}>
            &#xe833;
          </i>   
          <i
            className='demo-icon coin-info-scale-icon'
            onClick={ScaleCoin}>
            &#xe834;
          </i>
        </div>
        <CoinInfo onClose={CoinInfoPopupCloseHandler} show={show_coin_info} coinMetaData={props.coinMetaData} />
      </div>
    </div>
  );
}

const DropBox = (props) => {
  const [on_drag_style, set_on_drag_style] = useState(undefined);
  return (
    <div 
      className='coin-sort-drag-coin-box' 
      style={on_drag_style}
    >
      <p className='coin-sort-drag-coin-box-text'>
        DRAG COIN HERE
      </p>
      <div className='coin-sort-drag-coin-box-hover-element'
        onDrop={() => {
          console.log('end');
        }}
        onDragEnter={() => {
          props.onDragEnter();
          set_on_drag_style({
            backgroundColor: 'rgba(119, 153, 168, 0.74)',
            color: 'white',
          });
        }}
        onDragLeave={() => {
          set_on_drag_style({});
        }}
      />
    </div>
  );
}

// This will have 6 different layout options
// 1 x 1
// 2 x 1
// 3 x 1
// 2 x 2
// 3 x 2
// 6 x 3
export const CoinGrid = (props) => {
  const [coin_ids, set_coin_ids] = useState([]);
  const AddCoin = () => {
    if (props.coinToAdd != null && !coin_ids.includes(props.coinToAdd)) 
      set_coin_ids([...coin_ids, props.coinToAdd]);
  };

  const [coins, set_coins] = useState([]);

  useEffect(() => {
    props.showScaleAndRotate(coin_ids.length !== 0);
  }, [props, coin_ids]);

  useEffect(() => {
    if (coin_ids.length !== 0) {
      axios.get(process.env.REACT_APP_strapiURL + `/api/coins?${qs.stringify({
        filters: {
          id: {
            $in: coin_ids,
          }
        }
      })}`).then((res, err) => {
        if (err) {
          console.error(err);
        } else {
          set_coins(res.data.data);
        }
      });
    }
  }, [coin_ids]);

  return (
    <div id='coin-sort-drag-coin-box-outer-div'>
      {(() => {
        if (coins.length === 0) {
          return (
            <div id='coin-sort-drag-box-full'>
              <DropBox onDragEnter={AddCoin}/>
            </div>
          );
        } else {
          const FetchCoinsJSXarr = (css_id) => { 
            let jsx = coins.map((coin, index) => (
              <CoinScaleAndFlip id={`${css_id}${index+1}`} className={`${css_id}styling`} key={index} coinMetaData={coin.attributes} rotate={props.rotateAll} scale={props.scaleAll}/>
            ));

            if (coins.length < 18) {
              jsx.push(
                <div id={`${css_id}${jsx.length+1}`} className={`${css_id}styling`} key={jsx.length+1}>
                  <div className='coin-sort-drag-box-in-coin-grid'>
                    <DropBox onDragEnter={AddCoin}/>
                  </div>
                </div>
            );
            }
            return jsx;
          }
          let jsx = undefined;
          switch (coins.length) {
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
            case 17:
            case 18:
              jsx = (   
                <div id='coin-sort-grid-6x3-arrangement'>
                  {FetchCoinsJSXarr('coin-sort-grid-6x3-cell-')}
                </div>
              );
              break;
            case 4:
            case 5:
              jsx = (
                <div id='coin-sort-grid-3x2-arrangement'>
                  {FetchCoinsJSXarr('coin-sort-grid-3x2-cell-')}
                </div>
              );
              break;
            case 3:
              jsx = (
                <div id='coin-sort-grid-2x2-arrangement'>
                  {FetchCoinsJSXarr('coin-sort-grid-2x2-cell-')}
                </div>
              );
              break;
            case 2:
              jsx = (
                <div id='coin-sort-grid-3x1-arrangement'>
                  {FetchCoinsJSXarr('coin-sort-grid-3x1-cell-')}
                </div>
              );
              break;
            case 1:
              jsx = (
                <div id='coin-sort-grid-2x1-arrangement'>
                  {FetchCoinsJSXarr('coin-sort-grid-2x1-cell-')}
                </div>
              );
              break;
            default:
              console.error('No', coins.length, 'grid arrangement.');
          }

          return (
            <div id='coin-sort-grid-arrangement-wrapper'>
              {jsx}
            </div>
          );
        }
      })()}
    </div>
  );
}
