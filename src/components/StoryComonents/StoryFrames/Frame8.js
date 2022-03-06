import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap"
import mainText from '../ComponentFunction/mainText';
import subcomponent_image_only from '../ComponentFunction/subcomponent_image_only';
import subcomponent_image from '../ComponentFunction/subcomponent_image';
import sub_cap_blue_bg from '../ComponentFunction/sub_cap_blue_bg';
const Frame8 = (zone, index, jsonObject) =>{
    return(
      <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
        backgroundBlendMode:'multiply'}}>
          <Container className='justify-content-center'>
            <Row className='text-center'>
              {subcomponent_image_only(zone.image_top)}
            </Row>
            <Row>
              <Col md={4}>
                {subcomponent_image(zone.image_left)}
              </Col>
              <Col md={7} className='justify-content-around d-flex flex-column'>
                {mainText(zone.main_text)}
                {sub_cap_blue_bg(zone.sub_text_right,zone.cap_text_right)}
              </Col>
            </Row>
          </Container>
      </div>
    )
  }

  export default Frame8