import React from 'react';
import {
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactDomServer from 'react-dom/server';

import './Footer.css';
import 'src/components/constants.css';
import OutsideClickHandler from 'src/utils/OutsideClickHandler.js';
import NEH from 'src/assets/NEH-Preferred-Seal-White.svg';

export const ChangeCreditsAndReferences = (obj) => {
  if (obj === undefined || obj === null) return;

  // Check every 200ms if footer has been rendered. If true, delete the interval and update credits and references
  var interval = setInterval(function() {
    let dom = document.getElementById('CreditsAndReferences');
    if (dom !== undefined) {
      clearInterval(interval);
      let sourceMaterialReferences = undefined, readMoreReferences = undefined;
      dom.childNodes.forEach((e) => { // We need these dom elements so we can push list items into the innerHTML 
        let lowerTitle = e.title.toLowerCase();
        if (lowerTitle.includes('source') || lowerTitle.includes('material')) {
          sourceMaterialReferences = e;
        } else {
          readMoreReferences = e;
        }
      });

      const pushToJsxArr = (jsxArr, text) => { // takes jsxArr and link text and decides if it is a link or normal text. If normal, normal, if text, a href that boi.
        const regex = new RegExp(/\[[^\]]*\]\([^)]*\)*/); // looks for text matching: [text](link)

        let jsx = undefined;
        if (regex.test(text)) {
          //console.log(text);
          let textNoUrl = text.slice(text.indexOf('[')+1,text.indexOf(']('));
          let url = text.slice(text.indexOf('](')+2, text.lastIndexOf(')'));
          jsx = (
            <a href={url} className='CreditsAndReferencesListItemHref BlackText'>
              {textNoUrl}
            </a>
          );
        } else {
          jsx = text
        }
        jsxArr.push(
          ReactDomServer.renderToString(
            <li className='CreditsAndReferencesListItem BlackText'>
              {jsx}
            </li>)
        );
      }

      // Push stuff to jsxarray. Need one for Source Materical and Read More
      let sourceMaterialReferencesJsxArr = [];
      obj.source_material_references.forEach((e) => {
        pushToJsxArr(sourceMaterialReferencesJsxArr, e.text);
      });

      let readMoreReferencesJsxArr = [];
      obj.read_more_references.forEach((e) => {
        pushToJsxArr(readMoreReferencesJsxArr, e.text);
      });
      sourceMaterialReferences.innerHTML = sourceMaterialReferencesJsxArr.join('');
      readMoreReferences.innerHTML = readMoreReferencesJsxArr.join('');
    }
  }, 200); }

const Footer = (loadCreditsAndReferences = false) => {
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
            { loadCreditsAndReferences ? (
              <button 
                className='blandStyle WhiteText FooterText centerDiv'
                onClick={() => {
                  let dom = document.getElementById('CreditsAndReferences')
                  dom.style.height = '45vh';
                }}>
                CREDITS & REFERENCES
              </button>
            ) : (
              <div/>
            )}
          </Col>
          {/* ABOUT US */}
          <Col sm={3} xs={0}>
            <Link to='/About' className='blandStyle d-none d-md-block'>
              <p className='WhiteText FooterText centerDiv'>
                ABOUT US
              </p>
            </Link>
          </Col>
          {/* CONTACT US */}
          <Col sm={3} xs={0}>
            <Link to='/' className='blandStyle d-none d-md-block'>
              <p className='WhiteText FooterText centerDiv'>
                CONTACT US
              </p>
            </Link>
          </Col>
        </Row>
      </Container>
      {/* CREDITS & REFERENCES POPUP */}
      <OutsideClickHandler
        onOutsideClick={() => {
          setTimeout(()=> {
            let dom = document.getElementById('CreditsAndReferences');
            if (parseInt(window.getComputedStyle(dom).height) > .05 * window.innerHeight) {
              dom.style.height = '0vh';
            }
          }, 10);
        }}>
        <div 
          id='CreditsAndReferences'
          className='d-flex align-items-center justify-content-center'>
          <i 
            id='CreditsAndReferncesXIcon'
            className='demo-icon icon-x-medium'
            onClick={(e) => {
              document.getElementById('CreditsAndReferences').style.height = '0vh';
            }}>&#xe838;</i>
          <ol className='CreditsAndReferencesList' title='Source Material Courtesy of:'>
          </ol>
          <ol className='CreditsAndReferencesList' title='To read more, check these out:'>
          </ol>
        </div>
      </OutsideClickHandler>
    </div>
  );
}

export default Footer;
