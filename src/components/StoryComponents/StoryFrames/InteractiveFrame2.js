/* eslint-disable eqeqeq */
import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap";
import {FlipCoin,FlipCoinImg} from "../ComponentFunction/index";

function createMarkup(textTran){
  return {__html: textTran};
}
const InteractiveFrame2 = (zone, index, jsonObject) =>{
    // console.log(zone)
    return(
      <div key={`story_comp_${index}`} className='section'style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
        backgroundBlendMode:'multiply'}}>
        <Container>
          <Row className='d-flex justify-content-between'>
            {/* image_lieft */}
            <Col className='' xs={3} style={{height: '200px'}}>
              {FlipCoinImg(zone.left_front12, zone.left_back12)}
            </Col>
            {/* text in the middle */}
            <Col xs={4} className='align-items-center'>
                <Row>
                  <div dangerouslySetInnerHTML={createMarkup(zone.text_top)} className='GrayText SubText text-center'/>
                </Row>
                <Row className='my-5' >
                  <Col className='d-flex justify-content-center'>
                    <i 
                      className='demo-icon icon-coin-scale InteractiveFrame1ScaleIcon'
                      onClick={(e)=> {
                        let dom = e.target.parentElement.parentElement.parentElement.parentElement;
                        console.log(dom)
                        let coin_left = dom.childNodes[0].childNodes[0].childNodes[0]
                        let coin_right = dom.childNodes[2].childNodes[0].childNodes[0]
                        
                        FlipCoin(coin_left)
                        FlipCoin(coin_right)
                      }}>
                      &#xe833;</i>
                  </Col>
                </Row>
                <Row>
                  <div dangerouslySetInnerHTML={createMarkup(zone.text_top)} className='GrayText SubText text-center'/>
                </Row>
            </Col>
            {/* image right */}
            <Col className='' xs={3}>
              {FlipCoinImg(zone.right_front12, zone.right_back12)}
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
export default InteractiveFrame2  