import React from 'react';
import ReactMarkdown from 'react-markdown';
import ReactDomServer from 'react-dom/server';

import OutsideClickHandler from 'src/utils/OutsideClickHandler';
import { colors } from 'src/components/constants.js';

import './Event.css';



const Tag = (text, color) => {
  return (
    <div key={text.toUpperCase()} className='Tag' style={{ backgroundColor: colors.findColor(text) }}>
      <p className='WhiteText TagText'>
        {text.toUpperCase()}
      </p>
    </div>
  );
};

let lastTimeEventShowOccured = new Date();
export const ShowEventInfo = () => {
  lastTimeEventShowOccured = new Date();
  let dom = document.getElementById('EventInfo');
  if (window.getComputedStyle(dom).opacity != 1) {
    dom.style.zIndex=100;
    setTimeout(() => {dom.style.opacity=1;}, 100);

    let domWhiteBackground = dom.parentElement.previousSibling;
    domWhiteBackground.style.zIndex=100;
    setTimeout(() => {domWhiteBackground.style.opacity=0.5;}, 100);
  }
};

export const UpdateEventInfo = (e) => {
  let tags = e.tags.split(',');
  tags = tags.map(function(e) { return e.trim(); });

  let jsxArr = [];
  tags.forEach((e) => {
    jsxArr.push(Tag(e, colors.findColor(e)));
  });

  document.getElementById('EventTags').innerHTML = ReactDomServer.renderToString(
    <>
      {jsxArr}
    </>
  );

  document.getElementById('EventTitle').childNodes[0].innerHTML = e.Title;
  document.getElementById('EventDescription').childNodes[0].innerHTML = ReactDomServer.renderToString(
    <ReactMarkdown className='GrayText quote'>
      {e.detail}
    </ReactMarkdown>
  );

  document.getElementById('EventCulturalConnectionList').innerHTML = ReactDomServer.renderToString(
    <ReactMarkdown className='TypeCategory'>
      {e.cultural_connections}
    </ReactMarkdown>
  );
};

export const UpdateAndShowEventInfo = (e) => {
  UpdateEventInfo(e);
  ShowEventInfo();
};

const EventInfo = () => {
  return (
    <>
      <div id="EventWhiteBackground"/>
      <OutsideClickHandler
        onOutsideClick={() => { // If click occurs outside of CoinInfo, remove coin info
          let dom = document.getElementById('EventInfo');

          setTimeout(() => {
            let currentTime = new Date();
            if (currentTime - lastTimeEventShowOccured < 700) return;

            if (window.getComputedStyle(dom).opacity == 1) { // Idc what react says, but == is the right operator
              dom.style.opacity = 0;
              setTimeout(() => {dom.style.zIndex = -100}, 600); // Very important there is a timeout for it

              let domWhiteBackground = dom.parentElement.previousSibling;
              domWhiteBackground.style.opacity=0;
              setTimeout(() => {domWhiteBackground.style.zIndex=-100;}, 600);
            }
          }, 50);
        }}>
        <div id='EventInfo'>
          <i
            id='EventInfo-x-icon'
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
          <div id='EventInfoInnerDiv'>
            {/* tags */}
            <p id='EventTagsTitle' className='GrayText'>
              INFLUENCES ON ANTIOCH:
            </p>
            <div id='EventTags'>
              {Tag('tag1', 'red')} {Tag('tag2', 'green')} {Tag('tag3', 'blue')}
            </div>

            {/* title */}
            <div id='EventTitle'>
              <p className='DarkBlueText'>
                Title
              </p>
            </div>

            {/* description */}
            <div id='EventDescription'>
              <p className='DarkBlueText'>
                Some information
              </p>
            </div>

            {/* Cultural connections */}
            <div id='EventConnectionsBackground'>
              <div id='EventConnections'>
                <p id='EventCulturalConnectionText' className='GrayText'>
                  CULTURAL CONNECTIONS:
                </p>
                <p id='EventCulturalConnectionList' className='BlueText TypeCategory'>
                  Some, list, of connections
                </p>
              </div>
            </div>
          </div>
        </div>
      </OutsideClickHandler>
    </>
  );
};

export default EventInfo;
