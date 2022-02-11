import React, {useEffect, useState} from 'react';
import { useFormik } from "formik"
import * as Yup from "yup"
import {
	Container,
	Row,
	Col
} from 'react-bootstrap';
import axios from 'axios';

import Navbar from 'src/components/Navbar';
import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer';

import './Download.css';




function Download(){
    const [page, set_page] = useState(undefined);
    const [isLoading, set_isLoading] = useState(true);

    useEffect(()=>{
        if(isLoading){
            axios.get(process.env.REACT_APP_strapiURL + '/download')
                .then((res)=>{
                    let data = res.data
                    //console.log(data);
                    set_page(
                            <div>
                            {/* left */}
                                <Row className='d-flex justify-content-between align-items-center'>
                                    <Col xs={2} className='text-center'>
                                        <i
                                            className='demo-icon icon-coin-scale downLoadIcon'
                                        >
                                        &#xe810;</i>
                                    </Col>
                                    <Col xs={9}>
                                        <Row className='OrangeText' id='downLoad_Sub_Title'>
                                            {data.sub_title}
                                        </Row>
                                        <Row className='GrayText' id='downLoad_Sub_Text'>
                                            {data.sub_text}
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='my-5'>
                                    <img
                                        alt={data.image.alternativeText === undefined ? 'img' : data.image.alternativeText}
                                        className='FrameImage'
                                        src={`${process.env.REACT_APP_strapiURL}${data.image.url}`} 
                                    />
                                </Row>
                            </div>
                    );

                    set_isLoading(false);
                });
        }
    });

    const formik = useFormik({
        initialValues:{
            fullName:"",
            userEmail:""
        },
        validationSchema:Yup.object({
            fullName: Yup.string()
                .min(7, '* Names must have at least 7 characters')
                .max(30, "* Names can't be longer than 100 characters")
                .required('* Full name is required'),
            userEmail:Yup.string()
                .email('* Must be a valid email address')
                .max(100, '* Email must be less than 100 characters')
                .required('* Email is required'),
        }),
        onSubmit:(values)=>{
            console.log(values)
        }
    })

    //console.log(formik.touched)

    let formSub = undefined
    formSub = (
        <Container className='d-flex flex-column align-items-center'>
            <Row className='text-center'>
                <p>
                    Please provide your your name and email address in the form below to start the download.
                </p>
            </Row>
            <Row className='LightBlueBackground my-5 d-flex justify-content-center'>
                <form className='mx-2 my-3 px-5' onSubmit={formik.handleSubmit} >
                    <div className='form-group mt-4'>
                        <label className='GrayText' htmlFor='fullName'>Full Name:</label>
                        <br/>
                        <input 
                            id = "fullName"
                            type='text'
                            onChange={formik.handleChange}
                            onBlur = {formik.handleBlur}
                            value = {formik.values.fullName}
                            className='form-control'
                        />
                        {formik.touched.fullName && formik.errors.fullName ? <p>{formik.errors.fullName}</p>: null}
                    </div>
                    <div className='form-group mt-4'>
                        <label className='GrayText' htmlFor='userEmail'>Email:</label>
                        <br/>
                        <input 
                            type='email'
                            id='userEmail'
                            onChange={formik.handleChange}
                            onBlur = {formik.handleBlur}
                            value = {formik.values.userEmail}
                            className='form-control'
                        />
                        {formik.touched.userEmail && formik.errors.userEmail ? <p>{formik.errors.userEmail}</p>: null}
                    </div>
                    
                    <div className='text-center mt-5'>
                        <button type='submit' className=''>
                            Submit
                        </button>
                    </div>

                </form>
            </Row>
        </Container>
    )
    
    if (isLoading) {
        return(
            <>
                {Navbar()}
                {LoadingPage()}
                {Footer()}
            </>
        );
    }

    return(
        <>
            {Navbar()}
            <div id='downloadPage' className='d-flex align-items-center'>
                <Container className='justify-content-sm-center my-5'>
                    <Row>
                        <p className='BlueText text-center' id='DownloadTitle'>
                            Download the Data 
                        </p>
                    </Row>
                    <Row className='d-flex justify-content-between d-flex align-items-center'>
                        <Col xs={8}>
                            {page}
                        </Col>
                        <Col xs={3}>
                            {formSub}
                        </Col>
                    </Row>

                </Container>

            </div>
			{Footer()}
        </>
    );
	
}

export default Download;
