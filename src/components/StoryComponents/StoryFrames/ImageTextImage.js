import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap"
import {TextComponent, HeadComponent, ImageComponent } from "../ComponentFunction/index";

const ImageTextImage = (props) =>{
  let zone = props.zone
    return(
      <div className='section' style={{backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`, backgroundBlendMode:'multiply'}}>
      {zone.head.updown_switch ? (
        <Container>
          <Row className='d-flex justify-content-between align-items-center'>
              <Col><ImageComponent image = {zone.iti_image_left}/></Col>
              <Col><TextComponent text = {zone.iti_text_middle}/></Col>
              <Col><ImageComponent image = {zone.iti_image_right}/></Col>
          </Row>
          <Row className='d-flex justify-content-center mt-5'>
            <HeadComponent storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/>
          </Row>

        </Container>
      ):(
        <Container>
          <Row className='d-flex justify-content-center mb-5'>
            <HeadComponent storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/>
          </Row>
          <Row className='d-flex justify-content-between align-items-center'>
            <Col><ImageComponent image = {zone.iti_image_left}/></Col>
            <Col><TextComponent text = {zone.iti_text_middle}/></Col>
            <Col><ImageComponent image = {zone.iti_image_right}/></Col>
          </Row>
        </Container>
      )}
    </div>
    )
  // }
  }

  export default ImageTextImage
