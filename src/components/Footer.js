import React, { useState } from 'react';
import {
  Row,
  Col,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import createMarkup from 'src/utils/Markup.js';
// import OutsideClickHandler from 'src/utils/OutsideClickHandler.js';
import NEH from 'src/assets/NEH-Preferred-Seal-White.svg';

const Footer = ({references,imageReference}) => {
  // console.log('this is refer',references)
  // console.log('this is img src', imageReference)

  const [isBottomOpen, setIsBottomOpen] = useState(false)

  const toggleBottom = () => {
    setIsBottomOpen((prev) => !prev)
  }

  let referenceLength = 10
  if(references || imageReference){
    referenceLength = Math.max(referenceLength,references.length,imageReference.length )
    referenceLength = 175 + referenceLength *30
  }
  return (
    <>
     <div id='footer'>
       {/* NEH */}
       <a id='footer-logo' href='https://www.neh.gov/'>
         <img
           src={NEH}
           height='60px'
           alt='NEH Logo'/>
       </a>
         <Row id='footer-links' className='d-flex justify-content-end align-items-center mx-5'>
           {/* CREDITS & REFERENCES */}
           <Col xs={2} className='d-flex align-items-center justify-content-end'>
            {(imageReference || references) &&( imageReference.length!==0 ||references.length!==0) ?(
            <>
              <button 
                className='footer-text'
                onClick={toggleBottom}
                >
                CREDITS & REFERENCES <b className="story-icon" style={{color:'#ffffff'}} >&#xe80b;</b>

              </button>
            </>):(<></>)}
          </Col>
          {/* ABOUT US */}
          <Col xs={1} className='d-flex align-items-center justify-content-end'>
            <Link to='/About' className='footer-text'>
                ABOUT US
            </Link>
          </Col>
          {/* CONTACT US */}
          <Col xs={1} className='d-flex align-items-center justify-content-end'>
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
          size={`${referenceLength}px`}
          zIndex={100}
        >
          <Row className='' style={{marginLeft:'175px'}}>
            {imageReference.length ===0 ?(<></>):(
            <>
              <Col xs={4}>
                <Row style={{marginTop:'45px'}}>
                  <Col className='references-h3'>Coin Images Courtesy of:</Col>
                </Row>
                <Row className='d-flex references-text mt-3'>
                  {imageReference.map((ref,index)=>{
                    return(
                      <Row key={index}>
                        <Col xs={1} className="story-icon my-2" style={{color:'#b9ccd7', fontSize:'20px'}} >&#xe818;</Col>
                        <Col xs={11} className='my-2'><a href={ref.source_image}>{ref.right_holder}</a></Col>
                      </Row>
                    )})}
                </Row>
              </Col>
            </>)}
            {references.length ===0 ?(<></>):(
            <>
              <Col xs={6}>
              <Row style={{marginTop:'45px'}}>
                <Col className='references-h3 mx-4'>To read more, check these out:</Col>
              </Row>
              <Row className='d-flex references-text mt-3 '>
                  {references.map((ref,index)=>{
                    return(
                      <Row key={index}>
                      <Col xs={1} className='d-flex justify-content-end mt-1 references-text-ordered-list-number' >[{index+1}]</Col>
                      <Col xs={11} className='d-flex justify-content-start'  dangerouslySetInnerHTML={createMarkup(ref)}/>
                    </Row>
                    )})}
              </Row>
            </Col>
            </>)}
          </Row>
        </Drawer>
      </>):(<></>)}
    </>
  )
}

export default Footer;
