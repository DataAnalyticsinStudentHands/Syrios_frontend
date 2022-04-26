/* eslint-disable eqeqeq */
import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap";
import ReactMarkdown from 'react-markdown';
import {subcomponent_image, SwitchBack, SwitchFront} from "../ComponentFunction/index";
import { createMarkup } from 'src/utils/markup';
// function createMarkup(textTran){
//   return {__html: textTran};
// }

const InteractiveFrame3 = (zone, index) =>{
    const switchForFront = (dom) =>{
      let imgLeftDiv = dom.childNodes[0]
      let textmidDiv = dom.childNodes[1].childNodes[1].childNodes[0]
      let imgRightDiv = dom.childNodes[2]
      SwitchBack(imgLeftDiv)
      SwitchBack(textmidDiv)
      SwitchBack(imgRightDiv)

    }
    const switchForBack = (dom) =>{  
      let imgLeftDiv = dom.childNodes[0]
      let textmidDiv = dom.childNodes[1].childNodes[1].childNodes[0]
      let imgRightDiv = dom.childNodes[2]
      SwitchFront(imgLeftDiv)
      SwitchFront(textmidDiv)
      SwitchFront(imgRightDiv)
    }
    return(
      <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
        backgroundBlendMode:'multiply'}}>
        <Container>
          <Row>
              <ReactMarkdown className='OrangeText MainText text-center my-5'>
                {zone.title}
              </ReactMarkdown>
          </Row>
          <Row className='d-flex justify-content-around'>
            {/* image_lieft */}
            <Col xs={3}>
              <div style={{display:'black', opacity:1, transition:'0.3s'}}>
                {subcomponent_image(zone.left_front13)}
              </div>
              <div style={{display:'none', opacity:0, transition:'0.3s'}}>
                {subcomponent_image(zone.left_back13)}
              </div>
            </Col>
            {/* text in the middle */}
            <Col xs={5} className='justify-content-between d-flex flex-column'>
                <Row className='d-flex justify-content-center'>
                </Row>
                <Row className='d-flex justify-content-center' >
                  <Col xs={{span:9}}>
                    <div 
                      dangerouslySetInnerHTML={createMarkup(zone.mid_front)} 
                      className='text-center GrayText SubText'
                      style={{display:'black', opacity:1, transition:'0.3s'}}  
                    />
                    <div 
                      dangerouslySetInnerHTML={createMarkup(zone.mid_back)} 
                      className='text-center GrayText SubText'
                      style={{display:'none', opacity:0, transition:'0.3s'}}  
                    />
                  </Col>
                </Row>
  
                <Row className='d-flex justify-content-center'>
                  <Col className='d-flex justify-content-center'>
                      <button	
                        className='BlueText text-center my-2' 
                        style={{width: '150px'}}
                        onClick={(e)=>{
                          let dom = e.target.parentElement.parentElement.parentElement.parentElement
                          switchForFront(dom)
                        }}
                      >
                        Government
                      </button>
                  </Col>
                  <Col className='d-flex justify-content-center'>
                      <button	
                        className='BlueText text-center my-2' 
                        style={{width: '150px'}}
                        onClick={(e)=>{
                          let dom = e.target.parentElement.parentElement.parentElement.parentElement
                          switchForBack(dom)
                        }}
                      >
                        Values
                      </button>
                  </Col>
                </Row>
            </Col>
            {/* image right */}
            <Col xs={3}>
              <div style={{display:'black', opacity:1, transition:'0.3s'}}>
                {subcomponent_image(zone.right_front13)}
              </div>
              <div style={{display:'none', opacity:0, transition:'0.3s'}}>
                {subcomponent_image(zone.right_back13)}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
export default InteractiveFrame3
