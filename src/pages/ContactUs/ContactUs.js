import React,{useState} from 'react';
import { useFormik } from "formik"
import * as Yup from "yup"
import { Container, Row, Col, Form, Alert} from 'react-bootstrap';
import axios from 'axios';

import Footer from 'src/components/Footer';
// import createMarkup from 'src/utils/Markup.js';

// RegEx for phone number validation
const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

function ContactUs(){

  const [submitButton, setSubmitButton] = useState(false)
  const [show, setShow] = useState(false)

  const formik = useFormik({
    initialValues:{
      name:"",
      email:"",
      phone:"",
      writtenMessage:""
    },
    validationSchema:Yup.object().shape({
        name: Yup.string()
          .min(7, '*Names must have at least 7 characters')
          .max(40, "*Names can't be longer than 40 characters")
          .required('* Name is required'),
        email: Yup.string()
          .email('*Must be a valid email address')
          .max(100, '*Email must be less than 100 characters')
          .required('* Email is required'),
        phone: Yup.string()
          .matches(phoneRegExp, '*Phone number is not valid')
          .required('* Phone number required'),
        writtenMessage: Yup.string()
          .min(7, '*Message must have at least 7 characters')
          .required('*Message required'),
      }),
    onSubmit: (values,{resetForm})=>{
        axios.post(process.env.REACT_APP_strapiURL + '/api/contact-us', values)
            .then(resetForm())
            .then(setSubmitButton(true))
            .then(setShow(true))
            .catch(err =>{console.error(err)})
    }
  })

  return(
    <>
    <div className='feedbackicon'>
      <a href="https://universityofhouston.iad1.qualtrics.com/jfe/form/SV_e8xJud3C0FsmNz8?jfefe=new"
      target="_blank" rel="noopener noreferrer">
      <svg width="100%" viewBox="0 0 286 427" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_0_1)">
        <circle cx="213.5" cy="189.5" r="209.5" fill="#987818"/>
        </g>
        <text x="103.5" y="169.5" fill="white" className='feedbacktext'>   
          Give us
        </text>
        <text x="93.5" y="229.5" fill="white" className='feedbacktext'>   
          Usability
        </text>
        <text x="83.5" y="289.5" fill="white" className='feedbacktext'>   
          Feedback!
        </text>        
        <defs>
          <filter id="filter0_d_0_1" x="0" y="0" width="427" height="427" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape"/>
          </filter>
        </defs>
      </svg>
      </a>
    </div>

      <div id='contactus-page'>


        <Container>
            <Row>
                <Alert show={show} variant="success" onClose={() => setShow(false)} dismissible>
                    Thanks for contacting us, we will get back to you soon!
                </Alert>
            </Row>
          <Row className='d-flex justify-content-between'>
            <Col xs={3} className=" d-flex align-items-center justify-content-center">
                <img
                    alt={"contact"}
                    src={`${process.env.REACT_APP_strapiURL}/uploads/logoside_5b293d0769.png?`}
                    height='85%'
                />
            </Col>
            <Col xs={9}>
              <h1 className='text-center mb-5 yb-5'>Contact Us</h1>
                <Form className='mx-2 px-5' onSubmit={formik.handleSubmit}>
                    <Form.Group className='my-5'>
                        <Form.Label className='story-text' htmlFor='name'>Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="name"
                            onChange={formik.handleChange}
                            onBlur = {formik.handleBlur}
                            value = {formik.values.name}
                        />
                        {formik.touched.name && formik.errors.name ? <div className="error-message">{formik.errors.name}</div>: null}
                    </Form.Group>
                    <Form.Group className='my-5'>
                        <Form.Label className='story-text' htmlFor='email'>Email</Form.Label>
                        <Form.Control 
                            type="email"
                            name="email"
                            onChange={formik.handleChange}
                            onBlur = {formik.handleBlur}
                            value = {formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email ? <div className="error-message">{formik.errors.email}</div>: null}
                    </Form.Group>
                    <Form.Group className='my-5'>
                        <Form.Label className='story-text' htmlFor='phone'>Phone</Form.Label>
                        <Form.Control 
                            type="text" 
                            name = "phone"
                            onChange={formik.handleChange}
                            onBlur = {formik.handleBlur}
                            value = {formik.values.phone}
                        />
                        {formik.touched.phone && formik.errors.phone ? <div className="error-message">{formik.errors.phone}</div>: null}
                    </Form.Group>
                    <Form.Group className='my-5'>
                        <Form.Label className='story-text'>Message</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={8}
                            name="writtenMessage"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.writtenMessage}
                        />
                        {formik.touched.writtenMessage && formik.errors.writtenMessage ? (
                        <div className="error-message">{formik.errors.writtenMessage}</div>
                        ) : null}
                    </Form.Group>
                    <button type='submit' className='contact-us-button' disabled={!formik.isValid || submitButton} >
                        Submit
                    </button>
                </Form>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default ContactUs;
