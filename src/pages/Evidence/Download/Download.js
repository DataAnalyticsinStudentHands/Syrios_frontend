import React, {useEffect, useState} from 'react';
import { useFormik } from "formik"
import * as Yup from "yup"
import { Container, Row, Col, Form} from 'react-bootstrap';
import axios from 'axios';
import { saveAs } from 'file-saver';

import LoadingPage from 'src/components/loadingPage/LoadingPage.js';
import createMarkup from 'src/utils/Markup.js';

import downloadRequest from 'src/api/download';

function Download(){
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false)
  const [downloadPageData, setDownloadPageData] = useState([])

  useEffect(() => {
    async function fetchData(){
      const result = await downloadRequest.downloadFind();
      setDownloadPageData(result.data.data.attributes)
      setIsLoading(false)
    }
    fetchData()
  },[]);

  const formik = useFormik({
    initialValues:{
      // fullName:"",
      name:"",
      email:"",
    },
    validationSchema:Yup.object({
      name: Yup.string()
      .min(2, '* Names must have at least 2 characters')
      .max(30, "* Names can't be longer than 30 characters")
      .required('* Full name is required'),
      email:Yup.string()
      .email('* Must be a valid email address')
      .max(100, '* Email must be less than 100 characters')
      .required('* Email is required'),
    }),
    onSubmit: (values,{resetForm})=>{

      axios.post(`${process.env.REACT_APP_strapiURL}/api/user-download`, {data:values})
        .then(resetForm())
        .then(setShow(true))
        .catch(err =>{console.error(err)})
      saveAs(
        `${process.env.REACT_APP_strapiURL}${downloadPageData.coinData.data.attributes.url}`,
        'AntiochCoins.zip'
      )
    }
  })

  if (isLoading) {return(<LoadingPage />);}

  return(
      <div id='download-page'>
          {/* <Row>
              <Alert className='download-alert green-text story-text text-center'  show={show} variant="success" onClose={() => setShow(false)} dismissible>
                  Data is downloading ...
              </Alert>
          </Row> */}
        <Container className='my-5'>

          <center>
            <h1>Download the Data</h1>
          </center>
          <Row className='d-flex justify-content-around align-items-center'>
            <Col xs={8}>
                {/* left */}
                <Row className='d-flex justify-content-around'>
                  <Col xs={3} className='text-center story-icon download-icon'>&#xe810;</Col>
                  <Col xs={9}>
                      {/* <h2>
                        DOWNLOAD THE DATASET
                      </h2> */}
                      <div className='story-text' dangerouslySetInnerHTML={createMarkup(downloadPageData.text) } />
                  </Col>
                </Row>
                <Row className=''>
                  <img
                    alt={'Download'}
                    className=''
                    src={`${process.env.REACT_APP_strapiURL}/uploads/Image_47_89dc6433d0.png?updated_at=2022-04-14T13:41:55.091Z`}
                  />
                </Row>
            </Col>
            <Col xs={4}>
              <Container className='d-flex flex-column align-items-center mx-5'>
                <Row className='text-center story-download-text my-5' style={{width:"80%"}}>
                    <b>Please provide your your name and email address in the form below to start the download.</b>
                </Row>
                <Row className='light-blue-background my-2 d-flex justify-content-center' >
                  <Form className='mx-2 my-3 px-5' onSubmit={formik.handleSubmit}>
                    <Form.Group className='mt-3'>
                      <Form.Label className='mb-3' htmlFor='name'>Full Name</Form.Label>
                      <Form.Control 
                        id = "name"
                        type='text'
                        onChange={formik.handleChange}
                        onBlur = {formik.handleBlur}
                        value = {formik.values.name}
                        className='form-control'
                      />
                      {formik.touched.name && formik.errors.name ? <div className="error-message">{formik.errors.name}</div>: null}
                    </Form.Group>
                    <Form.Group className='mt-4'>
                      <Form.Label className='mb-3' htmlFor='email'>Email Address</Form.Label>
                      <Form.Control 
                        type='email'
                        id='email'
                        onChange={formik.handleChange}
                        onBlur = {formik.handleBlur}
                        value = {formik.values.email}
                        className='form-control'
                      />
                      {formik.touched.email && formik.errors.email ? <div className="error-message">{formik.errors.email}</div>: null}
                    </Form.Group>
                      {/* <button type='submit' className='download-button my-5' disabled={!formik.isValid}>
                        Download Data
                      </button> */}
                    <center>
                      { show ? <div className='my-5' style={{fontSize:'18px'}}>Data is downloading </div> : <button type='submit' className='download-button my-5' disabled={!formik.isValid} >Submit</button>}
                    </center>
                  </Form>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
  );
}

export default Download;
