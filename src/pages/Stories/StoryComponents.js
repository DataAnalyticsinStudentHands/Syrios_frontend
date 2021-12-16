import {
  Container,
  Row,
  Col
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import 'src/components/constants.css';
import './Stories.css';

function IsEmptyOrWhiteSpace(str) {
  return str===undefined ? true : (str.match(/^\s*$/) || []).length > 0;
}

// THIS NEEDS WORK
// These are more general exports. All functions may use them
const subcomponent_image = (image, width) => {
  let caption = undefined; 
  // If light_blue_background is true, light_blue_caption_background should be false.
  // don't want to double the background causing opacity to double.
  image.light_blue_caption_background = image.light_blue_background ? false : image.light_blue_caption_background;
  if (!IsEmptyOrWhiteSpace(image.caption)) {
    caption = (
      <>
        <Container className={`d-flex justify-content-center align-items-center ${image.light_blue_caption_background ? "LightBlueBackground" : ""}`} style={{ width: width }}>
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
            alt={IsEmptyOrWhiteSpace(image.image.alternativeText) ? 'dynamic_image' : image.image.alternativeText}
            className='FrameImage'
            width={width}
            src={`${process.env.REACT_APP_strapiURL}${image.image.url}`} />
        </Container>
        {caption}
      </div>
    </Container>
  );
}

// THIS NEEDS WORKS
const subcomponent_image_with_dynamic_sizing = (images) => {
  /* This is what we want at 1920 x 1080, but we need a better option for multiple screen sizes. */
  let imageSizes = {
    "very_small": "50px",
    "small": "130px",
    "medium": "210px",
    "big": "290px",
    "very_big": "370px",
    "gigantic": "450px"
  }; 

  let imagesJSX = []
  images.forEach((image) => {
    const image_brief_detail_font_size=Math.atan((parseInt(imageSizes[image.size])-250)/50)*30+50;
    if (!IsEmptyOrWhiteSpace(image.link) && !IsEmptyOrWhiteSpace(image.brief_detail)) {
      imagesJSX.push(
        <Col key={image.id}>
          <Link to={image.link} className='blandStyle'>
            <img
              src={`${process.env.REACT_APP_strapiURL}${image.image.url}`}
              alt={IsEmptyOrWhiteSpace(image.image.alternativeText) ? 'dynamic_image' : image.image.alternativeText}
              width={imageSizes[image.size]}/>
            <p className='OrangeText text-center' style={{fontSize: image_brief_detail_font_size}}>
              {image.brief_detail}
            </p>
          </Link>
        </Col>
      );
      return;
    }

    if (!IsEmptyOrWhiteSpace(image.link)) {
      imagesJSX.push(
        <Col key={image.id}>
          <Link to={image.link} className='blandStyle'>
            <img
              src={`${process.env.REACT_APP_strapiURL}${image.image.url}`}
              alt={IsEmptyOrWhiteSpace(image.image.alternativeText) ? 'dynamic_image' : image.image.alternativeText}
              width={imageSizes[image.size]}/>
          </Link>
        </Col>
      );
      return;
    }

    if (!IsEmptyOrWhiteSpace(image.brief_detail)) {
      imagesJSX.push(
        <Col key={image.id}>
          <img
            src={`${process.env.REACT_APP_strapiURL}${image.image.url}`}
            alt={IsEmptyOrWhiteSpace(image.image.alternativeText) ? 'dynamic_image' : image.image.alternativeText}
            width={imageSizes[image.size]}/>
          <p className='BlackText text-center' style={{fontSize: image_brief_detail_font_size}}>
            {image.brief_detail}
          </p>
        </Col>
      );
      return;
    }
  });
  return (
    <div>
      <Container className='d-flex justify-content-center align-items-center'>
        <Row style={{ marginTop: '80px', marginBottom: '100px'}}>
          {imagesJSX}
        </Row>
      </Container>
    </div>
  );
}



// Title component for all stories
const Title = (zone, index) => {
  return (
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background !== undefined ? `url(${process.env.REACT_APP_strapiURL}${zone.background.url})` : undefined}}>
      <Container className='d-flex justify-content-center align-items-center'>
        <img
          id='TitleImage'
          src={`${process.env.REACT_APP_strapiURL}${zone.image.url}`}
          alt={IsEmptyOrWhiteSpace(zone.image.alternativeText) ? zone.image.alternativeText : 'title image'} />
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
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background !== undefined ? `url(${process.env.REACT_APP_strapiURL}${zone.background.url})` : undefined}}>
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
  if (!IsEmptyOrWhiteSpace(zone.sub_text_1) && !IsEmptyOrWhiteSpace(zone.sub_text_2)) {
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

  if (subText === undefined && !IsEmptyOrWhiteSpace(zone.sub_text_1)) {
    subText = (
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='GrayText SubText text-center'>
          {zone.sub_text_1}
        </ReactMarkdown>
      </Container>
    );
  }

  if (subText === undefined && !IsEmptyOrWhiteSpace(zone.sub_text_2)) {
    subText = (
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='BlueText SubText text-center'>
          {zone.sub_text_2}
        </ReactMarkdown>
      </Container>
    );
  }

  return (
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background !== undefined ? `url(${process.env.REACT_APP_strapiURL}${zone.background.url})` : undefined}}>
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
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background !== undefined ? `url(${process.env.REACT_APP_strapiURL}${zone.background.url})` : undefined}}>
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='OrangeText MainText text-center'>
          {zone.main_text}
        </ReactMarkdown>
      </Container>
      {subText}
      {subcomponent_image(zone.image, '600px')}
    </div>
  );
}


const Frame3 = (zone, index) => {
  let subText = undefined;

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
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background !== undefined ? `url(${process.env.REACT_APP_strapiURL}${zone.background.url})` : undefined}}>
      {subcomponent_image_with_dynamic_sizing(zone.images)}
      <Container style={{marginTop: '-110px'}}>
        <ReactMarkdown className='OrangeText MainText text-center'>
          {zone.main_text}
        </ReactMarkdown>
      </Container>
      {subText}
    </div>
  );
}

const Frame4 = (zone, index) =>{
  // console.log(zone)
  let SQ2 = undefined;

  if (zone.quote2 !== undefined && zone.sub_quote2 !== undefined) {
    SQ2 = (
      <Col md={{span:5, offset:2}} className='LightBlueBackground justify-content-center align-self-center' >
        <ReactMarkdown className='BlueText text-center'>
          {zone.quote2}
        </ReactMarkdown>
        <ReactMarkdown className='GrayText text-center'>
          {zone.sub_quote2}
        </ReactMarkdown>   
      </Col>
    );
  }

  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background !== undefined ? `url(${process.env.REACT_APP_strapiURL}${zone.background.url})` : undefined}}>
      <Container className='justify-content-center align-items-center' style={{marginTop:'-300px'}}>
        <Row className='justify-content-around'>
          <Col md={{span:5}} className='LightBlueBackground justify-content-center align-self-center' >
            <ReactMarkdown className='BlueText text-center'>
              {zone.quote1}
            </ReactMarkdown>
            <ReactMarkdown className='GrayText text-center'>
              {zone.sub_quote1}
            </ReactMarkdown>
          </Col>
          {SQ2}
        </Row>
      </Container>
    </div>
  )
}

const Frame5 = (zone, index) =>{
  console.log(zone)

  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background !== undefined ? `url(${process.env.REACT_APP_strapiURL}${zone.background.url})` : undefined}}>
      <Container className='justify-content-center align-items-center' style={{marginTop:'200px'}}>
        <Row className='justify-content-around'>
          <Col>
            {zone.Picture_1}
            <ReactMarkdown>
              {zone.caption_1}
            </ReactMarkdown>
          </Col>
          <Col>
            <ReactMarkdown>
              {zone.caption}
            </ReactMarkdown>
          </Col>
          <Col>
            <ReactMarkdown>
              {zone.caption_2}
            </ReactMarkdown>
          </Col>
        </Row>
      </Container>
    </div>
  )
}


// Interactive frames
const InteractiveFrame1 = (zone, index) => {
  console.log(zone);
  let blueBackgroundMaxHeight = '200px';
  return (
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background !== undefined ? `url(${process.env.REACT_APP_strapiURL}${zone.background.url})` : undefined}}>
      <Container className='justify-content-center align-items-center'>
        <Row>
          <Col>
            <ReactMarkdown className='OrangeText MainText text-center'>
              {zone.main_text}
            </ReactMarkdown>
          </Col>
        </Row>
        <Row className='LightBlueBackground' style={{maxHeight: blueBackgroundMaxHeight}}>
          {/* Images left */}
          <Col style={{maxHeight: blueBackgroundMaxHeight}} xs={3} lg={4}> 
            <div className='InteractiveFrame1ImageOuterDiv' style={{height: '100%'}}> {/* I fucking hate this. I HAVE to define the height element as an inline style. Not even !important css tag works in the Stories.css file */}
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.left_front.url}`}
                alt={IsEmptyOrWhiteSpace(zone.left_front.alternativeText) ? 'Dyanamic_frame_left_front_image' : zone.left_front.alternativeText}
                className='imgFill InteractiveFrame1ImageFrontLeft'
              />
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.left_back.url}`}
                alt={IsEmptyOrWhiteSpace(zone.left_back.alternativeText) ? 'Dyanamic_frame_left_back_image' : zone.left_back.alternativeText}
                className='HalfImageSize InteractiveFrame1ImageBackLeft'
              />
            </div>
          </Col>
          {/* Text_center */}
          <Col>
          </Col>
          {/* Images Right */}
          <Col style={{maxHeight: blueBackgroundMaxHeight}} xs={3} lg={4}> 
            <div className='InteractiveFrame1ImageOuterDiv' style={{height: '100%'}}> {/* I fucking hate this. I HAVE to define the height element as an inline style. Not even !important css tag works in the Stories.css file */}
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.right_front.url}`}
                alt={IsEmptyOrWhiteSpace(zone.right_front.alternativeText) ? 'Dyanamic_frame_right_front_image' : zone.right_front.alternativeText}
                className='imgFill InteractiveFrame1ImageFrontRight'
              />
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.right_back.url}`}
                alt={IsEmptyOrWhiteSpace(zone.right_back.alternativeText) ? 'Dyanamic_frame_right_back_image' : zone.right_back.alternativeText}
                className='HalfImageSize InteractiveFrame1ImageBackRight'
              />
            </div>
          </Col>
        </Row>
      </Container>
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
    case 'frame.frame3':
      jsx = Frame3(zone, index);
      break;
    case 'frame.frame4':
      jsx = Frame4(zone, index);
      break;
    case 'frame.frame5':
      jsx = Frame5(zone, index);
      break;
    case 'frame.dynamic-frame1':
      jsx = InteractiveFrame1(zone, index);
      break;
    default:
      console.error(`Error: Unrecognized component '${zone.__component}'`);
  }

  return jsx;
}

export default SwitchComponent
