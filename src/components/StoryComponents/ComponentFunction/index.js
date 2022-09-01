/* eslint-disable eqeqeq */
import { Container, Row, Col } from "react-bootstrap"
// import { Link } from 'react-router-dom';

function createMarkup(textTran){
  return {__html: textTran};
}

export function IsEmptyOrWhiteSpace(str) {
  return str=== null ? true : (str.match(/^\s*$/) || []).length > 0;
}

export const HeadComponent = (props)=>{
  return(
    <Col>
      <div onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(props.storyMain)} className='story-h2 text-center'/>
      <div onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(props.storyCaption)} className='story-text text-center'/>
    </Col>
  )
}

export const TextComponent = (props)=>{
  let component_background = {
    "null":'',
    "light-blue-background":"light-blue-background",
    "light-yellow-background":"light-yellow-background",
  };
  let text = props.text
    if(text.text==""||text.text==null){
      return(
        <Container className={`${component_background[text.background_color]}`} style={{padding: '20px', paddingTop: '20px'}}>
          <Row onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.caption)} className='story-text text-center'/>
        </Container>
      )
    }
    else if (text.caption == "" || text.caption == null){
      return(
        <Container className={`${component_background[text.background_color]}`} style={{padding: '20px', paddingTop: '20px'}}>
          <Row onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.text)} className='story-h3-blue text-center'/>
        </Container>
      )
    }
    else{
      return (
        <Container className={`${component_background[text.background_color]}`} style={{padding: '20px', paddingTop: '20px'}}>
          <Row onClick={props.toggleBottom}  dangerouslySetInnerHTML={createMarkup(text.text)} className='quote-text text-center'/>
          <Row onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.caption)} className='quote-credit text-center'/>
        </Container>
      )
    }
}


export const ImageComponent =(props)=>{
  // console.log(props.imageWidth)
  let image = props.image
  let image_size = {
    "Smallest":"12.5%",
    "Smaller":"25%",
    "Small":"37.5%",
    "Regular":"50%",
    "Big":"62.5%",
    "Bigger":"75%",
    "Biggest":"87.5%",
    "Full":"100%"
  }
  let component_background = {"null":'',"light-blue-background":"light-blue-background","light-yellow-background":"light-yellow-background",};
  // Coin Data
  if((image.image.data === null)){
    return(
      <Col className={`${image.caption_or_both? component_background[image.background_color]:""}`}>
        <Row className={`justify-content-center align-items-center`}>
          <a href={`${image.coin.data.attributes.source_image}`} target="_blank" rel="noopener noreferrer" className="text-center">
            <img
              src={ `${process.env.REACT_APP_strapiURL}${image.reverse_or_obverse ? image.coin.data.attributes.obverse_file.data.attributes.url : image.coin.data.attributes.reverse_file.data.attributes.url}`}            
              alt={image.coin.data.attributes.obverse_file.data.alternativeText === undefined ? 'img' : image.coin.data.attributes.obverse_file.data.alternativeText}
              className="mb-1" style={{width: image_size[props.image.size]}}
            />
          </a>
        </Row>
        <Row className='justify-content-center align-items-center' >
          <div 
            onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(image.caption)} 
            className={`story-caption text-center  mt-3 ${image.caption_or_both? "":component_background[image.background_color]}`}
            style={{width:image_size[props.image.size]}}
            />
        </Row>
      </Col>
    )
  }
// Image Data
  else{ 
      return(
        <Col className={`${image.caption_or_both? component_background[image.background_color]:""}`}>
        <Row className='d-flex justify-content-center align-items-center'>
          {image.additional_link === null ? (
            <img src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`} alt={image.image.data.attributes.alternativeText === undefined ? 'img' : image.image.data.attributes.alternativeText}
              className="mb-1" style={{width: image_size[props.image.size]}}/>
          ):(
            <a href={`${image.additional_link}`} target="_blank" rel="noopener noreferrer" className="text-center">
              <img src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}            
                alt={image.image.data.attributes.alternativeText === undefined ? 'img' : image.image.data.attributes.alternativeText}
                className="mb-1" style={{width: image_size[props.image.size]}}/></a>
          )}
        </Row>
        <Row className={`d-flex justify-content-center align-items-center`} >
          <div 
            onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(image.caption)} 
            className={`story-caption text-center  mt-3 ${image.caption_or_both? "":component_background[image.background_color]}`}
            style={{width: image_size[props.image.size]}}
            />
        </Row>
      </Col>
      )
    }
}


export const ImagesComponent = (props)=>{
  let imageJsx = []
  if(props.images.length === 6 || props.images.length === 5){
    props.images.forEach((image)=>{
      imageJsx.push(<Col key={image.id} xs={4}><ImageComponent toggleBottom={props.toggleBottom} image={image} /></Col>);
      return;
    })
  }
  else if (props.images.length === 3){
    props.images.forEach((image)=>{
      imageJsx.push(<Col key={image.id} xs={3}><ImageComponent toggleBottom={props.toggleBottom} image={image}/></Col>);
      return;
    })
  }
  else if (props.images.length === 1){
    props.images.forEach((image)=>{
      imageJsx.push(<Col key={image.id} xs={8}><ImageComponent toggleBottom={props.toggleBottom} image={image}/></Col>);
      return;
    })
  }
  else{
    props.images.forEach((image)=>{
      imageJsx.push(<Col key={image.id}><ImageComponent toggleBottom={props.toggleBottom} image={image} /></Col>);
      return;
    })
  }

  return (<Row className='d-flex justify-content-around align-items-end'>{imageJsx}</Row>);
}
