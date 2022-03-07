import { Container, Row, Col, Button } from "react-bootstrap"
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import backGround from 'src/assets/background.jpg';


const End_Frame = (zone, index, jsonObject) => {
    return (
      <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined:`url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
        backgroundBlendMode:'multiply'}}>
        <Container className='d-flex justify-content-center align-items-center'>
          <div id='EndFrameText'>
            <ReactMarkdown className='GrayText text-center SubText'>
              {zone.text}
            </ReactMarkdown>
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
                <Button	className='BlueText EndFrameButtonWidth text-center'>
                  Tell Me a Story
                </Button>
              </Link>
            </Col>
            <Col>
              <Link to='/'>
                <Button	className='BlueText EndFrameButtonWidth text-center'>
                  Explore Coins
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
export default End_Frame