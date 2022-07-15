/* eslint-disable eqeqeq */
import { Container, Col } from "react-bootstrap"
import { Link } from 'react-router-dom';
import backGround from 'src/assets/background.jpg';

function createMarkup(textTran){
  return {__html: textTran};
}
const End_Frame = (props) => {
  let zone = props.zone
    return (
      <div 
      // key={`story_comp_${index}`} 
      className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined:`url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
        backgroundBlendMode:'multiply'}}>
        <Container className='d-flex justify-content-center align-items-center my-5'>
          <div id='end-frame-text'>
            <div onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(zone.text)} className='story-h3 text-center '/>
          </div>
        </Container>
        <Container className='d-flex justify-content-center align-items-center'>
          <p className='story-h2 text-center my-3'>
            Are you ready to learn more?
          </p>
        </Container>
        <Container className='d-flex justify-content-around align-items-center'>
            <Col className="d-flex justify-content-around align-items-center">
              <Link to='/Stories'>
                <button	className='story-end-frame-button'>
                  Tell Me a Story
                </button>
              </Link>
            </Col>
            <Col className="d-flex justify-content-around align-items-center">
              <Link to='/'>
                <button	className='story-end-frame-button'>
                  Explore Coins
                </button>
              </Link>
            </Col>
        </Container>
        <button
            onClick={()=>props.fullpageApi.moveTo(1)}
            className='back-to-top '
          > BACK TO TOP <b className='back-to-top-icon'>&#xe807;</b></button>  
      </div>
    );
  }
export default End_Frame