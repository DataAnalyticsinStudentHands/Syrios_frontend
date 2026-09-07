/**
 * Event.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders the timeline event detail popup.
 *
 * Refactor Summary:
 * 1. Improved Tag Compatibility
 *    - Supports both raw relation-shaped tags and flatter tag objects
 *
 * 2. Improved Safety
 *    - Guards missing tag arrays and missing text fields
 *    - Replaces unstable Math.random keys
 *
 * 3. Preserved Existing Behavior
 *    - Popup layout, description rendering, and tag display remain unchanged
 *
 * Notes:
 * - This component does not fetch API data directly
 * - Works with event metadata shaped by `Timeline.jsx` / `TimeLineInfo.jsx`
 */

import React from 'react';
import { createMarkup } from 'src/utils/Markup';
import WhitePopUp from 'src/utils/WhitePopUp';

function renderTag(tagData, index, prefix) {
  const text = tagData?.topic?.length > 0
    ? tagData.topic
    : tagData?.governing_power?.length > 0
      ? tagData.governing_power
      : '';

  if (!text) return null;

  return (
    <div
      key={`${prefix}-${tagData.id ?? text}-${index}`}
      className='event-tag'
      style={{ backgroundColor: tagData.color }}
    >
      <p className='tag-text'>{text}</p>
    </div>
  );
}

function loadTags(governingPowers, topics) {
  const jsxArr = [];

  const governingPowerRows = Array.isArray(governingPowers?.data)
    ? governingPowers.data
    : Array.isArray(governingPowers)
      ? governingPowers
      : [];

  const topicRows = Array.isArray(topics?.data)
    ? topics.data
    : Array.isArray(topics)
      ? topics
      : [];

  governingPowerRows.forEach((item, index) => {
    const tagData = item?.attributes || item || {};
    const jsx = renderTag(tagData, index, 'gp');
    if (jsx) jsxArr.push(jsx);
  });

  topicRows.forEach((item, index) => {
    const tagData = item?.attributes || item || {};
    const jsx = renderTag(tagData, index, 'topic');
    if (jsx) jsxArr.push(jsx);
  });

  return jsxArr;
}

const EventInfo = (props) => {
  const CloseHandler = () => {
    props.onClose(false);
  };

  const eventMetaData = props.eventMetaData || {};

  return (
    <WhitePopUp show={props.show} onClose={CloseHandler}>
      <div id='event-info'>
        <div id='event-info-inner-div'>
          <div id='event-title'>
            <p>{eventMetaData.title}</p>
          </div>

          <div
            id='event-description'
            dangerouslySetInnerHTML={createMarkup(eventMetaData.text || '')}
          />

          <div className='light-green-background'>
            <div id='event-connections'>
              <p id='event-connections-text' className='gray-text'>
                TAGS
              </p>
              <div id='event-tags' className='my-3'>
                {loadTags(eventMetaData.governing_powers, eventMetaData.topics)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </WhitePopUp>
  );
};

export default EventInfo;