import React from 'react';

import WhitePopUp from 'src/utils/WhitePopUp.js';
import Markup from 'src/utils/Markup.js';

export const ToolTipsBoxJSX = (props) => {
  if (props?.toolTips?.title == null) return <div></div>;
  let jsx = undefined;
  const toolTips = props.toolTips;
  // Three tooltip types possible. Need to be prepared to parse all three
  if (toolTips?.grid_1x1 != null && 
    toolTips?.grid_2x1 != null && 
    toolTips?.grid_3x1 != null && 
    toolTips?.grid_2x2 != null && 
    toolTips?.grid_3x2 != null && 
    toolTips?.grid_6x3 != null) { // Arrangment
    jsx = (
      <div className='coin-sort-tool-tips'>
        <div className='coin-sort-tool-tips-title'>
          {toolTips.title}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{color: '#183848'}}>1 x 1 Grid:</strong> {toolTips.grid_1x1}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{color: '#183848'}}>2 x 1 Grid:</strong> {toolTips.grid_2x1}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{color: '#183848'}}>3 x 1 Grid:</strong> {toolTips.grid_3x1}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{color: '#183848'}}>2 x 2 Grid:</strong> {toolTips.grid_2x2}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{color: '#183848'}}>3 x 2 Grid:</strong> {toolTips.grid_3x2}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{color: '#183848'}}>6 x 3 Grid:</strong> {toolTips.grid_6x3}
        </div>
      </div>
    );
  } else if (toolTips?.sub_title != null &&
    toolTips?.minting_date != null &&
    toolTips?.material != null &&
    toolTips?.issuing_authority != null &&
    toolTips?.governing_power != null &&
    toolTips?.size != null) { // Sorting
    jsx = (
      <div className='coin-sort-tool-tips'>
        <div className='coin-sort-tool-tips-title'>
          {toolTips.title}
        </div>
        <div className='coin-sort-tool-tips-text'>
          {toolTips.sub_title}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{color: '#183848'}}>Minting Date:</strong> {toolTips.minting_date}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{color: '#183848'}}>Material:</strong> {toolTips.material}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{color: '#183848'}}>Issuing Authority:</strong> {toolTips.issuing_authority}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{color: '#183848'}}>Governing Power:</strong> {toolTips.governing_power}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{color: '#183848'}}>Size:</strong> {toolTips.size}
        </div>
      </div>
    );
  } else if (toolTips?.sub_title != null &&
    toolTips?.minting_date != null &&
    toolTips?.material != null &&
    toolTips?.issuing_authority != null &&
    toolTips?.governing_power != null &&
    toolTips?.type != null) { // Filtering
    jsx = (
      <div className='coin-sort-tool-tips'>
        <div className='coin-sort-tool-tips-title'>
          {toolTips.title}
        </div>
        <div className='coin-sort-tool-tips-text'>
          {toolTips.sub_title}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{color: '#183848'}}>Minting Date:</strong> {toolTips.minting_date}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{color: '#183848'}}>Material:</strong> {toolTips.material}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{color: '#183848'}}>Issuing Authority:</strong> {toolTips.issuing_authority}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{color: '#183848'}}>Governing Power:</strong> {toolTips.governing_power}
        </div>
        <div className='coin-sort-tool-tips-text'>
          <strong style={{color: '#183848'}}>Type:</strong> {toolTips.type}
        </div>
      </div>
    );
  } else {
    console.err('Tool tip with this set of objects is not setup:', toolTips);
  }
  const CloseHandler = () => {
    props.onClose(false);
  };

  return (
    <WhitePopUp show={props.show} onClose={CloseHandler}>
      {jsx}
    </WhitePopUp>
  );
}

export const MainText = (props) => {
  return (
    <div id='coin-sort-main-text-wrapper'>
      <div id='coin-sort-main-text'>
        <div id='coin-sort-main-text-title'>
          {props.content?.title}
        </div>
        <div id='coin-sort-main-text' dangerouslySetInnerHTML={Markup(props.content?.text)}/>
      </div>
    </div>
  );
}
