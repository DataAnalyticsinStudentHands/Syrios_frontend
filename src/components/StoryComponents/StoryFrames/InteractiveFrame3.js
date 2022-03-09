/* eslint-disable eqeqeq */
import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap";
import ReactMarkdown from 'react-markdown';
import {subcomponent_image, SwitchBack, SwitchFront} from "../ComponentFunction/index";

const InteractiveFrame3 = (zone, index, jsonObject) =>{

    const switchForFront = (dom) =>{
      
      let imgLeftDiv = dom.childNodes[0]
      let textmidDiv = dom.childNodes[1].childNodes[1].childNodes[0]
      let imgRightDiv = dom.childNodes[2]
      SwitchBack(imgLeftDiv)
      SwitchBack(textmidDiv)
      SwitchBack(imgRightDiv)
      // imgLeftDiv.childNodes[1].style.opacity = '0.0';
      // setTimeout(() => {
      //   try {
      //     imgLeftDiv.childNodes[1].style.display = 'none';
      //     imgLeftDiv.childNodes[0].style.display = 'block';
      //   } catch (error) {
      //     console.error(error);
      //   }
      //   setTimeout(() => {
      //     try {
      //       imgLeftDiv.childNodes[0].style.opacity = '1.0';
      //     } catch (error) {
      //       console.error(error);
      //     }
      //   });
      // }, 400);
  
      // textmidDiv.childNodes[1].style.opacity = '0.0';
      // setTimeout(() => {
      //   try {
      //     textmidDiv.childNodes[1].style.display = 'none';
      //     textmidDiv.childNodes[0].style.display = 'block';
      //   } catch (error) {
      //     console.error(error);
      //   }
      //   setTimeout(() => {
      //     try {
      //       textmidDiv.childNodes[0].style.opacity = '1.0';
      //     } catch (error) {
      //       console.error(error);
      //     }
      //   });
      // }, 400);
  
      // imgRightDiv.childNodes[1].style.opacity = '0.0';
      // setTimeout(() => {
      //   try {
      //     imgRightDiv.childNodes[1].style.display = 'none';
      //     imgRightDiv.childNodes[0].style.display = 'block';
      //   } catch (error) {
      //     console.error(error);
      //   }
      //   setTimeout(() => {
      //     try {
      //       imgRightDiv.childNodes[0].style.opacity = '1.0';
      //     } catch (error) {
      //       console.error(error);
      //     }
      //   });
      // }, 400);
    }
  
    const switchForBack = (dom) =>{  
      let imgLeftDiv = dom.childNodes[0]
      let textmidDiv = dom.childNodes[1].childNodes[1].childNodes[0]
      let imgRightDiv = dom.childNodes[2]
      SwitchFront(imgLeftDiv)
      SwitchFront(textmidDiv)
      SwitchFront(imgRightDiv)
      // imgLeftDiv.childNodes[0].style.opacity = '0.0';
      // setTimeout(() => {
      //   try {
      //     imgLeftDiv.childNodes[0].style.display = 'none';
      //     imgLeftDiv.childNodes[1].style.display = 'block';
      //   } catch (error) {
      //     console.error(error);
      //   }
      //   setTimeout(() => {
      //     try {
      //       imgLeftDiv.childNodes[1].style.opacity = '1.0';
      //     } catch (error) {
      //       console.error(error);
      //     }
      //   });
      // }, 400);
  
      // textmidDiv.childNodes[0].style.opacity = '0.0';
      // setTimeout(() => {
      //   try {
      //     textmidDiv.childNodes[0].style.display = 'none';
      //     textmidDiv.childNodes[1].style.display = 'block';
      //   } catch (error) {
      //     console.error(error);
      //   }
      //   setTimeout(() => {
      //     try {
      //       textmidDiv.childNodes[1].style.opacity = '1.0';
      //     } catch (error) {
      //       console.error(error);
      //     }
      //   });
      // }, 400);
  
      // imgRightDiv.childNodes[0].style.opacity = '0.0';
      // setTimeout(() => {
      //   try {
      //     imgRightDiv.childNodes[0].style.display = 'none';
      //     imgRightDiv.childNodes[1].style.display = 'block';
      //   } catch (error) {
      //     console.error(error);
      //   }
      //   setTimeout(() => {
      //     try {
      //       imgRightDiv.childNodes[1].style.opacity = '1.0';
      //     } catch (error) {
      //       console.error(error);
      //     }
      //   });
      // }, 400);
    }
  
    return(
      <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
        backgroundBlendMode:'multiply'}}>
        <Container>
          <Row>
            <Col>
              <ReactMarkdown className='OrangeText MainText text-center my-5'>
                {zone.main_text}
              </ReactMarkdown>
            </Col>
          </Row>
          <Row className='d-flex justify-content-around'>
            {/* image_lieft */}
            <Col xs={3}>
              <div style={{display:'black', opacity:1, transition:'0.3s'}}>
                {subcomponent_image(zone.image_left_front)}
              </div>
              <div style={{display:'none', opacity:0, transition:'0.3s'}}>
                {subcomponent_image(zone.image_left_back)}
              </div>
            </Col>
            {/* text in the middle */}
            <Col xs={5} className='justify-content-between d-flex flex-column'>
                <Row className='d-flex justify-content-center'>
                </Row>
                <Row className='d-flex justify-content-center' >
                  <Col xs={{span:9}} className='text-center GrayText SubText'>
                    <p style={{display:'black', opacity:1, transition:'0.3s'}}>
                      {zone.sub_text_mid_front}
                    </p>
                    <p style={{display:'none', opacity:0, transition:'0.3s'}}>
                      {zone.text_mid_back}
                    </p>
                  </Col>
                </Row>
  
                <Row className='d-flex justify-content-center'>
                  <Col className='d-flex justify-content-center'>
                      <button	
                        className='BlueText text-center my-2' 
                        style={{width: '150px'}}
                        onClick={(e)=>{
                          let dom = e.target.parentElement.parentElement.parentElement.parentElement
                          // console.log(dom)
                          switchForFront(dom)
                        }}
                      >
                        Government
                      </button>
                  </Col>
                  <Col className='d-flex justify-content-center'>
                      <button	
                        className='BlueText text-center my-2' 
                        style={{width: '150px'}}
                        onClick={(e)=>{
                          let dom = e.target.parentElement.parentElement.parentElement.parentElement
                          // console.log(dom)
                          switchForBack(dom)
                        }}
                      >
                        Values
                      </button>
                  </Col>
                </Row>
            </Col>
            {/* image right */}
            <Col xs={3}>
              <div style={{display:'black', opacity:1, transition:'0.3s'}}>
                {subcomponent_image(zone.image_right_front)}
              </div>
              <div style={{display:'none', opacity:0, transition:'0.3s'}}>
                {subcomponent_image(zone.image_right_back)}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
export default InteractiveFrame3