import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import OutsideClickHandler from 'src/utils/OutsideClickHandler.js';
import NEH from 'src/assets/NEH-Preferred-Seal-White.svg';

import './Footer.css';
import 'src/components/constants.css';

const Footer = (props) => {
  const CreditsAndReferencesList = (props) => {
    if (props.credits_and_references == null) return (<div></div>);

    const CreateList = (props) => {
      let list_jsx = [];
      props.list.forEach((e, index) => {
        list_jsx.push(
          <li key={`${index}`}>
            <div
              className='list-items'
              dangerouslySetInnerHTML={{ __html: e.text }} 
            />
        </li>);
      });
      return list_jsx;
    };
    return (
      <div id='CreditsAndReferencesLists'>
        <ol className='CreditsAndReferencesList' title='Source material courtesy of:'>
          <CreateList list={props.credits_and_references.source_material} />
        </ol>
        <ol className='CreditsAndReferencesList' title='To read more, check these out:'>
          <CreateList list={props.credits_and_references.read_more} />
        </ol>
      </div>
    );
  }

  const [credits_and_references_height, set_credits_and_references_height] = useState('0vh');
  let has_credits_and_references = props.has_credits_and_references == null ? false : props.has_credits_and_references;
  return (
    <div id='Footer'>
      {/* NEH */}
      <a id='FooterLogo' href='https://www.neh.gov/'>
        <img
          src={NEH}
          height='60px'
          alt='NEH Logo'/>
      </a>
      <Container id='FooterLinks'>
        <Row className='justify-content-md-center'>
          {/* CREDITS & REFERENCES */}
          <Col sm={6}>
            { has_credits_and_references ? (
              <button 
                className='bland-style white-text FooterText center-div'
                onClick={() => {
                  set_credits_and_references_height('45vh');
                }}>
                CREDITS & REFERENCES
              </button>
            ) : (
              <div/>
            )}
          </Col>
          {/* ABOUT US */}
          <Col sm={3} xs={0}>
            <Link to='/About' className='bland-style d-none d-md-block'>
              <p className='white-text FooterText center-div'>
                ABOUT US
              </p>
            </Link>
          </Col>
          {/* CONTACT US */}
          <Col sm={3} xs={0}>
            <Link to='/' className='bland-style d-none d-md-block'>
              <p className='white-text FooterText center-div'>
                CONTACT US
              </p>
            </Link>
          </Col>
        </Row>
      </Container>
      {/* CREDITS & REFERENCES POPUP */}
      <OutsideClickHandler
        onOutsideClick={() => {
          // This timeout is necessary so if use clicks on credits and references on the footer expecting
          // it to close, it will close. This is due to setTimeout pushing the set_credits_and_references_height('0vh'); 
          // call further back in the call stack than the onClick for the button

          if (credits_and_references_height !== '0vh') {
            setTimeout(()=> {
              set_credits_and_references_height('0vh');
            }, 10);
          }
        }}>
        <div 
          id='CreditsAndReferences'
          className='d-flex align-items-center justify-content-center'
          style={{
            height: credits_and_references_height
          }}>
          <i 
            id='CreditsAndReferncesXIcon'
            className='demo-icon icon-x-medium'
            onClick={(e) => {
              // Don't need timeout because I know for a FACT I am not clicking on the C&R button
              set_credits_and_references_height('0vh');
            }}>&#xe838;</i>
          <CreditsAndReferencesList credits_and_references={props.credits_and_references} />
        </div>
      </OutsideClickHandler>
    </div>
  );
}

export default Footer;
