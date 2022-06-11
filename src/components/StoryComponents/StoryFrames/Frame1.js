import { Container, Row, Col } from "react-bootstrap"
import backGround from 'src/assets/background.jpg';
import { SubCapBlueBg } from "../ComponentFunction/index";

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
              {SubCapBlueBg(zone.left)}
              
            </Col>
            <Col xs={4}>
              {SubCapBlueBg(zone.right)}
            </Col>
          </Row>

          <Row>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='story-h2 text-center'/>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='story-text text-center'/>
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
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='story-h2 text-center'/>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='story-text text-center'/>
          </Row>
          <Row className="d-flex justify-content-around">
            <Col xs={4}>
              {SubCapBlueBg(zone.left)}
            </Col>
            <Col xs={4}>
              {SubCapBlueBg(zone.right)}
            </Col>
          </Row>
        </Container>
      </div>
      )

    }
  }
  export default Frame1
