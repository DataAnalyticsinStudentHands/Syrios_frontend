import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap"
import { SubcomponentImage, SubCapBlueBg } from "../ComponentFunction/index";

import createMarkup from 'src/utils/Markup.js';

const Frame7 = (zone, index) =>{

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
          <Col xs={Math.round((12/grid[zone.grid]))}>
            <Row className=''>
              <div dangerouslySetInnerHTML={createMarkup(zone.text7.text)} className={ `text-left story-h3`}/>
            </Row>
            <Row className=''>
              {SubCapBlueBg(zone.right)}
            </Row>
          </Col>
          <Col xs={Math.round((12/grid[zone.grid])*(grid[zone.grid]-1))}>
            {SubcomponentImage(zone.left)}
          </Col>
        </>
      )
    }
    else{
      frame_body=(
        <>
          <Col xs={7}>
            {SubcomponentImage(zone.left)}
          </Col>
          <Col xs={5}>
            <Row className=''>
              <div dangerouslySetInnerHTML={createMarkup(zone.text7.text)} className={ `text-left story-h3`}/>
            </Row>
            <Row className=''>
              {SubCapBlueBg(zone.right)}
            </Row>
          </Col>
        </>
      )
    }

    if (zone.head.updown_switch){
      return(
        <div key={`story_comp_${index}`} className='section' style={{backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`, backgroundBlendMode:'multiply'}}>
        <Container>
          <Row className='d-flex justify-content-between align-items-center'>
            {frame_body}
          </Row>
          <Row className='d-flex justify-content-center'>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='story-h2 text-center'/>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='story-text text-center'/>
          </Row>
  
        </Container>
      </div>
      )
    }
    else{
      return(
        <div key={`story_comp_${index}`} className='section' style={{backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`, backgroundBlendMode:'multiply'}}>
        <Container>
          <Row className='d-flex justify-content-center'>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='story-h2 text-center'/>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='story-text text-center'/>
          </Row>
          <Row className='d-flex justify-content-around align-items-center'>
            {frame_body}
          </Row>
        </Container>
      </div>
      )
    }

  }
  export default Frame7
