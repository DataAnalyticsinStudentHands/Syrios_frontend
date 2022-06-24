/* eslint-disable eqeqeq */
import backGround from 'src/assets/background.jpg';
import { Container, Row, Col} from "react-bootstrap"

import { HeadComponent,  } from "../ComponentFunction/index";
import createMarkup from 'src/utils/Markup.js';

const ScaleCoinImg = (props)=>{
  let coin_obverse_url = props.coin.coin.data.attributes.obverse_file.data.attributes.url
  let coin_obverse_alt = props.coin.coin.data.attributes.obverse_file.data.attributes.alternativeText

  let coin_reverse_url = props.coin.coin.data.attributes.reverse_file.data.attributes.url
  let coin_reverse_alt = props.coin.coin.data.attributes.reverse_file.data.attributes.alternativeText

  return(
    <>
        <img
          src={`${process.env.REACT_APP_strapiURL}${coin_obverse_url}`}
          alt={coin_obverse_alt}
          className='sclae_front'
        />
        <img
          src={`${process.env.REACT_APP_strapiURL}${coin_reverse_url}`}
          alt={coin_reverse_alt}
          className='scale_back'
        />
    </>
  )
}

function ScaleInOut (props){
  let scaleIn = props.childNodes[0]
  let scaleOut = props.childNodes[1]

  if(getComputedStyle(scaleIn).display === 'block'){
    scaleIn.style.opacity = '0.0'
    setTimeout(() => {
      try {
        scaleIn.style.display = 'none';
        scaleOut.style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          scaleOut.style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);
  }
  else{
    scaleOut.style.opacity = '0.0'
    setTimeout(() => {
      try {
        scaleOut.style.display = 'none';
        scaleIn.style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          scaleIn.style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);
  }
}

const ScaleFrame = (props) =>{
  let zone = props.zone
  if (zone.head.updown_switch){
    return(
      <div 
        className='section' 
        style={{ 
          backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`,
          backgroundBlendMode:'multiply'
        }}
      >
      <Container>
        <Row className='d-flex justify-content-around align-items-center'>
        </Row>
        <Row className='d-flex justify-content-center mt-5'>
          <HeadComponent storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/>
        </Row>
      </Container>
    </div>
    )
  }
  else{
    return(
      <div 
        className='section' 
        style={{ 
          backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`,
          backgroundBlendMode:'multiply'
        }}
      >
      <Container>
        <Row className='d-flex justify-content-center mb-5 '>
          <HeadComponent storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/>
        </Row>
        <Row 
            className='d-flex row-light-blue-background'
        />
        <Row 
            className='d-flex justify-content-around align-items-center row-scare-content'
        >
          <Col xs={3} className='d-flex justify-content-center'>
            <ScaleCoinImg coin = {zone.scale_coin_left}/>
          </Col>
          <Col 
            className='d-flex align-items-center'
            style={{height:'183px', zIndex:-3}}
          >
            <div 
                dangerouslySetInnerHTML={createMarkup(zone.text_front)} 
                className='text-center sclae_front_text story-text'
              />
              <div 
                dangerouslySetInnerHTML={createMarkup(zone.text_back)} 
                className='text-center scale_back_text story-text'
              />          
            </Col>
          <Col xs={3} className='d-flex justify-content-center'>
            <ScaleCoinImg coin = {zone.scale_coin_right}/>
          </Col>
        </Row>

        
        <Row>
          <Col className='d-flex align-items-center justify-content-center '>
            <i 
              className='demo-icon icon-coin-scale interactive-frame1-scale-icon'
              onClick={(e)=> {
                let dom = e.target.parentElement.parentElement.parentElement.childNodes[2].childNodes
                  ScaleInOut(dom[0])
                  ScaleInOut(dom[1])
                  ScaleInOut(dom[2])
              }}
            >
              &#xe834;</i>
          </Col>
        </Row>
        <Row>
          <Col 
            className='d-flex align-items-center justify-content-center'
            onClick={(e) => {
              console.log(e.target.parentElement.parentElement.nextSibling)
              // FadeThenSwitchCompAndReset(e.target)
              }
            }>
            <p className='icon-caption interactive-frame1-compare-scale'>
              Compare Scale
            </p>
            <p className='icon-caption interactive-frame1-reset-scale'>
              Reset Scale
            </p>
          </Col>
        </Row>

      </Container>
    </div>
    )
  }

  }

  export default ScaleFrame