import React,{useState} from 'react';
import { useFormik } from "formik"
import * as Yup from "yup"
import { Row, Col, Form} from 'react-bootstrap';
import axios from 'axios';
import FeedBackicon from 'src/components/constant/FeedBackIcon';

// RegEx for phone number validation
const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

function ContactUs(){

  // const [submitButton, setSubmitButton] = useState(false)
  const [show, setShow] = useState(false)

  const formik = useFormik({
    initialValues:{
      name:"",
      email:"",
      phone:"",
      message:""
    },
    validationSchema:Yup.object().shape({
        name: Yup.string()
          .min(2, '*Names must have at least 2 characters')
          .max(40, "*Names can't be longer than 40 characters")
          .required('* Name is required'),
        email: Yup.string()
          .email('*Must be a valid email address')
          .max(100, '*Email must be less than 100 characters')
          .required('* Email is required'),
        phone: Yup.string()
          .matches(phoneRegExp, '*Phone number is not valid')
          .required('* Phone number required'),
          message: Yup.string()
          .min(7, '*Message must have at least 7 characters')
          .required('*Message required'),
      }),
    onSubmit: (values,{resetForm})=>{
        axios.post(`${process.env.REACT_APP_strapiURL}/api/user-contact-us`, {data:values})
            .then(resetForm())
            .then(setShow(true))
            .catch(err =>{console.error(err)})
    }
  })

  return(
    <>
      <FeedBackicon/>
      <div id='contactus-page'>
            {/* <Row>
                <Alert show={show} variant="success" onClose={() => setShow(false)} dismissible>
                    Thanks for contacting us, we will get back to you soon!
                </Alert>
            </Row> */}
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
                            name="message"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.message}
                        />
                        {formik.touched.message && formik.errors.message ? (<div className="error-message">{formik.errors.message}</div>) : null}
                    </Form.Group>
                    <center>
                      { show ? <h3>Thans for Contact Us!</h3> : <button type='submit' className='contact-us-button' disabled={!formik.isValid} >Submit</button>}
                    </center>
                </Form>
            </Col>
          </Row>
      </div>
    </>
  );
}

export default ContactUs;
