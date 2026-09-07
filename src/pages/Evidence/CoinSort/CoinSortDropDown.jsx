/**
 * CoinSortDropDown.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders a reusable dropdown control for CoinSort options.
 *
 * Refactor Summary:
 * 1. Preserved Existing Behavior
 *    - Dropdown open/close, selection, clear button, and tooltip popup behavior remain unchanged
 *
 * 2. Improved Safety + Readability
 *    - Adds optional chaining on selections
 *    - Simplifies conditional rendering
 *
 * Notes:
 * - This component does not fetch API data directly
 * - No Strapi normalization changes are required here
 *
 * Future Improvements:
 * - Extract repeated conditional rendering into smaller helpers
 * - Add keyboard accessibility support
 */

import React, { useState } from 'react';
import OutsideClickHandler from 'src/utils/OutsideClickHandler';
import { ToolTipsBoxJSX } from './CoinSortExtraFunctions';

export default function CoinSortDropDown(props) {
  const [show, set_show] = useState(false);
  const [show_tool_tips, set_show_tool_tips] = useState(false);

  const CloseHandler = () => {
    set_show(false);
  };

  const OpenHandler = () => {
    set_show(true);
  };

  const Select = (e) => {
    set_show(false);
    props.setState(e.target.dataset.selection);
  };

  const display_styling = {
    opacity: show ? 1 : 0,
    zIndex: show ? 1000 : -1000,
  };

  const selection_jsx = (props.selections || []).map((e, index) => (
    <div
      key={`coin_sort_dropdown_${e + index}`}
      className='coin-sort-dropdown-item'
      onClick={Select}
      data-selection={e}
    >
      <p data-selection={e} className='coin-sort-dropdown-item-text'>
        {e}
        {index === 0 && (
          <i
            className='coin-sort-dropdown-arrow'
            style={{ position: 'absolute', right: '0', marginRight: '20px' }}
          />
        )}
      </p>
      <hr data-selection={e} className='coin-sort-dropdown-item-line-spacer' />
    </div>
  ));

  return (
    <div className='coin-sort-option mx-3'>
      <p className='coin-sort-dropdown-title-text'>
        {props.title}
        {props.toolTips != null ? (
          <i
            className='demo-icon icon-info coin-sort-info-icon'
            onClick={() => {
              set_show_tool_tips(!show_tool_tips);
            }}
          >
            &#xe817;
          </i>
        ) : null}
      </p>

      <div className='coin-sort-dropdown-outermost-div'>
        <div className='coin-sort-dropdown-bar' onClick={OpenHandler}>
          <p className='coin-sort-dropdow-bar-text blue-text'>
            {props.state}
          </p>
          <i className='coin-sort-dropdown-arrow' />
        </div>

        <OutsideClickHandler show={show} onOutsideClick={CloseHandler}>
          <div className='coin-sort-dropdown' style={display_styling}>
            <div className='coin-sort-dropdown-items'>
              {selection_jsx}
            </div>
          </div>
        </OutsideClickHandler>

        {props.clearTitle != null && props.showClear ? (
          <div className='coin-sort-clear-button' onClick={props.clear}>
            <i className="demo-icon icon-warning">&#xe82c;</i>
            {props.clearTitle}
          </div>
        ) : null}
      </div>

      {props.toolTips ? (
        <ToolTipsBoxJSX
          show={show_tool_tips}
          onClose={(e) => {
            set_show_tool_tips(e);
          }}
          toolTips={props.toolTips}
        />
      ) : null}
    </div>
  );
}