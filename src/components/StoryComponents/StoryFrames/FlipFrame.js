/* eslint-disable eqeqeq */
import backGround from 'src/assets/background.jpg';
import { Container, Row, Col} from "react-bootstrap"

import { HeadComponent,  } from "../ComponentFunction/index";
import createMarkup from 'src/utils/Markup.js';

const FlipCoinImage = (props)=>{
  let sourUrl = props.coin.coin.data.attributes.source_image
  let coin_obverse_url = props.coin.coin.data.attributes.obverse_file.data.attributes.url
  let coin_obverse_alt = props.coin.coin.data.attributes.obverse_file.data.attributes.alternativeText
  let coin_reverse_url = props.coin.coin.data.attributes.reverse_file.data.attributes.url
  let coin_reverse_alt = props.coin.coin.data.attributes.reverse_file.data.attributes.alternativeText

  return(
    <>
      <div className='flip-box'>
        <div className='flip-box-inner'>
          <div className='flip-box-front justify-content-center align-items-center'>
            <Row>
              <a href={`${sourUrl}`} target="_blank" rel="noopener noreferrer">
                <img 
                  src={`${process.env.REACT_APP_strapiURL}${coin_obverse_url}`} 
                  alt={coin_obverse_alt}
                  style={{width:"290px"}}
                />
              </a>
            </Row>
            <Row>
                <div 
                  dangerouslySetInnerHTML={createMarkup(props.coin.caption)} 
                  className={`story-caption text-center`}
                  style={{marginTop:"20px"}}
                />
            </Row>
          </div>
          <div className='flip-box-back'>
            <Row>
              <a href={`${sourUrl}`} target="_blank" rel="noopener noreferrer">
                <img 
                  src={`${process.env.REACT_APP_strapiURL}${coin_reverse_url}`} 
                  alt={coin_reverse_alt}
                  style={{width:"290px"}}
                />
              </a>
            </Row>
            <Row>
                <div 
                  dangerouslySetInnerHTML={createMarkup(props.coin.caption_back)} 
                  className={`story-caption text-center`}
                  style={{marginTop:"20px"}}
                />
            </Row>
          </div>
        </div>
      </div>
    </>
  )
}
function FlipCoin (dom){
  while (dom.className !== 'flip-box-inner') {dom = dom.nextSibling}
  if (dom.style.transform === 'rotateY(180deg)') {dom.style.transform = 'rotateY(0deg)'} 
  else {dom.style.transform = 'rotateY(180deg)'}
}

const FlipFrame = (props) =>{
  let zone = props.zone
    return(
      <div className='section' 
        style={{ 
          backgroundImage: zone.background.data == null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url}),url(${backGround})`,
          backgroundBlendMode:'multiply'
        }}
      >
        {zone.head.updown_switch ? (
        <Container>
          <Row style={{height:'464px'}} className="d-flex justify-content-between">
            <Col xs={3} className='light-blue-background d-flex justify-content-center align-items-center'><FlipCoinImage coin = {zone.flip_coin_left}/></Col>
            <Col xs={3} className="d-flex align-items-start flex-column">
              <Row className='mb-auto'><div dangerouslySetInnerHTML={createMarkup(zone.text_top)} className='story-text text-center'/></Row>
              <Row className='align-self-center' >
                <Col>
                  <i 
                    className='demo-icon icon-coin-scale interactive-frame1-scale-icon'
                    onClick={(e)=> {
                      let dom = e.target.parentElement.parentElement.parentElement.parentElement;
                      let coin_left = dom.childNodes[0].childNodes[0].childNodes[0]
                      let coin_right = dom.childNodes[2].childNodes[0].childNodes[0]
                      FlipCoin(coin_left)
                      FlipCoin(coin_right)
                    }}>
                    &#xe833;</i>
                </Col>
              </Row>
              <Row dangerouslySetInnerHTML={createMarkup(zone.text_down)} className='story-text text-center mt-auto' />
            </Col>
            <Col xs={3} className='light-blue-background d-flex justify-content-center align-items-center'><FlipCoinImage coin = {zone.flip_coin_right}/></Col>
          </Row>
          <Row className='d-flex justify-content-center mt-5'><HeadComponent storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/></Row>
        </Container>
        ):(
          <Container>
          <Row className='d-flex justify-content-center mb-5 '><HeadComponent storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/></Row>
          <Row style={{height:'464px'}} className="d-flex justify-content-between">
            <Col xs={3} className='light-blue-background d-flex justify-content-center align-items-center'><FlipCoinImage coin = {zone.flip_coin_left}/></Col>
            <Col xs={3} className="d-flex align-items-start flex-column">
              <Row className='mb-auto story-text text-center' dangerouslySetInnerHTML={createMarkup(zone.text_top)}/>
              <Row className='align-self-center' >
                <Col>
                  <i 
                    className='demo-icon icon-coin-scale interactive-frame1-scale-icon'
                    onClick={(e)=> {
                      let dom = e.target.parentElement.parentElement.parentElement.parentElement;
                      let coin_left = dom.childNodes[0].childNodes[0].childNodes[0]
                      let coin_right = dom.childNodes[2].childNodes[0].childNodes[0]
                      FlipCoin(coin_left)
                      FlipCoin(coin_right)
                    }}>
                    &#xe833;</i>
                </Col>
              </Row>
              <Row dangerouslySetInnerHTML={createMarkup(zone.text_down)} className='story-text text-center mt-auto'></Row>
            </Col>
            <Col xs={3} className='light-blue-background d-flex justify-content-center align-items-center'><FlipCoinImage coin = {zone.flip_coin_right}/></Col>
          </Row>
        </Container>
        )}
    </div>
    )
  }

  export default FlipFrame
