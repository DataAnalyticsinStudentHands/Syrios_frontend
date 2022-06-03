import React, {useEffect, useState} from 'react';
import { useFormik } from "formik"
import * as Yup from "yup"
import { Container, Row, Col, Alert} from 'react-bootstrap';
import axios from 'axios';
import { saveAs } from 'file-saver';

import Navbar from 'src/components/Navbar';
import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer';
import createMarkup from 'src/utils/Markup.js';

import './Download.css';

function Download(){
  const [is_loading, set_is_loading] = useState(true);

  const [submitButton, setSubmitButton] = useState(false)
  const [show, setShow] = useState(false)

  const [title, set_title] = useState(undefined);
  const [text, set_text] = useState(undefined);
  const [image, set_image] = useState(undefined);
  const [coinData, setCoinData] = useState(undefined)

  const [emailSubject, setEmailSubject] = useState(undefined);
  const [emailTo, setEmailTo] = useState(undefined);

  useEffect(()=>{
    if(is_loading){
      axios.get(process.env.REACT_APP_strapiURL + '/api/download')
        .then((res)=>{
          set_title(res.data.data.attributes.title);
          set_text(res.data.data.attributes.text);
          set_image(res.data.data.attributes.image);
          setCoinData(res.data.data.attributes.coinData.data.attributes.url)
          setEmailSubject(res.data.data.attributes.emailSubject);
          setEmailTo(res.data.data.attributes.emailTo);
          set_is_loading(false);
        });
    }
  });

  const formik = useFormik({
    initialValues:{
      fullName:"",
      email:"",
    },
    validationSchema:Yup.object({
      fullName: Yup.string()
      .min(7, '* Names must have at least 7 characters')
      .max(30, "* Names can't be longer than 30 characters")
      .required('* Full name is required'),
      email:Yup.string()
      .email('* Must be a valid email address')
      .max(100, '* Email must be less than 100 characters')
      .required('* Email is required'),
    }),
    onSubmit: (values,{resetForm})=>{
      values.emailSubject=emailSubject
      values.emailTo=emailTo
      axios.post(process.env.REACT_APP_strapiURL + '/api/download', values)
        .then(resetForm())
        .then(setSubmitButton(true))
        .then(setShow(true))
        .catch(err =>{console.error(err)})

      saveAs(
        `${process.env.REACT_APP_strapiURL}${coinData}`,
        'AntiochCoins.zip'
      )
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
      <div id='download-page' className='d-flex align-items-center'>
        <Container className='justify-content-sm-center my-5'>
          <Row>
              <Alert className='green-text' show={show} variant="success" onClose={() => setShow(false)} dismissible>
                  Data is downloading ...
              </Alert>
          </Row>
          <Row className='mb-5'>
            <p className='blue-text text-center' id='download-title'>
              Download the Data 
            </p>
          </Row>
          <Row className='d-flex justify-content-between align-items-center'>
            <Col xs={8}>
                {/* left */}
                <Row className='d-flex justify-content-between align-items-top'>
                  <Col xs={2} className=''>
                    <i
                      className='demo-icon icon-coin-scale download-icon'
                    >
                      &#xe810;</i>
                  </Col>
                  <Col xs={9} className=''>
                    <Row className='orange-text' id='download-sub-title'>
                      <div>
                          {title}
                      </div>
                    </Row>
                    <Row className='gray-text' id='download-sub-text'>
                      {/* {subText} */}
                      <div dangerouslySetInnerHTML={createMarkup(text)} />
                    </Row>
                  </Col>
                </Row>

                <Row className=''>
                  <img
                    alt={image.alternativeText === undefined ? 'img' : image.alternativeText}
                    className='frame-image'
                    src={`${process.env.REACT_APP_strapiURL}${image.data.attributes.url}`}
                  />
                </Row>
            </Col>
            <Col xs={4}>
              <Container className='d-flex flex-column align-items-center mx-5'>
                <Row className='text-center dark-blue-text'>
                    <b><small>Please provide your your name and email address in the form below to start the download.</small></b>
                </Row>
                <Row className='light-blue-background my-2 d-flex justify-content-center'>
                  <form className='mx-2 my-3 px-5' onSubmit={formik.handleSubmit}>
                    <div className='form-group mt-3'>
                      <label className='gray-text' htmlFor='fullName'>Full Name</label>
                      <br/>
                      <input 
                        id = "fullName"
                        type='text'
                        onChange={formik.handleChange}
                        onBlur = {formik.handleBlur}
                        value = {formik.values.fullName}
                        className='form-control'
                      />
                      {formik.touched.fullName && formik.errors.fullName ? <p className='gray-text'>{formik.errors.fullName}</p>: null}
                    </div>
                    <div className='form-group mt-4'>
                      <label className='gray-text' htmlFor='email'>Email Address</label>
                      <br/>
                      <input 
                        type='email'
                        id='email'
                        onChange={formik.handleChange}
                        onBlur = {formik.handleBlur}
                        value = {formik.values.email}
                        className='form-control'
                      />
                      {formik.touched.email && formik.errors.email ? <p className='gray-text'>{formik.errors.email}</p>: null}
                    </div>

                    <div className='text-center my-4'>
                      <button type='submit' className='download-button' disabled={!formik.isValid || submitButton}>
                        Download Data
                      </button>
                    </div>
                  </form>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default Download;
