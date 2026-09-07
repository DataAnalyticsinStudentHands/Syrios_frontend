/**
 * ContactUs.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders the Contact Us page layout and contact form.
 *
 * Refactor Summary:
 * 1. Vite Environment Compatibility
 *    - Uses `import.meta.env.VITE_STRAPI_URL` for static asset URL construction
 *
 * 2. Preserved Existing Behavior
 *    - Layout, logo rendering, and contact form integration remain unchanged
 *
 * Notes:
 * - This component does not fetch API data directly
 * - No response normalization changes are required
 * - The logo path is currently hardcoded to a known uploaded asset
 *
 * Future Improvements:
 * - Move the contact page logo into CMS content instead of hardcoding the upload path
 * - Add safer image fallback handling if the asset is missing
 */

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import NoFeedBackicon from 'src/components/constant/NoFeedBackIcon';
import ContactUsForm from './ContactUsForm';

const baseURL = import.meta.env.VITE_STRAPI_URL;

function ContactUs() {
  return (
    <>
      <NoFeedBackicon />
      <div id='contactus-page'>
        <Row className='d-flex justify-content-between'>
          <Col xs={3} className='d-flex align-items-center justify-content-center'>
            <img
              alt='contact'
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