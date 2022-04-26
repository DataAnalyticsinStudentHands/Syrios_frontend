import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap"
import {sub_cap_blue_bg, subcomponent_image  } from "../ComponentFunction/index";

function createMarkup(textTran){
  return {__html: textTran};
}
const Frame5 = (zone, index, jsonObjct) =>{
  if (zone.head.updown_switch){
    return(
      <div key={`story_comp_${index}`} className='section' style={{backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`, backgroundBlendMode:'multiply'}}>
      <Container>
        <Row className='d-flex justify-content-between align-items-center mb-5'>
            <Col xs={3}>
              {subcomponent_image(zone.image_left)}
            </Col>
            <Col xs={3}>
              {sub_cap_blue_bg(zone.middle)}
            </Col>
            <Col xs={3}>
              {subcomponent_image(zone.image_right)}
            </Col>
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
      <div key={`story_comp_${index}`} className='section' style={{backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`, backgroundBlendMode:'multiply'}}>
      <Container>
        <Row className='d-flex justify-content-center mb-5'>
            <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='OrangeText MainText text-center'/>
            <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='GrayText CaptionText text-center'/>
        </Row>
        <Row className='d-flex justify-content-between align-items-center'>
          <Col xs={3}>
            {subcomponent_image(zone.left)}
          </Col>
          <Col xs={3}>
          {sub_cap_blue_bg(zone.middle)}
          </Col>
          <Col xs={3}>
            {subcomponent_image(zone.right)}
          </Col>
        </Row>
      </Container>
    </div>
    )
  }
  }

  export default Frame5