import { Container, Row, Col } from "react-bootstrap"
import backGround from 'src/assets/background.jpg';

import {subcomponent_image } from "../ComponentFunction/index";

function createMarkup(textTran){
  return {__html: textTran};
}
const Frame2 = (zone, index, jsonObject) => {
  // console.log(zone)

  zone.image2.light_blue_caption_background = zone.image2.light_blue_background ? false : zone.image2.light_blue_caption_background;
  
  let imageSizes = {
    "XXS": "50px",
    "XS": "150px",
    "S": "250px",
    "M": "350px",
    "L": "500px",
    "XL": "750px",
    "XXL": "1200px"
    };

  // const image_brief_detail_font_size = Math.atan((parseInt(imageSizes[zone.image2.size])-250)/50)*30+50;
  // console.log(image_brief_detail_font_size)
  

  if (zone.head.updown_switch){
    return(
      <div 
      key={`story_comp_${index}`} 
      className='section' 
      style={{ 
        backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`,
        backgroundBlendMode:'multiply'
      }}
    >      
    <Container>    
        <div className={`${zone.image2.light_blue_background ? "light-blue-background" : ""}`} style={{padding: '20px', paddingBottom: '0px'}}>
          <Container className='d-flex justify-content-center align-items-center'>
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image2.image.data.attributes.url}`}            
                alt={zone.image2.image.alternativeText === undefined ? 'img' : zone.image2.image.data.attributes.alternativeText}
                width={imageSizes[zone.image2.size]}
              />
          </Container>
          <Container 
            className={`d-flex justify-content-center align-items-center ${zone.image2.light_blue_caption_background ? "light-blue-background" : ""}`} 
            style={{width:imageSizes[zone.image2.size]}}>
              <div 
                dangerouslySetInnerHTML={createMarkup(zone.image2.caption)} 
                className='gray-text CaptionText text-center'
                style={{padding: '0px', paddingTop: '20px',
                // fontSize:image_brief_detail_font_size
              }}
              />
          </Container>
        </div>

        <Container>
          <Row className='d-flex justify-content-center mt-5'>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='orange-text MainText text-center'/>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='gray-text CaptionText text-center'/>
          </Row>
      </Container>

      </Container>
    </div>
    )
  }
  else{
    return(
      <div key={`story_comp_${index}`} className='section' style={{backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`, backgroundBlendMode:'multiply'}}>
      <Container>
        <Row className='d-flex justify-content-center mb-5'>
            <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='orange-text MainText text-center'/>
            <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='gray-text CaptionText text-center'/>
        </Row>
      </Container>
      <div className={`${zone.image2.light_blue_background ? "light-blue-background" : ""}`} style={{padding: '20px', paddingBottom: '0px'}}>
        <Container className='d-flex justify-content-center align-items-center'>
            <img
              src={`${process.env.REACT_APP_strapiURL}${zone.image2.image.data.attributes.url}`}            
              alt={zone.image2.image.alternativeText === undefined ? 'img' : zone.image2.image.data.attributes.alternativeText}
              width={imageSizes[zone.image2.size]}
            />
        </Container>
        <Container 
          className={`d-flex justify-content-center align-items-center ${zone.image2.light_blue_caption_background ? "light-blue-background" : ""}`} 
          style={{width:imageSizes[zone.image2.size]}}>
            <div 
              dangerouslySetInnerHTML={createMarkup(zone.image2.caption)} 
              className='gray-text CaptionText text-center'
              style={{padding: '0px', paddingTop: '20px',
              // fontSize:image_brief_detail_font_size
            }}
            />
        </Container>
      </div>
    </div>
    )

  }
}
export default Frame2