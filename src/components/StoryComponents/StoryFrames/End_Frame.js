/* eslint-disable eqeqeq */
import { Container, Col } from "react-bootstrap"
import { Link } from 'react-router-dom';
import backGround from 'src/assets/background.jpg';

function createMarkup(textTran){
  return {__html: textTran};
}
const End_Frame = (zone, index) => {
    return (
      <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined:`url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
        backgroundBlendMode:'multiply'}}>
        <Container className='d-flex justify-content-center align-items-center'>
          <div id='end-frame-text'>
            <div dangerouslySetInnerHTML={createMarkup(zone.text)} className='gray-text text-center sub-text'/>
          </div>
        </Container>
        <Container className='d-flex justify-content-center align-items-center'>
          <p className='orange-text text-center main-text'>
            Are you ready to learn more?
          </p>
        </Container>
        <Container className='d-flex justify-content-around align-items-center'>
            <Col className="d-flex justify-content-around align-items-center">
              <Link to='/Stories'>
                <button	className='blue-text story-button'>
                  Tell Me a Story
                </button>
              </Link>
            </Col>
            <Col className="d-flex justify-content-around align-items-center">
              <Link to='/'>
                <button	
                  className='blue-text story-button'>
                  Explore Coins
                </button>
              </Link>
            </Col>
        </Container>
      </div>
    );
  }
export default End_Frame