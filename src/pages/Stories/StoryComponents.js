import {
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import 'src/components/constants.css';
import './Stories.css';

function IsEmptyOrWhiteSpace(str) {
  return str===undefined ? true : (str.match(/^\s*$/) || []).length > 0;
}

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
            alt={image.image.alternativeText === undefined ? 'img' : image.image.alternativeText}
            className='FrameImage'
            width={width}
            src={`${process.env.REACT_APP_strapiURL}${image.image.url}`} />
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
const Title = (zone, index) => {
  return (
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background !== undefined ? `url(${process.env.REACT_APP_strapiURL}${zone.background.url})` : undefined}}>
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
  let subQuote = undefined;

  if (!IsEmptyOrWhiteSpace(zone.quote1) && !IsEmptyOrWhiteSpace(zone.quote2)) {
    subQuote = (
      <Row className='justify-content-around'>
          <Col md={{span:5}} className='LightBlueBackground justify-content-center align-self-center my-2'style={{padding: '20px', paddingTop: '20px' }} >
              <ReactMarkdown className='BlueText text-center' >
                {zone.quote1}
              </ReactMarkdown>
              <ReactMarkdown className='GrayText text-center'>
                {zone.sub_quote1}
              </ReactMarkdown>
          </Col>
          <Col md={{span:5, offset:2}} className='LightBlueBackground justify-content-center align-self-center my-5' style={{padding: '20px', paddingTop: '20px'}}>
              <ReactMarkdown className='BlueText text-center'>
                {zone.quote2}
              </ReactMarkdown>
              <ReactMarkdown className='GrayText text-center'>
                {zone.sub_quote2}
              </ReactMarkdown>   
          </Col>
      </Row>
    );
  }
  if (subQuote === undefined && !IsEmptyOrWhiteSpace(zone.quote1)){
    subQuote = (
      <Row className='justify-content-around' >
        <Col md={{span:5}} className='LightBlueBackground justify-content-center align-self-center' style={{padding: '20px', paddingTop: '20px'}}>
            <ReactMarkdown className='BlueText text-center' >
              {zone.quote1}
            </ReactMarkdown>
            <ReactMarkdown className='GrayText text-center'>
              {zone.sub_quote1}
            </ReactMarkdown>
        </Col>
    </Row>
    )
  }

  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background !== undefined ? `url(${process.env.REACT_APP_strapiURL}${zone.background.url})` : undefined}}>
        <Container className='justify-content-center align-items-center' style={{marginTop:'-300px'}}>
              {subQuote}
        </Container>
    </div>
  )
}

const Frame5 = (zone, index) =>{
  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background !== undefined ? `url(${process.env.REACT_APP_strapiURL}${zone.background.url})` : undefined}}>
        <Container className='d-flex justify-content-around align-self-center'>
          <Row className='d-flex justify-content-around align-self-center'>
                <Col xs={6} md={3}>
                    {subcomponent_image(zone.image_left, '300px')}
                </Col>
                <Col xs={6} md={3} className='align-self-end text-center'>
                    {zone.caption}
                </Col>
                <Col xs={6} md={3} style={{mariginLeft:'100px'}}>
                    {subcomponent_image(zone.image_right, '300px')}
                </Col>
          </Row>
        </Container>
    </div>
  )
}

const Frame6 = (zone, index) =>{
  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background !== undefined ? `url(${process.env.REACT_APP_strapiURL}${zone.background.url})` : undefined}}>
        <Container className='d-flex justify-content-around align-self-center'>
            <ReactMarkdown className='OrangeText MainText text-center'>
              {zone.title}
            </ReactMarkdown>
        </Container>
        <Container>
            <Row className='justify-content-center'>
                  <Col>
                      {subcomponent_image(zone.image,'600px')}
                  </Col>
                  <Col md={{span:5}} className='LightBlueBackground justify-content-center align-self-center' style={{padding: '20px', paddingTop: '20px'}}>
                      <ReactMarkdown className='BlueText text-center ' >
                        {zone.sub_text}
                      </ReactMarkdown>
                      <ReactMarkdown className='GrayText text-center'>
                        {zone.sub_author}
                      </ReactMarkdown>
                  </Col>
                </Row>
        </Container>
    </div>
  )
}

const Frame7 = (zone, index) =>{
  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background !== undefined ? `url(${process.env.REACT_APP_strapiURL}${zone.background.url})` : undefined}}>
        <Container className='d-flex justify-content-around align-self-center'>
          <Row>
            <Col>
                {subcomponent_image(zone.image,'800px')}
            </Col>
            <Col className='justify-content-between d-flex flex-column'>
              <Row className='my-5 GrayText'>
                <ReactMarkdown>
                  {zone.main_text}
                </ReactMarkdown>
              </Row>
              <Row className='LightYellowBackground my-2 p-3'>
                  {zone.sub_text1}
              </Row>
            </Col>
          </Row>
        </Container>
        <Container className='align-self-center'>
          <Row className='my-5 text-center GrayText'>
              {zone.sub_text2}
          </Row>
        </Container>
    </div>
  )
}
const Frame8 = (zone, index) =>{
  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background !== undefined ? `url(${process.env.REACT_APP_strapiURL}${zone.background.url})` : undefined}}>
        <Container >
          <Row fluid>
            {subcomponent_image(zone.image_title,'1200px')}
          </Row>
          <Row className='justify-content-between'>
            <Col>
              {subcomponent_image(zone.image,'400px')}
            </Col>
            <Col className='justify-content-between d-flex flex-column align-self-center'>
              <Row className='OrangeText MainText text-center my-5'>
                {zone.title}
              </Row>
              <Row className='justify-content-around' >
                <Col className='LightBlueBackground justify-content-center align-self-center' style={{padding: '20px', paddingTop: '20px'}}>
                    <ReactMarkdown className='BlueText text-center' >
                      {zone.quote}
                    </ReactMarkdown>
                    <ReactMarkdown className='GrayText text-center'>
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

const Frame9 = (zone, index) =>{
  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background !== undefined ? `url(${process.env.REACT_APP_strapiURL}${zone.background.url})` : undefined}}>
        <Container >
          <Row className='OrangeText MainText text-center'>
            {zone.title}
          </Row>
          <Row className='d-flex justify-content-around align-self-center'>
            <Col xs={6} md={3}>
              {subcomponent_image(zone.image_left,'400px')}
            </Col>
            <Col xs={6} md={3} className='align-self-center'>
              {subcomponent_image(zone.image_mid,'200px')}
            </Col>
            <Col xs={6} md={3}>
              {subcomponent_image(zone.image_right,'400px')}
            </Col>
          </Row>

        </Container>
    </div>
  )
}


// Interactive frames
const InteractiveFrame1 = (zone, index) => {
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
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background !== undefined ? `url(${process.env.REACT_APP_strapiURL}${zone.background.url})` : undefined}}>
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
            <div className='d-flex align-items-center justify-content-center InteractiveFrame1ImageOuterDiv' style={{height: '100%'}}> {/* I fucking hate this. I HAVE to define the height element as an inline style. Not even !important css tag works in the Stories.css file */}
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
            <div className='d-flex align-items-center justify-content-center InteractiveFrame1ImageOuterDiv' style={{height: '100%'}}> {/* I fucking hate this. I HAVE to define the height element as an inline style. Not even !important css tag works in the Stories.css file */}
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
    case 'frame.frame6':
      jsx = Frame6(zone, index);
      break;
    case 'frame.frame7':
      jsx = Frame7(zone, index);
      break;
    case 'frame.frame8':
      jsx = Frame8(zone, index);
      break;
    case 'frame.frame9':
      jsx = Frame9(zone, index);
      break;    
    case 'frame.interactive-frame1':
      jsx = InteractiveFrame1(zone, index);
      break;
    default:
      console.error(`Error: Unrecognized component '${zone.__component}'`);
  }

  return jsx;
}

export default SwitchComponent
