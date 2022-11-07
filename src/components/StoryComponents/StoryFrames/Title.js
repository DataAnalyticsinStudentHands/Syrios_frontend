import { Container, Row,Col } from "react-bootstrap"
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
                  style={{width:"20vmax"}}
                  />
              </Col>
            </Row>
            <center>
              <h1> {zone.title} </h1>
              <h4> {zone.subtitle} </h4>
              <h3 onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(zone.caption)} className='my-5 py-3'/>
            </center>
        </Container>
        {props.index === 0 ? (<></>):(<button onClick={()=>props.fullpageApi.moveTo(1)} className='back-to-top'> BACK TO TOP <b className='back-to-top-icon'>&#xe807;</b></button> )}
      </div>
    );
  }

  export default Title
