import IsEmptyOrWhiteSpace from "./IsEmptyOrWhiteSpace"
import { Container, Row, Col } from "react-bootstrap"
import { Link } from 'react-router-dom';


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
  export default subcomponent_image_with_dynamic_sizing