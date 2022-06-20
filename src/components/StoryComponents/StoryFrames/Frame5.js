import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap"
import {SubcomponentImage, TextComponent, HeadComponent } from "../ComponentFunction/index";

const Frame5 = (zone, index, json_object) =>{
  if (zone.head.updown_switch){
    return(
      <div key={`story_comp_${index}`} className='section' style={{backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`, backgroundBlendMode:'multiply'}}>
      <Container>
        <Row className='d-flex justify-content-between align-items-center'>
            <Col >
              {SubcomponentImage(zone.image5_left)}

            </Col>
            <Col >
              <TextComponent text = {zone.text5_middle}/>
            </Col>
            <Col >
              {SubcomponentImage(zone.image5_right)}
            </Col>
        </Row>
        <Row className='d-flex justify-content-center mt-5'>
        <HeadComponent storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/>
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
        <HeadComponent storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/>
        </Row>
        <Row className='d-flex justify-content-between align-items-center'>
          <Col xs={3}>
            {SubcomponentImage(zone.image5_left)}
          </Col>
          <Col xs={3}>
            <TextComponent text = {zone.text5_middle}/>
          </Col>
          <Col xs={3}>
            {SubcomponentImage(zone.image5_right)}
          </Col>
        </Row>
      </Container>
    </div>
    )
  }
  }

  export default Frame5
