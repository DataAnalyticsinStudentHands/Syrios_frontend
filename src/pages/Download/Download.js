import React, {useEffect, useState} from 'react';
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
    const [fullName, setFullName] = useState('')
    const [userEmail, setEmail] = useState('')

    //console.log(fullName, userEmail)
    let formSub = undefined
    formSub = (
        <Container className='d-flex flex-column align-items-center'>
            <Row className='text-center'>
                <p>
                    Please provide your your name and email address in the form below to start the download.
                </p>
            </Row>
            <Row className='LightBlueBackground my-5 d-flex justify-content-center'>
                <form className='mx-5 my-3 px-5'>
                    <div className='form-group mt-4'>
                        <label className='GrayText' htmlFor='fullName'>Full Name:</label>
                        <br/>
                        <input 
                            id = "fullName"
                            type='text'
                            onChange={(e)=>setFullName(e.target.value)}
                            className='form-control'/>
                    </div>
                    <div className='form-group mt-4'>
                        <label className='GrayText' htmlFor='userEmail'>Email:</label>
                        <br/>
                        <input 
                            type='email'
                            id='userEmail'
                            onChange={(e)=>setEmail(e.target.value)}
                            className='form-control'/>
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
