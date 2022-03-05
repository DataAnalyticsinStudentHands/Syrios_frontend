import React, { useState, useEffect, useRef } from "react";
import OutsideClickHandler from 'src/utils/OutsideClickHandler.js';

import './WhitePopUp.css';


// WhitePopUp is a class that wraps information with a white popup and a translucent white background that covers everything but the navbar and footer.
// Has an X-icon prebuilt and closes on out side click.


const WhitePopUp = (props) => {
  const wrapperRef = useRef(null);
  const [show, set_show] = useState(false);

  const closeHandler = (e) => { 
    set_show(false);
    props.onClose(false);
  };

  useEffect(() => {
    set_show(props.show);
  }, [props.show]);

  let displayStyle = {
    opacity: show ? 1 : 0,
    zIndex: show ? 1000 : -1000
  };

  return (
    <div>
      <div className='TranslucentWhiteBackground' style={displayStyle}/>
      <OutsideClickHandler 
        onOutsideClick={closeHandler}>
        <div className='SnowWhiteBackground' style={displayStyle}> 
          <i
            className='demo-icon icon-x-medium x-icon'
            onClick={closeHandler}>
            &#xe838;</i>
          <div className='WhitePopUpInnerPadding'>
            {props.children}
          </div>
        </div>
      </OutsideClickHandler>
    </div>
  );
}

export default WhitePopUp;
