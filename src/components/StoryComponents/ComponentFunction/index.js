/* eslint-disable eqeqeq */
import { Container, Row, Col } from "react-bootstrap"
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import backGround from 'src/assets/background.jpg';

function createMarkup(textTran){
  return {__html: textTran};
}
export const mainText = (main_text) =>{
    let MainText = undefined
    if(!IsEmptyOrWhiteSpace(main_text)){
      MainText=(
        <Row className='d-flex justify-content-center align-self-center'>
          <ReactMarkdown className='OrangeText MainText text-center'>
            {main_text}
          </ReactMarkdown>
        </Row>
      )
    }
    return(
      MainText
    )
  };

export const bigSubText = (sub_text) =>{
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

export const subText = (sub_text) =>{
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

export const capText = (cap_text) =>{
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

export const sub_cap_blue_bg = (text)=>{
  if(text.light_blue_background){
      return (
        <Container className='LightBlueBackground' style={{padding: '20px', paddingTop: '20px'}}>
          <Row dangerouslySetInnerHTML={createMarkup(text.text)} className='BlueText text-center SubText'/>
          <Row dangerouslySetInnerHTML={createMarkup(text.caption)} className='GrayText text-center CaptionText'/>
        </Container>
      )
    }
  else if(text.light_yellow_background){
    return (
      <Container className='LightYellowBackground' style={{padding: '20px', paddingTop: '20px'}}>
        <Row dangerouslySetInnerHTML={createMarkup(text.text)} className='BlueText text-center SubText'/>
        <Row dangerouslySetInnerHTML={createMarkup(text.caption)} className='GrayText text-center CaptionText'/>
      </Container>
    )
  }    
  else{
    return(
      <Container style={{padding: '20px', paddingTop: '20px'}}>
        <div dangerouslySetInnerHTML={createMarkup(text.text)} className='BlueText text-center SubText'/>
        <div dangerouslySetInnerHTML={createMarkup(text.caption)} className='GrayText text-center CaptionText'/>
      </Container>
    )
  }
}

export function IsEmptyOrWhiteSpace(str) {
    return str=== null ? true : (str.match(/^\s*$/) || []).length > 0;
  }

export const subcomponent_image_only = (image) => {
  console.log(image.data.attributes)
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
        src={`${process.env.REACT_APP_strapiURL}${image.data.attributes.url}`}            
        alt={image.data.attributes.alternativeText === undefined ? 'img' : image.data.attributes.alternativeText}
        width={imageSizes[image.image.size]} 
    />
);
}

export const subcomponent_image = (image) => {
    image.light_blue_caption_background = image.light_blue_background ? false : image.light_blue_caption_background;
    let imageSizes = {
    "XXS": "50px",
    "XS": "150px",
    "S": "250px",
    "M": "350px",
    "L": "500px",
    "XL": "750px",
    "XXL": "1200px"
    };
    return (
    <Container 
      className={`d-flex justify-content-center align-items-center ${image.light_blue_background ? "LightBlueBackground" : ""}`}
      style={{padding: '20px', paddingBottom: '0px'}}>
          <Row className='d-flex justify-content-center align-items-center'>
              <img
                src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}            
                alt={image.image.data.alternativeText === undefined ? 'img' : image.image.data.attributes.alternativeText}
                width={imageSizes[image.size]}
              />
              <div 
                className={`d-flex justify-content-center align-items-center ${image.light_blue_caption_background ? "LightBlueBackground" : ""}`} 
              >
                <div 
                  dangerouslySetInnerHTML={createMarkup(image.caption)} 
                  className='GrayText CaptionText text-center'
                  style={{padding: '0px', paddingTop: '10px', 
                  // fontSize:image_brief_detail_font_size
                }}
                />
            </div>
          </Row>
    </Container>
    );
}

export const subcomponent_image_with_dynamic_sizing = (images) => {
  console.log(images)
    let imageSizes = {
      "XXS": "50px",
      "XS": "150px",
      "S": "250px",
      "M": "350px",
      "L": "500px",
      "XL": "750px",
      "XXL": "1200px"
    };
  
    let imagesJSX = []
    images.forEach((image) => {
      const image_brief_detail_font_size=Math.atan((parseInt(imageSizes[image.size])-250)/50)*30+50;
      if (!IsEmptyOrWhiteSpace(image.link) && !IsEmptyOrWhiteSpace(image.brief_detail)) {
        imagesJSX.push(
          <Col key={image.id} className='text-center'>
            <Link to={image.link} className='blandStyle'>
              <img
                src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}
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
                src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}
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
                src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}
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
              src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}
              alt='dynamic_image'
              width={imageSizes[image.size]}
              className='justify-content-center'
            />
          </Col>
        );
        return;
      }
    });
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

export const FlipCoin = (dom) =>{
    while (dom.className !== 'flip-box-inner') {
      dom = dom.nextSibling;
    }
  
    if (dom.style.transform === 'rotateY(180deg)') {
      dom.style.transform = 'rotateY(0deg)'
    } else {
      dom.style.transform = 'rotateY(180deg)';
    }
  }

export const FlipCoinImg = (img_fornt, img_back) =>{
  // console.log(img_fornt)  
  let Coin = undefined
    Coin = (
      <div className='flip-box'>
        <div className='flip-box-inner'>
          <div className='flip-box-front'>
            {subcomponent_image(img_fornt)}
          </div>
          <div className='flip-box-back'>
            {subcomponent_image(img_back)}
          </div>
        </div>
      </div>
    )
    return(
      Coin
    )
  }


export function SwitchFront(Switchitem){
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

export function SwitchBack(Switchitem){
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
