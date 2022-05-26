import React,{useState, useEffect} from 'react';
import { useFormik } from "formik"
import * as Yup from "yup"
import { Container, Row, Col, Form, Alert} from 'react-bootstrap';
import axios from 'axios';

import Navbar from 'src/components/Navbar';
import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer';
// import createMarkup from 'src/utils/Markup.js';
import './ContactUs.css';

// RegEx for phone number validation
const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

function ContactUs(){
  const [is_loading, set_is_loading] = useState(true);
  const [submitButton, setSubmitButton] = useState(false)
  const [show, setShow] = useState(false)

  const [image, set_image] = useState(undefined);

  const [emailSubject, setEmailSubject] = useState(undefined);
  const [emailTo, setEmailTo] = useState(undefined);

  useEffect(()=>{
    if(is_loading){
      axios.get(process.env.REACT_APP_strapiURL + '/api/contact-us')
        .then((res)=>{
            set_image(res.data.data.attributes.image);
            setEmailSubject(res.data.data.attributes.emailSubject);
            setEmailTo(res.data.data.attributes.emailTo);
            set_is_loading(false);
        });
    }
  });

  const formik = useFormik({
    initialValues:{
      name:"",
      email:"",
      phone:"",
      writtenMessage:""
    },
    validationSchema:Yup.object().shape({
        name: Yup.string()
          .min(2, '*Names must have at least 2 characters')
          .max(100, "*Names can't be longer than 100 characters")
          .required('*Name is required'),
        email: Yup.string()
          .email('*Must be a valid email address')
          .max(100, '*Email must be less than 100 characters')
          .required('*Email is required'),
        phone: Yup.string()
          .matches(phoneRegExp, '*Phone number is not valid')
          .required('*Phone number required'),
        writtenMessage: Yup.string()
          .min(2, '*Message must have at least 2 characters')
          .required('*Message required'),
      }),
    onSubmit: (values,{resetForm})=>{

        const data = {
            "data":{
                "name":values.name,
                "email":values.email,
                "phone":values.phone,
                "message":values.writtenMessage
            }
        }
        axios.post(process.env.REACT_APP_strapiURL + '/api/contact-user-infos', data)
        
        values.emailSubject=emailSubject
        values.emailTo=emailTo
        axios.post(process.env.REACT_APP_strapiURL + '/api/contact-us', values)
            .then(resetForm())
            .then(setSubmitButton(true))
            .then(setShow(true))
            .catch(err =>{console.error(err)})
    }
  })

  if (is_loading) {
    return(
      <>
        <Navbar />
        <LoadingPage />
        <Footer />
      </>
    );
  }

  return(
    <>
      <Navbar />
      <div id='contactus-page' className='d-flex align-items-center'>

        <Container className='my-5'>
            <Row>
                <Alert show={show} variant="success" onClose={() => setShow(false)} dismissible>
                    Thanks for contacting us, we will get back to you soon!
                </Alert>
            </Row>
          <Row className='blue-text text-center justify-content-center' id='contactus-title'>
              Contact Us
          </Row>
          <Row className='d-flex justify-content-between'>
            <Col xs={3}>
                <img
                    alt={image.alternativeText === undefined ? 'img' : image.alternativeText}
                    src={`${process.env.REACT_APP_strapiURL}${image.data.attributes.url}`}
                    width='100%'
                />
            </Col>
            <Col xs={9}>
                <Form className='mx-2 my-3 px-5' onSubmit={formik.handleSubmit}>
                    <Form.Group className='mb-3'>
                        <Form.Label className='gray-text' htmlFor='name'>Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="name"
                            onChange={formik.handleChange}
                            onBlur = {formik.handleBlur}
                            value = {formik.values.name}
                        />
                        {formik.touched.name && formik.errors.name ? <p>{formik.errors.name}</p>: null}
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label className='gray-text' htmlFor='email'>Email</Form.Label>
                        <Form.Control 
                            type="email"
                            name="email"
                            onChange={formik.handleChange}
                            onBlur = {formik.handleBlur}
                            value = {formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email ? <p>{formik.errors.email}</p>: null}
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label className='gray-text' htmlFor='phone'>Phone</Form.Label>
                        <Form.Control 
                            type="text" 
                            name = "phone"
                            onChange={formik.handleChange}
                            onBlur = {formik.handleBlur}
                            value = {formik.values.phone}
                        />
                        {formik.touched.phone && formik.errors.phone ? <p>{formik.errors.phone}</p>: null}
                    </Form.Group>
                    <Form.Group className='mb-5'>
                        <Form.Label className='gray-text'>Message</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            name="writtenMessage"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.writtenMessage}
                            className={
                                formik.touched.writtenMessage && formik.errors.writtenMessage ? 'has-error' : null
                            }
                        />
                        {formik.touched.writtenMessage && formik.errors.writtenMessage ? (
                        <div className="error-message">{formik.errors.writtenMessage}</div>
                        ) : null}
                    </Form.Group>
                    <button type='submit' disabled={!formik.isValid || submitButton} >
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
