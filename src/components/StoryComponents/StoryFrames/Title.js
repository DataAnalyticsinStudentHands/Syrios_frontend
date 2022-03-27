/* eslint-disable eqeqeq */
import { Container } from "react-bootstrap"
import ReactMarkdown from 'react-markdown';
import backGround from 'src/assets/background.jpg';
import {IsEmptyOrWhiteSpace,subcomponent_image_only } from "../ComponentFunction/index";

const Title = (zone, index) => {
    let title = undefined
    if (!IsEmptyOrWhiteSpace(zone.main_text)){
      title = (
        <Container className='d-flex justify-content-center align-items-center'>
          <ReactMarkdown className='BlueText text-center TitleText'>
            {zone.main_text}
          </ReactMarkdown>
        </Container>
      )
    }
  
    let subtitle = undefined
    if (!IsEmptyOrWhiteSpace(zone.sub_title)){
      subtitle = (
        <Container className='d-flex justify-content-center align-items-center'>
          <ReactMarkdown className='OrangeText text-center SubTitleText'>
            {zone.sub_title}
          </ReactMarkdown>
        </Container>
      )
    }
  
    let caption = undefined
    if (!IsEmptyOrWhiteSpace(zone.cap_text)){
      caption = (
        <Container className='d-flex justify-content-center align-items-center mt-5'>
          <ReactMarkdown className='GrayText text-center CaptionTitleText'>
            {zone.cap_text}
          </ReactMarkdown>
        </Container>
      )
    }
  
    return (
      // <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      //   backgroundBlendMode:'multiply'}}>
      <div key={`story_comp_${index}`} className='section'>
          {/* <Container className='d-flex justify-content-center align-items-center'>
            {subcomponent_image_only(zone.image)}
          </Container> */}
          {title}
          {subtitle}
          {caption}
      </div>
    );
  }

  export default Title
