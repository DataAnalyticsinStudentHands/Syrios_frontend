/* eslint-disable eqeqeq */
import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap"
import {MainText, SubcomponentImageOnly, SubcomponentImage, SubCapBlueBg } from "../ComponentFunction/index";

const Frame8 = (zone, index, json_object) =>{
    return(
      <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
        backgroundBlendMode:'multiply'}}>
          <Container className='justify-content-center'>
            <Row className='text-center'>
              {SubcomponentImageOnly(zone.image_top)}
            </Row>
            <Row>
              <Col md={4}>
                {SubcomponentImage(zone.image_left)}
              </Col>
              <Col md={7} className='justify-content-around d-flex flex-column'>
                {MainText(zone.main_text)}
                {SubCapBlueBg(zone.sub_text_right,zone.cap_text_right)}
              </Col>
            </Row>
          </Container>
      </div>
    )
  }

  export default Frame8
