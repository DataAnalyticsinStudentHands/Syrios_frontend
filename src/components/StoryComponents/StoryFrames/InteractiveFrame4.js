/* eslint-disable eqeqeq */
import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap";
// import ReactMarkdown from 'react-markdown';
import {IsEmptyOrWhiteSpace, MainText} from "../ComponentFunction/index";
function createMarkup(textTran){
  return {__html: textTran};
}
const InteractiveFrame4 = (zone, index) => {
  const FrameWithTwoImage = (zone) =>{
    return(
      <Row className='d-flex justify-content-around'>
        <Col xs={3}>
          <Row className='d-flex align-items-stretch justify-content-between' >
            <Col xs={6} className='align-self-end'>
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.images_left.data[0].attributes.url}`}
                alt={IsEmptyOrWhiteSpace(zone.images_left.data[0].attributes.alternativeText) ? 'Interactive_frame_right_back_image' : zone.images_left.data[0].attributes.alternativeText}
                id='interactive-frame4-image-S'
              />
            </Col>
            <Col xs={6}>
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.images_left.data[1].attributes.url}`}
                alt={IsEmptyOrWhiteSpace(zone.images_left.data[1].attributes.alternativeText) ? 'Interactive_frame_right_back_image' : zone.images_left.data[1].attributes.alternativeText}
                id='interactive-frame4-image-M'
              />
            </Col>
          </Row>
          <Row className='text-center caption-text gray-text mt-4 light-blue-background '>
            <div dangerouslySetInnerHTML={createMarkup(zone.left)} className='mt-3'/>
          </Row>
        </Col>

        <Col xs={3} className='d-flex justify-content-center align-items-end'>
          <div dangerouslySetInnerHTML={createMarkup(zone.mid)} className='sub-text text-center gray-text'/>
        </Col>

        <Col xs={3}>
          <Row className='d-flex align-items-stretch justify-content-between' >
            <Col xs={6} className='align-self-end'>
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.images_right.data[0].attributes.url}`}
                alt={IsEmptyOrWhiteSpace(zone.images_right.data[0].attributes.alternativeText) ? 'Interactive_frame_right_back_image' : zone.images_right.data[0].attributes.alternativeText}
                id='interactive-frame4-image-S'
              />
            </Col>
            <Col xs={6}>
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.images_right.data[1].attributes.url}`}
                alt={IsEmptyOrWhiteSpace(zone.images_right.data[1].attributes.alternativeText) ? 'Interactive_frame_right_back_image' : zone.images_right.data[1].attributes.alternativeText}
                id='interactive-frame4-image-M'
              />
            </Col>
          </Row>
          <Row className='text-center caption-text gray-text mt-4 light-blue-background'>
            <div dangerouslySetInnerHTML={createMarkup(zone.right)} className='mt-3'/>
          </Row>
        </Col>
      </Row>
    )
  }
  const FrameWithOneImage = (zone)=>{
    return(
      <Row className='d-flex justify-content-between'>
        <Col xs={3}>
          <Row className='d-flex align-items-stretch justify-content-center' >
            <Col className='d-flex justify-content-center'>
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.images_left.data[0].attributes.url}`}
                alt={IsEmptyOrWhiteSpace(zone.images_left.data[0].attributes.alternativeText) ? 'Interactive_frame_right_back_image' : zone.images_left.data[0].attributes.alternativeText}
                id='interactive-frame4-image-L'
              />
            </Col>
          </Row>
          <Row className='text-center caption-text gray-text mt-4 light-blue-background'>
            <div dangerouslySetInnerHTML={createMarkup(zone.left)} className='mt-3'/>
          </Row>
        </Col>

        <Col xs={3} className='d-flex justify-content-center align-items-end'>
          <div dangerouslySetInnerHTML={createMarkup(zone.mid)} className='sub-text text-center gray-text'/>
        </Col>

        <Col xs={3}>
          <Row className='d-flex justify-content-center' >
            <Col className='d-flex justify-content-center'>
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.images_right.data[0].attributes.url}`}
                alt={IsEmptyOrWhiteSpace(zone.images_right.data[0].attributes.alternativeText) ? 'Interactive_frame_right_back_image' : zone.images_right.data[0].attributes.alternativeText}
                id='interactive-frame4-image-L'
              />
            </Col>
          </Row>
          <Row className='text-center caption-text gray-text mt-4 light-blue-background'>
            <div dangerouslySetInnerHTML={createMarkup(zone.right)} className='mt-3'/>
          </Row>
        </Col>
      </Row>
    )
  }
  const SwitchFrame = (dom,i) =>{

    let option0 = dom.childNodes[0]
    let option1 = dom.childNodes[1]
    let option2 = dom.childNodes[2]
    let option3 = dom.childNodes[3]

    switch(i){
      case 'option0':
        option1.style.opacity = '0.0';
        option2.style.opacity = '0.0';
        option3.style.opacity = '0.0';
        setTimeout(() => {
          try {
            option0.style.display = 'block';
            option1.style.display = 'none';
            option2.style.display = 'none';
            option3.style.display = 'none';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              option0.style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);
        break;
      case 'option1':
        option0.style.opacity = '0.0';
        option2.style.opacity = '0.0';
        option3.style.opacity = '0.0';
        setTimeout(() => {
          try {
            option0.style.display = 'none';
            option1.style.display = 'block';
            option2.style.display = 'none';
            option3.style.display = 'none';
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
        option0.style.opacity = '0.0';
        option1.style.opacity = '0.0';
        option3.style.opacity = '0.0';
        setTimeout(() => {
          try {
            option0.style.display = 'none';
            option1.style.display = 'none';
            option2.style.display = 'block';
            option3.style.display = 'none';
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
        option0.style.opacity = '0.0';
        option1.style.opacity = '0.0';
        option2.style.opacity = '0.0';
        setTimeout(() => {
          try {
            option0.style.display = 'none';
            option1.style.display = 'none';
            option2.style.display = 'none';
            option3.style.display = 'block';
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
      default:
        break;
    }
  }
  const OptionButton = (component) =>{
    let button_option = []
    component.forEach((e, index) => {
      button_option.push(
        <Col xs={6} sm={3} className='d-flex justify-content-center'>
          <button	
            className='story-frame14-button my-2' 
            onClick={(e)=>{
              let i = `option${index}`
              let dom = e.target.parentElement.parentElement.nextSibling
              SwitchFrame(dom,i)
            }}
          >
            {e.button_name}
          </button>
        </Col>
      )

    });
    return(
      button_option
    )
  }

  const ContentComponent = (component) =>{
    let component_content = []
    component.forEach((e,index)=>{
      if(index === 0 ){
        component_content.push(
          <div style={{display:'block', opacity:'1.0', transition:'0.3s'}}>
            {FrameWithTwoImage(zone.component[index])}
          </div>
        )
      }
      else{
        if (e.images_left.data.length ===2 && e.images_right.data.length ===2){
          component_content.push(
            <div style={{display:'none', opacity:'1.0', transition:'0.3s'}}>
              {FrameWithTwoImage(zone.component[index])}
            </div>
          )
        }
        else{
          component_content.push(
            <div style={{display:'none', opacity:'0.0', transition:'0.3s'}}>
              {FrameWithOneImage(zone.component[index])}
            </div>
          )
        }
      }
    })
    return(
      component_content
    )
  }

  return (
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>

      {MainText(zone.main_text)}
      <Container className=''>
        <Row className='d-flex justify-content-between'>
          {OptionButton(zone.component)}
        </Row>
        <Row className='mt-5 d-flex justify-content-around' style={{height: '200px'}} >
          {ContentComponent(zone.component)}
        </Row>
      </Container>
    </div>
  );
}

export default InteractiveFrame4;
