import backGround from 'src/assets/background.jpg';
import { Container, Row } from "react-bootstrap"
import { HeadComponent } from '../ComponentFunction';

const TemplateFrame = (props) =>{
  let zone = props.zone
  return(
    <div className='section' style={{ backgroundImage: zone.background == null ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,backgroundBlendMode:'multiply'}}>
      {zone.head.updown_switch ?
        <Container>
          <Row className='d-flex justify-content-between align-items-center mb-5'>

          </Row>
          <Row className='d-flex justify-content-center mt-5'><HeadComponent toggleBottom={props.toggleBottom} storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/></Row>


        </Container> :
        <Container>
          <Row className='d-flex justify-content-center mb-5'><HeadComponent toggleBottom={props.toggleBottom} storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/></Row>
          <Row className='d-flex justify-content-between align-items-center'>

          </Row>
        </Container>
      }
    </div>
    )
  }
export default TemplateFrame
