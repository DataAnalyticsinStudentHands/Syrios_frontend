import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap"
import { SubcomponentImage } from "../ComponentFunction/index";


import createMarkup from 'src/utils/Markup.js';

const Frame4 = (zone, index) =>{
  if (zone.head.updown_switch){
    return(
      <div key={`story_comp_${index}`} className='section' style={{backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`, backgroundBlendMode:'multiply'}}>
      <Container>
        <Row className='d-flex justify-content-around align-items-end '>
            <Col xs={3}>
              {SubcomponentImage(zone.image_left)}
            </Col>
            <Col xs={3}>
              {SubcomponentImage(zone.image_middle)}
            </Col>
            <Col xs={3}>
              {SubcomponentImage(zone.image_right)}
            </Col>
        </Row>
        <Row className='d-flex justify-content-center mt-5'>
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
          <Col >
            {SubcomponentImage(zone.image_left)}
          </Col>
          <Col >
            {SubcomponentImage(zone.image_middle)}
          </Col>
          <Col>
            {SubcomponentImage(zone.image_right)}
          </Col>
        </Row>
      </Container>
    </div>
    )
  }
}

  export default Frame4
