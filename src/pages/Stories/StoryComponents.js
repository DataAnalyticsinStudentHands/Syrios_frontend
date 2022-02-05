import {
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import 'src/components/constants.css';
import './Stories.css';
import 'src/components/coin/coinFlip.css';

function IsEmptyOrWhiteSpace(str) {
  return str===undefined ? true : (str.match(/^\s*$/) || []).length > 0;
}

// These are more general exports. All functions may use them
const subcomponent_image = (image, imgId) => {
  let caption = undefined; 
  // If light_blue_background is true, light_blue_caption_background should be false.
  // don't want to double the background causing opacity to double.
  image.light_blue_caption_background = image.light_blue_background ? false : image.light_blue_caption_background;
  if (!IsEmptyOrWhiteSpace(image.caption)) {
    caption = (
      <>
        <Container className={`d-flex justify-content-center align-items-center ${image.light_blue_caption_background ? "LightBlueBackground" : ""}`}>
          <ReactMarkdown id = {imgId} className='FrameImage GrayText CaptionText text-center' style={{padding: '0px', paddingTop: '20px'}}>
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
            alt={image.image.alternativeText === undefined ? 'img' : image.image.alternativeText}
            className='FrameImage'
            id = {imgId}
            src={`${process.env.REACT_APP_strapiURL}${image.image.url}`} 
          />
        </Container>
        {caption}
      </div>
    </Container>
  );
}

const subcomponent_image_with_dynamic_sizing = (images) => {
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
              alt='dynamic_image'
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
              alt='dynamic_image'
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
            alt='dynamic_image'
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
const Title = (zone, index, jsonObject) => {
  return (
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background === (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
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

const End_Frame = (zone, index, jsonObject) => {
  return (
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background === (undefined || null) ? undefined:`url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
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
          <Col >
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


const Frame1 = (zone, index, jsonObject) => {
  let subText = undefined;
  if (!IsEmptyOrWhiteSpace(zone.sub_text_1) && !IsEmptyOrWhiteSpace(zone.sub_text_2)) {
    subText = (
      <Container className='d-flex justify-content-center align-items-center'>
        <Row>
          <Col xs={6}>
            <ReactMarkdown className='BlueText SubText text-center'>
              {zone.sub_text_left}
            </ReactMarkdown>
          </Col>
          <Col xs={6} className='LightBlueBackground'>
            <Row>
              <ReactMarkdown className='BlueText SubText text-center'>
                {zone.sub_text_right}
              </ReactMarkdown>
            </Row>
            <Row>
              <ReactMarkdown className='GrayText CaptionText text-center'>
                {zone.sub_text_right_author}
              </ReactMarkdown>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }

  if (subText === undefined && !IsEmptyOrWhiteSpace(zone.sub_text_1)) {
    subText = (
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='GrayText BigSubText text-center'>
          {zone.sub_text_left}
        </ReactMarkdown>
      </Container>
    );
  }

  if (subText === undefined && !IsEmptyOrWhiteSpace(zone.sub_text_2)) {
    subText = (
      <Container className='d-flex justify-content-center align-items-center'>
        <Row>
          <ReactMarkdown className='BlueText SubText text-center'>
            {zone.sub_text_right}
          </ReactMarkdown>
        </Row>
        <Row>
          <ReactMarkdown className='GrayText CaptionText text-center'>
            {zone.sub_text_right_author}
          </ReactMarkdown>
        </Row>
      </Container>
    );
  }

  return (
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background === (undefined || null) ?  undefined:`url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
      <Container>
        <ReactMarkdown className='OrangeText MainText text-center'>
          {zone.main_text}
        </ReactMarkdown>
      </Container>
      {subText}
    </div>
  );
}


const Frame2 = (zone, index, jsonObject) => {
  let subText = undefined;
  console.log(zone);

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
    <div 
      key={`story_comp_${index}`} 
      className='section' 
      style={{ backgroundImage: zone.background === (undefined || null) ?  undefined:`url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}
    >
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='OrangeText MainText text-center'>
          {zone.main_text}
        </ReactMarkdown>
      </Container>
      {subText}
      {subcomponent_image(zone.image, 'Frame2Image')}
    </div>
  );
}

const Frame3 = (zone, index, jsonObject) => {
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
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background === (undefined || null) ?  undefined:`url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
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

const Frame4 = (zone, index, jsonObject) =>{
  // console.log(zone)
  let subQuote = undefined;

  if (!IsEmptyOrWhiteSpace(zone.quote1) && !IsEmptyOrWhiteSpace(zone.quote2)) {
    subQuote = (
      <Row className='justify-content-around'>
          <Col md={{span:5}} className='LightBlueBackground justify-content-center align-self-center my-2'style={{padding: '20px', paddingTop: '20px' }} >
              <ReactMarkdown className='BlueText text-center SubText' >
                {zone.quote1}
              </ReactMarkdown>
              <ReactMarkdown className='GrayText text-center CaptionText'>
                {zone.author1}
              </ReactMarkdown>
          </Col>
          <Col md={{span:5, offset:2}} className='LightBlueBackground justify-content-center align-self-center my-5' style={{padding: '20px', paddingTop: '20px'}}>
              <ReactMarkdown className='BlueText text-center SubText'>
                {zone.quote2}
              </ReactMarkdown>
              <ReactMarkdown className='GrayText text-center CaptionText'>
                {zone.author2}
              </ReactMarkdown>   
          </Col>
      </Row>
    );
  }
  if (subQuote === undefined && !IsEmptyOrWhiteSpace(zone.quote1)){
    subQuote = (
      <Row className='justify-content-around' >
        <Col md={{span:5}} className='LightBlueBackground justify-content-center align-self-center' style={{padding: '20px', paddingTop: '20px'}}>
            <ReactMarkdown className='BlueText text-center SubText' >
              {zone.quote1}
            </ReactMarkdown>
            <ReactMarkdown className='GrayText text-center CaptionText'>
              {zone.sub_quote1}
            </ReactMarkdown>
        </Col>
    </Row>
    )
  }

  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background === (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
        <Container className='justify-content-center align-items-center' style={{marginTop:'-10%'}}>
              {subQuote}
        </Container>
    </div>
  )
}

const Frame5 = (zone, index, jsonObject) =>{

  //console.log(zone.text_middle);
  let text_middle = undefined
  if(zone.text_middle.light_blue_caption_background){
    text_middle = (
      <ReactMarkdown className='LightBlueBackground SubText'>
        {zone.text_middle.text}
      </ReactMarkdown>
    );
  }
  else{
    text_middle = (
      <ReactMarkdown className='SubText mt-3 GrayText'>
        {zone.text_middle.text}
      </ReactMarkdown>
    );
  }

  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background === (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
        <Container className='d-flex justify-content-around align-self-center'>
          <Row className='d-flex justify-content-between align-self-center'>
                <Col sm={3}>
                    {subcomponent_image(zone.image_left, 'Frame5Image')}
                </Col>
                <Col sm={3} className='align-self-end text-center SubText'>
                    {text_middle}
                </Col>
                <Col sm={3}>
                    {subcomponent_image(zone.image_right, 'Frame5Image')}
                </Col>
          </Row>
        </Container>
    </div>
  )
}


const Frame6 = (zone, index, jsonObject) =>{
  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background === (undefined || null) ? undefined: `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
        <Container className='d-flex justify-content-around align-self-center'>
            <ReactMarkdown className='OrangeText MainText text-center'>
              {zone.title}
            </ReactMarkdown>
        </Container>
        <Container>
            <Row className='justify-content-around'>
                  <Col sm={6}>
                      {subcomponent_image(zone.image,'Frame6Image')}
                  </Col>
                  <Col sm={6} className='LightBlueBackground justify-content-center align-self-center' style={{padding: '20px', paddingTop: '20px'}}>
                      <ReactMarkdown className='BlueText text-center SubText' >
                        {zone.sub_text}
                      </ReactMarkdown>
                      <ReactMarkdown className='GrayText text-center CaptionText'>
                        {zone.sub_author}
                      </ReactMarkdown>
                  </Col>
                </Row>
        </Container>
    </div>
  )
}

const Frame7 = (zone, index, jsonObject) =>{
  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background === (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
        <Container className='d-flex justify-content-center align-self-center'>
          <Row className='d-flex justify-content-center align-self-center'>
            <Col sm={{span:6}}>
                {subcomponent_image(zone.image,'Frame7Image')}
            </Col>
            <Col sm={{span:6}} className='justify-content-around d-flex flex-column' id={'Frame7Image'}>
              <Row className='GrayText align-items-start SubText'>
                  <ReactMarkdown>
                    {zone.main_text}
                  </ReactMarkdown>
              </Row>
              <Row className='LightYellowBackground p-3 align-items-end GrayText CaptionText'>
                <ReactMarkdown>
                  {zone.sub_text_right}
                </ReactMarkdown>
              </Row>
            </Col>
          </Row>
        </Container>
        <Container className='d-flex justify-content-center align-self-center'>
          <Row className='my-3 text-center GrayText CaptionText' id={'Frame7textBotten'}>
              {zone.sub_text_bottom}
          </Row>
        </Container>
    </div>
  )
}
const Frame8 = (zone, index, jsonObject) =>{
  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background === (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
        <Container className='justify-content-center'>
          <Row className='justify-content-center'>
            {subcomponent_image(zone.image_title,'100%')}
          </Row>
          <Row className='justify-content-between'>
            <Col md={4}>
              {subcomponent_image(zone.image,'100%')}
            </Col>
            <Col md={8} className='justify-content-between d-flex flex-column align-self-center'>
              <Row className='OrangeText MainText text-center align-self-center my-3'>
                {zone.title}
              </Row>
              <Row className='justify-content-around' >
                <Col className='LightBlueBackground justify-content-center align-self-center' style={{padding: '20px', paddingTop: '20px'}}>
                    <ReactMarkdown className='BlueText text-center SubText' >
                      {zone.quote}
                    </ReactMarkdown>
                    <ReactMarkdown className='GrayText text-center CaptionText'>
                      {zone.sub_quote}
                    </ReactMarkdown>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
        

    </div>
  )
}

const Frame9 = (zone, index, jsonObject) =>{
  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background === (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
        <Container className='justify-content-center '>
          <Row className='OrangeText MainText text-center'>
            <Col className='justify-content-center'>
              {zone.title}
            </Col>
          </Row>
          <Row className='d-flex justify-content-around '>
            <Col xs={9} sm={4} >
              {subcomponent_image(zone.image_left,'100%')}
            </Col>
            <Col xs={9} sm={4}>
              {subcomponent_image(zone.image_mid,'100%')}
            </Col>
            <Col xs={9} sm={4}>
              {subcomponent_image(zone.image_right,'100%')}
            </Col>
          </Row>

        </Container>
    </div>
  )
}

// Interactive frames
const InteractiveFrame1 = (zone, index, jsonObject) => {
  let blueBackgroundMaxHeight = '200px';

  const FadeThenSwitchCompAndReset = (dom) => { // This function REQUIRES e.target to be compare scale or reset scale
    // There are more try catches here than the amount of classes you have to take to get a degree.
    let InteractiveFrame1CompareScale = undefined;
    let InteractiveFrame1ResetScale = undefined;
    // Avoid fast clickers from breaking website
    try {
      let compareScaleActive = true;

      // Are we rendering compare or reset scale?
      if (dom.className.includes('InteractiveFrame1CompareScale')) {
        InteractiveFrame1CompareScale = dom;
        InteractiveFrame1ResetScale = dom.nextSibling;
        compareScaleActive = true;
      } else {
        InteractiveFrame1CompareScale = dom.previousSibling;
        InteractiveFrame1ResetScale = dom;
        compareScaleActive = false;
      }

      // Leave IF the compare scale to reset scale animation has yet to finish
      let computedOpacityCompareScale = window.getComputedStyle(InteractiveFrame1CompareScale).opacity;
      let computedOpacityResetScale = window.getComputedStyle(InteractiveFrame1ResetScale).opacity;
      if (computedOpacityCompareScale === 0 || computedOpacityCompareScale === 1 || computedOpacityResetScale === 0 || computedOpacityResetScale === 1) {
        return 0;
      }

      // Get the row with light blue background because we need to do some display switch and opacity flipping on the sub elements
      let rowLightBlueBackground = dom;

      while (!rowLightBlueBackground.className.includes("row")) {
        rowLightBlueBackground = rowLightBlueBackground.parentElement;
      }
      rowLightBlueBackground = rowLightBlueBackground.previousSibling.previousSibling;

      let imgLeftDiv = rowLightBlueBackground.childNodes[0].childNodes[0];
      let textCenterDiv = rowLightBlueBackground.childNodes[1];
      let imgRightDiv = rowLightBlueBackground.childNodes[2].childNodes[0];
      

      // If compare scale is active then switch to reset scale else switch to compare scale
      if (compareScaleActive) {
        // Compare scale to Reset scale
        InteractiveFrame1CompareScale.style.opacity = '0.0';
        setTimeout(() => {
          try {
            InteractiveFrame1CompareScale.style.display = 'none';
            InteractiveFrame1ResetScale.style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              InteractiveFrame1ResetScale.style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);

        // text center front to text center back
        textCenterDiv.childNodes[0].style.opacity = '0.0';
        setTimeout(() => {
          try {
            textCenterDiv.childNodes[0].style.display = 'none';
            textCenterDiv.childNodes[1].style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              textCenterDiv.childNodes[1].style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);

        // image left front to image left back
        imgLeftDiv.childNodes[1].style.opacity = '0.0';
        setTimeout(() => {
          try {
            imgLeftDiv.childNodes[1].style.display = 'none';
            imgLeftDiv.childNodes[2].style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              imgLeftDiv.childNodes[2].style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);

        // image right front to image right back
        imgRightDiv.childNodes[1].style.opacity = '0.0';
        setTimeout(() => {
          try {
            imgRightDiv.childNodes[1].style.display = 'none';
            imgRightDiv.childNodes[2].style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              imgRightDiv.childNodes[2].style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);
      } else {
        // Reset scale to Compare scale
        InteractiveFrame1ResetScale.style.opacity = '0.0';
        setTimeout(() => {
          try {
            InteractiveFrame1CompareScale.style.display = 'block';
            InteractiveFrame1ResetScale.style.display = 'none';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              InteractiveFrame1CompareScale.style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);

        // text center back to text center front
        textCenterDiv.childNodes[1].style.opacity = '0.0';
        setTimeout(() => {
          try {
            textCenterDiv.childNodes[1].style.display = 'none';
            textCenterDiv.childNodes[0].style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              textCenterDiv.childNodes[0].style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);

        // image left back to image left front
        imgLeftDiv.childNodes[2].style.opacity = '0.0';
        setTimeout(() => {
          try {
            imgLeftDiv.childNodes[2].style.display = 'none';
            imgLeftDiv.childNodes[1].style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              imgLeftDiv.childNodes[1].style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);

        // image right back to image right front
        imgRightDiv.childNodes[2].style.opacity = '0.0';
        setTimeout(() => {
          try {
            imgRightDiv.childNodes[2].style.display = 'none';
            imgRightDiv.childNodes[1].style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              imgRightDiv.childNodes[1].style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);
      }
    } catch (error) {
      console.error(error);
    }

  };
  return (
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background === (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
      <Container className='justify-content-center align-items-center'>
        {/* Main text */}
        <Row>
          <Col>
            <ReactMarkdown className='OrangeText MainText text-center'>
              {zone.main_text}
            </ReactMarkdown>
          </Col>
        </Row>
        {/* Blue background css grid goodie */}
        <Row className='LightBlueBackground InteractiveFrame1LightBlueSizing'>

          {/* Images left */}
          <Col xs={3}> 
            <div className='d-flex align-items-center justify-content-center InteractiveFrame1ImageOuterDiv' style={{height: '200px'}}> {/* I fucking hate this. I HAVE to define the height element as an inline style. Not even !important css tag works in the Stories.css file */}
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_left_front.url}`}
                alt={IsEmptyOrWhiteSpace(zone.image_left_front.alternativeText) ? 'Interactive_frame_left_front_image' : zone.image_left_front.alternativeText}
                className='imgFill InteractiveFrame1ImageFrontLeft'
              />
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_left_back.url}`}
                alt={IsEmptyOrWhiteSpace(zone.image_left_back.alternativeText) ? 'Interactive_frame_left_back_image' : zone.image_left_back.alternativeText}
                className='HalfImageSize InteractiveFrame1ImageBackLeft'
              />
            </div>
          </Col>

          {/* Text_center */}
          <Col className='d-flex align-items-center justify-content-center' style={{height: blueBackgroundMaxHeight}} xs={6}>
            <ReactMarkdown className='GrayText SubText text-center InteractiveFrame1TextFront'>
              {zone.text_front}
            </ReactMarkdown>
            <ReactMarkdown className='GrayText SubText text-center InteractiveFrame1TextBack'>
              {zone.text_back}
            </ReactMarkdown>
          </Col>

          {/* Images Right */}
          <Col xs={3}> 
            <div className='d-flex align-items-center justify-content-center InteractiveFrame1ImageOuterDiv' style={{height: '200px'}}> {/* I fucking hate this. I HAVE to define the height element as an inline style. Not even !important css tag works in the Stories.css file */}
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_right_front.url}`}
                alt={IsEmptyOrWhiteSpace(zone.image_right_front.alternativeText) ? 'Interactive_frame_right_front_image' : zone.image_right_front.alternativeText}
                className='imgFill InteractiveFrame1ImageFrontRight'
              />
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_right_back.url}`}
                alt={IsEmptyOrWhiteSpace(zone.image_right_back.alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_right_back.alternativeText}
                className='HalfImageSize InteractiveFrame1ImageBackRight'
              />
            </div>
          </Col>
        </Row>
        {/* Compare Scale */}
        <Row>
          <Col className='d-flex align-items-center justify-content-center'>
            <i 
              className='demo-icon icon-coin-scale InteractiveFrame1ScaleIcon'
              onClick={(e)=> {
                // Find dom parent element for compare scale and reset scale
                let dom = e.target.parentElement.parentElement.nextSibling.childNodes[0].childNodes;
                if (window.getComputedStyle(dom[0]).display.includes('block')) { // if compare scale is block
                  FadeThenSwitchCompAndReset(dom[0]); // then return compare scale
                } else {
                  FadeThenSwitchCompAndReset(dom[1]); // else return reset scale
                }
              }}>
              &#xe834;</i>
          </Col>
        </Row>
        <Row>
          <Col 
            className='d-flex align-items-center justify-content-center'
            onClick={(e) => {FadeThenSwitchCompAndReset(e.target)}}>
            <p className='OrangeText InteractiveFrame1CompareScale'>
              Compare Scale
            </p>
            <p className='OrangeText InteractiveFrame1ResetScale'>
              Reset Scale
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

const InteractiveFrame2 = (zone, index, jsonObject) =>{

  const FlipCoin = (dom) =>{
    while (dom.className !== 'flip-box-inner') {
      dom = dom.nextSibling;
    }

    if (dom.style.transform === 'rotateY(180deg)') {
      dom.style.transform = 'rotateY(0deg)'
    } else {
      dom.style.transform = 'rotateY(180deg)';
    }
  }

  
  return(
    <div key={`story_comp_${index}`} className='section'style={{ backgroundImage: zone.background === (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
      <Container>
        <Row className='d-flex justify-content-between'>
          {/* image_lieft */}
          <Col className='LightBlueBackground d-flex align-items-center justify-content-center' xs={3} style={{height: '250px'}}>
            <div className='flip-box'>
              <div className='flip-box-inner'>
                <div className='flip-box-front'>
                    <img
                      src={`${process.env.REACT_APP_strapiURL}${zone.image_left_front.url}`}
                      alt={IsEmptyOrWhiteSpace(zone.image_left_front.alternativeText) ? 'Interactive_frame_left_front_image' : zone.image_left_front.alternativeText}
                      id='CoinImageFront'
                    />
                    <ReactMarkdown className='text-center SubText GrayText'>
                      {zone.text_left_front}
                    </ReactMarkdown>
                </div>
                <div className='flip-box-back'>
                  <img
                    src={`${process.env.REACT_APP_strapiURL}${zone.image_left_back.url}`}
                    alt={IsEmptyOrWhiteSpace(zone.image_left_back.alternativeText) ? 'Interactive_frame_left_back_image' : zone.image_left_back.alternativeText}
                    id='CoinImageBack'
                  />
                  <ReactMarkdown className='text-center SubText GrayText'>
                    {zone.text_left_back}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </Col>
          {/* text in the middle */}
          <Col xs={3} className='justify-content-around d-flex flex-column'>
            
              <Row className='GrayText SubText text-center align-items-start'>
                <Col>
                {zone.text_mid_top}
                </Col>
              </Row>

              <Row className='text-center align-items-center' >
                <Col>
                  <Row>
                    <Col className='d-flex align-items-center justify-content-center'>
                      <i 
                        className='demo-icon icon-coin-scale InteractiveFrame1ScaleIcon'
                        onClick={(e)=> {
                          let dom = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
                          
                          let coin_left = dom.childNodes[0].childNodes[0].childNodes[0]
                          let coin_right = dom.childNodes[2].childNodes[0].childNodes[0]
                          
                          FlipCoin(coin_left)
                          FlipCoin(coin_right)
                        }}>
                        &#xe833;</i>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className='GrayText SubText text-center align-items-end'>
                <Col>
                  {zone.text_mid_bot}
                </Col>
              </Row>
          </Col>
          {/* image right */}
          <Col className='LightBlueBackground d-flex align-items-center justify-content-center' xs={3}>
            <div className='flip-box'>
              <div className='flip-box-inner'>
                <div className='flip-box-front'>
                  <img
                  src={`${process.env.REACT_APP_strapiURL}${zone.image_right_front.url}`}
                  alt={IsEmptyOrWhiteSpace(zone.image_right_front.alternativeText) ? 'Interactive_frame_right_front_image' : zone.image_right_front.alternativeText}
                  id='CoinImageFront'
                  />
                  <ReactMarkdown className='text-center SubText GrayText'>
                    {zone.text_right_front}
                  </ReactMarkdown>
                </div>
                <div className='flip-box-back'>
                  <img
                  src={`${process.env.REACT_APP_strapiURL}${zone.image_right_back.url}`}
                  alt={IsEmptyOrWhiteSpace(zone.image_right_back.alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_right_back.alternativeText}
                  id='CoinImageBack'
                  />
                  <ReactMarkdown className='text-center SubText GrayText'>
                    {zone.text_right_back}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

const InteractiveFrame3 = (zone, index, jsonObject) =>{

  const switchForFront = (dom) =>{
    
    let imgLeftDiv = dom.childNodes[0].childNodes[0].childNodes[0]
    console.log(imgLeftDiv)

    let textLeftDiv = dom.childNodes[0].childNodes[1].childNodes[0]
    let textmidDiv = dom.childNodes[1].childNodes[1].childNodes[0]
    let imgRightDiv = dom.childNodes[2].childNodes[0].childNodes[0]
    let texRightDiv = dom.childNodes[2].childNodes[1].childNodes[0]

    imgLeftDiv.childNodes[2].style.opacity = '0.0';
    setTimeout(() => {
      try {
        imgLeftDiv.childNodes[2].style.display = 'none';
        imgLeftDiv.childNodes[1].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          imgLeftDiv.childNodes[1].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);

    textLeftDiv.childNodes[1].style.opacity = '0.0';
    setTimeout(() => {
      try {
        textLeftDiv.childNodes[1].style.display = 'none';
        textLeftDiv.childNodes[0].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          textLeftDiv.childNodes[0].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);

    textmidDiv.childNodes[1].style.opacity = '0.0';
    setTimeout(() => {
      try {
        textmidDiv.childNodes[1].style.display = 'none';
        textmidDiv.childNodes[0].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          textmidDiv.childNodes[0].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);

    imgRightDiv.childNodes[2].style.opacity = '0.0';
    setTimeout(() => {
      try {
        imgRightDiv.childNodes[2].style.display = 'none';
        imgRightDiv.childNodes[1].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          imgRightDiv.childNodes[1].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);

    texRightDiv.childNodes[1].style.opacity = '0.0';
    setTimeout(() => {
      try {
        texRightDiv.childNodes[1].style.display = 'none';
        texRightDiv.childNodes[0].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          texRightDiv.childNodes[0].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);


  }

  const switchForBack = (dom) =>{
    
    let imgLeftDiv = dom.childNodes[0].childNodes[0].childNodes[0]
    console.log(imgLeftDiv)
    console.log(imgLeftDiv.childNodes)

    let textLeftDiv = dom.childNodes[0].childNodes[1].childNodes[0]
    let textmidDiv = dom.childNodes[1].childNodes[1].childNodes[0]
    let imgRightDiv = dom.childNodes[2].childNodes[0].childNodes[0]
    let texRightDiv = dom.childNodes[2].childNodes[1].childNodes[0]

    imgLeftDiv.childNodes[1].style.opacity = '0.0';
    setTimeout(() => {
      try {
        imgLeftDiv.childNodes[1].style.display = 'none';
        imgLeftDiv.childNodes[2].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          imgLeftDiv.childNodes[2].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);

    textLeftDiv.childNodes[0].style.opacity = '0.0';
    setTimeout(() => {
      try {
        textLeftDiv.childNodes[0].style.display = 'none';
        textLeftDiv.childNodes[1].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          textLeftDiv.childNodes[1].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);

    textmidDiv.childNodes[0].style.opacity = '0.0';
    setTimeout(() => {
      try {
        textmidDiv.childNodes[0].style.display = 'none';
        textmidDiv.childNodes[1].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          textmidDiv.childNodes[1].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);

    imgRightDiv.childNodes[1].style.opacity = '0.0';
    setTimeout(() => {
      try {
        imgRightDiv.childNodes[1].style.display = 'none';
        imgRightDiv.childNodes[2].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          imgRightDiv.childNodes[2].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);

    texRightDiv.childNodes[0].style.opacity = '0.0';
    setTimeout(() => {
      try {
        texRightDiv.childNodes[0].style.display = 'none';
        texRightDiv.childNodes[1].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          texRightDiv.childNodes[1].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);


  }

  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background === (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
      <Container>
        <Row>
          <Col>
            <ReactMarkdown className='OrangeText MainText text-center'>
              {zone.title}
            </ReactMarkdown>
          </Col>
        </Row>
        <Row className='d-flex justify-content-between'>
          {/* image_lieft */}
          <Col className='LightBlueBackground' xs={3}>
              <Row className=''>
                <div className='d-flex align-items-center justify-content-center' style={{height: '200px'}}> {/* I fucking hate this. I HAVE to define the height element as an inline style. Not even !important css tag works in the Stories.css file */}
                  <img
                    src={`${process.env.REACT_APP_strapiURL}${zone.image_left_front.url}`}
                    alt={IsEmptyOrWhiteSpace(zone.image_left_front.alternativeText) ? 'Interactive_frame_left_front_image' : zone.image_left_front.alternativeText}
                    style={{display:'block', 'max-height':'180px', opacity:1, transition:'0.3s'}}
                  />
                  <img
                    src={`${process.env.REACT_APP_strapiURL}${zone.image_left_back.url}`}
                    alt={IsEmptyOrWhiteSpace(zone.image_left_back.alternativeText) ? 'Interactive_frame_left_front_image' : zone.image_left_back.alternativeText}
                    style={{display:'none', 'max-height':'180px', opacity:0, transition:'0.3s'}}
                  />
                </div>
              </Row>
              <Row className='p-3'>
                <div className='text-center CaptionText GrayText'>
                  <ReactMarkdown style={{display:'block', opacity:1, transition:'0.3s'}}>
                    {zone.text_left_front}
                  </ReactMarkdown>
                  <ReactMarkdown style={{display:'none', opacity:0, transition:'0.3s'}}>
                    {zone.text_left_back}
                  </ReactMarkdown>
                </div>

              </Row>
          </Col>
          {/* text in the middle */}
          <Col xs={4} className='justify-content-between d-flex flex-column'>

              <Row className='d-flex justify-content-center'>

              </Row>

              <Row className='d-flex justify-content-center' >
                <Col xs={{span:9}} className='text-center GrayText SubText'>
                  <ReactMarkdown className='InteractiveFrame1TextFront'>
                    {zone.text_mid_front}
                  </ReactMarkdown>
                  <ReactMarkdown className='InteractiveFrame1TextBack'>
                    {zone.text_mid_back}
                  </ReactMarkdown>
                </Col>
              </Row>

              <Row className='d-flex justify-content-center'>
                <Col className='d-flex justify-content-center'>
                    <button	
                      className='BlueText text-center my-2' 
                      style={{width: '150px'}}
                      onClick={(e)=>{
                        let dom = e.target.parentElement.parentElement.parentElement.parentElement
                        // console.log(dom)
                        switchForFront(dom)
                      }}
                    >
                      Government
                    </button>
                </Col>
                <Col className='d-flex justify-content-center'>
                    <button	
                      className='BlueText text-center my-2' 
                      style={{width: '150px'}}
                      onClick={(e)=>{
                        let dom = e.target.parentElement.parentElement.parentElement.parentElement
                        // console.log(dom)
                        switchForBack(dom)
                      }}
                    >
                      Values
                    </button>
                </Col>
              </Row>
          </Col>
          {/* image right */}
          <Col className='LightBlueBackground' xs={3}>
              <Row>
                <div className='d-flex align-items-center justify-content-center ' style={{height: '200px'}}> {/* I fucking hate this. I HAVE to define the height element as an inline style. Not even !important css tag works in the Stories.css file */}
                  <img
                    src={`${process.env.REACT_APP_strapiURL}${zone.image_right_front.url}`}
                    alt={IsEmptyOrWhiteSpace(zone.image_right_front.alternativeText) ? 'Interactive_frame_right_front_image' : zone.image_right_front.alternativeText}
                    style={{display:'block', 'max-height':'180px', opacity:1, transition:'0.3s'}}
                  />
                  <img
                    src={`${process.env.REACT_APP_strapiURL}${zone.image_right_back.url}`}
                    alt={IsEmptyOrWhiteSpace(zone.image_right_back.alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_right_back.alternativeText}
                    style={{display:'none', 'max-height':'180px', opacity:0, transition:'0.3s'}}
                  />
                </div>
              </Row>
              <Row className='p-3'>
                <div className='text-center CaptionText GrayText'>
                  <ReactMarkdown style={{display:'block', opacity:1, transition:'0.3s'}}>
                    {zone.text_right_front}
                  </ReactMarkdown>
                  <ReactMarkdown style={{display:'block', opacity:1, transition:'0.3s'}}>
                    {zone.text_right_back}
                  </ReactMarkdown>
                </div>
              </Row>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

const InteractiveFrame4 = (zone, index, jsonObject) => {

  const frameWithTwoImage = (zone) =>{
    return(
      <Row className='d-flex justify-content-between'>
      <Col xs={3}>
        <Row className='d-flex align-items-stretch justify-content-center' >
          <Col xs={6} className='align-self-end'>
            <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_left[0].url}`}
                alt={IsEmptyOrWhiteSpace(zone.image_left[0].alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_left[0].alternativeText}
                // style={{'max-height':'180px','max-width':'180px'}}
                height={'120px'}
              />
          </Col>
          <Col xs={6}>
            <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_left[1].url}`}
                alt={IsEmptyOrWhiteSpace(zone.image_left[1].alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_left[1].alternativeText}
                // style={{'max-height':'180px','max-width':'180px'}}
                height={'180px'}
              />
          </Col>
        </Row>
        <Row className='text-center CaptionText GrayText mt-5 LightBlueBackground '>
          <ReactMarkdown className='mt-3'>
            {zone.text_left}
          </ReactMarkdown>
        </Row>
      </Col>

      <Col xs={3} className='d-flex justify-content-center align-items-end'>
        <ReactMarkdown className='SubText text-center GrayText'>
          {zone.text_mid}
        </ReactMarkdown>
      </Col>

      <Col xs={3}>
        <Row className='d-flex align-items-stretch justify-content-center' >
          <Col xs={6} className='align-self-end'>
            <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_right[0].url}`}
                alt={IsEmptyOrWhiteSpace(zone.image_right[0].alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_right[0].alternativeText}
                height={'120px'}
              />
          </Col>
          <Col xs={6}>
            <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_right[1].url}`}
                alt={IsEmptyOrWhiteSpace(zone.image_right[1].alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_right[1].alternativeText}
                height={'180px'}
              />
          </Col>
        </Row>
        <Row className='text-center CaptionText GrayText mt-5 LightBlueBackground'>
          <ReactMarkdown className='mt-3'>
            {zone.text_right}
          </ReactMarkdown>
        </Row>
      </Col>
    </Row>
    )
  }
  const frameWithOneImage = (zone)=>{
    return(
      <Row className='d-flex justify-content-between'>
      <Col xs={3}>
        <Row className='d-flex align-items-stretch justify-content-center' >
          <Col className='d-flex justify-content-center'>
            <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_left[0].url}`}
                alt={IsEmptyOrWhiteSpace(zone.image_left[0].alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_left[0].alternativeText}
                height={'180px'}
            />
          </Col>
        </Row>
        <Row className='text-center CaptionText GrayText mt-5 LightBlueBackground'>
          <ReactMarkdown className='mt-3'>
            {zone.text_left}
          </ReactMarkdown>
        </Row>
      </Col>

      <Col xs={3} className='d-flex justify-content-center align-items-end'>
        <ReactMarkdown className='SubText text-center GrayText'>
          {zone.text_mid}
        </ReactMarkdown>
      </Col>

      <Col xs={3}>
        <Row className='d-flex justify-content-center' >
          <Col className='d-flex justify-content-center'>
            <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_right[0].url}`}
                alt={IsEmptyOrWhiteSpace(zone.image_right[0].alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_right[0].alternativeText}
                height={'180px'}
                width={'auto'}
              />
          </Col>
        </Row>
        <Row className='text-center CaptionText GrayText mt-5 LightBlueBackground'>
          <ReactMarkdown className='mt-3'>
            {zone.text_right}
          </ReactMarkdown>
        </Row>
      </Col>
    </Row>
    )
  }

  const switchFrame = (dom,i) =>{

    let option1 = dom.childNodes[0]
    let option2 = dom.childNodes[1]
    let option3 = dom.childNodes[2]
    let option4 = dom.childNodes[3]

    switch(i){
      case 'option1':
        option2.style.opacity = '0.0';
        option3.style.opacity = '0.0';
        option4.style.opacity = '0.0';
        setTimeout(() => {
          try {
            option1.style.display = 'block';
            option2.style.display = 'none';
            option3.style.display = 'none';
            option4.style.display = 'none';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              option1.style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);
        console.log(option1)
        console.log('finish option 1')
        break;
      case 'option2':
        option1.style.opacity = '0.0';
        option3.style.opacity = '0.0';
        option4.style.opacity = '0.0';
        setTimeout(() => {
          try {
            option1.style.display = 'none';
            option2.style.display = 'block';
            option3.style.display = 'none';
            option4.style.display = 'none';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              option2.style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);
          console.log('finish option 2')
          break;
      case 'option3':
        option1.style.opacity = '0.0';
        option2.style.opacity = '0.0';
        option4.style.opacity = '0.0';
        setTimeout(() => {
          try {
            option1.style.display = 'none';
            option2.style.display = 'none';
            option3.style.display = 'block';
            option4.style.display = 'none';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              option3.style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);
        console.log('finish option 3')

        break;
      case 'option4':
        option2.style.opacity = '0.0';
        option1.style.opacity = '0.0';
        option3.style.opacity = '0.0';
        setTimeout(() => {
          try {
            option1.style.display = 'none';
            option2.style.display = 'none';
            option3.style.display = 'none';
            option4.style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              option4.style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);
        console.log('finish option 4')
        break;
      default:
        console.log();
    }


  }

  return (
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background === (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
      <Container className='my-3'>
        <ReactMarkdown className='OrangeText MainText text-center'>
          {zone.title}
        </ReactMarkdown>
      </Container>
      <Container className='my-5'>
        <Row className='d-flex justify-content-between'>
          <Col className='d-flex justify-content-center'>
            <button	
              className='BlueText text-center my-2' 
              onClick={(e)=>{
                let i = 'option1'
                let dom = e.target.parentElement.parentElement.nextSibling
                switchFrame(dom,i)
              }}
            >
              Denomination
            </button>
          </Col>
          <Col className='d-flex justify-content-center'>
            <button	
              className='BlueText text-center my-2' 
              onClick={(e)=>{
                let i = 'option2'
                let dom = e.target.parentElement.parentElement.nextSibling
                switchFrame(dom,i)
              }}
            >
              Mint Date
            </button>
          </Col>
          <Col className='d-flex justify-content-center'>
            <button	
              className='BlueText text-center my-2' 
              onClick={(e)=>{
                let i = 'option3'
                let dom = e.target.parentElement.parentElement.nextSibling
                switchFrame(dom,i)
              }}
            >
              Mint Marks
            </button>
          </Col>
          <Col className='d-flex justify-content-center'>
            <button	
              className='BlueText text-center my-2' 
              onClick={(e)=>{
                let i = 'option4'
                let dom = e.target.parentElement.parentElement.nextSibling
                switchFrame(dom,i)
              }}
            >
              Other Marks
            </button>
          </Col>
        </Row>
        <Row className='mt-5 d-flex justify-content-between' style={{height: '200px'}} >
            <div style={{display:'block', opacity:'1.0', transition:'0.3s'}}>
              {frameWithTwoImage(zone.component[0])}
            </div>
            <div style={{display:'none', opacity:'0.0', transition:'0.3s'}}>
              {frameWithOneImage(zone.component[1])}
            </div>
            <div style={{display:'none', opacity:'0.0', transition:'0.3s'}}>
              {frameWithOneImage(zone.component[2])}
            </div>
            <div style={{display:'none', opacity:'0.0', transition:'0.3s'}}>
              {frameWithOneImage(zone.component[3])}
            </div>
        </Row>
      </Container>
    </div>
  );
}

const Testframe =(zone, index, jsonObject) =>{

  //console.log(jsonObject, 'Yee! I get the image link');
  let instance = []
  for (var i = 0; i < jsonObject.results.bindings.length; i++){
    instance.push(jsonObject.results.bindings[i].image.value)
  }
  //console.log(instance);

  return(
    <div key={`story_comp_${index}`} className='section'  style={{ backgroundImage: zone.background === (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
        <Container>
          <Row>
            <img
              src={zone.image_link}
              alt= {'test img link'}
              style={{'max-height':'180px','max-width':'180px'}}
            />
          </Row>
          <Row>
            <img
              src={jsonObject.results.bindings[0].image.value} 
              alt= {'test img link 2'}
              style={{'max-height':'180px','max-width':'180px'}}
            />
          </Row>
          <Row>
          <img
              src={instance[1]}
              alt= {'test img link 2'}
              style={{'max-height':'180px','max-width':'180px'}}
            />

          </Row>
        </Container>
    </div>
  )
}
const Testframe2 =(zone, index, jsonObject) =>{

  //console.log(jsonObject.results.bindings);
  let instance = []
  for (var i = 0; i < jsonObject.results.bindings.length; i++){
    instance.push(jsonObject.results.bindings[i].instanceLabel.value)
  }
  //console.log(instance);

  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background === (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
        <Container>
          <Row>
            {jsonObject.results.bindings[0].instanceLabel.value}
          </Row>
          <Row>
            {instance[0]}
          </Row>
        </Container>
    </div>
  )
}

// This function is for mapping name and functions over.
// Did this for organization really. 
const SwitchComponent = (zone, index, jsonObject, fullpageApi,) => {
  let jsx = undefined;
  switch (zone.__component) {
    case 'frame.title':
      jsx = Title(zone, index, jsonObject);
      break;
    case 'frame.endframe':
      jsx = End_Frame(zone, index,jsonObject);
      break;
    case 'frame.frame1':
      jsx = Frame1(zone, index,jsonObject);
      break;
    case 'frame.frame2':
      jsx = Frame2(zone, index,jsonObject);
      break;
    case 'frame.frame3':
      jsx = Frame3(zone, index,jsonObject);
      break;
    case 'frame.frame4':
      jsx = Frame4(zone, index,jsonObject);
      break;
    case 'frame.frame5':
      jsx = Frame5(zone, index, jsonObject);
      break;
    case 'frame.frame6':
      jsx = Frame6(zone, index, jsonObject);
      break;
    case 'frame.frame7':
      jsx = Frame7(zone, index, jsonObject);
      break;
    case 'frame.frame8':
      jsx = Frame8(zone, index, jsonObject);
      break;
    case 'frame.frame9':
      jsx = Frame9(zone, index, jsonObject);
      break; 
    case 'frame.interactive-frame1':
      jsx = InteractiveFrame1(zone, index, jsonObject);
      break;
    case 'frame.interactive-frame2':
      jsx = InteractiveFrame2(zone, index, jsonObject);
      break;
    case 'frame.interactive-frame3':
      jsx = InteractiveFrame3(zone, index, jsonObject);
      break;
    case 'frame.interactive-frame4':
      jsx = InteractiveFrame4(zone, index, jsonObject);
      break;
    case 'frame.testframe':
      jsx = Testframe(zone, index, jsonObject);
      break;
    case 'frame.testframe2':
      jsx = Testframe2(zone, index, jsonObject);
      break;
    default:
      console.error(`Error: Unrecognized component '${zone.__component}'`);
  }

  return jsx;
}

export default SwitchComponent
