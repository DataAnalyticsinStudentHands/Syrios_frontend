import {
  Container,
  Row,
  Col
} from 'react-bootstrap';

import 'src/components/constants.css';
import './Stories.css';



// Title component for all stories
const Title = (zone, index) => {
  return (
    <div className='section' key={index}>
      <Container className='d-flex justify-content-center align-items-center'>
        <img
          src={`${process.env.REACT_APP_strapiURL}${zone.image.url}`}
          alt='title image'
          width='300px'/>
      </Container>
      <Container className='d-flex justify-content-center align-items-center'>
        <p id='TitleText' className='BlueText text-center'>
          {zone.title}
        </p>
      </Container>
      <Container className='d-flex justify-content-center align-items-center'>
        <p id='SubTitleText' className='OrangeText text-center'>
          {zone.subtitle}
        </p>
      </Container>
      <Container className='d-flex justify-content-center align-items-center'>
        <p id='CaptionTitleText' className='GrayText text-center'>
          {zone.caption}
        </p>
      </Container>
    </div>
  );
}

const End_Frame = (zone, index) => {
  return (
    <div className='section' key={index}>
      <Container className='d-flex justify-content-center align-items-center'>
        <p id='EndFrameText' className='GrayText text-center'>
          {zone.text}
        </p>
      </Container>
      <Container className='d-flex justify-content-center align-items-center'>
        <p id='AreYouReadyText' className='OrangeText text-center'>
          Are you ready to learn more?
        </p>
      </Container>
      <Container className='d-flex justify-content-center align-items-center'>
        <Row container='justify-content-md-center' className='d-flex justify-content-center'>
          <Col>
            <a href='/Stories'>
              <button	className='BlueText EndFrameButtonWidth text-center'>
                Tell Me a Story
              </button>
            </a>
          </Col>
          <Col>
            <Container>
            </Container>
          </Col>
          <Col>
            <Container>
            </Container>
          </Col>
          <Col>
            <Container>
            </Container>
          </Col>
          <Col>
            <a href='/'>
              <button	className='BlueText EndFrameButtonWidth text-center'>
                Explore Coins
              </button>
            </a>
          </Col>
        </Row>
      </Container>
    </div>
  );
}


const Frame1 = (zone, index) => {
  let subText = undefined;
  if ((zone.sub_text_1 !== undefined && zone.sub_text_2 !== undefined) &&
    (zone.sub_text_1.trim() !== '' && zone.sub_text_2.trim() !== '')) {
    subText = (
      <Container className='d-flex justify-content-center align-items-center'>
        <Row>
          <Col className='Frame1SubText1'>
            <p className='GrayText SubText text-center'>
              {zone.sub_text_1}
            </p>
          </Col>
          <Col className='LightBlueBackground Frame1SubText2'>
            <p className='BlueText SubText text-center'>
              {zone.sub_text_2}
            </p>
          </Col>
        </Row>
      </Container>
    );
  }

  if (subText === undefined && zone.sub_text_1 !== undefined && zone.sub_text_1.trim() !== '') {
    subText = (
      <Container className='d-flex justify-content-center align-items-center'>
        <p className='GrayText SubText text-center'>
          {zone.sub_text_1}
        </p>
      </Container>
    );
  }

  if (subText === undefined && zone.sub_text_2 !== undefined && zone.sub_text_2.trim() !== '') {
    subText = (
      <Container className='d-flex justify-content-center align-items-center'>
        <p className='BlueText SubText text-center'>
          {zone.sub_text_2}
        </p>
      </Container>
    );
  }
  if (zone.background !== undefined) {
    return (
      <div className='section' key={index} style={{backgroundImage:`url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
        <Container>
          <p className='OrangeText MainText text-center'>
            {zone.main_text}
          </p>
        </Container>
        {subText}
      </div>
    );
  }

  return (
      <div className='section' key={index}>
        <Container>
          <p className='OrangeText MainText text-center'>
            {zone.main_text}
          </p>
        </Container>
        {subText}
      </div>
  );
}


// This function is for mapping name and functions over.
// Did this for organization really. 
const SwitchComponent = (zone, index, fullpageApi) => {
  let jsx = undefined;
  switch (zone.__component) {
    case 'frame.title':
      jsx = Title(zone, index);
      break;
    case 'frame.endframe':
      jsx = End_Frame(zone, index);
      break;
    case 'frame.frame1':
      jsx = Frame1(zone, index);
      break;
    default:
      console.error(`Error: Unrecognized component '${zone.__component}'`);
      jsx = (
        <>
        </>
      );
  }

  return (
    <>
      {jsx}
    </>

  );
}

export default SwitchComponent
