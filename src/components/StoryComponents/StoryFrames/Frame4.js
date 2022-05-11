import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap"
import { subcomponent_image } from "../ComponentFunction/index";

function createMarkup(textTran){
  return {__html: textTran};
}
const Frame4 = (zone, index) =>{
  
  if (zone.head.updown_switch){
    return(
      <div key={`story_comp_${index}`} className='section' style={{backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`, backgroundBlendMode:'multiply'}}>
      <Container>
        <Row className='d-flex justify-content-between align-items-center mb-5'>
            <Col xs={3}>
              {subcomponent_image(zone.image_left)}
            </Col>
            <Col xs={3}>
              {subcomponent_image(zone.image_middle)}
            </Col>
            <Col xs={3}>
              {subcomponent_image(zone.image_right)}
            </Col>
        </Row>
        
        <Row className='d-flex justify-content-center '>
            <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='orange-text MainText text-center'/>
            <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='gray-text CaptionText text-center'/>
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
            <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='orange-text MainText text-center'/>
            <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='gray-text CaptionText text-center'/>
        </Row>
        <Row className='d-flex justify-content-between align-items-center'>
          <Col xs={3}>
            {subcomponent_image(zone.image_left)}
          </Col>
          <Col xs={3}>
            {subcomponent_image(zone.image_middle)}
          </Col>
          <Col xs={3}>
            {subcomponent_image(zone.image_right)}
          </Col>
        </Row>
      </Container>
    </div>
    )
  }
}

  export default Frame4