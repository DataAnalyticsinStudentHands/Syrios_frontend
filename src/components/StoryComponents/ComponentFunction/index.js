/* eslint-disable eqeqeq */
import { Container, Row, Col } from "react-bootstrap"
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

function createMarkup(textTran){
  return {__html: textTran};
}

export const MainText = (main_text) =>{
  let main_text_jsx = undefined
  if(!IsEmptyOrWhiteSpace(main_text)){
    main_text_jsx=(
      <Row className='d-flex justify-content-center align-self-center'>
        <ReactMarkdown className='orange-text main_text_jsx text-center'>
          {main_text}
        </ReactMarkdown>
      </Row>
    )
  }
  return(
    main_text_jsx
  )
};

export const BigSubText = (sub_text) =>{
  let big_sub_text_jsx = undefined
  if(!IsEmptyOrWhiteSpace(sub_text)){
    big_sub_text_jsx=(
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='blue-text big-sub-text text-center'>
          {sub_text}
        </ReactMarkdown>
      </Container>
    )
  }
  return(
    big_sub_text_jsx
  )
}

export const SubText = (sub_text) =>{
  let sub_text_jsx = undefined
  if(!IsEmptyOrWhiteSpace(sub_text)){
    sub_text_jsx=(
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='blue-text sub-text text-center'>
          {sub_text}
        </ReactMarkdown>
      </Container>
    )
  }
  return(
    sub_text_jsx
  )
}

export const CapText = (cap_text) =>{
  let CubText = undefined
  if(!IsEmptyOrWhiteSpace(cap_text)){
    CubText=(
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='gray-text caption-text text-center'>
          {cap_text}
        </ReactMarkdown>
      </Container>
    )
  }
  return(
    CubText
  )
}

export const SubCapBlueBg = (text)=>{
  if(text.light_blue_background){
    return (
      <Container className='light-blue-background' style={{padding: '20px', paddingTop: '20px'}}>
        <Row dangerouslySetInnerHTML={createMarkup(text.text)} className='quote-text text-center'/>
        <Row dangerouslySetInnerHTML={createMarkup(text.caption)} className='quote-credit text-center'/>
      </Container>
    )
  }
  else if(text.light_yellow_background){
    return (
      <Container className='light-yellow-background' style={{padding: '20px', paddingTop: '20px'}}>
        <Row dangerouslySetInnerHTML={createMarkup(text.text)} className='quote-text text-center '/>
        <Row dangerouslySetInnerHTML={createMarkup(text.caption)} className='quote-credit text-center '/>
      </Container>
    )
  }    
  else{
    return(
      <Container style={{padding: '20px', paddingTop: '20px'}}>
        <div dangerouslySetInnerHTML={createMarkup(text.text)} className='quote-text text-center '/>
        <div dangerouslySetInnerHTML={createMarkup(text.caption)} className='quote-credit text-center'/>
      </Container>
    )
  }
}

export function IsEmptyOrWhiteSpace(str) {
  return str=== null ? true : (str.match(/^\s*$/) || []).length > 0;
}

export const SubcomponentImageOnly = (image) => {
  let image_sizes = {
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
      width={image_sizes[image.image.size]} 
    />
  );
}

export const SubcomponentImage = (image) => {
  image.light_blue_caption_background = image.light_blue_background ? false : image.light_blue_caption_background;
  let image_sizes = {
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
      className={`d-flex justify-content-center align-items-center ${image.light_blue_background ? "light-blue-background" : ""}`}
      style={{padding: '20px', paddingBottom: '0px'}}>
      <Row className='d-flex justify-content-center align-items-center'>
        <img
          src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}            
          alt={image.image.data.alternativeText === undefined ? 'img' : image.image.data.attributes.alternativeText}
          width={image_sizes[image.size]}
        />
        <div 
          className={`d-flex justify-content-center align-items-center ${image.light_blue_caption_background ? "light-blue-background" : ""}`} 
        >
          <div 
            dangerouslySetInnerHTML={createMarkup(image.caption)} 
            className='story-caption text-center'
            style={{padding: '0px', paddingTop: '10px', 
              // fontSize:image_brief_detail_font_size
            }}
          />
        </div>
      </Row>
    </Container>
  );
}

export const SubcomponentImageWithDynamicSizing = (images) => {
  let image_sizes = {
    "XXS": "50px",
    "XS": "150px",
    "S": "250px",
    "M": "350px",
    "L": "500px",
    "XL": "750px",
    "XXL": "1200px"
  };

  let images_jsx = []
  images.forEach((image) => {
    const image_brief_detail_font_size=Math.atan((parseInt(image_sizes[image.size])-250)/50)*30+50;
    if (!IsEmptyOrWhiteSpace(image.link) && !IsEmptyOrWhiteSpace(image.brief_detail)) {
      images_jsx.push(
        <Col key={image.id} className='text-center'>
          <Link to={image.link} className='bland-style'>
            <img
              src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}
              alt='dynamic_image'
              width={image_sizes[image.size]}
            />
            <p className='orange-text' style={{fontSize: image_brief_detail_font_size}}>
              {image.brief_detail}
            </p>
          </Link>
        </Col>
      );
      return;
    }

    if (!IsEmptyOrWhiteSpace(image.link)) {
      images_jsx.push(
        <Col key={image.id} className='text-center'>
          <Link to={image.link} className='bland-style'>
            <img
              src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}
              alt='dynamic_image'
              width={image_sizes[image.size]}/>
          </Link>
        </Col>
      );
      return;
    }

    if (!IsEmptyOrWhiteSpace(image.brief_detail)) {
      images_jsx.push(
        <Col key={image.id} className='text-center'>
          <img
            src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}
            alt='dynamic_image'
            width={image_sizes[image.size]}
            className='justify-content-center'
          />
          <p className='black-text' style={{fontSize: image_brief_detail_font_size}}>
            {image.brief_detail}
          </p>
        </Col>
      );
      return;
    }
    else {
      images_jsx.push(
        <Col key={image.id} className='text-center'>
          <img
            src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}
            alt='dynamic_image'
            width={image_sizes[image.size]}
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
        <Row className='d-flex justify-content-center align-items-end mt-3 mb-5'>
          {images_jsx}
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
          {SubcomponentImage(img_fornt)}
        </div>
        <div className='flip-box-back'>
          {SubcomponentImage(img_back)}
        </div>
      </div>
    </div>
  )
  return(
    Coin
  )
}


export function SwitchFront(switch_item){
  switch_item.childNodes[0].style.opacity = '0.0';
  setTimeout(() => {
    try {
      switch_item.childNodes[0].style.display = 'none';
      switch_item.childNodes[1].style.display = 'block';
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => {
      try {
        switch_item.childNodes[1].style.opacity = '1.0';
      } catch (error) {
        console.error(error);
      }
    });
  }, 400);
}

export function SwitchBack(switch_item){
  switch_item.childNodes[1].style.opacity = '0.0';
  setTimeout(() => {
    try {
      switch_item.childNodes[1].style.display = 'none';
      switch_item.childNodes[0].style.display = 'block';
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => {
      try {
        switch_item.childNodes[0].style.opacity = '1.0';
      } catch (error) {
        console.error(error);
      }
    });
  }, 400);
}
