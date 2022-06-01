import React from 'react';

import { createMarkup } from 'src/utils/Markup.js';
import WhitePopUp from 'src/utils/WhitePopUp.js';
import { colors } from 'src/components/constants.js';

import './Event.css';




function tag(text) {
  return (
    <div key={text.toUpperCase()} className='tag' style={{ backgroundColor: colors.find_color(text) }}>
      <p className='white-text tag-text'>
        {text.toUpperCase()}
      </p>
    </div>
  );
};

function loadtags(tags) { // Split every tag into individual components with delimiter ',' and push the resultant jsx to array
  let jsxArr = [];
  tags.split(',').forEach((e) => {
    jsxArr.push(tag(e.trim()));
  });

  return jsxArr;
}

const EventInfo = (props) => {
  const CloseHandler = (e) => {
    props.onClose(false);
  };

  return (
    <WhitePopUp show={props.show} onClose={CloseHandler}>
      <div id='event-info'>
        <div id='event-info-inner-div'>
          {/* tags */}
          <p id='event-tags-title' className='gray-text'>
            INFLUENCES ON ANTIOCH:
          </p>
          <div id='event-tags'>
            {loadtags(props.eventMetaData.tags)}
          </div>

          {/* title */}
          <div id='event-title'>
            <p className='dark-blue-text'>
              {props.eventMetaData.title}
            </p>
          </div>

          {/* description */}
          <div id='event-description' className='dark-blue-text'>
            <div dangerouslySetInnerHTML={createMarkup(props.eventMetaData.text)} />
          </div>

          {/* Cultural connections */}
          <div id='event-connections-background'>
            <div id='event-connections'>
              <p id='event-connections-text' className='gray-text'>
                CULTURAL CONNECTIONS:
              </p>
              <p id='event-connections-list' className='blue-text type-category'>
                {props.eventMetaData.type_category}
              </p>
            </div>
          </div>
        </div>
      </div>
    </WhitePopUp>
  );
};

export default EventInfo;
