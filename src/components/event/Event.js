import React from 'react';

import { createMarkup } from 'src/utils/markup.js';
import WhitePopUp from 'src/utils/WhitePopUp.js';
import { colors } from 'src/components/constants.js';

import './Event.css';




function Tag(text) {
  return (
    <div key={text.toUpperCase()} className='Tag' style={{ backgroundColor: colors.findColor(text) }}>
      <p className='WhiteText TagText'>
        {text.toUpperCase()}
      </p>
    </div>
  );
};

function loadTags(tags) { // Split every tag into individual components with delimiter ',' and push the resultant jsx to array
  let jsxArr = [];
  tags.split(',').forEach((e) => {
    jsxArr.push(Tag(e.trim()));
  });

  return jsxArr;
}

const EventInfo = (props) => {
  console.log(props.EventMetaData);

  const closeHandler = (e) => {
    props.onClose(false);
  };

  return (
    <WhitePopUp show={props.show} onClose={closeHandler}>
      <div id='EventInfo'>
        <i
          id='EventInfo-x-icon'
          className='demo-icon icon-x-medium'
          onClick={closeHandler}>
          &#xe838;</i>
        <div id='EventInfoInnerDiv'>
          {/* tags */}
          <p id='EventTagsTitle' className='GrayText'>
            INFLUENCES ON ANTIOCH:
          </p>
          <div id='EventTags'>
            {loadTags(props.EventMetaData.tags)}
          </div>

          {/* title */}
          <div id='EventTitle'>
            <p className='DarkBlueText'>
              {props.EventMetaData.title}
            </p>
          </div>

          {/* description */}
          <div id='EventDescription' className='DarkBlueText'>
            <div dangerouslySetInnerHTML={createMarkup(props.EventMetaData.text)} />
          </div>

          {/* Cultural connections */}
          <div id='EventConnectionsBackground'>
            <div id='EventConnections'>
              <p id='EventCulturalConnectionText' className='GrayText'>
                CULTURAL CONNECTIONS:
              </p>
              <p id='EventCulturalConnectionList' className='BlueText TypeCategory'>
                {props.EventMetaData.TypeCategory}
              </p>
            </div>
          </div>
        </div>
      </div>
    </WhitePopUp>
  );
};

export default EventInfo;
