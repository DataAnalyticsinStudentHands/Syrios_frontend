import React from 'react';
import ReactMarkdown from 'react-markdown';
import ReactDomServer from 'react-dom/server';

import OutsideClickHandler from 'src/utils/OutsideClickHandler';

import './CoinInfo.css';
import './coinFlip.css';

import OldLogo from 'src/assets/OldLogo.png';
import OldLogoColorless from 'src/assets/OldLogoColorless.png';



var lastTimeCoinShowOccured = new Date();
export const ShowCoinInfo = () => {
  lastTimeCoinShowOccured = new Date();
  let dom = document.getElementById('CoinInfo');

  if (window.getComputedStyle(dom).opacity != 1) {
    dom.style.zIndex = '100';
    setTimeout(() => {dom.style.opacity = 1}, 100);

    let domWhiteBackground = dom.parentElement.previousSibling;
    domWhiteBackground.style.zIndex=100;
    setTimeout(() => {domWhiteBackground.style.opacity=0.5;}, 100);
  }
}

export const UpdateCoinInfo = (coinMetaData) => {
  let CoinInfo = document.getElementById('CoinInfo');

  // Coin Image
  document.getElementById('CoinImageFront').src = process.env.REACT_APP_strapiURL + coinMetaData.obverseFile.url;
  document.getElementById('CoinImageBack').src = process.env.REACT_APP_strapiURL + coinMetaData.reverseFile.url;
  document.getElementById('CoinScaleDiameterText').innerHTML = `<span className='DarkBlueText'>Diameter:</span> <span style='font-style:italic;'>${coinMetaData.Diameter}mm</span>`;

  // Reset coin image scale if it is up, and flip it to the front image
  document.getElementById('CoinScaleDottedCircle').style.height = '0%';
  let newHeight = parseInt(window.getComputedStyle(document.getElementById('CoinImageFront').parentElement.parentElement.parentElement).height) * .7;
  document.getElementById('CoinImageFront').height = newHeight;
  document.getElementById('CoinImageBack').height = newHeight;
  document.getElementById('CoinScaleDiameterText').style.fontSize = 0;

  if(document.getElementById('CoinImageFront').parentElement.parentElement.style.transform === 'rotateY(180deg)') document.getElementById('CoinImageFront').parentElement.parentElement.style.transform = 'rotateY(0deg)';


  // Coin main info
  document.getElementById('CoinMainInfoTitle').childNodes[0].innerHTML = `<span class='DarkBlueText'>${coinMetaData.Title}</span>`;
  document.getElementById('CoinMainInfoRegion').childNodes[0].innerHTML = `REGION: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.Region}</span>`;
  document.getElementById('CoinMainInfoState').childNodes[0].innerHTML = `STATE: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.State}</span>`;
  document.getElementById('CoinMainInfoMint').childNodes[0].innerHTML = `MINT: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.Mint}</span>`;
  document.getElementById('CoinMainInfoAuthority').childNodes[0].innerHTML = `AUTHORITY: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.IssuingAuthority}</span>`;
  document.getElementById('CoinMainInfoEra').childNodes[0].innerHTML = `ERA: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.Era}</span>`;
  document.getElementById('CoinMainInfoDate').childNodes[0].innerHTML = `DATE(S): <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.Date}</span>`;
  document.getElementById('CoinMainInfoCatalogueDate').childNodes[0].innerHTML = `CATALOGE DATE: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.CatalogueDate}</span>`;
  document.getElementById('CoinMainInfoMaterial').childNodes[0].innerHTML = `MATERIAL: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.Material}</span>`;
  document.getElementById('CoinMainInfoDenomination').childNodes[0].innerHTML = `DENOMINATION: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.Denomination}</span>`;
  document.getElementById('CoinMainInfoDiameter').childNodes[0].innerHTML = `DIAMETER: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.Diameter}mm</span>`;
  document.getElementById('CoinMainInfoCulturalConnections').childNodes[0].innerHTML = `CULTURAL CONNECTIONS: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.TypeCategory}</span>`;

  let typeCategoryStr = (ReactDomServer.renderToString(
    <ReactMarkdown className='DarkBlueText CoinMainInfoDynamicText'>
      {coinMetaData.TypeCategory}
    </ReactMarkdown>
  ));

  typeCategoryStr = typeCategoryStr.slice(typeCategoryStr.indexOf('<p>') + 3, typeCategoryStr.lastIndexOf('</p>'));
  document.getElementById('CoinMainInfoCulturalConnections').childNodes[0].innerHTML = `CULTURAL CONNECTIONS: ${typeCategoryStr}`;

  // Coin Image Type
  document.getElementById('CoinImageTypeObverse').childNodes[1].innerHTML = coinMetaData.ObverseType;
  document.getElementById('CoinImageTypeObverseLegend').childNodes[1].innerHTML = coinMetaData.ObverseLegend;
  document.getElementById('CoinImageTypeReverse').childNodes[1].innerHTML = coinMetaData.ReverseType;
  document.getElementById('CoinImageTypeReverseLegend').childNodes[1].innerHTML = coinMetaData.ReverseLegend;

  // Coin Source Material
  document.getElementById('CoinSourceMaterialSourceImage').childNodes[1].innerHTML = coinMetaData.SourceImage ;
  document.getElementById('CoinSourceMaterialRightsHolder').childNodes[1].innerHTML = coinMetaData.RightsHolder;
  document.getElementById('CoinSourceMaterialBibliography').childNodes[1].innerHTML = coinMetaData.Bibliography;
}

export const UpdateAndShowCoinInfo = (coinMetaData) => {
  UpdateCoinInfo(coinMetaData);
  ShowCoinInfo();
}


const CoinInfo = () => {
  /*** Coin info that shows up when you click on a coin.
      The premise behind it is to have interactable code anywhere with getDocumentById to change the innerHTML portion of the code.
      Once the content has been changed to whatever is desired, change the z-index and opacity to lift it from the shadows

      Lastly, this uses CSS grid to position elements in a formative way ***/
  return (
    <>
      <div id="CoinWhiteBackground"/>
      <OutsideClickHandler
        onOutsideClick={() => { // If click occurs outside of CoinInfo, remove coin info
          let dom = document.getElementById('CoinInfo');

          setTimeout(() => {
            let currentTime = new Date();
            if (currentTime - lastTimeCoinShowOccured < 700) return;

            if (window.getComputedStyle(dom).opacity == 1) { // Idc what react says, but == is the right operator
              dom.style.opacity = 0;
              setTimeout(() => {dom.style.zIndex = -100}, 600); // Very important there is a timeout for it

              let domWhiteBackground = dom.parentElement.previousSibling;
              domWhiteBackground.style.opacity=0;
              setTimeout(() => {domWhiteBackground.style.zIndex=-100;}, 600);
            }
          }, 50);
        }}>
        <div id='CoinInfo'>
          <i
            id='CoinInfo-x-icon'
            className='demo-icon icon-x-medium'
            onClick={(e) => {
              let dom = e.target.parentElement;
              dom.style.opacity = 0;
              setTimeout(() => {dom.style.zIndex = -100}, 600); // Very important there is a timeout for it

              let domWhiteBackground = dom.parentElement.previousSibling;
              domWhiteBackground.style.opacity=0;
              setTimeout(() => {domWhiteBackground.style.zIndex=-100;}, 600);
            }}>
            &#xe838;</i>
          <div id='CoinInfoGrid'>
            {/* Our coin images */}
            <div id='CoinImageDiv'>
              <i
                id='CoinInfoRotateButton'
                className='demo-icon icon-coin-rotate'
                onClick={(e)=> {
                  let dom = e.target;

                  while (dom.className !== 'flip-box') {
                    dom = dom.nextSibling;
                  }

                  dom = dom.childNodes[0];

                  while (dom.className !== 'flip-box-inner') {
                    dom = dom.nextSibling;
                  }

                  if (dom.style.transform === 'rotateY(180deg)') {
                    dom.style.transform = 'rotateY(0deg)';
                  } else {
                    dom.style.transform = 'rotateY(180deg)';
                  }
                }}>
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

                        let diameter = document.getElementById('CoinMainInfoDiameter').childNodes[0].innerHTML;
                        diameter = parseInt(diameter.substring(diameter.indexOf('>')+1, diameter.indexOf('mm')));

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
                  Diameter: N/A
                </p>
              </div>
              <div className='flip-box' style={{ position: 'relative', left: '2%' }}>
                  <div className='flip-box-inner'>
                    <div className='flip-box-front'>
                      <img
                        id='CoinImageFront'
                        src={OldLogo}
                        alt='Logo'
                      />
                    </div>
                    <div className='flip-box-back'>
                      <img
                        id='CoinImageBack'
                        src={OldLogoColorless}
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
                  Syrios project Logo
                </ReactMarkdown>
              </div>
              <div id='CoinMainInfoRegion'>
                <ReactMarkdown className='DarkBlueText text-start'>
                  REGION:
                </ReactMarkdown>
              </div>
              <div id='CoinMainInfoState'>
                <ReactMarkdown className='DarkBlueText text-start'>
                  STATE:
                </ReactMarkdown>
              </div>
              <div id='CoinMainInfoMint'>
                <ReactMarkdown className='DarkBlueText text-start'>
                  MINT:
                </ReactMarkdown>
              </div>
              <div id='CoinMainInfoAuthority'>
                <ReactMarkdown className='DarkBlueText text-start'>
                  AUTHORITY:
                </ReactMarkdown>
              </div>
              <div id='CoinMainInfoEra'>
                <ReactMarkdown className='DarkBlueText text-start'>
                  ERA:
                </ReactMarkdown>
              </div>
              <div id='CoinMainInfoDate'>
                <ReactMarkdown className='DarkBlueText text-start'>
                  DATE(S):
                </ReactMarkdown>
              </div>
              <div id='CoinMainInfoCatalogueDate'>
                <ReactMarkdown className='DarkBlueText text-start'>
                  CATALOGE DATE:
                </ReactMarkdown>
              </div>
              <div id='CoinMainInfoMaterial'>
                <ReactMarkdown className='DarkBlueText text-start'>
                  MATERIAL:
                </ReactMarkdown>
              </div>
              <div id='CoinMainInfoDenomination'>
                <ReactMarkdown className='DarkBlueText text-start'>
                  DENOMINATION:
                </ReactMarkdown>
              </div>
              <div id='CoinMainInfoDiameter'>
                <ReactMarkdown className='DarkBlueText text-start'>
                  DIAMETER:
                </ReactMarkdown>
              </div>
              <div id='CoinMainInfoCulturalConnections'>
                <ReactMarkdown className='DarkBlueText text-start'>
                  CULTURAL CONNECTIONS:
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
                  front
                </ReactMarkdown>
              </div>
              <div id='CoinImageTypeObverseLegend'>
                <p className='GrayText text-center'>
                  OBVERSE LEGEND:
                </p>
                <ReactMarkdown className='DarkBlueText CoinImageTypeDynamicText text-center'>
                  none
                </ReactMarkdown>
              </div>
              <div id='CoinImageTypeReverse'>
                <p className='GrayText text-center'>
                  REVERSE TYPE:
                </p>
                <ReactMarkdown className='DarkBlueText CoinImageTypeDynamicText text-center'>
                  back
                </ReactMarkdown>
              </div>
              <div id='CoinImageTypeReverseLegend'>
                <p className='GrayText text-center'>
                  REVERSE LEGEND:
                </p>
                <ReactMarkdown className='DarkBlueText CoinImageTypeDynamicText text-center'>
                  none
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
                    N/A
                  </ReactMarkdown>
                </div>
                <div id='CoinSourceMaterialRightsHolder'>
                  <p className='GrayText text-start'>
                    RIGHTS HOLDER:
                  </p>
                  <ReactMarkdown className='DarkBlueText CoinSourceMaterialDynamicText text-start'>
                    N/A
                  </ReactMarkdown>
                </div>
                <div id='CoinSourceMaterialBibliography'>
                  <p className='GrayText text-start'>
                    BIBLIOGRAPHY:
                  </p>
                  <ReactMarkdown className='DarkBlueText CoinSourceMaterialDynamicText text-start'>
                    N/A
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </OutsideClickHandler>
    </>
  );
}

export default CoinInfo;
