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
            <TextComponent text = {zone.tt_text_right}/>
          </Col>
        </Row>
      )
    }
    else if((zone.tt_text_right.text === '' || zone.tt_text_right.text === null) && (zone.tt_text_right.caption === '' || zone.tt_text_right.caption === null)){
      return(
        <Row className="d-flex justify-content-around align-items-center">
          <Col xs={6}>
            <TextComponent text = {zone.tt_text_left}/>
          </Col>
        </Row>
      )
    }
    else{
      return(
        <Row className="d-flex justify-content-around align-items-center">
          <Col xs={5}>
            <TextComponent text = {zone.tt_text_left}/>
          </Col>
          <Col xs={5}>
            <TextComponent text = {zone.tt_text_right}/>
          </Col>
        </Row>
      )
    }
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
          {/* <Row className="d-flex justify-content-around align-items-center mb-5">
            <Col xs={5}>
              <TextComponent text = {zone.tt_text_left}/>
            </Col>
            <Col xs={5}>
              <TextComponent text = {zone.tt_text_right}/>
            </Col>
          </Row> */}
          <TextTxtBody/>
          <Row className="mt-5">
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
            backgroundBlendMode:'multiply',
          }}
        >
        <Container>
          <Row className="mb-5">
            <HeadComponent storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/>
          </Row>
          {/* <Row className="d-flex justify-content-around align-items-center mt-5">
            <Col xs={5}>
              <TextComponent text = {zone.tt_text_left}/>
            </Col>
            <Col xs={5}>
              <TextComponent text = {zone.tt_text_right}/>
            </Col>
          </Row> */}
          <TextTxtBody/>
        </Container>
      </div>
      )

    }
  }
  export default TextText