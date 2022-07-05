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

const DrawerBody = (props) => {

  const imgrefLi=[]
  if(props.imageReference){
    props.imageReference.forEach((ref,index)=>{
      imgrefLi.push(
        <div key={index}>
          <Row>
            <Col xs={1} className="story-icon my-2" style={{color:'#b9ccd7', fontSize:'20px'}} >&#xe818;</Col>
            <Col xs={11} className='my-2'><a href={ref.source_image}>{ref.right_holder}</a></Col>
          </Row>
        </div>
      )})}

  const refLi=[]
  if(props.references){
    props.references.forEach((ref, index)=>{
      refLi.push(
        <div key={index}>
          <Row>
            <Col xs={1} className='d-flex justify-content-end mt-1' >[{index+1}]</Col>
            <Col xs={11} className='d-flex justify-content-start'  dangerouslySetInnerHTML={createMarkup(ref)}/>
          </Row>
        </div>
      )})}

  return (
    <>
      <Row className='' style={{marginLeft:'175px'}}>
        {props.imageReference ?(
          <>          
          <Col xs={4}>
          <Row className='mt-5'>
            <Col className='references-h3'>Coin Images Courtesy of:</Col>
          </Row>
          <Row className='d-flex references-text mt-3'>
              {/* <ul className=''> */}
                {imgrefLi}
              {/* </ul> */}
          </Row>
        </Col>
        </>
        ):(<></>)}
        {props.references?(
        <>
        <Col xs={6}>
          <Row className='mt-5'>
            <Col className='references-h3'>To read more, check these out:</Col>
          </Row>
          <Row className='d-flex references-text mt-3 '>
              {refLi}
          </Row>
        </Col>
        </>):(<></>)}
      </Row>
    </>
  )
}
const Footer = ({references,imageReference}) => {
  // console.log('this is refer',references)
  // console.log('this is img src', imageReference)

  const [isBottomOpen, setIsBottomOpen] = useState(false)

  const toggleBottom = () => {
    setIsBottomOpen((prev) => !prev)
  }

  // const CreditsAndReferencesList = (props) => {
  //   if (props.creditsAndReferences == null) return (<div></div>);

  //   const CreateList = (props) => {
  //     let list_jsx = [];
  //     props.list.forEach((e, index) => {
  //       list_jsx.push(
  //         <li key={`${index}`}>
  //           <div
  //             className='credits-and-references-list-items'
  //             dangerouslySetInnerHTML={{ __html: e.text }} 
  //           />
  //       </li>);
  //     });
  //     return list_jsx;
  //   };

  //   return (
  //     <div id='credits-and-references-lists'>
  //       <ol className='credits-and-references-list' title='Source material courtesy of:'>
  //         <CreateList list={props.creditsAndReferences.source_material} />
  //       </ol>
  //       <ol className='credits-and-references-list' title='To read more, check these out:'>
  //         <CreateList list={props.creditsAndReferences.read_more} />
  //       </ol>
  //     </div>
  //   ); 
  // }

  // const [credits_and_references_height, set_credits_and_references_height] = useState('0vh');
  // let has_credits_and_references = props.hasCreditsAndReferences == null ? false : props.hasCreditsAndReferences;
  // return (
  //   <div id='footer'>
  //     {/* NEH */}
  //     <a id='footer-logo' href='https://www.neh.gov/'>
  //       <img
  //         src={NEH}
  //         height='60px'
  //         alt='NEH Logo'/>
  //     </a>
  //     <Container id='footer-links'>
  //       <Row className='justify-content-md-center'>
  //         {/* CREDITS & REFERENCES */}
  //         <Col sm={6}>
  //           { has_credits_and_references ? (
  //             <button 
  //               className='bland-style white-text footer-text center-div'
  //               onClick={() => {
  //                 set_credits_and_references_height('45vh');
  //               }}>
  //               CREDITS & REFERENCES
  //             </button>
  //           ) : (
  //             <div/>
  //           )}
  //         </Col>
  //         {/* ABOUT US */}
  //         <Col sm={3} xs={0}>
  //           <Link to='/About' className='bland-style d-none d-md-block'>
  //             <p className='white-text footer-text center-div'>
  //               ABOUT US
  //             </p>
  //           </Link>
  //         </Col>
  //         {/* CONTACT US */}
  //         <Col sm={3} xs={0}>
  //           <Link to='/ContactUs' className='bland-style d-none d-md-block'>
  //             <p className='white-text footer-text center-div'>
  //               CONTACT US
  //             </p>
  //           </Link>
  //         </Col>
  //       </Row>
  //     </Container>
  //     {/* CREDITS & REFERENCES POPUP */}
  //     {/* <OutsideClickHandler
  //       onOutsideClick={() => {
  //         // This timeout is necessary so if use clicks on credits and references on the footer expecting
  //         // it to close, it will close. This is due to setTimeout pushing the set_credits_and_references_height('0vh'); 
  //         // call further back in the call stack than the onClick for the button

  //         if (credits_and_references_height !== '0vh') {
  //           setTimeout(()=> {
  //             set_credits_and_references_height('0vh');
  //           }, 10);
  //         }
  //       }}>
  //       <div 
  //         id='credits-and-references'
  //         className='d-flex align-items-center justify-content-center'
  //         style={{
  //           height: credits_and_references_height
  //         }}>
  //         <i 
  //           id='credits-and-references-x-icon'
  //           className='demo-icon icon-x-medium'
  //           onClick={(e) => {
  //             // Don't need timeout because I know for a FACT I am not clicking on the C&R button
  //             set_credits_and_references_height('0vh');
  //           }}>&#xe838;</i>
  //         <CreditsAndReferencesList creditsAndReferences={props.creditsAndReferences} />
  //       </div>
  //     </OutsideClickHandler> */}
  //   </div>
  // );
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
            {imageReference || references ?(
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
      {imageReference || references ?(
      <>
        <Drawer
          open={isBottomOpen}
          onClose={toggleBottom}
          direction='bottom'
          className='credits-and-references'
          size={'40%'}
          zIndex={100}
        >
          <DrawerBody imageReference={imageReference} references={references}/>
        </Drawer>
      </>):(<></>)}

    </>
  )
}

export default Footer;
