/* eslint-disable eqeqeq */
import { Container, Row } from "react-bootstrap"
import ReactMarkdown from 'react-markdown';
import backGround from 'src/assets/background.jpg';

import createMarkup from 'src/utils/Markup.js';
const Title = (props) => {
  let zone = props.zone
    return (
      <div 
        // key={`story_comp_${index}`} 
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
                style={{width:"286px"}}
              />
            </Row>
            {/* {title} */}
            <Row className='mt-5'>
              <ReactMarkdown className='story-h1  text-center'>
                {zone.title}
              </ReactMarkdown>
            </Row>

            {/* {subtitle} */}
            <Row className='mb-5'>
              <ReactMarkdown className='story-h4 text-center'>
                {zone.subtitle}
              </ReactMarkdown>
            </Row>

            {/* {caption} */}
            <Row className='mt-5 '>
              <div onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(zone.caption)} className='story-h3 text-center'/>
            </Row>
        </Container>
        {props.index === 0 ? (<></>):(<button onClick={()=>props.fullpageApi.moveTo(1)} className='back-to-top'> BACK TO TOP <b className='back-to-top-icon'>&#xe807;</b></button> )}
      </div>
    );
  }

  export default Title
