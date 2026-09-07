/**
 * CoinSortExtraFunctions.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Provides CoinSort helper UI components such as tooltips and main text rendering.
 *
 * Refactor Summary:
 * 1. Preserved Existing Behavior
 *    - Tooltip modal rendering and main text rendering remain unchanged
 *
 * 2. Minor Fixes
 *    - Corrected `console.err` to `console.error`
 *
 * Notes:
 * - This module does not fetch API data directly
 * - No Strapi normalization changes are required here
 */

import React from 'react';
import WhitePopUp from 'src/utils/WhitePopUp';
import Markup from 'src/utils/Markup';

export const ToolTipsBoxJSX = (props) => {
  if (props?.toolTips?.title == null) return <div></div>;

  let jsx = undefined;
  const toolTips = props.toolTips;

  if (
    toolTips?.grid_1x1 != null &&
    toolTips?.grid_2x1 != null &&
    toolTips?.grid_3x1 != null &&
    toolTips?.grid_2x2 != null &&
    toolTips?.grid_3x2 != null &&
    toolTips?.grid_6x3 != null
  ) {
    jsx = (
      <div className='coin-sort-tool-tips'>
        <div className='coin-sort-tool-tips-title'>{toolTips.title}</div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{ color: '#183848' }}>1 x 1 Grid:</strong> {toolTips.grid_1x1}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{ color: '#183848' }}>2 x 1 Grid:</strong> {toolTips.grid_2x1}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{ color: '#183848' }}>3 x 1 Grid:</strong> {toolTips.grid_3x1}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{ color: '#183848' }}>2 x 2 Grid:</strong> {toolTips.grid_2x2}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{ color: '#183848' }}>3 x 2 Grid:</strong> {toolTips.grid_3x2}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{ color: '#183848' }}>6 x 3 Grid:</strong> {toolTips.grid_6x3}
        </div>
      </div>
    );
  } else if (
    toolTips?.sub_title != null &&
    toolTips?.minting_date != null &&
    toolTips?.material != null &&
    toolTips?.issuing_authority != null &&
    toolTips?.governing_power != null &&
    toolTips?.size != null
  ) {
    jsx = (
      <div className='coin-sort-tool-tips'>
        <div className='coin-sort-tool-tips-title'>{toolTips.title}</div>
        <div className='coin-sort-tool-tips-text'>{toolTips.sub_title}</div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{ color: '#183848' }}>Minting Date:</strong> {toolTips.minting_date}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{ color: '#183848' }}>Material:</strong> {toolTips.material}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{ color: '#183848' }}>Issuing Authority:</strong> {toolTips.issuing_authority}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{ color: '#183848' }}>Governing Power:</strong> {toolTips.governing_power}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{ color: '#183848' }}>Size:</strong> {toolTips.size}
        </div>
      </div>
    );
  } else if (
    toolTips?.sub_title != null &&
    toolTips?.minting_date != null &&
    toolTips?.material != null &&
    toolTips?.issuing_authority != null &&
    toolTips?.governing_power != null &&
    toolTips?.type != null
  ) {
    jsx = (
      <div className='coin-sort-tool-tips'>
        <div className='coin-sort-tool-tips-title'>{toolTips.title}</div>
        <div className='coin-sort-tool-tips-text'>{toolTips.sub_title}</div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{ color: '#183848' }}>Minting Date:</strong> {toolTips.minting_date}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{ color: '#183848' }}>Material:</strong> {toolTips.material}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{ color: '#183848' }}>Issuing Authority:</strong> {toolTips.issuing_authority}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{ color: '#183848' }}>Governing Power:</strong> {toolTips.governing_power}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{ color: '#183848' }}>Type:</strong> {toolTips.type}
        </div>
      </div>
    );
  } else {
    console.error('Tool tip with this set of objects is not setup:', toolTips);
  }

  const CloseHandler = () => {
    props.onClose(false);
  };

  return (
    <WhitePopUp show={props.show} onClose={CloseHandler}>
      {jsx}
    </WhitePopUp>
  );
};

export const MainText = (props) => {
  return (
    <div id='coin-sort-main-text-wrapper'>
      <div id='coin-sort-main-text'>
        <div id='coin-sort-main-text-title'>
          {props.content?.title}
        </div>
        <div
          id='coin-sort-main-text'
          dangerouslySetInnerHTML={Markup(props.content?.text)}
        />
      </div>
    </div>
  );
};