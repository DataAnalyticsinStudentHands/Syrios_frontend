/* eslint-disable eqeqeq */
import { Container, Row, Col } from "react-bootstrap"
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
          <div id='EndFrameText'>
            <div dangerouslySetInnerHTML={createMarkup(zone.text)} className='GrayText text-center SubText'/>
          </div>
        </Container>
        <Container className='d-flex justify-content-center align-items-center'>
          <p className='OrangeText text-center MainText'>
            Are you ready to learn more?
          </p>
        </Container>
        <Container className='d-flex justify-content-center align-items-center'>
          <Row className='d-flex justify-content-around'>
            <Col >
              <Link to='/Stories'>
                <button	className='BlueText EndFrameButtonWidth text-center'>
                  Tell Me a Story
                </button>
              </Link>
            </Col>
            <Col>
              <Link to='/'>
                <button	className='BlueText EndFrameButtonWidth text-center'>
                  Explore Coins
                </button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
export default End_Frame