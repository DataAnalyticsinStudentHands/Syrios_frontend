/* eslint-disable eqeqeq */
import { Container, Row } from "react-bootstrap"
import ReactMarkdown from 'react-markdown';
import backGround from 'src/assets/background.jpg';

import createMarkup from 'src/utils/Markup.js';
const Title = (zone, index) => {

    // let title = undefined
    // if ((zone.title)){
    //   title = (
    //     <Container className='d-flex justify-content-center align-items-center'>
    //       <ReactMarkdown className='blue-text text-center title-text'>
    //         {zone.title}
    //       </ReactMarkdown>
    //     </Container>
    //   )
    // }
  
    // let subtitle = undefined
    // if ((zone.subtitle)){
    //   subtitle = (
    //     <Container className='d-flex justify-content-center align-items-center'>
    //       <ReactMarkdown className='orange-text text-center sub-title-text'>
    //         {zone.subtitle}
    //       </ReactMarkdown>

    //     </Container>
    //   )
    // }
  
    // let caption = undefined
    // if (!IsEmptyOrWhiteSpace(zone.caption)){
    //   caption = (
    //     <Container className='d-flex justify-content-center align-items-center mt-5'>
    //         <div dangerouslySetInnerHTML={createMarkup(zone.caption)} className='gray-text text-center caption-title-text'/>
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
        <Container className=''>
            <Row className="justify-content-center">
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image.data.attributes.url}`}
                alt={zone.image.data.attributes.alternativeText == null ? 'image' : zone.image.data.attributes.alalternativeText}
                style={{width:"268px"}}
              />
            </Row>

            {/* {title} */}
            <Row className=''>
              <ReactMarkdown className='story-h1 my-5 text-center'>
                {zone.title}
              </ReactMarkdown>
            </Row>

            {/* {subtitle} */}
            <Row className=''>
              <ReactMarkdown className='story-h4 text-center'>
                {zone.subtitle}
              </ReactMarkdown>
            </Row>

            {/* {caption} */}
            <Row className='mt-5 '>
              <div dangerouslySetInnerHTML={createMarkup(zone.caption)} className='story-h3 text-center'/>
            </Row>
        </Container>

      </div>
    );
  }

  export default Title
