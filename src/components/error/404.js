import React from 'react';

import Footer from 'src/components/footer/Footer';
import { Container, Row} from 'react-bootstrap';
const ErrorPage = ()=>{
    return(
        <div id='error-page' className='d-flex align-items-center'>
            <Container>
                <Row className='mb-5'>
                    <p className='story-h1 text-center'>
                        404
                    </p>
                </Row>
                <Row>
                    <p className='story-h2 text-center my-5'>
                        Sorry, the page you visited does not exist.
                    </p>
                </Row>
            </Container>
            <Footer/>
        </div>
    )
}
export default ErrorPage
