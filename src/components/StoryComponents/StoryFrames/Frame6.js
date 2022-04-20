/* eslint-disable eqeqeq */
import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap"
import { subcomponent_image, sub_cap_blue_bg } from "../ComponentFunction/index";

function createMarkup(textTran){
  return {__html: textTran};
}
const Frame6 = (zone, index) =>{
  let grid = {
    "half": 2,
    "third": 3,
    "quarter": 4,
    "two":1.5,
    "three":1.333333,
    "four":1.25
  };

    let frameBody = undefined
    if (zone.left_right_switch){
      frameBody=(
        <>
          <Col xs={(12/grid[zone.grid])}>
            {sub_cap_blue_bg(zone.text6)}
          </Col>
          <Col xs={(12/grid[zone.grid])*(grid[zone.grid]-1)}>
            {subcomponent_image(zone.image6)}
          </Col>
        </>
      )
    }
    else{
      frameBody=(
        <>
          <Col xs={(12/grid[zone.grid])*(grid[zone.grid]-1)}>
            {subcomponent_image(zone.image6)}
          </Col>
          <Col xs={(12/grid[zone.grid])}>
            {sub_cap_blue_bg(zone.text6)}
          </Col>
        </>
      )
    }

    if (zone.head.updown_switch){
      return(
        <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,backgroundBlendMode:'multiply'}}>
        <Container>
          <Row className='d-flex justify-content-between align-items-center mb-5'>
            {frameBody}
          </Row>
          <Row className='d-flex justify-content-center '>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='OrangeText MainText text-center'/>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='GrayText CaptionText text-center'/>
          </Row>
  
        </Container>
      </div>
      )
    }
    else{
      return(
        <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,backgroundBlendMode:'multiply'}}>
        <Container>
          <Row className='d-flex justify-content-center mb-5'>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='OrangeText MainText text-center'/>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='GrayText CaptionText text-center'/>
          </Row>
          <Row className='d-flex justify-content-around align-items-center'>
            {frameBody}
          </Row>
        </Container>
      </div>
      )
    }

  }
  export default Frame6