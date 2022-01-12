import React from 'react';
import ReactMarkdown from 'react-markdown';
import ReactDomServer from 'react-dom/server';

import OutsideClickHandler from 'src/utils/OutsideClickHandler';

import './CoinInfo.css';
import './coinFlip.css';

import OldLogo from 'src/assets/OldLogo.png';
import OldLogoColorless from 'src/assets/OldLogoColorless.png';



export const ShowCoinInfo = () => {
  let CoinInfo = document.getElementById('CoinInfo');
  CoinInfo.style.zIndex = '100';
  setTimeout(() => {CoinInfo.style.opacity = 1}, 100);
}

export const UpdateCoinInfo = (coinMetaData) => {
  let CoinInfo = document.getElementById('CoinInfo');

  // Coin Image
  document.getElementById('CoinImageFront').src = process.env.REACT_APP_strapiURL + coinMetaData.coin_image_front.url;
  document.getElementById('CoinImageBack').src = process.env.REACT_APP_strapiURL + coinMetaData.coin_image_back.url;

  // Coin main info
  document.getElementById('CoinMainInfoTitle').childNodes[0].innerHTML = `<span class='DarkBlueText'>${coinMetaData.name}</span>`;
  document.getElementById('CoinMainInfoRegion').childNodes[0].innerHTML = `REGION: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.region}</span>`;
  document.getElementById('CoinMainInfoState').childNodes[0].innerHTML = `STATE: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.state}</span>`;
  document.getElementById('CoinMainInfoMint').childNodes[0].innerHTML = `MINT: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.mint}</span>`;
  document.getElementById('CoinMainInfoAuthority').childNodes[0].innerHTML = `AUTHORITY: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.authority}</span>`;
  document.getElementById('CoinMainInfoEra').childNodes[0].innerHTML = `ERA: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.era}</span>`;
  document.getElementById('CoinMainInfoDate').childNodes[0].innerHTML = `DATE(S): <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.date}</span>`;
  document.getElementById('CoinMainInfoCatalogueDate').childNodes[0].innerHTML = `CATALOGE DATE: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.cataloge_date}</span>`;
  document.getElementById('CoinMainInfoMaterial').childNodes[0].innerHTML = `MATERIAL: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.material}</span>`;
  document.getElementById('CoinMainInfoDenomination').childNodes[0].innerHTML = `DENOMINATION: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.denomination}</span>`;
  document.getElementById('CoinMainInfoDiameter').childNodes[0].innerHTML = `DIAMETER: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.diameter}</span>`;
  document.getElementById('CoinMainInfoCulturalConnections').childNodes[0].innerHTML = `CULTURAL CONNECTIONS: <span class='DarkBlueText CoinMainInfoDynamicText'>${coinMetaData.cultural_connections}</span>`;

  let cultural_connectionsStr = (ReactDomServer.renderToString(
    <ReactMarkdown className='DarkBlueText CoinMainInfoDynamicText'>
      {coinMetaData.cultural_connections}
    </ReactMarkdown>
  ));
  cultural_connectionsStr = cultural_connectionsStr.slice(cultural_connectionsStr.indexOf('<p>') + 3, cultural_connectionsStr.lastIndexOf('</p>'));
  console.log(cultural_connectionsStr);
  document.getElementById('CoinMainInfoCulturalConnections').childNodes[0].innerHTML = `CULTURAL CONNECTIONS: ${cultural_connectionsStr}`;

  // Coin Image Type
  document.getElementById('CoinImageTypeObverse').childNodes[1].innerHTML = coinMetaData.obverse_type;
  document.getElementById('CoinImageTypeObverseLegend').childNodes[1].innerHTML = coinMetaData.obverse_legend;
  document.getElementById('CoinImageTypeReverse').childNodes[1].innerHTML = coinMetaData.reverse_type;
  document.getElementById('CoinImageTypeReverseLegend').childNodes[1].innerHTML = coinMetaData.reverse_legend;

  // Coin Source Material
  document.getElementById('CoinSourceMaterialSourceImage').childNodes[1].innerHTML = coinMetaData.source_image;
  document.getElementById('CoinSourceMaterialRightsHolder').childNodes[1].innerHTML = coinMetaData.rights_holder;
  document.getElementById('CoinSourceMaterialBibliography').childNodes[1].innerHTML = coinMetaData.bibliography;
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
    <OutsideClickHandler
      onOutsideClick={() => { // If click occurs outside of CoinInfo, remove coin info
        let dom = document.getElementById('CoinInfo');

        if (window.getComputedStyle(dom).opacity == 1) { // Idc what react says, but == is the right operator
          dom.style.opacity = 0;
          setTimeout(() => {dom.style.zIndex = -100}, 600); // Very important there is a timeout for it
        }
      }}>
      <div id='CoinInfo'>
        <i
          id='CoinInfo-x-icon'
          className='demo-icon icon-x-medium'
          onClick={(e) => {
            let dom = e.target.parentElement;
            dom.style.opacity = 0;
            setTimeout(() => {dom.style.zIndex = -100}, 600); // Very important there is a timeout for it
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
                  dom.style.transform = 'rotateY(0deg)'
                } else {
                  dom.style.transform = 'rotateY(180deg)';
                }
              }}>
              &#xe833;</i>
            <div className='flip-box'>
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
  );
}

export default CoinInfo;
