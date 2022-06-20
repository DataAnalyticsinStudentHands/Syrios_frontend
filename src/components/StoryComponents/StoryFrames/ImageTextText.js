import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap"
import { HeadComponent, ImageComponent, TextComponent } from "../ComponentFunction/index";

import createMarkup from 'src/utils/Markup.js';

const ImageTextText = (props) =>{
  let zone = props.zone

    console.log(zone)
    let grid = {
      "half": 6,
      "third": 4,
      "quarter": 3,
    };

    let frame_body = undefined
    if (zone.left_right_switch){
      frame_body=(
        <Container>
          <Col xs={`${grid[zone.grid_option]}`}>
            <Row className=''>
              <div dangerouslySetInnerHTML={createMarkup(zone.itt_text.text)} className={ `text-center ${zone.itt_text.text_class}`}/>
            </Row>
            <Row className=''>
              <TextComponent text = {zone.itt_texts}/>
            </Row>
          </Col>
          <Col>
            <ImageComponent image={zone.itt_image}/>
          </Col>
        </Container>
      )
    }
    else{
      frame_body=(
        <>
          <Col xs={`${grid[zone.grid_option]}`} >
            <ImageComponent image={zone.itt_image}/>
          </Col>
          <Col className=''>
            <Row  className='py-5'>
              <div dangerouslySetInnerHTML={createMarkup(zone.itt_text.text)} className={ `text-center ${zone.itt_text.text_class}`}/>
            </Row>
            <Row className=' py-5'>
            <TextComponent text = {zone.itt_texts}/>
            </Row>
          </Col>
        </>
      )
    }

    if (zone.head.updown_switch){
      return(
        <div className='section' style={{backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`, backgroundBlendMode:'multiply'}}>
        <Container>
          <Row className='d-flex justify-content-between align-items-center'>
            {frame_body}
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
        <div className='section' style={{backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`, backgroundBlendMode:'multiply'}}>
        <Container>
          <Row className='d-flex justify-content-center mb-5'>
            <HeadComponent storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/>
          </Row>
          <Row className='d-flex justify-content-around align-items-center'>
            {frame_body}
          </Row>
        </Container>
      </div>
      )
    }

  }
  export default ImageTextText
