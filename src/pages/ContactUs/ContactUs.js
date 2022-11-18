import React from 'react';
import { Row, Col} from 'react-bootstrap';
import FeedBackicon from 'src/components/constant/FeedBackIcon';
import ContactUsForm from './ContactUsForm';

function ContactUs(){
  return(
    <>
      <FeedBackicon/>
      <div id='contactus-page'>
          <Row className='d-flex justify-content-between'>
            <Col xs={3} className=" d-flex align-items-center justify-content-center">
                <img alt={"contact"} src={`${process.env.REACT_APP_strapiURL}/uploads/logoside_5b293d0769.png?`} height='85%'/>
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
