import React, {useEffect, useState} from 'react';
import { useFormik } from "formik"
import * as Yup from "yup"
import { Container, Row, Col, Alert} from 'react-bootstrap';
import axios from 'axios';
import { saveAs } from 'file-saver';

import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer';
import createMarkup from 'src/utils/Markup.js';

import downloadRequest from 'src/api/download';
import zoteroRequest from 'src/api/zotero';

function Download(){
  const [isLoading, setIsLoading] = useState(true);

  const [submitButton, setSubmitButton] = useState(false)
  const [show, setShow] = useState(false)

  const [downloadPageData, setDownloadPageData] = useState([])
  const [storyReference, setStoryReference] = useState([])
  const [storyImageSouce]= useState([])

  useEffect(() => {
    async function fetchData(){
      const result = await downloadRequest.downloadFind();
      createZoteroReference(result.data.data.attributes)
      setDownloadPageData(result.data.data.attributes)
      setIsLoading(false)
    }
    fetchData()
  },[]);

  async function createZoteroReference(resultData){
    let itemkeys = []
    resultData.references.data.forEach((reference)=>{itemkeys.push(reference.attributes.item_key)})
    let bibArr = []
    for (const itemkey of itemkeys){
      const data = await zoteroRequest.getOneItemBib(itemkey)
      bibArr.push(data.data)
    }
    bibArr = bibArr.sort()
    setStoryReference(bibArr)
  }

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
      values.emailSubject=downloadPageData.emailSubject
      values.emailTo=downloadPageData.emailTo
      axios.post(process.env.REACT_APP_strapiURL + '/api/download', values)
        .then(resetForm())
        .then(setSubmitButton(true))
        .then(setShow(true))
        .catch(err =>{console.error(err)})

      saveAs(
        `${process.env.REACT_APP_strapiURL}${downloadPageData.coinData.data.attributes.url}`,
        'AntiochCoins.zip'
      )
    }
  })

  if (isLoading) {
    return(
      <>
        <LoadingPage />
        <Footer />
      </>
    );
  }

  return(
    <>
      <div id='download-page' className='d-flex align-items-center'>
        <Container className='my-5'>
          <Row>
              <Alert className='green-text' show={show} variant="success" onClose={() => setShow(false)} dismissible>
                  Data is downloading ...
              </Alert>
          </Row>
          <Row className='mb-5'>
            <p className='story-h1 text-center'>
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
                    <Row className='story-h4'>
                      <div>
                      {downloadPageData.title}
                      </div>
                    </Row>
                    <Row className='story-caption'>
                      {/* {subText} */}
                      <div dangerouslySetInnerHTML={createMarkup(downloadPageData.text)} />
                    </Row>
                  </Col>
                </Row>

                <Row className=''>
                  <img
                    alt={downloadPageData.image.data.attributes.alternativeText}
                    className='frame-image'
                    src={`${process.env.REACT_APP_strapiURL}${downloadPageData.image.data.attributes.url}`}
                  />
                </Row>
            </Col>
            <Col xs={4}>
              <Container className='d-flex flex-column align-items-center mx-5'>
                <Row className='text-center story-download-text px-4'>
                    <b>Please provide your your name and email address in the form below to start the download.</b>
                </Row>
                <Row className='light-blue-background my-2 d-flex justify-content-center' >
                  <form className='mx-2 my-3 px-5' onSubmit={formik.handleSubmit}>
                    <div className='form-group mt-3'>
                      <label className='' htmlFor='fullName'>Full Name</label>
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
                      <label className='' htmlFor='email'>Email Address</label>
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
      <Footer 
      	references={storyReference}
        imageReference={storyImageSouce}
      />
    </>
  );
}

export default Download;
