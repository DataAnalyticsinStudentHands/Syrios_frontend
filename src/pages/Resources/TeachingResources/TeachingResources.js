import React from 'react';

import Footer from 'src/components/Footer';
import { Container, Row, Col} from 'react-bootstrap';
const TeachingResources = ()=>{
    return(
        <div id='teaching-resources' >
            <Container>
                <Row className='mb-5'>
                    <p className='story-h1 text-center'>
                        Teaching Resources
                    </p>
                </Row>
                <Row className='d-flex justify-content-center'>
                    <Col xs={10} className='  text-center my-5 pb-5 red-box'>
                        <p className='story-h3 my-5 pb-5'>
                            The Teaching Resources Functionality is still under development.
                        </p>

                        <p className='story-text my-5'>

                        </p>
                    </Col>
                </Row>
            </Container>
            <Footer/>
        </div>
    )
}
export default TeachingResources
