import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap"
import mainText from '../ComponentFunction/mainText';
import subcomponent_image from '../ComponentFunction/subcomponent_image';
import sub_cap_blue_bg from '../ComponentFunction/sub_cap_blue_bg';

const Frame6 = (zone, index, jsonObject) =>{
    return(
      <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined: `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
        backgroundBlendMode:'multiply'}}>
          <Container className='mb-5'>
            {mainText(zone.main_text)}
          </Container>
          <Container>
            <Row>
              <Col xs={5}>
                {subcomponent_image(zone.image)}
              </Col>
              <Col xs={7} className='align-self-center'>
                {sub_cap_blue_bg(zone.sub_text_right, zone.cap_text_right)}
              </Col>
            </Row>
          </Container>
      </div>
    )
  }
  export default Frame6