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
import backGround from 'src/assets/background.jpg';

function IsEmptyOrWhiteSpace(str) {
  return str===undefined ? true : (str.match(/^\s*$/) || []).length > 0;
}
const mainText = (main_text) =>{
  let MainText = undefined
  if(!IsEmptyOrWhiteSpace(main_text)){
    MainText=(
      <Container className='d-flex justify-content-center align-self-center'>
        <ReactMarkdown className='OrangeText MainText text-center'>
          {main_text}
        </ReactMarkdown>
      </Container>
    )
  }
  return(
    MainText
  )
}
const bigSubText = (sub_text) =>{
  let BigsubText = undefined
  if(!IsEmptyOrWhiteSpace(sub_text)){
    BigsubText=(
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='BlueText BigSubText text-center'>
          {sub_text}
        </ReactMarkdown>
      </Container>
    )
  }
  return(
    BigsubText
  )
}
const subText = (sub_text) =>{
  let SubText = undefined
  if(!IsEmptyOrWhiteSpace(sub_text)){
    SubText=(
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='BlueText SubText text-center'>
          {sub_text}
        </ReactMarkdown>
      </Container>
    )
  }
  return(
    SubText
  )
}
const capText = (cap_text) =>{
  let CubText = undefined
  if(!IsEmptyOrWhiteSpace(cap_text)){
    CubText=(
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='GrayText CaptionText text-center'>
          {cap_text}
        </ReactMarkdown>
      </Container>
    )
  }
  return(
    CubText
  )
}

const sub_cap_blue_bg = (sub_text, cap_text)=>{
  let Sub_Cap_Blue_Bg = undefined
  if(!IsEmptyOrWhiteSpace(cap_text)){
    Sub_Cap_Blue_Bg = (
      <Container className='LightBlueBackground' style={{padding: '20px', paddingTop: '20px'}}>
        <ReactMarkdown className='BlueText text-center SubText' >
          {sub_text}
        </ReactMarkdown>
        <ReactMarkdown className='GrayText text-center CaptionText' >
          {cap_text}
        </ReactMarkdown>
      </Container>
    )
  }
  else{
    Sub_Cap_Blue_Bg = (
      <Container>
        <ReactMarkdown className='GrayText text-center BigSubText' >
          {sub_text}
        </ReactMarkdown>
      </Container>
    )
  }
  return(
    Sub_Cap_Blue_Bg
  )
}

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

const FlipCoinImg = (img_fornt, img_back) =>{
  let Coin = undefined
  Coin = (
    <div className='flip-box'>
      <div className='flip-box-inner'>
        <div className='flip-box-front'>
          {subcomponent_image_only(img_fornt)}
        </div>
        <div className='flip-box-back'>
          {subcomponent_image_only(img_back)}
        </div>
      </div>
    </div>
  )
  return(
    Coin
  )
}


const subcomponent_image_only = (image) => {
  let imageSizes = {
    "XXS": "50px",
    "XS": "150px",
    "S": "250px",
    "M": "350px",
    "L": "450px",
    "XL": "550px",
    "XXL": "650px"
  };
  return (
      <img
        src={`${process.env.REACT_APP_strapiURL}${image.image.url}`}            
        alt={image.image.alternativeText === undefined ? 'img' : image.image.alternativeText}
        width={imageSizes[image.size]} 
      />
  );
}

// These are more general exports. All functions may use them
const subcomponent_image = (image) => {
  // If light_blue_background is true, light_blue_caption_background should be false.
  // don't want to double the background causing opacity to double.
  image.light_blue_caption_background = image.light_blue_background ? false : image.light_blue_caption_background;
  
  let imageSizes = {
    "very_small": "150px",
    "small": "250px",
    "medium": "350px",
    "big": "500px",
    "very_big": "750px",
    "gigantic": "1200px"
  };
  const image_brief_detail_font_size=Math.atan((parseInt(imageSizes[image.size])-250)/50)*30+50;

  let caption = undefined; 
  if (!IsEmptyOrWhiteSpace(image.caption)) {
    caption = (
      <>
        <Container className={`d-flex justify-content-center align-items-center ${image.light_blue_caption_background ? "LightBlueBackground" : ""}`} style={{width:imageSizes[image.size]}}>
          <ReactMarkdown 
            className='GrayText CaptionText text-center' 
            style={{padding: '0px', paddingTop: '20px', fontSize:image_brief_detail_font_size}}
          >
            {image.caption}
          </ReactMarkdown>
        </Container>
      </>
    );
  }
  return (
    <Container className='d-flex justify-content-center align-items-center'>
      <div className={`${image.light_blue_background ? "LightBlueBackground" : ""}`} style={{padding: '20px', paddingBottom: '0px'}}>
        <Container className='d-flex justify-content-center align-items-center Blande_Image'>
          <img
            src={backGround}
            alt={'bgimg'}
            width={imageSizes[image.size]}
          />
          <img
            src={`${process.env.REACT_APP_strapiURL}${image.image.url}`}            
            alt={image.image.alternativeText === undefined ? 'img' : image.image.alternativeText}
            width={imageSizes[image.size]}
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
        <Col key={image.id} className='text-center'>
          <Link to={image.link} className='blandStyle'>
            <img
              src={`${process.env.REACT_APP_strapiURL}${image.image.url}`}
              alt='dynamic_image'
              width={imageSizes[image.size]}
            />
            <p className='OrangeText' style={{fontSize: image_brief_detail_font_size}}>
              {image.brief_detail}
            </p>
          </Link>
        </Col>
      );
      return;
    }

    if (!IsEmptyOrWhiteSpace(image.link)) {
      imagesJSX.push(
        <Col key={image.id} className='text-center'>
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
        <Col key={image.id} className='text-center'>
            <img
              src={`${process.env.REACT_APP_strapiURL}${image.image.url}`}
              alt='dynamic_image'
              width={imageSizes[image.size]}
              className='justify-content-center'
            />
            <p className='BlackText' style={{fontSize: image_brief_detail_font_size}}>
              {image.brief_detail}
            </p>
        </Col>
      );
      return;
    }
    else {
      imagesJSX.push(
        <Col key={image.id} className='text-center'>
          <img
            src={`${process.env.REACT_APP_strapiURL}${image.image.url}`}
            alt='dynamic_image'
            width={imageSizes[image.size]}
            className='justify-content-center'
          />
        </Col>
      );
      return;
    }
  });
  // console.log(imagesJSX);
  return (
    <div>
      <Container>
        <Row style={{ marginTop: '80px', marginBottom: '150px'}} className='d-flex justify-content-center align-items-end'>
          {imagesJSX}
        </Row>
      </Container>
    </div>
  );
}

// Title component for all stories
const Title = (zone, index, jsonObject) => {

  let title = undefined
  if (!IsEmptyOrWhiteSpace(zone.title)){
    title = (
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='BlueText text-center TitleText'>
          {zone.title}
        </ReactMarkdown>
      </Container>
    )
  }

  let subtitle = undefined
  if (!IsEmptyOrWhiteSpace(zone.subtitle)){
    subtitle = (
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='OrangeText text-center SubTitleText'>
          {zone.subtitle}
        </ReactMarkdown>
      </Container>
    )
  }

  let caption = undefined
  if (!IsEmptyOrWhiteSpace(zone.caption)){
    caption = (
      <Container className='d-flex justify-content-center align-items-center mt-5'>
        <ReactMarkdown className='GrayText text-center CaptionTitleText'>
          {zone.caption}
        </ReactMarkdown>
      </Container>
    )
  }

  return (
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>
        <Container className='d-flex justify-content-center align-items-center'>
          {subcomponent_image_only(zone.image)}
        </Container>
        {title}
        {subtitle}
        {caption}
    </div>
  );
}

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


const Frame1 = (zone, index, jsonObject) => {
  //console.log(zone);
  let subtext = undefined;
  if (!IsEmptyOrWhiteSpace(zone.sub_text_left) && !IsEmptyOrWhiteSpace(zone.sub_text_right) && !IsEmptyOrWhiteSpace(zone.caption_text_right)) {
    subtext = (
      <Container className='d-flex justify-content-center align-items-center'>
        <Row>
          <Col xs={6}>
            {bigSubText(zone.sub_text_left)}
          </Col>
          <Col xs={6} className='LightBlueBackground p-3'>
            <Row>
              {subText(zone.sub_text_right)}
            </Row>
            <Row>
              {capText(zone.caption_text_right)}
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }

  if (subtext === undefined && !IsEmptyOrWhiteSpace(zone.sub_text_left)) {
    subtext = (
      <Container className='d-flex justify-content-center align-items-center'>
        {bigSubText(zone.sub_text_left)}
      </Container>
    );
  }

  if (subtext === undefined && !IsEmptyOrWhiteSpace(zone.sub_text_right)) {
    subtext = (
      <Container className='d-flex justify-content-center align-items-center'>
        <Row>
          {subText(zone.sub_text_right)}
        </Row>
        <Row>
          {capText(zone.caption_text_right)}
        </Row>
      </Container>
    );
  }

  if (subtext === undefined && !IsEmptyOrWhiteSpace(zone.caption_text_right)) {
    subtext = (
      <Container className='d-flex justify-content-center align-items-center'>
        <Row>
          {capText(zone.caption_text_right)}
        </Row>
      </Container>
    );
  }

  return (
    <div key={`story_comp_${index}`} className='section testSection' style={{ backgroundImage: zone.background == (undefined || null) ?  undefined:`url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
    backgroundBlendMode:'multiply' }}>
      <Container className='mb-5'>
        {mainText(zone.main_text)}
      </Container>
      {subtext}
    </div>
  );
}

const Frame2 = (zone, index, jsonObject) => {
  return (
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ?  undefined:`url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
    backgroundBlendMode:'multiply'}}>
      <Container className='mb-5'>
        {mainText(zone.main_text)}
      </Container>
      {subText(zone.sub_text)}
      {subcomponent_image(zone.image)}
    </div>
  );
}

const Frame3 = (zone, index, jsonObject) => {

  return (
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ?  undefined:`url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>
      {subcomponent_image_with_dynamic_sizing(zone.images)}
      <div style={{marginTop: '-60px'}}>
        {mainText(zone.main_text)}
        {subText(zone.sub_text)}
      </div>
    </div>
  );
}

const Frame4 = (zone, index, jsonObject) =>{
  
  let subQuote = undefined;

  if (!IsEmptyOrWhiteSpace(zone.sub_text_left) && !IsEmptyOrWhiteSpace(zone.sub_text_right)) {
    subQuote = (
      <Row className='justify-content-between'>
          <Col xs={{span:5}} className='LightBlueBackground justify-content-center align-self-center'style={{padding: '20px', paddingTop: '20px' }} >
              {subText(zone.sub_text_left)}
              {capText(zone.cap_text_left)}
          </Col>
          <Col xs={{span:5}} className='LightBlueBackground justify-content-center align-self-center' style={{padding: '20px', paddingTop: '20px'}}>
              {subText(zone.sub_text_right)}
              {capText(zone.cap_text_right)}
          </Col>
      </Row>
    );
  }
  if (subQuote === undefined && !IsEmptyOrWhiteSpace(zone.sub_text_left)){
    subQuote = (
      <Row className='justify-content-between' >
        <Col xs={{span:5}} className='LightBlueBackground justify-content-center align-self-center' style={{padding: '20px', paddingTop: '20px'}}>
          {subText(zone.sub_text_left)}
          {capText(zone.cap_text_left)}
        </Col>
      </Row>
    )
  }
  return(
    <div key={`story_comp_${index}`} 
    className='section' 
    style={{ 
      backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply' 
    }}
    >
        <Container className='justify-content-center align-items-center' style={{marginBottom:'30%'}}>
            {subQuote}
        </Container>
    </div>
  )
}

const Frame5 = (zone, index, jsonObject) =>{

  let text_middle = undefined
  if(zone.text_middle.light_blue_caption_background){
    text_middle = (
      <Col xs={6} className='LightBlueBackground align-self-center text-center SubText' style={{zIndex:'-1'}}>
        <ReactMarkdown className='BigSubText GrayText px-5 my-5'>
          {zone.sub_text_middle.text}
        </ReactMarkdown>
      </Col>
    );
  }
  else{
    text_middle = (
      <Col xs={3} className='align-self-center text-center SubText'>
        <ReactMarkdown className=' BigSubText mt-3 GrayText'>
          {zone.sub_text_middle.text}
        </ReactMarkdown>
      </Col>
    );
  }

  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>
        <Container className='mb-5'>
          {mainText(zone.main_text)}
        </Container>
        <Container>
          <Row className='d-flex justify-content-around align-self-center' >
                <Col xs={3}>
                    {subcomponent_image(zone.image_left)}
                </Col>
                {text_middle}
                <Col xs={3}>
                    {subcomponent_image(zone.image_right)}
                </Col>
          </Row>
        </Container>
    </div>
  )
}

const Frame6 = (zone, index, jsonObject) =>{
  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined: `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>
        <Container className='mb-5'>
          {mainText(zone.main_text)}
        </Container>
        <Container>
          <Row>
            <Col xs={5}>
              {subcomponent_image(zone.image)}
            </Col>
            <Col xs={7} className='align-self-center'>
              {sub_cap_blue_bg(zone.sub_text_right, zone.cap_text_right)}
            </Col>
          </Row>
        </Container>
    </div>
  )
}

const Frame7 = (zone, index, jsonObject) =>{

  let sub_text_right_top = undefined
  if (!IsEmptyOrWhiteSpace(zone.sub_text_right_top)){
    sub_text_right_top =(
      <Row className='GrayText align-items-start SubText'>
        <ReactMarkdown>
          {zone.sub_text_right_top}
        </ReactMarkdown>
      </Row>
    )
  }
  let cap_text_right_bottom = undefined
  if (!IsEmptyOrWhiteSpace(zone.cap_text_bottom)){
    cap_text_right_bottom =(
      <Row className='LightYellowBackground align-items-end GrayText CaptionText' style={{padding: '20px', paddingTop: '20px'}}>
        <ReactMarkdown>
          {zone.cap_text_bottom}
        </ReactMarkdown>
      </Row>
    )
  }

  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>
        <Container className='mb-5'>
          {mainText(zone.main_text)}
        </Container>
        {capText(zone.cap_text_top)}
        <Container className='d-flex justify-content-between align-self-center my-5'>
            <Col xs={8} className='d-flex justify-content-between align-self-center'>
              {subcomponent_image(zone.image)}
            </Col>
            <Col xs={4} className='justify-content-between d-flex flex-column'>
              {sub_text_right_top}
              {cap_text_right_bottom}
            </Col>
        </Container>
        {capText(zone.cap_text_bottom)}
    </div>
  )
}

const Frame8 = (zone, index, jsonObject) =>{
  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>
        <Container className='justify-content-center'>
          <Row className='text-center'>
            {subcomponent_image_only(zone.image_top)}
          </Row>
          <Row>
            <Col md={4}>
              {subcomponent_image(zone.image_left)}
            </Col>
            <Col md={7} className='justify-content-around d-flex flex-column'>
              {mainText(zone.main_text)}
              {sub_cap_blue_bg(zone.sub_text_right,zone.cap_text_right)}
            </Col>
          </Row>
        </Container>
    </div>
  )
}


const Frame9 = (zone, index, jsonObject) =>{
  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>
        <Container className='mb-5'>
          {mainText(zone.main_text)}
        </Container>
        <Container>
          <Row className='d-flex justify-content-between mt-5'>
            <Col xs={9} sm={3} >
              {subcomponent_image(zone.image_left)}
            </Col>
            <Col xs={9} sm={3} className='d-flex align-items-center'>
              {subcomponent_image(zone.image_mid)}
            </Col>
            <Col xs={9} sm={3}>
              {subcomponent_image(zone.image_right)}
            </Col>
          </Row>

        </Container>
    </div>
  )
}

const Frame10 = (zone, index, jsonObject) =>{
  let page = undefined
  if(zone.leftOrRight){
    page = (
      <Row className='d-flex justify-content-between align-self-center'>
        <Col xs={9} className="d-flex align-self-center">
          {mainText(zone.main_text)}
        </Col>
        <Col xs={3}>
          {subcomponent_image_only(zone.image)}
        </Col>
      </Row>
    )
  }
  else{
    page = (
      <Row className='d-flex justify-content-between align-self-center'>
        <Col xs={3}>
          {subcomponent_image_only(zone.image)}
        </Col>
        <Col xs={9} className="d-flex align-self-center">
          {mainText(zone.main_text)}
        </Col>
    </Row>
    )
  }

  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>
        <Container>
          {page}
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
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>
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
        <Row className='LightBlueBackground InteractiveFrame1LightBlueSizing d-flex justify-content-around'>

          {/* Images left */}
          <Col xs={3}> 
            <div className='d-flex align-items-center justify-content-center InteractiveFrame1ImageOuterDiv' style={{height: '200px'}}> {/* I fucking hate this. I HAVE to define the height element as an inline style. Not even !important css tag works in the Stories.css file */}
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_left_front.url}`}
                alt={IsEmptyOrWhiteSpace(zone.image_left_front.alternativeText) ? 'Interactive_frame_left_front_image' : zone.image_left_front.alternativeText}
                className=' InteractiveFrame1ImageFrontLeft'
                id='InteractiveFrame1'
              />
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_left_back.url}`}
                alt={IsEmptyOrWhiteSpace(zone.image_left_back.alternativeText) ? 'Interactive_frame_left_back_image' : zone.image_left_back.alternativeText}
                className=' InteractiveFrame1ImageBackLeft'
                id='InteractiveFrame1'
              />
            </div>
          </Col>

          {/* Text_center */}
          <Col xs={5} className='d-flex align-items-center justify-content-center' style={{height: blueBackgroundMaxHeight}}>
            <ReactMarkdown className='GrayText SubText text-center InteractiveFrame1TextFront'>
              {zone.sub_text_middle_front}
            </ReactMarkdown>
            <ReactMarkdown className='GrayText SubText text-center InteractiveFrame1TextBack'>
              {zone.sub_text_middle_back}
            </ReactMarkdown>
          </Col>

          {/* Images Right */}
          <Col xs={3}> 
            <div className='d-flex align-items-center justify-content-center InteractiveFrame1ImageOuterDiv' style={{height: '200px'}}> {/* I fucking hate this. I HAVE to define the height element as an inline style. Not even !important css tag works in the Stories.css file */}
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_right_front.url}`}
                alt={IsEmptyOrWhiteSpace(zone.image_right_front.alternativeText) ? 'Interactive_frame_right_front_image' : zone.image_right_front.alternativeText}
                className=' InteractiveFrame1ImageFrontRight'
                id='InteractiveFrame1'
              />
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_right_back.url}`}
                alt={IsEmptyOrWhiteSpace(zone.image_right_back.alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_right_back.alternativeText}
                className=' InteractiveFrame1ImageBackRight'
                id='InteractiveFrame1'

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
    <div key={`story_comp_${index}`} className='section'style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>
      <Container>
        <Row className='d-flex justify-content-between'>
          {/* image_lieft */}
          <Col className='d-flex align-items-center justify-content-center' xs={3}>
            <div className='flip-box'>
              <div className='flip-box-inner'>
                <div className='flip-box-front'>
                  {subcomponent_image(zone.image_left_front)}
                </div>
                <div className='flip-box-back'>
                  {subcomponent_image(zone.image_left_back)}
                </div>
              </div>
            </div>
          </Col>
          {/* text in the middle */}
          <Col xs={4} className='justify-content-between d-flex flex-column mt-5'>
            
              <Row className='GrayText SubText text-center align-items-start mt-5'>
                <Col>
                  {zone.sub_text_middle_top}
                </Col>
              </Row>

              <Row className='text-center align-items-center my-5' >
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
              <Row className='GrayText SubText text-center align-items-end mb-5'>
                <Col>
                  {zone.sub_text_middle_bottom}
                </Col>
              </Row>
          </Col>
          {/* image right */}
          <Col className='d-flex align-items-center justify-content-center' xs={3}>
            <div className='flip-box'>
              <div className='flip-box-inner'>
              <div className='flip-box-front'>
                  {subcomponent_image(zone.image_right_front)}
                </div>
                <div className='flip-box-back'>
                  {subcomponent_image(zone.image_right_back)}
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
    
    let imgLeftDiv = dom.childNodes[0]
    let textmidDiv = dom.childNodes[1].childNodes[1].childNodes[0]
    let imgRightDiv = dom.childNodes[2]


    imgLeftDiv.childNodes[1].style.opacity = '0.0';
    setTimeout(() => {
      try {
        imgLeftDiv.childNodes[1].style.display = 'none';
        imgLeftDiv.childNodes[0].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          imgLeftDiv.childNodes[0].style.opacity = '1.0';
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

    imgRightDiv.childNodes[1].style.opacity = '0.0';
    setTimeout(() => {
      try {
        imgRightDiv.childNodes[1].style.display = 'none';
        imgRightDiv.childNodes[0].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          imgRightDiv.childNodes[0].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);


  }

  const switchForBack = (dom) =>{

    //console.log(dom.childNodes[1].childNodes[1])

    let imgLeftDiv = dom.childNodes[0]
    let textmidDiv = dom.childNodes[1].childNodes[1].childNodes[0]
    let imgRightDiv = dom.childNodes[2]

    imgLeftDiv.childNodes[0].style.opacity = '0.0';
    setTimeout(() => {
      try {
        imgLeftDiv.childNodes[0].style.display = 'none';
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

    imgRightDiv.childNodes[0].style.opacity = '0.0';
    setTimeout(() => {
      try {
        imgRightDiv.childNodes[0].style.display = 'none';
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

  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>
      <Container>
        <Row>
          <Col>
            <ReactMarkdown className='OrangeText MainText text-center my-5'>
              {zone.main_text}
            </ReactMarkdown>
          </Col>
        </Row>
        <Row className='d-flex justify-content-around'>
          {/* image_lieft */}
          <Col xs={3}>
            <div style={{display:'black', opacity:1, transition:'0.3s'}}>
              {subcomponent_image(zone.image_left_front)}
            </div>
            <div style={{display:'none', opacity:0, transition:'0.3s'}}>
              {subcomponent_image(zone.image_left_back)}
            </div>
          </Col>
          {/* text in the middle */}
          <Col xs={5} className='justify-content-between d-flex flex-column'>

              <Row className='d-flex justify-content-center'>

              </Row>

              <Row className='d-flex justify-content-center' >
                <Col xs={{span:9}} className='text-center GrayText SubText'>
                  <p style={{display:'black', opacity:1, transition:'0.3s'}}>
                    {zone.sub_text_mid_front}
                  </p>
                  <p style={{display:'none', opacity:0, transition:'0.3s'}}>
                    {zone.text_mid_back}
                  </p>
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
          <Col xs={3}>
            <div style={{display:'black', opacity:1, transition:'0.3s'}}>
              {subcomponent_image(zone.image_right_front)}
            </div>
            <div style={{display:'none', opacity:0, transition:'0.3s'}}>
              {subcomponent_image(zone.image_right_back)}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

const InteractiveFrame4 = (zone, index, jsonObject) => {

  const frameWithTwoImage = (zone) =>{
    return(
      <Row className='d-flex justify-content-around'>
      <Col xs={3}>
        <Row className='d-flex align-items-stretch justify-content-between' >
          <Col xs={6} className='align-self-end'>
            <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_left[0].url}`}
                alt={IsEmptyOrWhiteSpace(zone.image_left[0].alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_left[0].alternativeText}
                id='InteractiveFrame4ImageS'
            />
          </Col>
          <Col xs={6}>
            <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_left[1].url}`}
                alt={IsEmptyOrWhiteSpace(zone.image_left[1].alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_left[1].alternativeText}
                id='InteractiveFrame4ImageM'
              />
          </Col>
        </Row>
        <Row className='text-center CaptionText GrayText mt-4 LightBlueBackground '>
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
        <Row className='d-flex align-items-stretch justify-content-between' >
          <Col xs={6} className='align-self-end'>
            <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_right[0].url}`}
                alt={IsEmptyOrWhiteSpace(zone.image_right[0].alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_right[0].alternativeText}
                id='InteractiveFrame4ImageS'
              />
          </Col>
          <Col xs={6}>
            <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_right[1].url}`}
                alt={IsEmptyOrWhiteSpace(zone.image_right[1].alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_right[1].alternativeText}
                id='InteractiveFrame4ImageM'
              />
          </Col>
        </Row>
        <Row className='text-center CaptionText GrayText mt-4 LightBlueBackground'>
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
                id='InteractiveFrame4ImageL'
            />
          </Col>
        </Row>
        <Row className='text-center CaptionText GrayText mt-4 LightBlueBackground'>
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
                id='InteractiveFrame4ImageL'
              />
          </Col>
        </Row>
        <Row className='text-center CaptionText GrayText mt-4 LightBlueBackground'>
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
        break;
      default:
        console.log();
    }


  }

  return (
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>
          {mainText(zone.main_text)}
      <Container className='my-5'>
        <Row className='d-flex justify-content-between'>
          <Col xs={6} sm={3} className='d-flex justify-content-center'>
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
          <Col xs={6} sm={3} className='d-flex justify-content-center'>
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
          <Col xs={6} sm={3} className='d-flex justify-content-center'>
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
          <Col xs={6} sm={3} className='d-flex justify-content-center'>
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
        <Row className='mt-5 d-flex justify-content-around' style={{height: '200px'}} >
            <div style={{display:'block', opacity:'1.0', transition:'0.3s'}}>
              {frameWithTwoImage(zone.image_component[0])}
            </div>
            <div style={{display:'none', opacity:'0.0', transition:'0.3s'}}>
              {frameWithOneImage(zone.image_component[1])}
            </div>
            <div style={{display:'none', opacity:'0.0', transition:'0.3s'}}>
              {frameWithOneImage(zone.image_component[2])}
            </div>
            <div style={{display:'none', opacity:'0.0', transition:'0.3s'}}>
              {frameWithOneImage(zone.image_component[3])}
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
    <div key={`story_comp_${index}`} className='section'  style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>
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
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>
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

function SwitchFront(Switchitem){
  Switchitem.childNodes[0].style.opacity = '0.0';
  setTimeout(() => {
    try {
      Switchitem.childNodes[0].style.display = 'none';
      Switchitem.childNodes[1].style.display = 'block';
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => {
      try {
        Switchitem.childNodes[1].style.opacity = '1.0';
      } catch (error) {
        console.error(error);
      }
    });
  }, 400);
}
function SwitchBack(Switchitem){
  Switchitem.childNodes[1].style.opacity = '0.0';
  setTimeout(() => {
    try {
      Switchitem.childNodes[1].style.display = 'none';
      Switchitem.childNodes[0].style.display = 'block';
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => {
      try {
        Switchitem.childNodes[0].style.opacity = '1.0';
      } catch (error) {
        console.error(error);
      }
    });
  }, 400);
}
const InteractiveFrame5 = (zone, index, jsonObject) =>{
  let switchDir = true
  const switchWord = (dom) =>{
    let main_text = dom.childNodes[0]
    let sub_text = dom.childNodes[1].childNodes[1]
    if (switchDir){
      SwitchFront(main_text)
      SwitchFront(sub_text)
      switchDir = false
    }
    else{
      SwitchBack(main_text)
      SwitchBack(sub_text)
      switchDir = true
    }
  }
  return(
    <div key={`story_comp_${index}`} className='section'style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>
      <Container>
        <Row className='mb-5'>
          <p className='OrangeText MainText text-center' style={{display:'black', opacity:1, transition:'0.3s'}}>
            {zone.main_text_front}
          </p>
          <p className='OrangeText MainText text-center' style={{display:'none', opacity:0, transition:'0.3s'}}>
            {zone.main_text_back}
          </p>
        </Row>

        <Row className='d-flex justify-content-between'>
          <Col xs={6} className="d-flex justify-content-center">
            <Col xs={6} className="d-flex justify-content-end">
              {FlipCoinImg(zone.image_left_front,zone.image_left_back)}
            </Col>
            <Col xs={6} className="d-flex justify-content-start">
              <i 
                className='demo-icon icon-coin-scale InteractiveFrame5ScaleIcon'
                onClick={(e)=> {
                  let dom = e.target.parentElement.parentElement.parentElement.parentElement;
                  let image_left = dom.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0]

                  FlipCoin(image_left)
                  switchWord(dom)
                }}>
                &#xe833;</i>
            </Col>
          </Col>
          <Col xs={6} className='LightBlueBackground d-flex justify-content-center align-items-center'style={{padding: '20px', paddingTop: '20px', marginTop:'125px'}}>
            <p className='BlueText text-center SubText' style={{display:'black', opacity:1, transition:'0.3s'}}>
              {zone.sub_text_right_front}
            </p>
            <p className='BlueText text-center SubText' style={{display:'none', opacity:0, transition:'0.3s'}}>
              {zone.sub_text_right_back}
            </p>
          </Col>
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
    case 'frame.frame10':
      jsx = Frame10(zone, index, jsonObject);
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
    case 'frame.interactive-frame5':
      jsx = InteractiveFrame5(zone, index, jsonObject);
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
