import { Container, Row, Col } from "react-bootstrap"
import { HeadComponent, ImageComponent, TextComponent } from "../ComponentFunction/index";
import createMarkup from 'src/utils/Markup.js';

const ImageTextText = (props) =>{
  let zone = props.zone
  let grid = {"half": 6,"third": 4,"quarter": 3,};

  return(
    <div className='section stories-background' style={{ backgroundImage: zone.background.data === null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url})`}}>
    {zone.head.updown_switch ? (
      <Container>
      <Row className='d-flex justify-content-between align-items-center'>
        {zone.left_right_switch? (
          <Container>
            <Col xs={`${grid[zone.grid_option]}`}>
              <Row><div onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(zone.itt_text.text)} className={ `text-center ${zone.itt_text.text_class}`}/></Row>
              <Row><TextComponent toggleBottom={props.toggleBottom} text = {zone.itt_texts}/></Row>
            </Col>
            <Col><ImageComponent toggleBottom={props.toggleBottom} image={zone.itt_image}/></Col>
          </Container>
        ):(
          <Container>
            <Col xs={`${grid[zone.grid_option]}`} ><ImageComponent toggleBottom={props.toggleBottom} image={zone.itt_image}/></Col>
            <Col>
              <Row className='py-5'><div onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(zone.itt_text.text)} className={ `text-center ${zone.itt_text.text_class}`}/></Row>
              <Row className=' py-5'><TextComponent toggleBottom={props.toggleBottom} text = {zone.itt_texts}/></Row>
            </Col>
          </Container>
        )}
      </Row>
      <Row className='d-flex justify-content-center mt-5'><HeadComponent toggleBottom={props.toggleBottom} storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/></Row>
    </Container>
    ):(
      <Container>
        <Row className='d-flex justify-content-center mb-5'><HeadComponent toggleBottom={props.toggleBottom} storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/></Row>
      {zone.left_right_switch? (
        <Row className='d-flex justify-content-around align-items-center'>
          <Col xs={`${grid[zone.grid_option]}`}>
            <Row><div onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(zone.itt_text.text)} className={ `text-center ${zone.itt_text.text_class}`}/></Row>
            <Row><TextComponent toggleBottom={props.toggleBottom} text = {zone.itt_texts}/></Row>
          </Col>
          <Col><ImageComponent toggleBottom={props.toggleBottom} image={zone.itt_image}/></Col>
        </Row>
        ):(
          <Row className='d-flex justify-content-around align-items-center'>
            <Col xs={`${grid[zone.grid_option]}`} ><ImageComponent toggleBottom={props.toggleBottom} image={zone.itt_image}/></Col>
            <Col >
              <Row className='py-5'><div onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(zone.itt_text.text)} className={ `text-center ${zone.itt_text.text_class}`}/></Row>
              <Row className='py-5'><TextComponent toggleBottom={props.toggleBottom} text = {zone.itt_texts}/></Row>
            </Col>
          </Row>
        )}
    </Container>
    )}
        {props.index === 0 ? (<></>):(<button onClick={()=>props.fullpageApi.moveTo(1)} className='back-to-top'> BACK TO TOP <b className='back-to-top-icon'>&#xe807;</b></button> )}
  </div>
  )
}
export default ImageTextText
