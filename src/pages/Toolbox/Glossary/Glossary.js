/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import Footer from 'src/components/Footer.js'
import LoadingPage from 'src/components/LoadingPage.js';
import glossaryRequest from 'src/api/glossary';

import { Container, Row, Col, Form, InputGroup, Button, Modal,
    Tab, Tabs, ListGroup} from 'react-bootstrap';
import { useFormik } from "formik"
import * as Yup from "yup"

function GlossaryModal(props){
    if(props.term.attributes){
        const term = props.term.attributes
        return(
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                {/* <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Modal heading
                    </Modal.Title>
                </Modal.Header> */}
                <Modal.Body style={{padding:"50px"}}>
                    <Container className='glossary-modal'>
                        <Row>
                            <Col className='glossary-modal-term'>
                                {term.term}
                            </Col></Row>
                        <Row className='glossary-term-basic d-flex justify-content-start'>
                            <Col>{term.type} | {term.syllabication} | {term.sounds_like}</Col>
                            {/* <Col xs={1}>{term.syllabication}</Col> */}
                            {/* <Col xs={1}>{term.sounds_like}</Col> */}
                        </Row>
                        <Row className='glossary-term-title'>DEFINITION</Row>
                        <Row></Row>
                        <Row className='glossary-term-title'>Related Words</Row>
                        <Row className='glossary-term-title'>See Word in Context</Row>
                    </Container>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer> */}
            </Modal>
        )
    }
    return(<></>)

}

const Glossary = () =>{

    const [key, setKey] = useState('All');
    const [isLoading, setIsLoading] = useState(true)
    const [glossaryAllData, setGlossaryAllData]=useState([])
    // const [show, setShow]=useState(false)
    const [modalShow, setModalShow] = useState(false);
    const [term, setTerm] = useState([])


    // const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    const alphabetGroup = ["ABC","DEF","GHI","JKL","MNO","PQRS","TUV","WXYZ"];

    useEffect(()=>{
        async function fetchData(){
            // if(isLoading === false) setIsLoading(true)
            const result = await glossaryRequest.glossaryTagFind()
            let data = result.data.data
            // const result = await glossaryRequest.glossaryTagFind()
            function compare(a,b){
                if ( a.attributes.alphabet < b.attributes.alphabet ){return -1;}
                if ( a.attributes.alphabet > b.attributes.alphabet ){return 1;}
                return 0;}
            data =  data.sort(compare)
            // console.log(data[2].attributes.glossaries.data[0])
            setGlossaryAllData(data)
            // setTerm(data[2].attributes.glossaries.data[0])
            setIsLoading(false)
        }
        fetchData()
    },[])


    async function handleModal (item){
        // console.log('This item is clicked',item)
        setTerm(item)
        setModalShow(true)
    }

    // async function handleAll(){
    //     const result = await glossaryRequest.glossaryTagFind()
    //     let data = result.data.data
    //     // const result = await glossaryRequest.glossaryTagFind()
    //     function compare(a,b){
    //         if ( a.attributes.alphabet < b.attributes.alphabet ){return -1;}
    //         if ( a.attributes.alphabet > b.attributes.alphabet ){return 1;}
    //         return 0;}
    //     data =  data.sort(compare)
    //     // console.log(data)
    //     setGlossaryAllData(data)
    //     setIsLoading(false)
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

    if (isLoading) return (
        <>
          <LoadingPage />
          <Footer />
        </>
      );
    return(
        <>
            <div id='glossary-page'>
                <Container>
                    <Row className='mt-5'>
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
                        <Col xs={10} className='story-text'>
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
                        <GlossaryModal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                            term={term}
                        />
                    <Tabs 
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="d-flex justify-content-center story-text"
                    >
                        <Tab eventKey="All" title="All" >
                            <ListGroup as='ul'>
                                {glossaryAllData.map((item)=>{
                                    return(<>
                                            {item.attributes.glossaries.data.length ===0 ?(<>
                                            </>):(<>
                                                <ListGroup.Item as='li' eventKey={item.id} key={`${item.id}`}>
                                                    <Row key={item.id}>
                                                        <Col xs={2} className="glossary-alphabet d-flex justify-content-center align-items-center">{item.attributes.alphabet}</Col>
                                                        <Col xs={6}>
                                                            <Row className='glossary-term'>
                                                                {item.attributes.glossaries.data ? (<>
                                                                    {item.attributes.glossaries.data.map((item)=>{
                                                                        return(<Col xs={3} key={`${item.attributes.term}`} >
                                                                                <button onClick={()=>handleModal(item)}>{item.attributes.term}</button>
                                                                                </Col>)
                                                                    })}
                                                                </>):(<></>)}
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            </>)}
                                        </>)
                                })}
                            </ListGroup>
                        </Tab>
                        {alphabetGroup.map((alphabet)=>{
                            return(
                                <Tab eventKey={alphabet} title={alphabet}>
                                    <ListGroup as='ul'>
                                    {glossaryAllData.map((item)=>{
                                        return(<>
                                            {item.attributes.alphabet_group === key ? (<>
                                                {item.attributes.glossaries.data.length ===0 ?(<>
                                                    </>):(<>
                                                        <ListGroup.Item as='li' eventKey={`${item.attributes.alphabet}-${item.id}`} key={`${item.attributes.alphabet}-${item.id}`}>
                                                            <Row >
                                                                <Col xs={2} className="glossary-alphabet d-flex justify-content-center align-items-center">{item.attributes.alphabet}</Col>
                                                                <Col xs={6}>
                                                                    <Row className='glossary-term'>
                                                                        {item.attributes.glossaries.data ? (<>
                                                                            {item.attributes.glossaries.data.map((item)=>{
                                                                                return(
                                                                                    <Col xs={3} key={`${item.attributes.term}`}>
                                                                                        <button onClick={()=>handleModal(item)}>{item.attributes.term}</button>
                                                                                    </Col>
                                                                                )
                                                                            })}
                                                                        </>):(<></>)}
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </ListGroup.Item>
                                                    </>)}
                                            </>):(<></>)}
                                        </>)
                                    })}
                                    </ListGroup>
                                </Tab>
                            )
                        })}
                    </Tabs>

                    </Row>
                </Container>
            </div>
            <Footer/>
        </>
    )
}

export default Glossary;
