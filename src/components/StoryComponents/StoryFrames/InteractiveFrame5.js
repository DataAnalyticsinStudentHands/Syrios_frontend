/* eslint-disable eqeqeq */
import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap";
import {SwitchFront,SwitchBack,FlipCoinImg,FlipCoin } from "../ComponentFunction/index";

function createMarkup(textTran){
  return {__html: textTran};
}
const InteractiveFrame5 = (zone, index, json_object) =>{
  let switch_dir = true
  const SwitchWord = (dom) =>{
    let main_text = dom.childNodes[0]
    let sub_text = dom.childNodes[1].childNodes[1]
    if (switch_dir){
      SwitchFront(main_text)
      SwitchFront(sub_text)
      switch_dir = false
    }
    else{
      SwitchBack(main_text)
      SwitchBack(sub_text)
      switch_dir = true
    }
  }
  return(
    <div key={`story_comp_${index}`} className='section'style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>
      <Container>
        <Row className='mb-5'>
          <div 
            dangerouslySetInnerHTML={createMarkup(zone.main_text_front)} 
            className='orange-text main-text text-center'
            style={{display:'black', opacity:1, transition:'0.3s'}}
          />
          <div 
            dangerouslySetInnerHTML={createMarkup(zone.main_text_back)} 
            className='orange-text main-text text-center'
            style={{display:'none', opacity:0, transition:'0.3s'}}
          />
        </Row>

        <Row className='d-flex justify-content-center'>
          <Col xs={6} className="d-flex justify-content-center">
            <Col xs={8} className="d-flex justify-content-end">
              {FlipCoinImg(zone.left_front,zone.left_back)}
              <i 
                className='demo-icon icon-coin-scale interactive-frame5-scale-icon'
                onClick={(e)=> {
                  let dom = e.target.parentElement.parentElement.parentElement.parentElement;
                  let image_left = dom.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0]

                  FlipCoin(image_left)
                  SwitchWord(dom)
                }}>
                &#xe833;</i>
            </Col>
          </Col>
          <Col xs={6} className='light-blue-background d-flex justify-content-center align-items-center'style={{padding: '20px', paddingTop: '20px', marginTop:'125px'}}>
            <div 
              dangerouslySetInnerHTML={createMarkup(zone.right_front)} 
              className='blue-text text-center sub-text'
              style={{display:'black', opacity:1, transition:'0.3s'}}
            />
            <div 
              dangerouslySetInnerHTML={createMarkup(zone.right_back)} 
              className='blue-text text-center sub-text'
              style={{display:'none', opacity:0, transition:'0.3s'}}
            />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default InteractiveFrame5;
