import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap";
import IsEmptyOrWhiteSpace from '../ComponentFunction/IsEmptyOrWhiteSpace';
import ReactMarkdown from 'react-markdown';


const InteractiveFrame1 = (zone, index, jsonObject) => {
    let blueBackgroundMaxHeight = '200px';
  
    const FadeThenSwitchCompAndReset = (dom) => { // This function REQUIRES e.target to be compare scale or reset scale
      // There are more try catches here than the amount of classes you have to take to get a degree.
      let InteractiveFrame1CompareScale = undefined;
      let InteractiveFrame1ResetScale = undefined;
      // Avoid fast clickers from breaking website
      try {
        let compareScaleActive = true;
  
        // Are we rendering compare or reset scale?
        if (dom.className.includes('InteractiveFrame1CompareScale')) {
          InteractiveFrame1CompareScale = dom;
          InteractiveFrame1ResetScale = dom.nextSibling;
          compareScaleActive = true;
        } else {
          InteractiveFrame1CompareScale = dom.previousSibling;
          InteractiveFrame1ResetScale = dom;
          compareScaleActive = false;
        }
  
        // Leave IF the compare scale to reset scale animation has yet to finish
        let computedOpacityCompareScale = window.getComputedStyle(InteractiveFrame1CompareScale).opacity;
        let computedOpacityResetScale = window.getComputedStyle(InteractiveFrame1ResetScale).opacity;
        if (computedOpacityCompareScale === 0 || computedOpacityCompareScale === 1 || computedOpacityResetScale === 0 || computedOpacityResetScale === 1) {
          return 0;
        }
  
        // Get the row with light blue background because we need to do some display switch and opacity flipping on the sub elements
        let rowLightBlueBackground = dom;
  
        while (!rowLightBlueBackground.className.includes("row")) {
          rowLightBlueBackground = rowLightBlueBackground.parentElement;
        }
        rowLightBlueBackground = rowLightBlueBackground.previousSibling.previousSibling;
  
        let imgLeftDiv = rowLightBlueBackground.childNodes[0].childNodes[0];
        let textCenterDiv = rowLightBlueBackground.childNodes[1];
        let imgRightDiv = rowLightBlueBackground.childNodes[2].childNodes[0];
        
  
        // If compare scale is active then switch to reset scale else switch to compare scale
        if (compareScaleActive) {
          // Compare scale to Reset scale
          InteractiveFrame1CompareScale.style.opacity = '0.0';
          setTimeout(() => {
            try {
              InteractiveFrame1CompareScale.style.display = 'none';
              InteractiveFrame1ResetScale.style.display = 'block';
            } catch (error) {
              console.error(error);
            }
            setTimeout(() => {
              try {
                InteractiveFrame1ResetScale.style.opacity = '1.0';
              } catch (error) {
                console.error(error);
              }
            });
          }, 400);
  
          // text center front to text center back
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
          InteractiveFrame1ResetScale.style.opacity = '0.0';
          setTimeout(() => {
            try {
              InteractiveFrame1CompareScale.style.display = 'block';
              InteractiveFrame1ResetScale.style.display = 'none';
            } catch (error) {
              console.error(error);
            }
            setTimeout(() => {
              try {
                InteractiveFrame1CompareScale.style.opacity = '1.0';
              } catch (error) {
                console.error(error);
              }
            });
          }, 400);
  
          // text center back to text center front
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
          <Row>
            <Col>
              <ReactMarkdown className='OrangeText MainText text-center'>
                {zone.main_text}
              </ReactMarkdown>
            </Col>
          </Row>
          {/* Blue background css grid goodie */}
          <Row className='LightBlueBackground InteractiveFrame1LightBlueSizing d-flex justify-content-around'>
  
            {/* Images left */}
            <Col xs={3}> 
              <div className='d-flex align-items-center justify-content-center InteractiveFrame1ImageOuterDiv' style={{height: '200px'}}> {/* I fucking hate this. I HAVE to define the height element as an inline style. Not even !important css tag works in the Stories.css file */}
                <img
                  src={`${process.env.REACT_APP_strapiURL}${zone.image_left_front.url}`}
                  alt={IsEmptyOrWhiteSpace(zone.image_left_front.alternativeText) ? 'Interactive_frame_left_front_image' : zone.image_left_front.alternativeText}
                  className=' InteractiveFrame1ImageFrontLeft'
                  id='InteractiveFrame1'
                />
                <img
                  src={`${process.env.REACT_APP_strapiURL}${zone.image_left_back.url}`}
                  alt={IsEmptyOrWhiteSpace(zone.image_left_back.alternativeText) ? 'Interactive_frame_left_back_image' : zone.image_left_back.alternativeText}
                  className=' InteractiveFrame1ImageBackLeft'
                  id='InteractiveFrame1'
                />
              </div>
            </Col>
  
            {/* Text_center */}
            <Col xs={5} className='d-flex align-items-center justify-content-center' style={{height: blueBackgroundMaxHeight}}>
              <ReactMarkdown className='GrayText SubText text-center InteractiveFrame1TextFront'>
                {zone.sub_text_middle_front}
              </ReactMarkdown>
              <ReactMarkdown className='GrayText SubText text-center InteractiveFrame1TextBack'>
                {zone.sub_text_middle_back}
              </ReactMarkdown>
            </Col>
  
            {/* Images Right */}
            <Col xs={3}> 
              <div className='d-flex align-items-center justify-content-center InteractiveFrame1ImageOuterDiv' style={{height: '200px'}}> {/* I fucking hate this. I HAVE to define the height element as an inline style. Not even !important css tag works in the Stories.css file */}
                <img
                  src={`${process.env.REACT_APP_strapiURL}${zone.image_right_front.url}`}
                  alt={IsEmptyOrWhiteSpace(zone.image_right_front.alternativeText) ? 'Interactive_frame_right_front_image' : zone.image_right_front.alternativeText}
                  className=' InteractiveFrame1ImageFrontRight'
                  id='InteractiveFrame1'
                />
                <img
                  src={`${process.env.REACT_APP_strapiURL}${zone.image_right_back.url}`}
                  alt={IsEmptyOrWhiteSpace(zone.image_right_back.alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_right_back.alternativeText}
                  className=' InteractiveFrame1ImageBackRight'
                  id='InteractiveFrame1'
  
                />
              </div>
            </Col>
          </Row>
          {/* Compare Scale */}
          <Row>
            <Col className='d-flex align-items-center justify-content-center'>
              <i 
                className='demo-icon icon-coin-scale InteractiveFrame1ScaleIcon'
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
              <p className='OrangeText InteractiveFrame1CompareScale'>
                Compare Scale
              </p>
              <p className='OrangeText InteractiveFrame1ResetScale'>
                Reset Scale
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

  export default InteractiveFrame1