import { Container, Row } from "react-bootstrap"
import backGround from 'src/assets/background.jpg';

import createMarkup from 'src/utils/Markup.js';

const Frame2 = (zone, index, json_object) => {
  zone.image2.light_blue_caption_background = zone.image2.light_blue_background ? false : zone.image2.light_blue_caption_background;
  
  let imageSizes = {
    "XXS": "50px",
    "XS": "230px",
    "S": "290px",
    "M": "350px",
    "L": "450px",
    "XL": "750px",
    "XXL": "1200px"
    };

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
                style={{width:imageSizes[zone.image2.size]}}
              /> 
          </Container>
          <Container 
            className={`d-flex justify-content-center align-items-center ${zone.image2.light_blue_caption_background ? "light-blue-background" : ""}`} 
            style={{width:"290px"}}>
              <div 
                dangerouslySetInnerHTML={createMarkup(zone.image2.caption)} 
                className='story-caption text-center px-3'
                // style={{padding: '0px', paddingTop: '20px'}}
              />
          </Container>
        </div>

        <Container>
          <Row className='d-flex justify-content-center mt-5'>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='story-h2 text-center'/>
              <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='story-h3 text-center'/>
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
          <div dangerouslySetInnerHTML={createMarkup(zone.head.head_main)} className='story-h2 text-center'/>
          <div dangerouslySetInnerHTML={createMarkup(zone.head.head_caption)} className='story-text text-center'/>
        </Row>
      </Container>

      <div className={`${zone.image2.light_blue_background ? "light-blue-background" : ""}`}>
        <Container className='d-flex justify-content-center align-items-center'>
            <img
              src={`${process.env.REACT_APP_strapiURL}${zone.image2.image.data.attributes.url}`}            
              alt={zone.image2.image.alternativeText === undefined ? 'img' : zone.image2.image.data.attributes.alternativeText}
              // style={{width:"290px"}}
            />
        </Container>
        <Container 
          className={`d-flex justify-content-center align-items-center ${zone.image2.light_blue_caption_background ? "light-blue-background" : ""}`} 
        >
            <div 
              dangerouslySetInnerHTML={createMarkup(zone.image2.caption)} 
              className='story-caption text-center px-5 pt-3'
              // style={{padding: '0px', paddingTop: '20px'}}
            />
        </Container>
      </div>
    </div>
    )

  }
}
export default Frame2
