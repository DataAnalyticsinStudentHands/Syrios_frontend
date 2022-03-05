import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

import WhitePopUp from 'src/utils/WhitePopUp.js';

import './CoinInfo.css';
import './coinFlip.css';



const CoinInfo = (props) => {
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

  return (
    <WhitePopUp show={props.show} onClose={closeHandler}>
      <div id='CoinInfo'>
        <i
          id='CoinInfo-x-icon'
          className='demo-icon icon-x-medium'
          onClick={closeHandler}>
          &#xe838;</i>
        <div id='CoinInfoGrid'>
          {/* Our coin images */}
          <div id='CoinImageDiv'>
            <i
              id='CoinInfoRotateButton'
              className='demo-icon icon-coin-rotate'
              onClick={rotateCoin}>
              &#xe833;</i>
            <i
              id='CoinInfoScaleButton'
              className='demo-icon icon-coin-scale'
              onClick={(e) => {
                let dom = document.getElementById('CoinScaleDottedCircle');
                let newHeight = parseInt(window.getComputedStyle(document.getElementById('CoinImageFront').parentElement.parentElement.parentElement).height)*0.1;
                document.getElementById('CoinImageFront').height = newHeight;
                document.getElementById('CoinImageBack').height = newHeight;
                document.getElementById('CoinScaleDiameterText').style.fontSize = 0;

                if (dom.style.height.includes('100%')) {
                  dom.style.height = '0%';
                  let newHeight = parseInt(window.getComputedStyle(document.getElementById('CoinImageFront').parentElement.parentElement.parentElement).height) * .7;
                  document.getElementById('CoinImageFront').height = newHeight;
                  document.getElementById('CoinImageBack').height = newHeight;
                } else {
                  dom.style.height = '100%';

                  let previousComputedHeight = '0px';
                  var CoinInfoScaleCircleInterval = setInterval(() => {
                    if (previousComputedHeight === window.getComputedStyle(dom).height) {
                      clearInterval(CoinInfoScaleCircleInterval);
                      previousComputedHeight = parseInt(previousComputedHeight.substring('0',previousComputedHeight.indexOf('px')));

                      let diameter = props.CoinMetaData.Diameter;

                      newHeight = previousComputedHeight * (diameter * 2 / 100);
                      document.getElementById('CoinImageFront').height = newHeight;
                      document.getElementById('CoinImageBack').height = newHeight;

                      document.getElementById('CoinScaleDiameterText').style.fontSize = '12px';
                    }
                    previousComputedHeight = window.getComputedStyle(dom).height;
                  }, 50);
                }
              }}>&#xe834;</i>
            <div id='CoinScaleDottedCircle' />
            <div id='CoinScaleDiameterDiv'>
              <p id='CoinScaleDiameterText' className='BlueText'>
                {'Diameter: ' + (props.CoinMetaData.Diameter == - 1 ? 'N/A' : props.CoinMetaData.Diameter + 'mm') }
              </p>
            </div>
            <div className='flip-box' style={{ position: 'relative', left: '2%' }}>
              <div className='flip-box-inner' style={{ transform: coinRotation }}>
                <div className='flip-box-front'>
                  <img
                    id='CoinImageFront'
                    src={process.env.REACT_APP_strapiURL + props.CoinMetaData.obverseFile.url}
                    alt='Logo'
                  />
                </div>
                <div className='flip-box-back'>
                  <img
                    id='CoinImageBack'
                    src={process.env.REACT_APP_strapiURL + props.CoinMetaData.reverseFile.url}
                    alt='Colorless logo'
                  />
                </div>
              </div>
            </div>
          </div>
          {/* this main info with era, date, min, authority, title, etc... */}
          <div id='CoinMainInfo'>
            <div id='CoinMainInfoTitle'>
              <ReactMarkdown className='DarkBlueText text-start'>
                {props.CoinMetaData.Title}
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoRegion'>
              <ReactMarkdown className='DarkBlueText text-start'>
                {'REGION: ' + props.CoinMetaData.Region}
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoState'>
              <ReactMarkdown className='DarkBlueText text-start'>
                {'STATE: ' + props.CoinMetaData.State}
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoMint'>
              <ReactMarkdown className='DarkBlueText text-start'>
                {'MINT: ' + props.CoinMetaData.Mint}
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoAuthority'>
              <ReactMarkdown className='DarkBlueText text-start'>
                {'AUTHORITY: ' + props.CoinMetaData.IssuingAuthority}
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoEra'>
              <ReactMarkdown className='DarkBlueText text-start'>
                {'ERA: ' + props.CoinMetaData.Era}
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoDate'>
              <ReactMarkdown className='DarkBlueText text-start'>
                {'DATE(S): ' + props.CoinMetaData.Date}
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoCatalogueDate'>
              <ReactMarkdown className='DarkBlueText text-start'>
                {'CATALOGE DATE: ' + props.CoinMetaData.CatalogueDate}
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoMaterial'>
              <ReactMarkdown className='DarkBlueText text-start'>
                {'MATERIAL: ' + props.CoinMetaData.Material}
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoDenomination'>
              <ReactMarkdown className='DarkBlueText text-start'>
                {'DENOMINATION: ' + props.CoinMetaData.Denomination}
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoDiameter'>
              <ReactMarkdown className='DarkBlueText text-start'>
                {'DIAMETER: ' + props.CoinMetaData.Diameter + 'mm'}
              </ReactMarkdown>
            </div>
            <div id='CoinMainInfoCulturalConnections'>
              <ReactMarkdown className='DarkBlueText text-start'>
                {'CULTURAL CONNECTIONS: ' + props.CoinMetaData.TypeCategory}
              </ReactMarkdown>
            </div>
          </div>
          {/* Reverse, reverse legend, obverse, obverse legend */}
          <div id='CoinImageType'>
            <div id='CoinImageTypeObverse'>
              <p className='GrayText text-center'>
                OBVERSE TYPE:
              </p>
              <ReactMarkdown className='DarkBlueText CoinImageTypeDynamicText text-center'>
                {props.CoinMetaData.ObverseType}
              </ReactMarkdown>
            </div>
            <div id='CoinImageTypeObverseLegend'>
              <p className='GrayText text-center'>
                OBVERSE LEGEND:
              </p>
              <ReactMarkdown className='DarkBlueText CoinImageTypeDynamicText text-center'>
                {props.CoinMetaData.ObverseLegend}
              </ReactMarkdown>
            </div>
            <div id='CoinImageTypeReverse'>
              <p className='GrayText text-center'>
                REVERSE TYPE:
              </p>
              <ReactMarkdown className='DarkBlueText CoinImageTypeDynamicText text-center'>
                {props.CoinMetaData.ReverseType}
              </ReactMarkdown>
            </div>
            <div id='CoinImageTypeReverseLegend'>
              <p className='GrayText text-center'>
                REVERSE LEGEND:
              </p>
              <ReactMarkdown className='DarkBlueText CoinImageTypeDynamicText text-center'>
                {props.CoinMetaData.ReverseLegend}
              </ReactMarkdown>
            </div>
          </div>
          {/* Bibliography, source url, etc */}
          <div id='CoinSourceMaterial'>
            <div id='CoinSourceMaterialGrid'>
              <div id='CoinSourceMaterialSourceImage'>
                <p className='GrayText text-start'>
                  SOURCE IMAGE:
                </p>
                <ReactMarkdown className='DarkBlueText CoinSourceMaterialDynamicText text-start'>
                  {props.CoinMetaData.SourceImage}
                </ReactMarkdown>
              </div>
              <div id='CoinSourceMaterialRightsHolder'>
                <p className='GrayText text-start'>
                  RIGHTS HOLDER:
                </p>
                <ReactMarkdown className='DarkBlueText CoinSourceMaterialDynamicText text-start'>
                  {props.CoinMetaData.RightsHolder}
                </ReactMarkdown>
              </div>
              <div id='CoinSourceMaterialBibliography'>
                <p className='GrayText text-start'>
                  BIBLIOGRAPHY:
                </p>
                <ReactMarkdown className='DarkBlueText CoinSourceMaterialDynamicText text-start'>
                  {props.CoinMetaData.Bibliography}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WhitePopUp>
  );
}
export default CoinInfo;
