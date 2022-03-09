/* eslint-disable eqeqeq */
import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap"
import {mainText, subcomponent_image} from "../ComponentFunction/index";

const Frame9 = (zone, index, jsonObject) =>{
    return(
      <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
        backgroundBlendMode:'multiply'}}>
          <Container className='mb-5'>
            {mainText(zone.main_text)}
          </Container>
          <Container>
            <Row className='d-flex justify-content-between mt-5'>
              <Col xs={9} sm={3} >
                {subcomponent_image(zone.image_left)}
              </Col>
              <Col xs={9} sm={3} className='d-flex align-items-center'>
                {subcomponent_image(zone.image_mid)}
              </Col>
              <Col xs={9} sm={3}>
                {subcomponent_image(zone.image_right)}
              </Col>
            </Row>
  
          </Container>
      </div>
    )
  }
  export default Frame9