import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

import WhitePopUp from 'src/utils/WhitePopUp.js';

import './CoinInfo.css';
import './coinFlip.css';



const CoinInfo = (props) => {
  const StringifyTypeCategory = (type_category) => {
    let stringified_list = `${type_category[0].type_category}`;
    for (let i = 1; i < type_category.length; i++) {
      stringified_list += `, ${type_category[i].type_category}`;
    }

    return stringified_list;
  };
  /*** Coin info that shows up when you click on a coin.
      The premise behind it is to have interactable code anywhere with getDocumentById to change the innerHTML portion of the code.
      Once the content has been changed to whatever is desired, change the z-index and opacity to lift it from the shadows

      Lastly, this uses CSS grid to position elements in a formative way ***/

  const [coinRotation, set_coinRotation] = useState('rotateY(0deg)');
  const rotateCoin = () => {
    if (coinRotation.includes('(0deg)')) {
      set_coinRotation('rotateY(180deg)');
    } else {
      set_coinRotation('rotateY(0deg)');
    }
  };

  const closeHandler = (e) => { 
    set_coinRotation('rotateY(0deg)');
    props.onClose(false);
  };

  console.log(props.coin_meta_data);

  return (
    <WhitePopUp show={props.show} onClose={closeHandler}>
      <div className='coin-info'>
        <i
          className='coin-info-x-icon demo-icon icon-x-medium'
          onClick={closeHandler}>
          &#xe838;</i>
        <div className='coin-image'>
        </div>
        <div className='coin-details'>
          <div className='coin-title DarkBlueText'>
            {`${props.coin_meta_data.mint}`}
          </div>
          {/* column 1 of coin details */}
          <div className='coin-ancient-territory'>
            <span className='GrayText coin-details-gray-text'>ANCIENT TERRITORY: </span><span className='DarkBlueText'>{props.coin_meta_data.ancient_territory}</span>
          </div>
          <div className='coin-modern-country'>
            <span className='GrayText coin-details-gray-text'>MODERN COUNTRY: </span><span className='DarkBlueText'>{props.coin_meta_data.modern_country}</span>
          </div>
          <div className='coin-issuing-authority'>
            <span className='GrayText coin-details-gray-text'>ISSUING AUTHORITY: </span><span className='DarkBlueText'>{props.coin_meta_data.issuing_authority}</span>
          </div>
          <div className='coin-governing-power'>
            <span className='GrayText coin-details-gray-text'>GOVERNING POWER: </span><span className='DarkBlueText'>{props.coin_meta_data.governing_power}</span>
          </div>
          <div className='coin-language'>
            <span className='GrayText coin-details-gray-text'>LANGUAGE: </span><span className='DarkBlueText'>{props.coin_meta_data.language}</span>
          </div>
          {/* column 2 of coin details */}
          <div className='coin-mint'>
            <span className='GrayText coin-details-gray-text'>MINT: </span><span className='DarkBlueText'>{props.coin_meta_data.mint}</span>
          </div>
          <div className='coin-mint-modern-name'>
            <span className='GrayText coin-details-gray-text'>MINT MODERN NAME: </span><span className='DarkBlueText'>{props.coin_meta_data.mint_modern_name}</span>
          </div>
          <div className='coin-material'>
            <span className='GrayText coin-details-gray-text'>MATERIAL: </span><span className='DarkBlueText'>{props.coin_meta_data.material}</span>
          </div>
          <div className='coin-denomination'>
            <span className='GrayText coin-details-gray-text'>DENOMINATION: </span><span className='DarkBlueText'>{props.coin_meta_data.denomination}</span>
          </div>
          <div className='coin-diameter'>
            <span className='GrayText coin-details-gray-text'>DIAMETER: </span><span className='DarkBlueText'>{props.coin_meta_data.diameter == null ? "N/A" : `${props.coin_meta_data.diameter}mm`}</span>
          </div>
          {/* column 3 of coin details */}
          <div className='coin-date-range'>
            <span className='GrayText coin-details-gray-text'>DATE RANGE: </span><span className='DarkBlueText'>{props.coin_meta_data.date_range}</span>
          </div>
          <div className='coin-latitude'>
            <span className='GrayText coin-details-gray-text'>LATITUDE: </span><span className='DarkBlueText'>{props.coin_meta_data.latitude}</span>
          </div>
          <div className='coin-longitude'>
            <span className='GrayText coin-details-gray-text'>LONGITUDE: </span><span className='DarkBlueText'>{props.coin_meta_data.longitude}</span>
          </div>
          <div className='coin-categories'>
            <span className='GrayText coin-details-gray-text'>CATEGORIES: </span><span className='DarkBlueText'>{StringifyTypeCategory(props.coin_meta_data.type_category)}</span>
          </div>
        </div>
        <div className='coin-types'>
        </div>
        <div className='coin-source-material'>
        </div>
      </div>
    </WhitePopUp>
  );
}
export default CoinInfo;
