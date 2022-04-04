// import IsEmptyOrWhiteSpace from "./IsEmptyOrWhiteSpace"
import { Container, Row, Col } from "react-bootstrap"
import { Link } from 'react-router-dom';
import backGround from 'src/assets/background.jpg';
import ReactMarkdown from 'react-markdown';


export const mainText = (main_text) =>{
    let MainText = undefined
    if(!IsEmptyOrWhiteSpace(main_text)){
      MainText=(
        <Container className='d-flex justify-content-center align-self-center'>
            <ReactMarkdown className='OrangeText MainText text-center'>
              {main_text}
            </ReactMarkdown>
          {/* <div className='OrangeText MainText text-center' dangerouslySetInnerHTML={createMarkup(main_text)} /> */}
        </Container>
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
        <div className='BlueText BigSubText text-center' dangerouslySetInnerHTML={createMarkup(sub_text)} />
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
        <div dangerouslySetInnerHTML={createMarkup(sub_text)} className='BlueText SubText text-center'/>
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
        <div dangerouslySetInnerHTML={createMarkup(cap_text)} className='GrayText CaptionText text-center'/>
    </Container>
    )
}
return(
    CubText
  )
}

export const sub_cap_blue_bg = (sub_text, cap_text)=>{
    let Sub_Cap_Blue_Bg = undefined
    if(!IsEmptyOrWhiteSpace(cap_text)){
      Sub_Cap_Blue_Bg = (
        <Container className='LightBlueBackground' style={{padding: '20px', paddingTop: '20px'}}>
          <div dangerouslySetInnerHTML={createMarkup(sub_text)} className='BlueText text-center SubText'/>
          <div dangerouslySetInnerHTML={createMarkup(cap_text)} className='GrayText text-center CaptionText'/>
        </Container>
      )
    }
    else{
      Sub_Cap_Blue_Bg = (
        <Container>
          <div dangerouslySetInnerHTML={createMarkup(sub_text)} className='GrayText text-center BigSubText'/>
        </Container>
      )
    }
    return(
      Sub_Cap_Blue_Bg
    )
  }

export function IsEmptyOrWhiteSpace(str) {
    return (str==null) ? true : (str.match(/^\s*$/) || []).length > 0;
  }

export const subcomponent_image_only = (image) => {
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

export const subcomponent_image = (image) => {
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

    let caption = undefined; 
    if (!IsEmptyOrWhiteSpace(image.caption)) {
    caption = (
        <>
        <Container className={`d-flex justify-content-center align-items-center ${image.light_blue_caption_background ? "LightBlueBackground" : ""}`} style={{width:imageSizes[image.size]}}>
            <div 
              className='GrayText CaptionText text-center' 
              style={{padding: '0px', paddingTop: '20px'}}
              dangerouslySetInnerHTML={createMarkup(image.caption)} 
            />
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

export const subcomponent_image_with_dynamic_sizing = (images) => {
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

  export function createMarkup(textTran){
    return {__html: textTran};
}
