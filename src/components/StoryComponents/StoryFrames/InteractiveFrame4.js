/* eslint-disable eqeqeq */
import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap";
import ReactMarkdown from 'react-markdown';
import {IsEmptyOrWhiteSpace, mainText} from "../ComponentFunction/index";
function createMarkup(textTran){
  return {__html: textTran};
}
const InteractiveFrame4 = (zone, index, jsonObject) => {
  console.log(zone)
    const frameWithTwoImage = (zone) =>{
      return(
        <Row className='d-flex justify-content-around'>
        <Col xs={3}>
          <Row className='d-flex align-items-stretch justify-content-between' >
            <Col xs={6} className='align-self-end'>
              <img
                  src={`${process.env.REACT_APP_strapiURL}${zone.images_left.data[0].attributes.url}`}
                  alt={IsEmptyOrWhiteSpace(zone.images_left.data[0].attributes.alternativeText) ? 'Interactive_frame_right_back_image' : zone.images_left.data[0].attributes.alternativeText}
                  id='InteractiveFrame4ImageS'
              />
            </Col>
            <Col xs={6}>
              <img
                  src={`${process.env.REACT_APP_strapiURL}${zone.images_left.data[1].attributes.url}`}
                  alt={IsEmptyOrWhiteSpace(zone.images_left.data[1].attributes.alternativeText) ? 'Interactive_frame_right_back_image' : zone.images_left.data[1].attributes.alternativeText}
                  id='InteractiveFrame4ImageM'
                />
            </Col>
          </Row>
          <Row className='text-center CaptionText GrayText mt-4 LightBlueBackground '>
            <div dangerouslySetInnerHTML={createMarkup(zone.left)} className='mt-3'/>
          </Row>
        </Col>
  
        <Col xs={3} className='d-flex justify-content-center align-items-end'>
          <div dangerouslySetInnerHTML={createMarkup(zone.mid)} className='SubText text-center GrayText'/>
        </Col>
  
        <Col xs={3}>
          <Row className='d-flex align-items-stretch justify-content-between' >
            <Col xs={6} className='align-self-end'>
              <img
                  src={`${process.env.REACT_APP_strapiURL}${zone.images_right.data[0].attributes.url}`}
                  alt={IsEmptyOrWhiteSpace(zone.images_right.data[0].attributes.alternativeText) ? 'Interactive_frame_right_back_image' : zone.images_right.data[0].attributes.alternativeText}
                  id='InteractiveFrame4ImageS'
                />
            </Col>
            <Col xs={6}>
              <img
                  src={`${process.env.REACT_APP_strapiURL}${zone.images_right.data[1].attributes.url}`}
                  alt={IsEmptyOrWhiteSpace(zone.images_right.data[1].attributes.alternativeText) ? 'Interactive_frame_right_back_image' : zone.images_right.data[1].attributes.alternativeText}
                  id='InteractiveFrame4ImageM'
                />
            </Col>
          </Row>
          <Row className='text-center CaptionText GrayText mt-4 LightBlueBackground'>
            <div dangerouslySetInnerHTML={createMarkup(zone.right)} className='mt-3'/>
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
                  src={`${process.env.REACT_APP_strapiURL}${zone.images_left.data[0].attributes.url}`}
                  alt={IsEmptyOrWhiteSpace(zone.images_left.data[0].attributes.alternativeText) ? 'Interactive_frame_right_back_image' : zone.images_left.data[0].attributes.alternativeText}
                  id='InteractiveFrame4ImageL'
              />
            </Col>
          </Row>
          <Row className='text-center CaptionText GrayText mt-4 LightBlueBackground'>
            <div dangerouslySetInnerHTML={createMarkup(zone.left)} className='mt-3'/>
          </Row>
        </Col>
  
        <Col xs={3} className='d-flex justify-content-center align-items-end'>
          <div dangerouslySetInnerHTML={createMarkup(zone.mid)} className='SubText text-center GrayText'/>
        </Col>
  
        <Col xs={3}>
          <Row className='d-flex justify-content-center' >
            <Col className='d-flex justify-content-center'>
              <img
                  src={`${process.env.REACT_APP_strapiURL}${zone.images_right.data[0].attributes.url}`}
                  alt={IsEmptyOrWhiteSpace(zone.images_right.data[0].attributes.alternativeText) ? 'Interactive_frame_right_back_image' : zone.images_right.data[0].attributes.alternativeText}
                  id='InteractiveFrame4ImageL'
                />
            </Col>
          </Row>
          <Row className='text-center CaptionText GrayText mt-4 LightBlueBackground'>
            <div dangerouslySetInnerHTML={createMarkup(zone.right)} className='mt-3'/>
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
          break;
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
                
                {zone.component[0].button_name}
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
                {zone.component[1].button_name}
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
                {zone.component[2].button_name}
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
                {zone.component[3].button_name}
              </button>
            </Col>
          </Row>
          <Row className='mt-5 d-flex justify-content-around' style={{height: '200px'}} >
              <div style={{display:'block', opacity:'1.0', transition:'0.3s'}}>
                {frameWithTwoImage(zone.component[0])}
              </div>
              <div style={{display:'none', opacity:'0.0', transition:'0.3s'}}>
                {frameWithOneImage(zone.component[1])}
              </div>
              <div style={{display:'none', opacity:'0.0', transition:'0.3s'}}>
                {frameWithOneImage(zone.component[2])}
              </div>
              <div style={{display:'none', opacity:'0.0', transition:'0.3s'}}>
                {frameWithOneImage(zone.component[3])}
              </div>
          </Row>
        </Container>
      </div>
    );
  }

  export default InteractiveFrame4
