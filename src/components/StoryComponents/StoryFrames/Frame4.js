import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap"
import { IsEmptyOrWhiteSpace, sub_cap_blue_bg } from "../ComponentFunction/index";


const Frame4 = (zone, index, jsonObject) =>{
  
    let subQuote = undefined;
  
    if (!IsEmptyOrWhiteSpace(zone.sub_text_left) && !IsEmptyOrWhiteSpace(zone.sub_text_right)) {
      subQuote = (
        <Row className='justify-content-between'>
            <Col xs={{span:5}} className='justify-content-center align-self-center'>
                {/* {subText(zone.sub_text_left)}
                {capText(zone.cap_text_left)} */}
                {sub_cap_blue_bg(zone.sub_text_left, zone.cap_text_left)}
            </Col>
            <Col xs={{span:5}} className='justify-content-center align-self-center'>
                {/* {subText(zone.sub_text_right)}
                {capText(zone.cap_text_right)} */}
                {sub_cap_blue_bg(zone.sub_text_right, zone.cap_text_right)}
            </Col>
        </Row>
      );
    }
    if (subQuote === undefined && !IsEmptyOrWhiteSpace(zone.sub_text_left)){
      subQuote = (
        <Row className='justify-content-between' >
          <Col xs={{span:5}} className='justify-content-center align-self-center'>
            {/* {subText(zone.sub_text_left)}
            {capText(zone.cap_text_left)} */}
            {sub_cap_blue_bg(zone.sub_text_left, zone.cap_text_left)}
          </Col>
        </Row>
      )
    }
    return(
      // eslint-disable-next-line eqeqeq
      <div key={`story_comp_${index}`} className='section' 
      style={{ 
        backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
        backgroundBlendMode:'multiply'}}>
        <Container className='justify-content-center align-items-center' style={{marginBottom:'30%'}}>
            {subQuote}
        </Container>
      </div>
    )
  }

  export default Frame4