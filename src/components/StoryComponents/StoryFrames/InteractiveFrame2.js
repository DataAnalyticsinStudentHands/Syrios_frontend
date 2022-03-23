import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap";
import {FlipCoin,FlipCoinImg} from "../ComponentFunction/index";

const InteractiveFrame2 = (zone, index, jsonObject) =>{
    
    return(
      // eslint-disable-next-line eqeqeq
      <div key={`story_comp_${index}`} className='section'style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
        backgroundBlendMode:'multiply'}}>
        <Container>
          <Row className='d-flex justify-content-between'>
            {/* image_lieft */}
            <Col className='d-flex align-items-center justify-content-center' xs={3}>

              {FlipCoinImg(zone.image_left_front, zone.image_left_back)}
            </Col>
            {/* text in the middle */}
            <Col xs={4} className='justify-content-between d-flex flex-column mt-5'>
                <Row className='GrayText SubText text-center align-items-start mt-5'>
                  <Col>
                    {zone.sub_text_middle_top}
                  </Col>
                </Row>
                <Row className='text-center align-items-center my-5' >
                  <Col>
                    <Row>
                      <Col className='d-flex align-items-center justify-content-center'>
                        <i 
                          className='demo-icon icon-coin-scale InteractiveFrame1ScaleIcon'
                          onClick={(e)=> {
                            let dom = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
                            
                            let coin_left = dom.childNodes[0].childNodes[0].childNodes[0]
                            let coin_right = dom.childNodes[2].childNodes[0].childNodes[0]
                            
                            FlipCoin(coin_left)
                            FlipCoin(coin_right)
                          }}>
                          &#xe833;</i>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className='GrayText SubText text-center align-items-end mb-5'>
                  <Col>
                    {zone.sub_text_middle_bottom}
                  </Col>
                </Row>
            </Col>
            {/* image right */}
            <Col className='d-flex align-items-center justify-content-center' xs={3}>

              {FlipCoinImg(zone.image_right_front, zone.image_right_back)}
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
export default InteractiveFrame2  