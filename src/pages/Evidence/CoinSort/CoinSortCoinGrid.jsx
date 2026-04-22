/**
 * CoinSortCoinGrid.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders the CoinSort study grid and coin scale/flip interactions.
 *
 * Refactor Summary:
 * 1. Removed Legacy Coin Refetching
 *    - No longer fetches `/api/coins` directly
 *    - Uses adapted coin objects passed from `CoinSort.jsx`
 *
 * 2. Unified Coin Data Model
 *    - Grid and popup now consume the same adapted coin records as the pile
 *
 * 3. Preserved Existing Behavior
 *    - Drag/drop, layout options, scale/flip, and popup behavior remain unchanged
 *
 * Notes:
 * - `props.coinLookup` is a Map of adapted coin records keyed by coin ID
 * - CoinInfo still receives a legacy-compatible `coinMetaData` shape
 *
 * Future Improvements:
 * - Convert CoinInfo to consume a flatter coin model directly
 * - Reduce repeated local animation state logic if reused elsewhere
 */

import React, { useEffect, useMemo, useState } from 'react';
import CoinInfo, { CoinAlt } from 'src/components/coin/CoinInfo';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

export const CoinScaleAndFlip = (props) => {
  const [coin_rotation, set_coin_rotation] = useState('rotateY(0deg)');
  const [img_height, set_img_height] = useState('100%');
  const [dotted_circle_height, set_dotted_circle_height] = useState('0%');
  const [is_img_scaled, set_is_img_scaled] = useState(false);
  const [size_diameter_jsx, set_size_diameter_jsx] = useState('0');
  const [show_coin_info, set_show_coin_info] = useState(false);

  const CoinInfoPopupCloseHandler = (e) => {
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
    if (is_img_scaled) {
      set_size_diameter_jsx('.8em');
    } else {
      set_size_diameter_jsx('0');
    }
  }, [is_img_scaled, props.coinMetaData.diameter]);

  const ScaleCoin = () => {
    if (is_img_scaled) {
      set_dotted_circle_height('0%');
      set_img_height('100%');
    } else {
      set_dotted_circle_height('80%');

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
    if (props.scale && !is_img_scaled) {
      set_dotted_circle_height('80%');

      const box_percent = 100;
      const box_height_mm = 62.5;
      let height_of_coin_percent = (box_percent / box_height_mm) * props.coinMetaData.diameter;

      if (!height_of_coin_percent) {
        height_of_coin_percent = 5;
      }

      set_img_height(`${height_of_coin_percent}%`);
      set_is_img_scaled(true);
    }

    if (!props.scale && is_img_scaled) {
      set_dotted_circle_height('0%');
      set_img_height('100%');
      set_is_img_scaled(false);
    }
  }, [props.scale, props.coinMetaData.diameter, is_img_scaled]);

  const renderTooltipScale = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      scale to size
    </Tooltip>
  );

  const renderTooltipFlip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      flip the coin
    </Tooltip>
  );

  if (props.coinMetaData?.obverse_file?.data == null || props.coinMetaData?.reverse_file?.data == null) {
    return (
      <div className='coin-image-box'>
        <div className='coin-info-no-image coin-info-dark-text'>
          No image
        </div>
      </div>
    );
  }

  return (
    <div id={props.id} className={props.className}>
      <div className='coin-image-box coin-sort-grid-cell-image-box'>
        <div className='coin-info-dotted-circle' style={{ height: dotted_circle_height }} />
        <div className='coin-info-image-diameter-box coin-info-dark-text' style={{ fontSize: size_diameter_jsx }}>
          {props.coinMetaData.diameter == null ? 'N/A' : `${props.coinMetaData.diameter}mm`}
        </div>

        <div className='flip-box coin-sort-grid-cell-flip-box' onClick={() => { set_show_coin_info(true); }}>
          <div className='flip-box-inner' style={{ transform: coin_rotation }}>
            <div className='flip-box-front'>
              <img
                alt={CoinAlt(props.coinMetaData.obverse_file.data.attributes)}
                className='coin-info-image-flip coin-info-image-flip-front'
                src={STRAPI_URL + props.coinMetaData.obverse_file.data.attributes.url}
                height={img_height}
              />
            </div>

            <div className='flip-box-back'>
              <img
                alt={CoinAlt(props.coinMetaData.obverse_file.data.attributes)}
                className='coin-info-image-flip coin-info-image-flip-back'
                src={STRAPI_URL + props.coinMetaData.reverse_file.data.attributes.url}
                height={img_height}
              />
            </div>
          </div>
        </div>

        <div className='coin-sort-grid-cell-icons-div'>
          <i
            className='demo-icon icon-x-thin coin-info-icon-x'
            onClick={() => {
              props.removeCoin(props.coinId);
            }}
          >
            &#xe839;
          </i>

          <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltipFlip}
          >
            <i className='demo-icon coin-info-icon-rotate' onClick={RotateCoin}>
              &#xe833;
            </i>
          </OverlayTrigger>

          <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltipScale}
          >
            <i className='demo-icon coin-info-scale-icon' onClick={ScaleCoin}>
              &#xe834;
            </i>
          </OverlayTrigger>
        </div>

        <CoinInfo
          onClose={CoinInfoPopupCloseHandler}
          show={show_coin_info}
          coinMetaData={props.coinMetaData}
        />
      </div>
    </div>
  );
};

const DropBox = (props) => {
  const [on_drag_style, set_on_drag_style] = useState(undefined);

  return (
    <div className="coin-sort-drag-coin-box" style={on_drag_style}>
      <p className="coin-sort-drag-coin-box-text">DRAG COIN HERE</p>

      <div
        className="coin-sort-drag-coin-box-hover-element"
        onDragEnter={(e) => {
          e.preventDefault();
          set_on_drag_style({
            backgroundColor: 'rgba(119, 153, 168, 0.74)',
            color: 'white',
          });
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDragLeave={() => set_on_drag_style({})}
        onDrop={(e) => {
          e.preventDefault();
          set_on_drag_style({});
          props.onDrop?.();
        }}
      />
    </div>
  );
};

export const CoinGrid = (props) => {
  const [coin_ids, set_coin_ids] = useState([]);

  const AddCoin = () => {
    const nextId = props.coinToAdd != null ? String(props.coinToAdd) : null;
    if (nextId != null && !coin_ids.includes(nextId)) {
      set_coin_ids([...coin_ids, nextId]);
    }
  };

  const RemoveCoin = (coin_id) => {
    const targetId = String(coin_id);
    set_coin_ids((prev) => prev.filter((id) => id !== targetId));
  };

  const coins = useMemo(() => {
    return coin_ids
      .map((id) => props.coinLookup?.get(String(id)))
      .filter(Boolean);
  }, [coin_ids, props.coinLookup]);

  useEffect(() => {
    props.showScaleAndRotate(coin_ids.length !== 0);
  }, [props, coin_ids]);

  return (
    <div id='coin-sort-drag-coin-box-outer-div'>
      {(() => {
        if (coin_ids.length === 0) {
          return (
            <div id='coin-sort-drag-box-full'>
              <DropBox onDrop={AddCoin} />
            </div>
          );
        }

        const FetchCoinsJSXarr = (css_id) => {
          let jsx = coins.map((coin, index) => (
            <CoinScaleAndFlip
              id={`${css_id}${index + 1}`}
              className={`${css_id}styling`}
              key={coin.id}
              coinMetaData={coin.attributes}
              coinId={coin.id}
              rotate={props.rotateAll}
              scale={props.scaleAll}
              removeCoin={RemoveCoin}
            />
          ));

          if (coins.length < 18) {
            jsx.push(
              <div id={`${css_id}${jsx.length + 1}`} className={`${css_id}styling`} key={`drop-${jsx.length + 1}`}>
                <div className='coin-sort-drag-box-in-coin-grid'>
                  <DropBox onDrop={AddCoin} />
                </div>
              </div>
            );
          }

          return jsx;
        };

        const { length } = coins;
        let size = '';

        if (length === 1) size = '2x1';
        else if (length === 2) size = '3x1';
        else if (length === 3) size = '2x2';
        else if (length === 4 || length === 5) size = '3x2';
        else if (length < 19) size = '6x3';
        else console.error('No Coin arrangment with', length, 'coins');

        if (size === '') return null;

        return (
          <div id='coin-sort-grid-arrangement-wrapper'>
            <div id={`coin-sort-grid-${size}-arrangement`}>
              {FetchCoinsJSXarr(`coin-sort-grid-${size}-cell-`)}
            </div>
          </div>
        );
      })()}
    </div>
  );
};