import React from 'react';

import { createMarkup } from 'src/utils/Markup.js';
import WhitePopUp from 'src/utils/WhitePopUp.js';
import { colors } from 'src/pages/Toolbox/Timeline/constants.js';

function tag(text) {
  return (
    <div key={Math.random()} className='event-tag' style={{ backgroundColor: colors.find_color(text) }}>
      <p className='tag-text'>
        {text}
      </p>
    </div>
  );
};

function loadtags(tag1,tag2) { // Split every tag into individual components with delimiter ',' and push the resultant jsx to array
  let jsxArr = [];
  if (tag1){
    tag1.forEach((e)=>{
      if(e.subcategory1 !== null){
        jsxArr.push(tag(e.subcategory1));
      }
    })
  }
  if (tag2){
    tag2.forEach((e)=>{
      jsxArr.push(tag(e.subcategory2));
    })
  }
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
          {/* title */}
          <div id='event-title'>
            <p>
              {props.eventMetaData.title}
            </p>
          </div>

          <div id='event-description' dangerouslySetInnerHTML={createMarkup(props.eventMetaData.text)} />


          <div id='light-green-background'>
            <div id='event-connections'>
              <p id='event-connections-text' className='gray-text'>
                TAGS
              </p>
              <div id='event-tags' className='my-3'>
                {loadtags(props.eventMetaData.tag_subcategory1,props.eventMetaData.tag_subcategory2)}
              </div>
            </div>
          </div>
        
        </div>
      </div>
    </WhitePopUp>
  );
};

export default EventInfo;
