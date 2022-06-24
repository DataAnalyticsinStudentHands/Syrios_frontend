/* eslint-disable eqeqeq */
import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap"
import { HeadComponent, TextComponent, ImageComponent } from "../ComponentFunction/index";


const ImageText = (props) =>{
  let grid = {
    "half": 6,
    "third": 4,
    "quarter": 3,
  };
let zone= props.zone
// let index= props.index
    let frame_body = undefined
    if (zone.left_right_switch){
      frame_body=(
        <>
          <Col xs={`${grid[zone.grid_option]}`}>
            <TextComponent text = {zone.it_text}/>
          </Col>
          <Col >
            <ImageComponent image = {zone.it_image}/>
          </Col>
        </>
      )
    }
    else{
      frame_body=(
        <>
          <Col xs={`${grid[zone.grid_option]}`}>
          <ImageComponent image = {zone.it_image}/>
          </Col>
          <Col >
          <TextComponent text = {zone.it_text}/>
          </Col>
        </>
      )
    }

    if (zone.head.updown_switch){
      return(
        <div 
          // key={`story_comp_${index}`} 
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
          <Row className='d-flex justify-content-center mt-5'>
          <HeadComponent storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/>
          </Row>
  
        </Container>
      </div>
      )
    }
    else{
      return(
        <div 
          // key={`story_comp_${index}`} 
          className='section' 
          style={{ 
            backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`,
            backgroundBlendMode:'multiply'
          }}
        >
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
  export default ImageText
