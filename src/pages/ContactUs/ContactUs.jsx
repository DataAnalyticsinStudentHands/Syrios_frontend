/**
 * ContactUs.jsx — Vite Migration Refactor (2026)
 *
 * Changes:
 * - `.js` → `.jsx`
 * - `process.env.REACT_APP_strapiURL` → `import.meta.env.VITE_STRAPI_URL`
 *
 * Everything else is intentionally preserved.
 */

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import NoFeedBackicon from 'src/components/constant/NoFeedBackIcon';
import ContactUsForm from './ContactUsForm';

const baseURL = import.meta.env.VITE_STRAPI_URL;

function ContactUs(){
  return(
    <>
      <NoFeedBackicon/>
      <div id='contactus-page'>
        <Row className='d-flex justify-content-between'>
          <Col xs={3} className=" d-flex align-items-center justify-content-center">
            <img
              alt={"contact"}
              src={`${baseURL}/uploads/logoside_5b293d0769.png?`}
              height='85%'
            />
          </Col>
          <Col xs={9}>
            <h1 className='text-center mb-5 yb-5'>Contact Us</h1>
            <ContactUsForm />
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ContactUs;