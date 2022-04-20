/* eslint-disable eqeqeq */
import { Container, Row, Col } from "react-bootstrap"
import backGround from 'src/assets/background.jpg';

function createMarkup(textTran){
  return {__html: textTran};
}
const Frame1 = (zone, index) => {
    const Textcomponent = (text)=>{
      if(text.light_blue_background){
         return (
          <Container className='LightBlueBackground' style={{padding: '20px', paddingTop: '20px'}}>
            <Row dangerouslySetInnerHTML={createMarkup(text.text)} className='BlueText text-center SubText'/>
            <Row dangerouslySetInnerHTML={createMarkup(text.caption)} className='GrayText text-center CaptionText'/>
          </Container>
        )
      }
      else{
        return(
          <Container style={{padding: '20px', paddingTop: '20px'}}>
          <div dangerouslySetInnerHTML={createMarkup(text.text)} className='BlueText text-center SubText'/>
          <div dangerouslySetInnerHTML={createMarkup(text.caption)} className='GrayText text-center CaptionText'/>
        </Container>
        )
      }
    }

    if (zone.head.updown_switch){
      return(
        <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,backgroundBlendMode:'multiply'}}>
        <Container>
          <Row className="d-flex justify-content-around">
            <Col xs={4}>
              {Textcomponent(zone.left)}
            </Col>
            <Col xs={4}>
              {Textcomponent(zone.right)}
            </Col>
          </Row>

          <Row className='mb-5'>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='OrangeText MainText text-center'/>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='GrayText CaptionText text-center'/>
          </Row>

        </Container>
      </div>
      )
    }
    else{
      return(
        <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,backgroundBlendMode:'multiply'}}>
        <Container>
          <Row className='mb-5'>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='OrangeText MainText text-center'/>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='GrayText CaptionText text-center'/>
          </Row>
          <Row className="d-flex justify-content-around">
            <Col xs={4}>
              {Textcomponent(zone.left)}
            </Col>
            <Col xs={4}>
              {Textcomponent(zone.right)}
            </Col>
          </Row>
        </Container>
      </div>
      )

    }
  }
  export default Frame1