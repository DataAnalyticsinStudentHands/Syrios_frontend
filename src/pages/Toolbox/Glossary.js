import React from 'react';
import Footer from 'src/components/Footer.js'
// import LoadingPage from 'src/components/LoadingPage.js';

// import axios from 'axios';

import { Container, Row, Col, Form, InputGroup, Button, Tabs, Tab} from 'react-bootstrap';
import { useFormik } from "formik"
import * as Yup from "yup"


const Glossary = () =>{

    // const [isGlassoryLoading, setIsGlossaryLoading] = useState(true)
    // const [glossaryDescription, setGlossaryDescription] = useState(undefined)

    // useEffect(()=>{
    //     if(isGlassoryLoading){
    //         axios.get(process.env.REACT_APP_strapiURL + '/api/glossaries')
    //         .then((res)=>{
    //             console.log(res)
    //             setGlossaryDescription(res.data.data.attributes.glossary_description)
    //             setIsGlossaryLoading(false)
    //             console.log(glossaryDescription)
    //         })
    //     }
    // })


    // if (isGlassoryLoading ){
    //     return(
    //         <>
    //         <Navbar />
    //         <LoadingPage />
    //         <Footer />
    //       </>
    //     )
    // }

    const formik = useFormik({
        initialValues:{
            text:''
        },
        validationSchema:Yup.object({
            text:Yup.string()
        }),
        onSubmit:(values)=>{
            console.log(values)
        }
    })

    return(
        <>
            <div id='glossary-page' className='d-flex align-items-center'>
                <Container>
                    <Row >
                        <p className='story-h1 text-center'>
                            Glossary
                        </p>
                    </Row>
                    <Row className='d-flex justify-content-between align-items-center'>
                        <Col xs={2}>
                            <i className='demo-icon icon-coin-scale glossary-icon'>
                                &#xe817;
                            </i>
                        </Col>
                        <Col xs={10} className='gray-text story-caption'>
                            Explorethisglossary to learn about terms related to coins, the ancient world, historical investigation, and archaeology. Begin by searching for a term, selecting a category, or clicking through the tabs. 
                        </Col>
                    </Row>
                    <Row className='mt-3'>
                        <Form onSubmit={formik.handleSubmit} style={{width:'25%', marginRight: '10px'}}>
                            <InputGroup className='mb-1'>
                                <Form.Control
                                    name='text'
                                    size='sm'  
                                    type='search' 
                                    placeholder='search'
                                    value={formik.values.text}
                                    onChange={formik.handleChange}
                                />
                                <Button type='submit'className='text-center bg-white border border-left-0'>
                                    <i className='demo-icon icon-coin-scale search-icon '>
                                        &#xe827;
                                    </i>
                                </Button>
                            </InputGroup>
                        </Form>
                    </Row>
                    <Row>
                    <Tabs 
                        id="glossary-tabs"
                        className="mb-3 gray-text"

                    >
                        <Tab eventKey="All" title="All">
                            <Row>
                                <Col xs={2} className="story-bullets">A</Col>
                                <Col xs={6}>
                                    <Row>
                                        <Col xs={3}>
                                            Coin
                                        </Col>
                                        <Col xs={3}>
                                            Coin 1
                                        </Col>
                                        <Col xs={3}>
                                            Coin 1
                                        </Col>
                                        <Col xs={3}>
                                            Coin 1
                                        </Col>
                                        <Col xs={3}>
                                            Coin 1
                                        </Col>
                                        <Col xs={3}>
                                            Coin 1
                                        </Col>
                                        <Col xs={3}>
                                            Coin 1
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <hr/>
                        </Tab>
                        <Tab eventKey="ABC" title="ABC">
                        ABC
                        </Tab>
                        <Tab eventKey="DEF" title="DEF">
                        DEF
                        </Tab>
                        <Tab eventKey="GHI" title="GHI">
                        GHI
                        </Tab>
                        <Tab eventKey="JKL" title="JKL">
                        JKL
                        </Tab>
                        <Tab eventKey="MNO" title="MNO">
                        MNO
                        </Tab>
                        <Tab eventKey="PQRS" title="PQRS">
                        PQRS
                        </Tab>
                        <Tab eventKey="TUV" title="TUV">
                        TUV
                        </Tab>
                        <Tab eventKey="WXYZ" title="WXYZ">
                        WXYZ
                        </Tab>
                    </Tabs>

                    </Row>
                </Container>
            </div>
            <Footer/>
        </>
    )
}

export default Glossary;
