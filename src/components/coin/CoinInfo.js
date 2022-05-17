import React, { useState, useEffect } from 'react';

import WhitePopUp from 'src/utils/WhitePopUp.js';

import './CoinInfo.css';
import './CoinFlip.css';

export function StringifyTypeCategory(type_category) {
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
    if (coin_title[i] === '_') {
      coin_title[i] = ' ';
      if (i < coin_title_length)
        coin_title[i + 1] = coin_title[i + 1].toUpperCase();
    } else if (!isNaN(coin_title[i])) {
      let num_of_digits = 1;
      let num_str = coin_title[i];
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
  return (str == null || str.length === 0) ? "N/A" : str;
}

export function IfEmptyReturnNone(str) {
  return (str == null || str.length === 0) ? "None" : str;
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
        <span className='gray-text coin-info-small-gray-text'>REFERENCE:<br /></span>
        <span className='dark-blue-text'>{IfUrlHrefElseString(props.coinMetaData.ref2)}</span>
      </div>
    );
  else if (props.coinMetaData.ref2 == null || props.coinMetaData.ref2.length === 0)
    return (
      <div className='coin-info-ref-1'>
        <span className='gray-text coin-info-small-gray-text'>REFERENCE:<br /></span>
        <span className='dark-blue-text'>{IfUrlHrefElseString(props.coinMetaData.ref1)}</span>
      </div>
    );
  else 
    return (
      <>
        <div className='coin-info-ref-1'>
          <span className='gray-text coin-info-small-gray-text'>REFERENCE:<br /></span>
          <span className='dark-blue-text'>{IfUrlHrefElseString(props.coinMetaData.ref1)}</span>
        </div>
        <div className='coin-info-ref-2'>
          <span className='gray-text coin-info-small-gray-text'>REFERENCE:<br /></span>
          <span className='dark-blue-text'>{IfUrlHrefElseString(props.coinMetaData.ref2)}</span>
        </div>
      </>
    );
}

export function CoinScaleAndFlip(props) {
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
        <div className='coin-info-no-image dark-blue-text'>
          No image
        </div>
      </div>
    );

  return (
    <div className='coin-image-box'>
      <div className='coin-info-dotted-circle' style={{height: dotted_circle_height}}/>
      <div className='coin-info-image-diameter-box dark-blue-text' style={{fontSize: size_diameter_jsx}}>
        DIAMETER: {props.coinMetaData.diameter == null ? 'N/A' : `${props.coinMetaData.diameter}mm`}
        </div>
        <div className='flip-box'>
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
  );
}


const CoinInfo = (props) => {
  /*** Coin info that shows up when you click on a coin.
      The premise behind it is to have interactable code anywhere with getDocumentById to change the innerHTML portion of the code.
      Once the content has been changed to whatever is desired, change the z-index and opacity to lift it from the shadows

      Lastly, this uses CSS grid to position elements in a formative way ***/
  props.coinMetaData.coin_title = CoinIdIntoTitle(props.coinMetaData.coin_id);

  const CloseHandler = (e) => { 
    props.onClose(false);
  };
  
  return (
    <WhitePopUp show={props.show} onClose={CloseHandler}>
      <div className='coin-info'>
        {/*** coin image ***/}
        <div className='coin-info-image'>
          <CoinScaleAndFlip coinMetaData={props.coinMetaData} />
        </div>
        {/*** coin details ***/}
        <div className='coin-info-details-background'>
          <div className='coin-info-details'>
            <div className='coin-info-title dark-blue-text'>
              <span style={{ fontSize: '1.5em' }}>{`${props.coinMetaData.coin_title}`}</span>
            </div>
            {/* column 1 of coin details */}
            <div className='coin-info-ancient-territory'>
              <span className='gray-text coin-info-small-gray-text'>ANCIENT TERRITORY: </span><span className='dark-blue-text'>{props.coinMetaData.ancient_territory}</span>
            </div>
            <div className='coin-info-modern-country'>
              <span className='gray-text coin-info-small-gray-text'>MODERN COUNTRY: </span><span className='dark-blue-text'>{props.coinMetaData.modern_country}</span>
            </div>
            <div className='coin-info-issuing-authority'>
              <span className='gray-text coin-info-small-gray-text'>ISSUING AUTHORITY: </span><span className='dark-blue-text'>{props.coinMetaData.issuing_authority}</span>
            </div>
            <div className='coin-info-governing-power'>
              <span className='gray-text coin-info-small-gray-text'>GOVERNING POWER: </span><span className='dark-blue-text'>{props.coinMetaData.governing_power}</span>
            </div>
            <div className='coin-info-language'>
              <span className='gray-text coin-info-small-gray-text'>LANGUAGE: </span><span className='dark-blue-text'>{props.coinMetaData.language}</span>
            </div>
            {/* column 2 of coin details */}
            <div className='coin-info-mint'>
              <span className='gray-text coin-info-small-gray-text'>MINT: </span><span className='dark-blue-text'>{props.coinMetaData.mint}</span>
            </div>
            <div className='coin-info-mint-modern-name'>
              <span className='gray-text coin-info-small-gray-text'>MINT MODERN NAME: </span><span className='dark-blue-text'>{props.coinMetaData.mint_modern_name}</span>
            </div>
            <div className='coin-info-material'>
              <span className='gray-text coin-info-small-gray-text'>MATERIAL: </span><span className='dark-blue-text'>{props.coinMetaData.material}</span>
            </div>
            <div className='coin-info-denomination'>
              <span className='gray-text coin-info-small-gray-text'>DENOMINATION: </span><span className='dark-blue-text'>{props.coinMetaData.denomination}</span>
            </div>
            <div className='coin-info-diameter'>
              <span className='gray-text coin-info-small-gray-text'>DIAMETER: </span><span className='dark-blue-text'>{props.coinMetaData.diameter == null ? "N/A" : `${props.coinMetaData.diameter}mm`}</span>
            </div>
            {/* column 3 of coin details */}
            <div className='coin-info-date-range'>
              <span className='gray-text coin-info-small-gray-text'>DATE RANGE: </span><span className='dark-blue-text'>{props.coinMetaData.date_range}</span>
            </div>
            <div className='coin-info-latitude'>
              <span className='gray-text coin-info-small-gray-text'>LATITUDE: </span><span className='dark-blue-text'>{props.coinMetaData.latitude}</span>
            </div>
            <div className='coin-info-longitude'>
              <span className='gray-text coin-info-small-gray-text'>LONGITUDE: </span><span className='dark-blue-text'>{props.coinMetaData.longitude}</span>
            </div>
            <div className='coin-info-categories'>
              <span className='gray-text coin-info-small-gray-text'>CATEGORIES: </span><span className='dark-blue-text'>{StringifyTypeCategory(props.coinMetaData.type_category)}</span>
            </div>
          </div>
        </div>
        {/*** Obverse / Reverse data ***/}
        <div className='coin-info-types'>
          <div className='coin-info-obverse-type text-center'>
            <span className='gray-text coin-info-small-gray-text'>OBVERSE TYPE:<br /></span>
            <span style={{fontStyle: 'italic'}} className='dark-blue-text'>{IfEmptyReturnNone(props.coinMetaData.obverse_type)}</span>
          </div>
          <div className='coin-info-obverse-legend text-center'>
            <span className='gray-text coin-info-small-gray-text'>OBVERSE LEGEND:<br /></span>
            <span style={{fontStyle: 'italic'}} className='dark-blue-text'>{IfEmptyReturnNone(props.coinMetaData.obverse_legend)}</span>
          </div>
          <div className='coin-info-reverse-type text-center'>
            <span className='gray-text coin-info-small-gray-text'>REVERSE TYPE:<br /></span>
            <span style={{fontStyle: 'italic'}} className='dark-blue-text'>{IfEmptyReturnNone(props.coinMetaData.reverse_type)}</span>
          </div>
          <div className='coin-info-reverse-legend text-center'>
            <span className='gray-text coin-info-small-gray-text'>REVERSE LEGEND:<br /></span>
            <span style={{fontStyle: 'italic'}} className='dark-blue-text'>{IfEmptyReturnNone(props.coinMetaData.reverse_legend)}</span>
          </div>
        </div>
        {/*** SOURCE MATERIAL ***/}
        <div className='coin-info-source-material-background'>
          <div className='coin-info-source-material'>
            <div className='coin-info-source-image'>
              <span className='gray-text coin-info-small-gray-text'>SOURCE IMAGE:<br /></span>
              <span className='dark-blue-text'>{IfUrlHrefElseString(props.coinMetaData.source_image)}</span>
            </div>
            <div className='coin-info-rights-holder'>
              <span className='gray-text coin-info-small-gray-text'>RIGHTS HOLDER:<br /></span>
              <span className='dark-blue-text'>{IfUrlHrefElseString(props.coinMetaData.right_holder)}</span>
            </div>
            <div className='coin-info-wikidata'>
              <span className='gray-text coin-info-small-gray-text'>WIKIDATA:<br /></span>
              <span className='dark-blue-text'>{IfUrlHrefElseString(props.coinMetaData.wikidata)}</span>
            </div>
            <div className='coin-info-mint-nomisma-uri'>
              <span className='gray-text coin-info-small-gray-text'>MINT NOMISMA URI:<br /></span>
              <span className='dark-blue-text'>{IfUrlHrefElseString(props.coinMetaData.mint_nomisma_uri)}</span>
            </div>
            <div className='coin-info-obverse-nomisma-uri'>
              <span className='gray-text coin-info-small-gray-text'>OBVERSE NOMISMA URI:<br /></span>
              <span className='dark-blue-text'>{IfUrlHrefElseString(props.coinMetaData.mint_nomisma_uri)}</span>
            </div>
            <div className='coin-info-reverse-nomisma-uri'>
              <span className='gray-text coin-info-small-gray-text'>REVERSE NOMISMA URI:<br /></span>
              <span className='dark-blue-text'>{IfUrlHrefElseString(props.coinMetaData.nomisma_reverse_uri)}</span>
            </div>
            <References coinMetaData={props.coinMetaData}/>
          </div>
        </div>
      </div>
    </WhitePopUp>
  );
}
export default CoinInfo;
