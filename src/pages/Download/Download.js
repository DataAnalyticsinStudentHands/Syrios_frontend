import React, {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';
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
                    console.log(data);
                    set_page(
                        <div id='downloadPage' className='d-flex align-items-center'>
                            <Container>
                                <Row container='justify-content-sm-center my-5'>
                                    <Col>
                                        <p className='BlueText text-center' id='DownloadTitle'>
                                            {data.title}
                                        </p>
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-between'>
                                    {/* left */}
                                    <Col xs={8}>
                                        <Row className='d-flex justify-content-between align-items-center'>
                                            <Col xs={2} className='text-center'>
                                                <i
                                                    className='demo-icon icon-coin-scale downLoadIcon'
                                                >
                                                &#xe832;</i>
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
                                    </Col>
                                    {/* Right */}
                                    <Col xs={3} className='d-flex flex-column align-items-center'>
                                        <Row className='text-center'>
                                            {data.email_text}
                                        </Row>
                                        <Row className='LightBlueBackground mt-5 d-flex justify-content-center'>
                                            <form className='mx-5 my-3'>
                                                <div className='form-group mt-4'>
                                                    <label className='GrayText' for='userEmail'>Full Name:</label>
                                                    <br/>
                                                    <input type={'text'} value={''} id={'userName'} className='form-control'/>
                                                </div>
                                                <div className='form-group mt-4'>
                                                    <label className='GrayText' for='userEmail'>Email:</label>
                                                    <br/>
                                                    <input type={'email'} value={''} id={'userEmail'} className='form-control'/>

                                                </div>
                                                
                                                <div className='text-center mt-5'>
                                                    <button type='submit' className=''>
                                                        Submit
                                                    </button>
                                                </div>

                                            </form>
                                        </Row>

                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    );

                    set_isLoading(false);
                });
        }
    });
    
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
            {page}
			{Footer()}
        </>
    );
	
}

export default Download;
