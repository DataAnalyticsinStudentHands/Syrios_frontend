import backGround from 'src/assets/background.jpg';
import IsEmptyOrWhiteSpace from "../ComponentFunction/IsEmptyOrWhiteSpace";
import { Container, Row, Col } from "react-bootstrap"

import subText from "../ComponentFunction/subText";
import capText from "../ComponentFunction/capText";

const Frame4 = (zone, index, jsonObject) =>{
  
    let subQuote = undefined;
  
    if (!IsEmptyOrWhiteSpace(zone.sub_text_left) && !IsEmptyOrWhiteSpace(zone.sub_text_right)) {
      subQuote = (
        <Row className='justify-content-between'>
            <Col xs={{span:5}} className='LightBlueBackground justify-content-center align-self-center'style={{padding: '20px', paddingTop: '20px' }} >
                {subText(zone.sub_text_left)}
                {capText(zone.cap_text_left)}
            </Col>
            <Col xs={{span:5}} className='LightBlueBackground justify-content-center align-self-center' style={{padding: '20px', paddingTop: '20px'}}>
                {subText(zone.sub_text_right)}
                {capText(zone.cap_text_right)}
            </Col>
        </Row>
      );
    }
    if (subQuote === undefined && !IsEmptyOrWhiteSpace(zone.sub_text_left)){
      subQuote = (
        <Row className='justify-content-between' >
          <Col xs={{span:5}} className='LightBlueBackground justify-content-center align-self-center' style={{padding: '20px', paddingTop: '20px'}}>
            {subText(zone.sub_text_left)}
            {capText(zone.cap_text_left)}
          </Col>
        </Row>
      )
    }
    return(
      <div key={`story_comp_${index}`} 
      className='section' 
      style={{ 
        backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
        backgroundBlendMode:'multiply' 
      }}
      >
          <Container className='justify-content-center align-items-center' style={{marginBottom:'30%'}}>
              {subQuote}
          </Container>
      </div>
    )
  }

  export default Frame4