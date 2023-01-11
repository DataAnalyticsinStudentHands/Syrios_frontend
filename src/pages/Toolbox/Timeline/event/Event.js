import React from 'react';
import { createMarkup } from 'src/utils/Markup.js';
import WhitePopUp from 'src/utils/WhitePopUp.js';

function tag(text) {
  // console.log(text);
  return (
    <div key={Math.random()} className='event-tag' style={{ backgroundColor: text.color}}>
      <p className='tag-text'>
        {text?.topic?.length > 0 ? text?.topic : ""}
        {text?.governing_power?.length > 0 ? text?.governing_power : ""}

      </p>
    </div>
  );
};

function loadtags(tag1,tag2) { // Split every tag into individual components with delimiter ',' and push the resultant jsx to array
  let jsxArr = [];

  if (tag1 && tag1.data.length > 0) {
    tag1.data.forEach((e)=>{
      if(e.subcategory1 !== null){
        // jsxArr.push(tag(e.subcategory1));
        jsxArr.push(tag(e.attributes));

      }
    })
  }
  if (tag2 && tag2.data.length > 0){
    tag2.data.forEach((e)=>{
      // jsxArr.push(tag(e.subcategory2));
      jsxArr.push(tag(e.attributes));

    })
  }
  return jsxArr;
}

const EventInfo = (props) => {
  const CloseHandler = (e) => {
    props.onClose(false);
  };
  // console.log(props);
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

          <div className='light-green-background'>
            <div id='event-connections'>
              <p id='event-connections-text' className='gray-text'>
                TAGS
              </p>
              <div id='event-tags' className='my-3'>
                {/* {loadtags(props.eventMetaData.tag_subcategory1,props.eventMetaData.tag_subcategory2)} */}
                {loadtags(props.eventMetaData.governing_powers,props.eventMetaData.topics)}

              </div>
            </div>
          </div>
        
        </div>
      </div>
    </WhitePopUp>
  );
};

export default EventInfo;
