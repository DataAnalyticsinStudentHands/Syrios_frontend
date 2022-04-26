import { Container, Row, Col } from "react-bootstrap"
import backGround from 'src/assets/background.jpg';
import { sub_cap_blue_bg } from "../ComponentFunction/index";

function createMarkup(textTran){
  return {__html: textTran};
}
const Frame1 = (zone, index) => {
    if (zone.head.updown_switch){
      return(
        <div 
          key={`story_comp_${index}`} 
          className='section' 
          style={{ 
            backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`,
            backgroundBlendMode:'multiply'
          }}
        >
        <Container>
          <Row className="d-flex justify-content-around">
            <Col xs={4}>
              {sub_cap_blue_bg(zone.left)}
              
            </Col>
            <Col xs={4}>
              {sub_cap_blue_bg(zone.right)}
            </Col>
          </Row>

          <Row>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='OrangeText MainText text-center'/>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='GrayText CaptionText text-center'/>
          </Row>

        </Container>
      </div>
      )
    }
    else{
      return(
        <div 
          key={`story_comp_${index}`} 
          className='section' 
          style={{ 
            backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`,
            backgroundBlendMode:'multiply',
          }}
        >
        <Container>
          <Row>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='OrangeText MainText text-center'/>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='GrayText CaptionText text-center'/>
          </Row>
          <Row className="d-flex justify-content-around">
            <Col xs={4}>
              {sub_cap_blue_bg(zone.left)}
            </Col>
            <Col xs={4}>
              {sub_cap_blue_bg(zone.right)}
            </Col>
          </Row>
        </Container>
      </div>
      )

    }
  }
  export default Frame1