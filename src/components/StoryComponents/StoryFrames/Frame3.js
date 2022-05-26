/* eslint-disable eqeqeq */
import backGround from 'src/assets/background.jpg';
import { SubcomponentImageWithDynamicSizing } from "../ComponentFunction/index";
import { Container, Row } from "react-bootstrap"

import createMarkup from 'src/utils/Markup.js';

const Frame3 = (zone, index) => {
  if(zone.head.updown_switch){
    return(
      <div key={`story_comp_${index}`} className='section' style={{backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`, backgroundBlendMode:'multiply'}}>
        <Container>
          {SubcomponentImageWithDynamicSizing(zone.images)}
          <Row className='d-flex justify-content-center'>
            <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='orange-text main-text text-center'/>
            <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='gray-text caption-text text-center'/>
          </Row>
        </Container>
      </div>
    )
  }
  else{
    return(
      <div key={`story_comp_${index}`} className='section' style={{backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`, backgroundBlendMode:'multiply'}}>
        <Container>
          <Row className='d-flex justify-content-center'>
            <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='orange-text main-text text-center'/>
            <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='gray-text caption-text text-center'/>
          </Row>
          {SubcomponentImageWithDynamicSizing(zone.images)}
        </Container>
      </div>
    )
  }

}

export default Frame3
