import IsEmptyOrWhiteSpace from "./IsEmptyOrWhiteSpace";
import { Container } from "react-bootstrap"
import ReactMarkdown from 'react-markdown';
import backGround from 'src/assets/background.jpg';

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

export default subcomponent_image