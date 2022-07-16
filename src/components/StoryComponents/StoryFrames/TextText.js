import { Container, Row, Col } from "react-bootstrap"
import backGround from 'src/assets/background.jpg';
import { HeadComponent, TextComponent } from "../ComponentFunction/index";

const TextText = (props) => {
  let zone = props.zone
  const TextTxtBody = ()=>{
    if ((zone.tt_text_left.text === '' || zone.tt_text_left.text === null) && (zone.tt_text_left.caption === '' || zone.tt_text_left.caption === null)){
      return(
        <Row className="d-flex justify-content-around align-items-center">
          <Col xs={6}>
            <TextComponent toggleBottom={props.toggleBottom} text = {zone.tt_text_right}/>
          </Col>
        </Row>
      )
    }
    else if((zone.tt_text_right.text === '' || zone.tt_text_right.text === null) && (zone.tt_text_right.caption === '' || zone.tt_text_right.caption === null)){
      return(
        <Row className="d-flex justify-content-around align-items-center">
          <Col xs={6}>
            <TextComponent toggleBottom={props.toggleBottom} text = {zone.tt_text_left}/>
          </Col>
        </Row>
      )
    }
    else{
      return(
        <Row className="d-flex justify-content-around align-items-center">
          <Col xs={5}>
            <TextComponent toggleBottom={props.toggleBottom} text = {zone.tt_text_left}/>
          </Col>
          <Col xs={5}>
            <TextComponent toggleBottom={props.toggleBottom} text = {zone.tt_text_right}/>
          </Col>
        </Row>
      )
    }
  }

      return(
        <div 
          className='section' 
          style={{ 
            backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`,
            backgroundBlendMode:'multiply',
          }}
        >
        {zone.head.updown_switch ?(
        <Container>
          <TextTxtBody/>
          <Row className="mt-5">
            <HeadComponent toggleBottom={props.toggleBottom} storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/>
          </Row>
        </Container>
        ):(
          <Container>
            <Row className="mb-5">
              <HeadComponent toggleBottom={props.toggleBottom} storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/>
            </Row>
            <TextTxtBody/>
          </Container>
        )}
        {props.index === 0 ? (<></>):(<button onClick={()=>props.fullpageApi.moveTo(1)} className='back-to-top'> BACK TO TOP <b className='back-to-top-icon'>&#xe807;</b></button> )}
      </div>
      )

  }
  export default TextText
