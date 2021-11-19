import {
  Container,
  Row,
  Col
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import 'src/components/constants.css';
import './Stories.css';

// These are more general exports. All functions may use them
const subcomponent_image = (image) => {
  let caption = undefined; 
  // If light_blue_background is true, light_blue_caption_background should be false.
  // don't want to double the background causing opacity to double.
  image.light_blue_caption_background = image.light_blue_background ? false : image.light_blue_caption_background;
  if (image.caption !== undefined) {
    caption = (
      <>
        <Container className={`d-flex justify-content-center align-items-center ${image.light_blue_caption_background ? "LightBlueBackground" : ""}`}>
          <ReactMarkdown className='FrameImage GrayText CaptionText text-center' style={{padding: '0px', paddingTop: '20px'}}>
            {image.caption}
          </ReactMarkdown>
        </Container>
      </>
    );
  }

  return (
    <Container className='d-flex justify-content-center align-items-center'>
      <div className={`${image.light_blue_background ? "LightBlueBackground" : ""}`} style={{padding: '20px', paddingBottom: '0px'}}>
        <Container className='d-flex justify-content-center align-items-center'>
          <img
            alt={image.image.alternativeText == undefined ? 'img' : image.image.alternativeText}
            className='FrameImage'
            src={`${process.env.REACT_APP_strapiURL}${image.image.url}`} />
        </Container>
        {caption}
      </div>
    </Container>
  );
}



// Title component for all stories
const Title = (zone, index) => {
  return (
    <div className='section' key={index}>
      <Container className='d-flex justify-content-center align-items-center'>
        <img
          id='TitleImage'
          src={`${process.env.REACT_APP_strapiURL}${zone.image.url}`}
          alt={zone.image.alternativeText !== undefined ? zone.image.alternativeText : 'title image'} />
      </Container>
      <Container className='d-flex justify-content-center align-items-center'>
        <p id='TitleText' className='BlueText text-center'>
          {zone.title}
        </p>
      </Container>
      <Container className='d-flex justify-content-center align-items-center'>
        <p id='SubTitleText' className='OrangeText text-center'>
          <ReactMarkdown>
            {zone.subtitle}
          </ReactMarkdown>
        </p>
      </Container>
      <Container className='d-flex justify-content-center align-items-center'>
        <p id='CaptionTitleText' className='GrayText text-center'>
          <ReactMarkdown>
            {zone.caption}
          </ReactMarkdown>
        </p>
      </Container>
    </div>
  );
}

const End_Frame = (zone, index) => {
  return (
    <div className='section' key={index}>
      <Container className='d-flex justify-content-center align-items-center'>
        <div id='EndFrameText'>
          <ReactMarkdown className='GrayText text-center'>
            {zone.text}
          </ReactMarkdown>
        </div>
      </Container>
      <Container className='d-flex justify-content-center align-items-center'>
        <p id='AreYouReadyText' className='OrangeText text-center'>
          Are you ready to learn more?
        </p>
      </Container>
      <Container className='d-flex justify-content-center align-items-center'>
        <Row container='justify-content-md-center' className='d-flex justify-content-center'>
          <Col>
            <Link to='/Stories'>
              <button	className='BlueText EndFrameButtonWidth text-center' style={{marginRight: '100px'}}>
                Tell Me a Story
              </button>
            </Link>
          </Col>
          <Col>
            <Link to='/'>
              <button	className='BlueText EndFrameButtonWidth text-center' style={{marginLeft: '100px'}}>
                Explore Coins
              </button>
            </Link>
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
            <ReactMarkdown className='GrayText SubText text-center'>
              {zone.sub_text_1}
            </ReactMarkdown>
          </Col>
          <Col className='LightBlueBackground Frame1SubText2'>
            <ReactMarkdown className='BlueText SubText text-center'>
              {zone.sub_text_2}
            </ReactMarkdown>
          </Col>
        </Row>
      </Container>
    );
  }

  if (subText === undefined && zone.sub_text_1 !== undefined && zone.sub_text_1.trim() !== '') {
    subText = (
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='GrayText SubText text-center'>
          {zone.sub_text_1}
        </ReactMarkdown>
      </Container>
    );
  }

  if (subText === undefined && zone.sub_text_2 !== undefined && zone.sub_text_2.trim() !== '') {
    subText = (
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='BlueText SubText text-center'>
          {zone.sub_text_2}
        </ReactMarkdown>
      </Container>
    );
  }

  return (
    <div className='section' key={index} style={{ backgroundImage: zone.background !== undefined ? `url(${process.env.REACT_APP_strapiURL}${zone.background.url})` : undefined}}>
      <Container>
        <ReactMarkdown className='OrangeText MainText text-center'>
          {zone.main_text}
        </ReactMarkdown>
      </Container>
      {subText}
    </div>
  );
}


const Frame2 = (zone, index) => {
  let subText = undefined;
  let caption = undefined;

  if (zone.sub_text !== undefined) {
    subText = (
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='GrayText SubText text-center'>
          {zone.sub_text}
        </ReactMarkdown>
      </Container>
    );
  }

  return (
    <div className='section' key={index} style={{ backgroundImage: zone.background !== undefined ? `url(${process.env.REACT_APP_strapiURL}${zone.background.url})` : undefined}}>
      <Container className='d-flex justify-content-center align-items-center'>
        <p className='OrangeText MainText text-center'>
          <ReactMarkdown>
            {zone.main_text}
          </ReactMarkdown>
        </p>
      </Container>
      {subText}
      {subcomponent_image(zone.image)}
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
    case 'frame.frame2':
      jsx = Frame2(zone, index);
      break;
    default:
      console.error(`Error: Unrecognized component '${zone.__component}'`);
  }

  return (
    <>
      {jsx}
    </>

  );
}

export default SwitchComponent
