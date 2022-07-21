import { Container, Row,Col } from "react-bootstrap"
import ReactMarkdown from 'react-markdown';

import createMarkup from 'src/utils/Markup.js';
const Title = (props) => {
  let zone = props.zone
    return (
      <div className='section stories-background' style={{ backgroundImage: zone.background.data === null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url})`}}>
        <Container className=''>
            <Row className="d-flex justify-content-center">
              <Col xs={6} className="text-center">
                <img
                  src={`${process.env.REACT_APP_strapiURL}${zone.image.data.attributes.url}`}
                  alt={zone.image.data.attributes.alternativeText == null ? 'image' : zone.image.data.attributes.alalternativeText}
                  className='story-image-size'/>
              </Col>
            </Row>
            {/* {title} */}
            <Row className='mt-3'><ReactMarkdown className='story-h1 text-center'>{zone.title}</ReactMarkdown></Row>

            {/* {subtitle} */}
            <Row className='mb-3'><ReactMarkdown className='story-h4 text-center'>{zone.subtitle}</ReactMarkdown></Row>

            {/* {caption} */}
            <Row className='mt-3 '><div onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(zone.caption)} className='story-h3 text-center'/></Row>
        </Container>
        {props.index === 0 ? (<></>):(<button onClick={()=>props.fullpageApi.moveTo(1)} className='back-to-top'> BACK TO TOP <b className='back-to-top-icon'>&#xe807;</b></button> )}
      </div>
    );
  }

  export default Title
