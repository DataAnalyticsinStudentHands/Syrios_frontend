import { Container,Row } from "react-bootstrap"
import backGround from 'src/assets/background.jpg';
import {IsEmptyOrWhiteSpace,subcomponent_image_only, createMarkup } from "../ComponentFunction/index";

const Title = (zone, index, jsonObject) => {

    let title = undefined
    if (!IsEmptyOrWhiteSpace(zone.title)){
      title = (
        <Container className='d-flex justify-content-center align-items-center'>
          <div dangerouslySetInnerHTML={createMarkup(zone.title)} className='BlueText text-center TitleText'/>
        </Container>
      )
    }
  
    let subtitle = undefined
    if (!IsEmptyOrWhiteSpace(zone.subtitle)){
      subtitle = (
        <Container className='d-flex justify-content-center align-items-center'>
          <div dangerouslySetInnerHTML={createMarkup(zone.subtitle)} className='OrangeText text-center SubTitleText'/>
        </Container>
      )
    }
  
    let caption = undefined
    if (!IsEmptyOrWhiteSpace(zone.caption)){
      caption = (
        <Container className='d-flex justify-content-center align-items-center mt-5'>
          <Row className='GrayText text-center CaptionTitleText'>
            <div dangerouslySetInnerHTML={createMarkup(zone.caption)} />
          </Row>
        </Container>
      )
    }
  
    return (
      // eslint-disable-next-line eqeqeq
      <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
        backgroundBlendMode:'multiply'}}>
          <Container className='d-flex justify-content-center align-items-center'>
            {subcomponent_image_only(zone.image)}
          </Container>
          {title}
          {subtitle}
          {caption}
      </div>
    );
  }

  export default Title