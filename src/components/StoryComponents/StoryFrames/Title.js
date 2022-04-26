/* eslint-disable eqeqeq */
import { Container } from "react-bootstrap"
import ReactMarkdown from 'react-markdown';
import backGround from 'src/assets/background.jpg';
// import {IsEmptyOrWhiteSpace } from "../ComponentFunction/index";

function createMarkup(textTran){
  return {__html: textTran};
}
const Title = (zone, index) => {

    // let title = undefined
    // if ((zone.title)){
    //   title = (
    //     <Container className='d-flex justify-content-center align-items-center'>
    //       <ReactMarkdown className='BlueText text-center TitleText'>
    //         {zone.title}
    //       </ReactMarkdown>
    //     </Container>
    //   )
    // }
  
    // let subtitle = undefined
    // if ((zone.subtitle)){
    //   subtitle = (
    //     <Container className='d-flex justify-content-center align-items-center'>
    //       <ReactMarkdown className='OrangeText text-center SubTitleText'>
    //         {zone.subtitle}
    //       </ReactMarkdown>

    //     </Container>
    //   )
    // }
  
    // let caption = undefined
    // if (!IsEmptyOrWhiteSpace(zone.caption)){
    //   caption = (
    //     <Container className='d-flex justify-content-center align-items-center mt-5'>
    //         <div dangerouslySetInnerHTML={createMarkup(zone.caption)} className='GrayText text-center CaptionTitleText'/>
    //     </Container>
    //   )
    // }
  
    return (
      <div 
        key={`story_comp_${index}`} 
        className='section' 
        style={{ 
          backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`,
          backgroundBlendMode:'multiply'
        }}
      >
          <Container className='d-flex justify-content-center align-items-center'>
            <img
              src={`${process.env.REACT_APP_strapiURL}${zone.image.data.attributes.url}`}
              alt={zone.image.data.attributes.alalternativeText === undefined ?'image':zone.image.data.attributes.alalternativeText}
              width={400}
            />
          </Container>
            {/* {title} */}
          <Container className='d-flex justify-content-center align-items-center'>
            <ReactMarkdown className='BlueText text-center TitleText'>
              {zone.title}
            </ReactMarkdown>
          </Container>
            {/* {subtitle} */}
          <Container className='d-flex justify-content-center align-items-center'>
            <ReactMarkdown className='OrangeText text-center SubTitleText'>
              {zone.subtitle}
            </ReactMarkdown>
          </Container>
            {/* {caption} */}
          <Container className='d-flex justify-content-center align-items-center mt-5'>
            <div dangerouslySetInnerHTML={createMarkup(zone.caption)} className='GrayText text-center CaptionTitleText'/>
          </Container>
      </div>
    );
  }

  export default Title
