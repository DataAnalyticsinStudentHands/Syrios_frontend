import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap";
import {SwitchFront,SwitchBack,FlipCoinImg,FlipCoin } from "../ComponentFunction/index";


const InteractiveFrame5 = (zone, index, jsonObject) =>{
    let switchDir = true
    const switchWord = (dom) =>{
      let main_text = dom.childNodes[0]
      let sub_text = dom.childNodes[1].childNodes[1]
      if (switchDir){
        SwitchFront(main_text)
        SwitchFront(sub_text)
        switchDir = false
      }
      else{
        SwitchBack(main_text)
        SwitchBack(sub_text)
        switchDir = true
      }
    }
    return(
      <div key={`story_comp_${index}`} className='section'style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
        backgroundBlendMode:'multiply'}}>
        <Container>
          <Row className='mb-5'>
            <p className='OrangeText MainText text-center' style={{display:'black', opacity:1, transition:'0.3s'}}>
              {zone.main_text_front}
            </p>
            <p className='OrangeText MainText text-center' style={{display:'none', opacity:0, transition:'0.3s'}}>
              {zone.main_text_back}
            </p>
          </Row>
  
          <Row className='d-flex justify-content-between'>
            <Col xs={6} className="d-flex justify-content-center">
              <Col xs={6} className="d-flex justify-content-end">
                {FlipCoinImg(zone.image_left_front,zone.image_left_back)}
              </Col>
              <Col xs={6} className="d-flex justify-content-start">
                <i 
                  className='demo-icon icon-coin-scale InteractiveFrame5ScaleIcon'
                  onClick={(e)=> {
                    let dom = e.target.parentElement.parentElement.parentElement.parentElement;
                    let image_left = dom.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
  
                    FlipCoin(image_left)
                    switchWord(dom)
                  }}>
                  &#xe833;</i>
              </Col>
            </Col>
            <Col xs={6} className='LightBlueBackground d-flex justify-content-center align-items-center'style={{padding: '20px', paddingTop: '20px', marginTop:'125px'}}>
              <p className='BlueText text-center SubText' style={{display:'black', opacity:1, transition:'0.3s'}}>
                {zone.sub_text_right_front}
              </p>
              <p className='BlueText text-center SubText' style={{display:'none', opacity:0, transition:'0.3s'}}>
                {zone.sub_text_right_back}
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
  export default InteractiveFrame5