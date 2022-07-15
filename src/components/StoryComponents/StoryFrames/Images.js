/* eslint-disable eqeqeq */
import backGround from 'src/assets/background.jpg';
import { Container, Row} from "react-bootstrap"

import { HeadComponent, ImagesComponent } from "../ComponentFunction/index";


const Images = (props) =>{
  let zone = props.zone
    return(
      <div 
        className='section' 
        style={{ 
          backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`,
          backgroundBlendMode:'multiply'
        }}
      >
        {zone.head.updown_switch ?(
          <Container>
            <Row >
              <ImagesComponent toggleBottom={props.toggleBottom} images = {zone.images} />
            </Row>
            <Row className='d-flex justify-content-center mt-5'>
              <HeadComponent toggleBottom={props.toggleBottom} storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/>
            </Row>
          </Container>
        ):(
          <Container>
            <Row className='d-flex justify-content-center mb-5'>
              <HeadComponent toggleBottom={props.toggleBottom} storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/>
            </Row>
            <Row>
              <ImagesComponent toggleBottom={props.toggleBottom} images = {zone.images} />
            </Row>
          </Container>
        )}
                  <button
            onClick={()=>props.fullpageApi.moveTo(1)}
            className='back-to-top '
          > BACK TO TOP <b className='back-to-top-icon'>&#xe807;</b></button>  
    </div>
    )
  // }

  }

  export default Images
