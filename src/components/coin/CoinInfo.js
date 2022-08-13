import React, { useState, useEffect } from 'react';

import WhitePopUp from 'src/utils/WhitePopUp.js';

export function StringifyTypeCategory(type_category) {
  if (type_category?.length === 0)
    return;
  let stringified_list = `${type_category[0].type_category}`;
  for (let i = 1; i < type_category.length; i++) {
    stringified_list += `, ${type_category[i].type_category}`;
  }

  return stringified_list;
};

export function CoinIdIntoTitle(coin_id) {
  function ConvertToRoman(num) {
    var roman = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1
    };
    var str = '';

    for (var i of Object.keys(roman)) {
      var q = Math.floor(num / roman[i]);
      num -= q * roman[i];
      str += i.repeat(q);
    }

    return str;
  }

  let coin_title = Object.assign([], coin_id);

  let coin_title_length = coin_title.length;

  if (coin_title_length === 0) return coin_id;
  coin_title[0] = coin_title[0].toUpperCase();
  for (let i = 0; i < coin_title_length; i++) {
    if (coin_title[i] === '(') break; // For bibliography numbers shouldn't get romanized
    if (coin_title[i] === '_') {
      coin_title[i] = ' ';
      if (i < coin_title_length)
        coin_title[i + 1] = coin_title[i + 1].toUpperCase();
    } else if (!isNaN(coin_title[i])) {
      let num_of_digits = 1;
      let num_str = [];
      num_str.push(coin_title[i]);
      for (let j = i + 1; j < coin_title_length && !isNaN(coin_title[j]); j++) {
        num_of_digits++;
        num_str.push(coin_title[j]);
      }
      let roman_numeral = ConvertToRoman(parseInt(num_str));
      coin_title.splice(i, 1, roman_numeral);

      coin_title.splice(i, 0, ' ');
      coin_title_length = coin_title.length;
      i += num_of_digits;
    }
  }

  return coin_title.join("");
}

export function IfEmptyReturnNotApplicable(str) {
  return (str?.length === 0) ? "N/A" : str;
}

export function IfEmptyReturnNone(str) {
  return (str?.length === 0) ? "N/A" : str;
}

export function IfUrlHrefElseString(str) {
  function isUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  if (isUrl(str))
    return (
      <a className='coin-info-url' href={str}>{str}</a>
    );
  else 
    return (
      IfEmptyReturnNotApplicable(str)
    );
}

export function CoinAlt(coin) {
  return (coin.alternativeText == null || coin.alternativeText.length === 0) ? "coin_image" : coin.alternativeText;
}

const References = (props) => {
  if ((props.coinMetaData.ref1 == null || props.coinMetaData.ref1.length === 0) && 
    (props.coinMetaData.ref2 == null || props.coinMetaData.ref1.length === 0)) 
    return <div></div>;

  if (props.coinMetaData.ref1 == null || props.coinMetaData.ref1.length === 0)
    return (
      <div className='coin-info-ref-1'>
        <span className='coin-info-small-gray-text'>REFERENCE:<br /></span>
        <span className='coin-info-dark-text'>{IfUrlHrefElseString(props.coinMetaData.ref2)}</span>
      </div>
    );
  else if (props.coinMetaData.ref2 == null || props.coinMetaData.ref2.length === 0)
    return (
      <div className='coin-info-ref-1'>
        <span className='coin-info-small-gray-text'>REFERENCE:<br /></span>
        <span className='coin-info-dark-text'>{IfUrlHrefElseString(props.coinMetaData.ref1)}</span>
      </div>
    );
  else 
    return (
      <>
        <div className='coin-info-ref-1'>
          <span className='coin-info-small-gray-text'>REFERENCE:<br /></span>
          <span className='coin-info-dark-text'>{IfUrlHrefElseString(props.coinMetaData.ref1)}</span>
        </div>
        <div className='coin-info-ref-2'>
          <span className='coin-info-small-gray-text'>REFERENCE:<br /></span>
          <span className='coin-info-dark-text'>{IfUrlHrefElseString(props.coinMetaData.ref2)}</span>
        </div>
      </>
    );
}

function CoinScaleAndFlip(props) {
  const [coin_rotation, set_coin_rotation] = useState('rotateY(0deg)');
  const [img_height, set_img_height] = useState('100%');
  const [dotted_circle_height, set_dotted_circle_height] = useState('0%');
  const [is_img_scaled, set_is_img_scaled] = useState(false);
  const [size_diameter_jsx, set_size_diameter_jsx] = useState('0');

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
      set_size_diameter_jsx('1em');
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

  if (props.coinMetaData.obverse_file.data == null || props.coinMetaData.reverse_file.data == null)
    return (
      <div className='coin-image-box'>
        <div className='coin-info-no-image coin-info-dark-text'>
          No image
        </div>
      </div>
    );

  return (
    <div className='coin-image-box'>
      <div className='coin-info-dotted-circle' style={{height: dotted_circle_height}}/>
      <div className='coin-info-image-diameter-box coin-info-dark-text' style={{fontSize: size_diameter_jsx}}>
        DIAMETER: {props.coinMetaData.diameter == null ? 'N/A' : `${props.coinMetaData.diameter}mm`}
        </div>
        <div className='flip-box'>
          <div className='flip-box-inner' style={{ transform: coin_rotation }}>
          <div className='flip-box-front'>
            <img
              alt={CoinAlt(props.coinMetaData.obverse_file.data.attributes)}
              className='coin-info-image-flip coin-info-image-flip-front'
              src={process.env.REACT_APP_strapiURL + props.coinMetaData.obverse_file.data.attributes.url}
              // height={img_height}
              // width="100%"
            />
          </div>
          <div className='flip-box-back'>
            <img
              alt={CoinAlt(props.coinMetaData.obverse_file.data.attributes)}
              className='coin-info-image-flip coin-info-image-flip-back'
              src={process.env.REACT_APP_strapiURL + props.coinMetaData.reverse_file.data.attributes.url}
              // height={img_height}
              // width={img_height}
            />
          </div>
        </div>
      </div>
      {/*** Scale and Rotate button. MUST be rendered after coin image ***/}
      <div
        className='demo-icon coin-info-icon-rotate'
        onClick={RotateCoin}>
        &#xe833;
      </div>   
      <div
        className='demo-icon coin-info-scale-icon'
        onClick={ScaleCoin}>
      &#xe834;
      </div>
    </div>
  );
}


const CoinInfo = (props) => {
  props.coinMetaData.coin_title = CoinIdIntoTitle(props.coinMetaData.coin_id);
  const CloseHandler = (e) => { 
    props.onClose(false);
  };
 
  return (
    <WhitePopUp show={props.show} onClose={CloseHandler}>
      <div className='coin-info'>
        {/*** coin image ***/}
        <div className='coin-info-title text-center mb-5'>{props.coinMetaData.issuing_authority} {props.coinMetaData.mint} {props.coinMetaData.material}</div>
        <div className="coin-info-subtitle text-center my-3 mb-5">{props.coinMetaData.date_range}</div>

        <div className='coin-info-basic mb-3'>
          <div className='coin-info-basic-left'>
            <div className='coin-info-basic-text text-center mb-3'>OBVERSE TYPE:</div>
            <div className='coin-info-basic-content text-center mb-5'>{IfEmptyReturnNone(props.coinMetaData.obverse_type)}</div>
            <div className='coin-info-basic-text text-center mb-3'>OBVERSE LEGEND:</div>
            <div className='coin-info-basic-content text-center mb-5'>{IfEmptyReturnNone(props.coinMetaData.obverse_legend)}</div>
          </div>
          <div className='coin-info-basic-right'>
            <div className='coin-info-basic-text text-center mb-3'>REVERSE TYPE:</div>
            <div className='coin-info-basic-content text-center mb-5'>{IfEmptyReturnNone(props.coinMetaData.reverse_type)}</div>
            <div className='coin-info-basic-text text-center mb-3'>REVERSE LEGEND:</div>
            <div className='coin-info-basic-content text-center mb-5'>{IfEmptyReturnNone(props.coinMetaData.reverse_legend)}</div>
          </div>
        </div>
        <hr />
        <div className='coin-info-detail my-5'>
          <div className='coin-info-detail-left'>
            <div className='coin-info-image'>
              <CoinScaleAndFlip coinMetaData={props.coinMetaData} />
            </div>
          </div>
          <div className='coin-info-detail-right'>
            <div className='coin-info-detail-text text-left mb-5'>ANCIENT TERRITORY:<span style={{marginLeft:"0.5em"}} className='coin-info-detail-content'>{IfEmptyReturnNone(props.coinMetaData.ancient_territory)}</span></div>
            <div className='coin-info-detail-text text-left mb-5'>MODERN COUNTRY:<span style={{marginLeft:"0.5em"}} className='coin-info-detail-content'>{IfEmptyReturnNone(props.coinMetaData.modern_country)}</span></div>
            <div className='coin-info-detail-text text-left mb-5'>MINT:<span style={{marginLeft:"0.5em"}} className='coin-info-detail-content'>{IfEmptyReturnNone(props.coinMetaData.mint)}</span></div>
            <div className='coin-info-detail-text text-left mb-5'>MODERN NAME:<span style={{marginLeft:"0.5em"}} className='coin-info-detail-content'>{IfEmptyReturnNone(props.coinMetaData.mint_modern_name)}</span></div>
            <div className='coin-info-detail-text text-left mb-5'>GOVERNING POWER:<span style={{marginLeft:"0.5em"}} className='coin-info-detail-content'>{props.coinMetaData.governing_power.data?.attributes.governing_power ?? 'N/A'}</span></div>
            <div className='coin-info-detail-text text-left mb-5'>ISSUING AUTHORITY:<span style={{marginLeft:"0.5em"}} className='coin-info-detail-content'>{IfEmptyReturnNone(props.coinMetaData.issuing_authority)}</span></div>
            <div className='coin-info-detail-text text-left mb-5'>LANGUAGE:<span style={{marginLeft:"0.5em"}} className='coin-info-detail-content'>{IfEmptyReturnNone(props.coinMetaData.language)}</span></div>
            <div className='coin-info-detail-text text-left mb-5'>MATERIAL:<span style={{marginLeft:"0.5em"}} className='coin-info-detail-content'>{IfEmptyReturnNone(props.coinMetaData.material)}</span></div>
            <div className='coin-info-detail-text text-left mb-5'>DENOMINATION:<span style={{marginLeft:"0.5em"}} className='coin-info-detail-content'>{IfEmptyReturnNone(props.coinMetaData.denomination)}</span></div>
          </div>
        </div>

        <div className='coin-info-reference '>
          <div className='coin-info-reference-text  text-center'>SOURCE IMAGE: 
            <span style={{marginLeft:"0.25em"}} className='coin-info-reference-content'>
              {props.coinMetaData.source_image ?(<>
                <a href={props.coinMetaData.source_image} target="_blank" rel="noopener noreferrer">{props.coinMetaData.source_image} </a>
              </>) : (<></>)}
            </span>
          </div>
          <div className='coin-info-reference-text  text-center'>RIGHTS HOLDER: <span style={{marginLeft:"0.25em"}} className='coin-info-reference-content'>{IfUrlHrefElseString(props.coinMetaData.right_holder) ?? 'N/A'}</span></div>
          {props.coinMetaData.coin_id.split("(")[1]?.split(")")[0] ? (<div className='coin-info-reference-text text-center'>REFERENCE: 
            <span style={{marginLeft:"0.25em"}} className='coin-info-reference-content'>{props.coinMetaData.coin_id.split("(")[1]?.split(")")[0]}</span></div>):(<></>)}
        </div>
      </div>
    </WhitePopUp>
  );
}
export default CoinInfo;
