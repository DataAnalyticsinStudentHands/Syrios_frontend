import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap"
import mainText from '../ComponentFunction/mainText';
import subcomponent_image_only from '../ComponentFunction/subcomponent_image_only';

const Frame10 = (zone, index, jsonObject) =>{
  let page = undefined
  if(zone.leftOrRight){
    page = (
      <Row className='d-flex justify-content-between align-self-center'>
        <Col xs={9} className="d-flex align-self-center">
          {mainText(zone.main_text)}
        </Col>
        <Col xs={3}>
          {subcomponent_image_only(zone.image)}
        </Col>
      </Row>
    )
  }
  else{
    page = (
      <Row className='d-flex justify-content-between align-self-center'>
        <Col xs={3}>
          {subcomponent_image_only(zone.image)}
        </Col>
        <Col xs={9} className="d-flex align-self-center">
          {mainText(zone.main_text)}
        </Col>
    </Row>
    )
  }

  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>
        <Container>
          {page}
        </Container>
    </div>
  )
}

export default Frame10