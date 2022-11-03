import { Container, Row, Col } from "react-bootstrap"
import { HeadComponent, TextComponent, ImageComponent } from "../ComponentFunction/index";

const ImageText = (props) =>{
  let zone= props.zone
  return(
    <div className='section stories-background' style={{ backgroundImage: zone.background.data === null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url})`}}>
      {zone.head?.updown_switch ?
      <Container>
        <Row className='d-flex justify-content-between align-items-center'>
          {zone.left_right_switch ?(<>
            <Col><TextComponent toggleBottom={props.toggleBottom} text = {zone.it_text}/></Col>
            <Col xs={`${zone.image_grid}`}><ImageComponent toggleBottom={props.toggleBottom} image = {zone.it_image}/></Col>
          </>):(<>
            <Col xs={`${zone.image_grid}`}><ImageComponent toggleBottom={props.toggleBottom} image = {zone.it_image} /></Col>
            <Col><TextComponent toggleBottom={props.toggleBottom} text = {zone.it_text}/></Col>
          </>)}
        </Row>
        <Row className='d-flex justify-content-center mt-5'><HeadComponent toggleBottom={props.toggleBottom} storyMain = {zone.head?.head_main} storyCaption = {zone.head?.head_caption}/></Row>
      </Container>:       
      <Container>
        <Row className='d-flex justify-content-center mb-5'><HeadComponent toggleBottom={props.toggleBottom} storyMain = {zone.head?.head_main} storyCaption = {zone.head?.head_caption}/></Row>
        <Row className='d-flex justify-content-around align-items-center'>
          {zone.left_right_switch ?(<>
              <Col><TextComponent toggleBottom={props.toggleBottom} text = {zone.it_text}/></Col>
              <Col xs={`${zone.image_grid}`}><ImageComponent toggleBottom={props.toggleBottom} image = {zone.it_image}/></Col>
            </>):(<>
              <Col xs={`${zone.image_grid}`}><ImageComponent toggleBottom={props.toggleBottom} image = {zone.it_image}/></Col>
              <Col><TextComponent toggleBottom={props.toggleBottom} text = {zone.it_text}/></Col>
            </>)}
        </Row>
      </Container>}
      {props.index === 0 ? (<></>):(<button onClick={()=>props.fullpageApi.moveTo(1)} className='back-to-top'> BACK TO TOP <b className='back-to-top-icon'>&#xe807;</b></button> )}
  </div>
  )

  }
  export default ImageText
