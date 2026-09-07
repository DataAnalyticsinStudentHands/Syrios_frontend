/**
 * WhitePopUp.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders a reusable white popup with:
 * - translucent page overlay
 * - built-in close icon
 * - outside-click dismissal
 *
 * Refactor Summary:
 * 1. Removed Redundant Local State
 *    - Uses `props.show` directly instead of mirroring it in local state
 *
 * 2. Improved Outside Click Handling
 *    - Passes `show` into `OutsideClickHandler`
 *    - Prevents outside-click listeners when popup is not visible
 *
 * 3. Preserved Existing Behavior
 *    - Visual styling, close icon, overlay, and children rendering remain unchanged
 *
 * Notes:
 * - Requires parent to control `show`
 * - Calls `props.onClose(false)` when dismissed
 *
 * Future Improvements:
 * - Add keyboard Escape-to-close support
 * - Add optional size variants
 * - Consider portal rendering if stacking issues appear
 */

import React from 'react';
import OutsideClickHandler from 'src/utils/OutsideClickHandler';

// WhitePopUp wraps content in a white popup with a translucent background.
// Includes a built-in close icon and closes on outside click.

const WhitePopUp = (props) => {
  const { show = false, onClose, children } = props;

  const CloseHandler = () => {
    onClose?.(false);
  };

  const display_style = {
    opacity: show ? 1 : 0,
    zIndex: show ? 1000 : -1000,
  };

  return (
    <>
      <div className='translucent-white-background' style={display_style} />

      <OutsideClickHandler show={show} onOutsideClick={CloseHandler}>
        <div className='snow-white-background' style={display_style}>
          <div
            className='demo-icon icon-x-medium white-pop-up-x-icon'
            onClick={CloseHandler}
          >
            &#xe838;
          </div>

          <div className='white-pop-up-inner-padding'>
            {children}
          </div>
        </div>
      </OutsideClickHandler>
    </>
  );
};

export default WhitePopUp;