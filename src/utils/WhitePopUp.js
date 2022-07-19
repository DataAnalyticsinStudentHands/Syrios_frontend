import React, { useState, useEffect } from "react";
import OutsideClickHandler from 'src/utils/OutsideClickHandler.js';

// WhitePopUp is a class that wraps information with a white popup and a translucent white background that covers everything but the navbar and footer.
// Has an X-icon prebuilt and closes on out side click.

const WhitePopUp = (props) => {
  const [show, set_show] = useState(false);

  const CloseHandler = (e) => { 
    set_show(false);
    props.onClose(false);
  };

  useEffect(() => {
    set_show(props.show);
  }, [props.show]);

  let display_style = {
    opacity: show ? 1 : 0,
    zIndex: show ? 1000 : -1000
  };

  return (
    <>
      <div className='translucent-white-background' style={display_style}/>
      <OutsideClickHandler onOutsideClick={CloseHandler}>
        <div className='snow-white-background' style={display_style}> 
          <i
            className='demo-icon icon-x-medium white-pop-up-x-icon'
            onClick={CloseHandler}>
            &#xe838;</i>
          <div className='white-pop-up-inner-padding'>
            {props.children}
          </div>
        </div>
      </OutsideClickHandler>
    </>
  );
}

export default WhitePopUp;
