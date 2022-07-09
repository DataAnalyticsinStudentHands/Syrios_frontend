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
  return(
    <div 
      className='section' 
      style={{ 
        backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`,
        backgroundBlendMode:'multiply'
      }}
    >
      {zone.head.updown_switch ?(
      <Container>
        <Row className='d-flex justify-content-between align-items-center'>
          {zone.left_right_switch ?(
          <>
            <Col xs={`${grid[zone.grid_option]}`}><TextComponent text = {zone.it_text}/></Col>
            <Col><ImageComponent image = {zone.it_image}/></Col>
          </>
          ):(
          <>
            <Col xs={`${grid[zone.grid_option]}`}><ImageComponent image = {zone.it_image}/></Col>
            <Col><TextComponent text = {zone.it_text}/></Col>
          </>
          )}
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
        <Row className='d-flex justify-content-around align-items-center'>
          {zone.left_right_switch ?(
            <>
              <Col xs={`${grid[zone.grid_option]}`}><TextComponent text = {zone.it_text}/></Col>
              <Col><ImageComponent image = {zone.it_image}/></Col>
            </>
          ):(
            <>
              <Col xs={`${grid[zone.grid_option]}`}><ImageComponent image = {zone.it_image}/></Col>
              <Col><TextComponent text = {zone.it_text}/></Col>
            </>
          )}
          </Row>
      </Container>)}
      <button
            onClick={()=>props.fullpageApi.moveTo(1)}
            className='back-to-top '
          > BACK TO TOP <b className='back-to-top-icon'>&#xe807;</b></button>  
  </div>
  )

  }
  export default ImageText
