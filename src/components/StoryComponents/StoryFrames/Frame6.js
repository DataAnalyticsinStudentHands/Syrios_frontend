/* eslint-disable eqeqeq */
import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap"
import { SubcomponentImage, SubCapBlueBg } from "../ComponentFunction/index";

import createMarkup from 'src/utils/Markup.js';

const Frame6 = (zone, index) =>{
  let grid = {
    "half": 2,
    "third": 3,
    "quarter": 4,
    "two":1.5,
    "three":1.333333,
    "four":1.25
  };

    let frame_body = undefined
    if (zone.left_right_switch){
      frame_body=(
        <>
          <Col xs={(12/grid[zone.grid])-1} className='gray-text caption-text text-center'>
            {SubCapBlueBg(zone.text6)}
          </Col>
          <Col xs={(12/grid[zone.grid])*(grid[zone.grid]-1)-1}>
            {SubcomponentImage(zone.image6)}
          </Col>
        </>
      )
    }
    else{
      frame_body=(
        <>
          <Col xs={(12/grid[zone.grid])*(grid[zone.grid]-1)-1}>
            {SubcomponentImage(zone.image6)}
          </Col>
          <Col xs={(12/grid[zone.grid])-1} className='gray-text caption-text text-center'>
            {SubCapBlueBg(zone.text6)}
          </Col>
        </>
      )
    }

    if (zone.head.updown_switch){
      return(
        <div 
          key={`story_comp_${index}`} 
          className='section' 
          style={{ 
            backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`,
            backgroundBlendMode:'multiply'
          }}
        >
        <Container>
          <Row className='d-flex justify-content-between align-items-center'>
            {frame_body}
          </Row>
          <Row className='d-flex justify-content-center '>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='orange-text main-text text-center'/>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='gray-text caption-text text-center'/>
          </Row>
  
        </Container>
      </div>
      )
    }
    else{
      return(
        <div 
          key={`story_comp_${index}`} 
          className='section' 
          style={{ 
            backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`,
            backgroundBlendMode:'multiply'
          }}
        >
        <Container>
          <Row className='d-flex justify-content-center'>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='orange-text main-text text-center'/>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='gray-text caption-text text-center'/>
          </Row>
          <Row className='d-flex justify-content-around align-items-center'>
            {frame_body}
          </Row>
        </Container>
      </div>
      )
    }

  }
  export default Frame6
