import React from 'react';
import {Row,Col} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import createMarkup from 'src/utils/Markup.js';
// import OutsideClickHandler from 'src/utils/OutsideClickHandler.js';
import NEH from 'src/assets/NEH-Preferred-Seal-White.svg';

const Footer = ({references,imageReference,isBottomOpen,toggleBottom}) => {
  // console.log('this is refer',references)
  // console.log('this is img src', imageReference)

  // const [isBottomOpen, setIsBottomOpen] = useState(false)

  // const toggleBottom = () => {
  //   setIsBottomOpen((prev) => !prev)
  // }

  let referenceLength = 10
  if(references || imageReference){
    referenceLength = 20+ Math.max(referenceLength,references.length,imageReference.length )*1
  }
  return (
    <>
     <div id='footer'>
       {/* NEH */}
       <a id='footer-logo' href='https://www.neh.gov/'>
         <img
           src={NEH}
           style= {{height:"3.125vmax"}}
           alt='NEH Logo'/>
       </a>
         <Row id='footer-links' className='d-flex justify-content-end align-items-center mx-5'>
           {/* CREDITS & REFERENCES */}
           <Col xs={2} className='d-flex align-items-center justify-content-end mx-5'>
            {(imageReference || references) &&( imageReference.length!==0 ||references.length!==0) ?(
            <>
              <button className='footer-text reference-tag'
                onClick={toggleBottom}
              >
                CREDITS & REFERENCES <b className="story-icon" style={{color:'#ffffff'}} >&#xe80b;</b>
              </button>
            </>):(<></>)}
          </Col>
          {/* ABOUT US */}
          <Col xs={1} className='d-flex align-items-center justify-content-end mx-5'>
            <Link to='/About' className='footer-text'>
                ABOUT US
            </Link>
          </Col>
          {/* CONTACT US */}
          <Col xs={1} className='d-flex align-items-center justify-content-end mx-5'>
            <Link to='/ContactUs' className='footer-text'>
                CONTACT US
            </Link>
          </Col>
        </Row>
    </div>
      {(imageReference || references) &&( imageReference.length!==0 ||references.length!==0) ?(<>
        <Drawer
          open={isBottomOpen}
          onClose={toggleBottom}
          direction='bottom'
          className='credits-and-references'
          // height={`${referenceLength}vmax`}
          zIndex={100}
          style={{height:`${referenceLength}vmax`}}
        >
          <Row>
            <Col>
              <button className='x-button reference-tag' onClick={toggleBottom}> &#xe839;</button>
            </Col>
          </Row>
          <Row className='' style={{marginLeft:'175px'}}>
            {imageReference.length ===0 ?(<></>):(
            <>
              <Col xs={4}>
                <Row style={{marginTop:'45px'}}>
                  <Col className='references-h3 mb-3'>Coin Images Courtesy of:</Col>
                </Row>
                  {imageReference.map((ref,index)=>{
                    return(
                      <Row key={index} className='d-flex references-text mt-3'>
                        <Col className='my-3 '>
                          <a href={ref.source_image} target="_blank" rel="noopener noreferrer">{ref.right_holder}</a>
                          <span className='story-icon mx-3' style={{color:'#b9ccd7', fontSize:'20px'}}> &#xe818;</span>
                        </Col>
                      </Row>
                    )})}
              </Col>
            </>)}
            {references.length ===0 ?(<></>):(
            <>
              <Col xs={7}>
              <Row style={{marginTop:'45px'}}>
                <Col className='references-h3 mx-4 mb-3'>To read more, check these out:</Col>
              </Row>
                {references.map((ref,index)=>{
                  return(
                    <Row key={index} className='d-flex references-text mt-3'>
                      <Col xs={1} className='d-flex justify-content-end mt-1' >[{index+1}]</Col>
                      {/* <Col xs={11} className='d-flex justify-content-start'  dangerouslySetInnerHTML={createMarkup(ref)}/> */}
                      {ref.split("http")[1] ? (
                            <Col xs={11} >
                                <a 
                                  href={`http${ref.split("http")[1].split(".</div>")[0]}`} 
                                  dangerouslySetInnerHTML={createMarkup(ref.split("http")[0])}
                                  target="_blank" rel="noopener noreferrer"
                                />
                            </Col>
                            ):(
                            <Col xs={11} dangerouslySetInnerHTML={createMarkup(ref.split("http")[0])}/>
                        )}
                    </Row>
                  )})}
            </Col>
            </>)}
          </Row>
        </Drawer>
      </>):(<></>)}
    </>
  )
}

export default Footer;
