/* eslint-disable eqeqeq */
import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap"
import ReactMarkdown from 'react-markdown';
import {mainText, subcomponent_image  } from "../ComponentFunction/index";

const Frame5 = (zone, index, jsonObject) =>{

    let text_middle = undefined
    if(zone.text_middle.light_blue_caption_background){
      text_middle = (
        <Col xs={6} className='LightBlueBackground align-self-center text-center SubText' style={{zIndex:'-1'}}>
          <ReactMarkdown className='BigSubText GrayText px-5 my-5'>
            {zone.sub_text_middle.text}
          </ReactMarkdown>
        </Col>
      );
    }
    else{
      text_middle = (
        <Col xs={3} className='align-self-center text-center SubText'>
          <ReactMarkdown className=' BigSubText mt-3 GrayText'>
            {zone.sub_text_middle.text}
          </ReactMarkdown>
        </Col>
      );
    }
  
    return(
      <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
        backgroundBlendMode:'multiply'}}>
          <Container className='mb-5'>
            {mainText(zone.main_text)}
          </Container>
          <Container>
            <Row className='d-flex justify-content-around align-self-center' >
                  <Col xs={3}>
                      {subcomponent_image(zone.image_left)}
                  </Col>
                  {text_middle}
                  <Col xs={3}>
                      {subcomponent_image(zone.image_right)}
                  </Col>
            </Row>
          </Container>
      </div>
    )
  }

  export default Frame5