/* eslint-disable eqeqeq */
import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap";
import ReactMarkdown from 'react-markdown';
import { IsEmptyOrWhiteSpace } from "../ComponentFunction/index";

import createMarkup from 'src/utils/Markup.js';

const InteractiveFrame1 = (zone, index, json_object) => {  
  let blueBackgroundMaxHeight = '200px';

  const FadeThenSwitchCompAndReset = (dom) => { // This function REQUIRES e.target to be compare scale or reset scale
    // There are more try catches here than the amount of classes you have to take to get a degree.
    let interactive_frame1_compare_scale = undefined;
    let interactive_frame1_reset_scale = undefined;
    // Avoid fast clickers from breaking website
    try {
      let compareScaleActive = true;

      // Are we rendering compare or reset scale?
      if (dom.className.includes('interactive-frame1-compare-scale')) {
        interactive_frame1_compare_scale = dom;
        interactive_frame1_reset_scale = dom.nextSibling;
        compareScaleActive = true;
      } else {
        interactive_frame1_compare_scale = dom.previousSibling;
        interactive_frame1_reset_scale = dom;
        compareScaleActive = false;
      }

      // Leave IF the compare scale to reset scale animation has yet to finish
      let computedOpacityCompareScale = window.getComputedStyle(interactive_frame1_compare_scale).opacity;
      let computedOpacityResetScale = window.getComputedStyle(interactive_frame1_reset_scale).opacity;
      if (computedOpacityCompareScale === 0 || computedOpacityCompareScale === 1 || computedOpacityResetScale === 0 || computedOpacityResetScale === 1) {
        return 0;
      }

      // Get the row with light blue background because we need to do some display switch and opacity flipping on the sub elements
      let row_light_blue_background = dom;

      while (!row_light_blue_background.className.includes("row")) {
        row_light_blue_background = row_light_blue_background.parentElement;
      }
      row_light_blue_background = row_light_blue_background.previousSibling.previousSibling;

      let imgLeftDiv = row_light_blue_background.childNodes[0].childNodes[0];
      let textCenterDiv = row_light_blue_background.childNodes[1];
      let imgRightDiv = row_light_blue_background.childNodes[2].childNodes[0];

      // If compare scale is active then switch to reset scale else switch to compare scale
      if (compareScaleActive) {
        // Compare scale to Reset scale
        interactive_frame1_compare_scale.style.opacity = '0.0';
        setTimeout(() => {
          try {
            interactive_frame1_compare_scale.style.display = 'none';
            interactive_frame1_reset_scale.style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              interactive_frame1_reset_scale.style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);

        // text center front to text center back
        // SwitchFront(textCenterDiv)
        textCenterDiv.childNodes[0].style.opacity = '0.0';
        setTimeout(() => {
          try {
            textCenterDiv.childNodes[0].style.display = 'none';
            textCenterDiv.childNodes[1].style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              textCenterDiv.childNodes[1].style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);

        // image left front to image left back
        // SwitchBack(imgLeftDiv)
        imgLeftDiv.childNodes[1].style.opacity = '0.0';
        setTimeout(() => {
          try {
            imgLeftDiv.childNodes[1].style.display = 'none';
            imgLeftDiv.childNodes[2].style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              imgLeftDiv.childNodes[2].style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);

        // image right front to image right back
        // SwitchBack(imgRightDiv)
        imgRightDiv.childNodes[1].style.opacity = '0.0';
        setTimeout(() => {
          try {
            imgRightDiv.childNodes[1].style.display = 'none';
            imgRightDiv.childNodes[2].style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              imgRightDiv.childNodes[2].style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);
      } else {
        // Reset scale to Compare scale
        interactive_frame1_reset_scale.style.opacity = '0.0';
        setTimeout(() => {
          try {
            interactive_frame1_compare_scale.style.display = 'block';
            interactive_frame1_reset_scale.style.display = 'none';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              interactive_frame1_compare_scale.style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);

        // text center back to text center front
        // SwitchBack(textCenterDiv)
        textCenterDiv.childNodes[1].style.opacity = '0.0';
        setTimeout(() => {
          try {
            textCenterDiv.childNodes[1].style.display = 'none';
            textCenterDiv.childNodes[0].style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              textCenterDiv.childNodes[0].style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);

        // image left back to image left front
        imgLeftDiv.childNodes[2].style.opacity = '0.0';
        setTimeout(() => {
          try {
            imgLeftDiv.childNodes[2].style.display = 'none';
            imgLeftDiv.childNodes[1].style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              imgLeftDiv.childNodes[1].style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);

        // image right back to image right front
        imgRightDiv.childNodes[2].style.opacity = '0.0';
        setTimeout(() => {
          try {
            imgRightDiv.childNodes[2].style.display = 'none';
            imgRightDiv.childNodes[1].style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              imgRightDiv.childNodes[1].style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);
      }
    } catch (error) {
      console.error(error);
    }

  };
  return (
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>
      <Container className='justify-content-center align-items-center'>
        {/* Main text */}
        <Row className='mb-5'>
          <ReactMarkdown className='orange-text main-text text-center'>
            {zone.main_text}
          </ReactMarkdown>
          {/* <div dangerouslySetInnerHTML={createMarkup(zone.main_text)} className='orange-text main-text text-center'/> */}

        </Row>
        {/* Blue background css grid goodie */}
        <Row className='light-blue-background interactive-frame1-light-blue-sizing d-flex justify-content-around'>

          {/* Images left */}
          <Col xs={3}> 
            <div className='d-flex align-items-center justify-content-center interactive-frame1-image-outer-div' style={{height: blueBackgroundMaxHeight}}> {/* I fucking hate this. I HAVE to define the height element as an inline style. Not even !important css tag works in the Stories.css file */}
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.left_front11.data.attributes.url}`}
                alt={IsEmptyOrWhiteSpace(zone.left_front11.data.attributes.alternativeText) ? 'Interactive_frame_left_front_image' : zone.left_front11.data.attributes.alternativeText}
                className=' interactive-frame1-image-front-left'
                id='interactive-frame1'
              />
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.left_back11.data.attributes.url}`}
                alt={IsEmptyOrWhiteSpace(zone.left_back11.data.attributes.alternativeText) ? 'Interactive_frame_left_back_image' : zone.left_back11.data.attributes.alternativeText}
                className=' interactive-frame1-image-back-left'
                id='interactive-frame1'
              />
            </div>
          </Col>

          {/* Text_center */}
          <Col xs={5} className='d-flex align-items-center justify-content-center' style={{height: blueBackgroundMaxHeight}}>
            <div 
              dangerouslySetInnerHTML={createMarkup(zone.text_front)} 
              className='gray-text sub-text text-center interactive-frame1-text-front'
            />
            <div 
              dangerouslySetInnerHTML={createMarkup(zone.text_back)} 
              className='gray-text sub-text text-center interactive-frame1-text-back'
            />
          </Col>

          {/* Images Right */}
          <Col xs={3}> 
            <div className='d-flex align-items-center justify-content-center interactive-frame1-image-outer-div' style={{height: blueBackgroundMaxHeight}}> {/* I fucking hate this. I HAVE to define the height element as an inline style. Not even !important css tag works in the Stories.css file */}
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.right_front11.data.attributes.url}`}
                alt={IsEmptyOrWhiteSpace(zone.right_front11.data.attributes.alternativeText) ? 'Interactive_frame_right_front_image' : zone.right_front11.data.attributes.alternativeText}
                className=' interactive-frame1-image-front-right'
                id='interactive-frame1'
              />
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.right_back11.data.attributes.url}`}
                alt={IsEmptyOrWhiteSpace(zone.right_back11.data.attributes.alternativeText) ? 'Interactive_frame_right_back_image' : zone.right_back11.data.attributes.alternativeText}
                className=' interactive-frame1-image-back-right'
                id='interactive-frame1'
              />
            </div>
          </Col>
        </Row>
        {/* Compare Scale */}
        <Row>
          <Col className='d-flex align-items-center justify-content-center'>
            <i 
              className='demo-icon icon-coin-scale interactive-frame1-scale-icon'
              onClick={(e)=> {
                // Find dom parent element for compare scale and reset scale
                let dom = e.target.parentElement.parentElement.nextSibling.childNodes[0].childNodes;
                if (window.getComputedStyle(dom[0]).display.includes('block')) { // if compare scale is block
                  FadeThenSwitchCompAndReset(dom[0]); // then return compare scale
                } else {
                  FadeThenSwitchCompAndReset(dom[1]); // else return reset scale
                }
              }}>
              &#xe834;</i>
          </Col>
        </Row>
        <Row>
          <Col 
            className='d-flex align-items-center justify-content-center'
            onClick={(e) => {FadeThenSwitchCompAndReset(e.target)}}>
            <p className='orange-text interactive-frame1-compare-scale'>
              Compare Scale
            </p>
            <p className='orange-text interactive-frame1-reset-scale'>
              Reset Scale
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default InteractiveFrame1;
