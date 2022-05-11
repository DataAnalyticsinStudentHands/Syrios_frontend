import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap"

function createMarkup(textTran){
    return {__html: textTran};
  }
  const TemplateFrame = (zone, index, jsonObject) =>{
    console.log(zone)
      if (zone.head.updown_switch){
        return(
          <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,backgroundBlendMode:'multiply'}}>
          <Container>
            <Row className='d-flex justify-content-between align-items-center mb-5'>
  
            </Row>
            <Row className='d-flex justify-content-center '>
                <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='orange-text MainText text-center'/>
                <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='gray-text CaptionText text-center'/>
            </Row>
    
          </Container>
        </div>
        )
      }
      else{
        return(
          <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,backgroundBlendMode:'multiply'}}>
          <Container>
            <Row className='d-flex justify-content-center mb-5'>
                <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='orange-text MainText text-center'/>
                <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='gray-text CaptionText text-center'/>
            </Row>
            <Row className='d-flex justify-content-between align-items-center'>
  
            </Row>
          </Container>
        </div>
        )
      }
  
    }
    export default TemplateFrame