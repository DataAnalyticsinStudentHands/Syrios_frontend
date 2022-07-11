import React from 'react';

import Footer from 'src/components/Footer';
import { Container, Row} from 'react-bootstrap';
const Toolbox = ()=>{
    return(
        <div id='tool-box' >
            <Container>
                <Row className='mb-5'>
                    <p className='story-h1 text-center'>
                        Tool Box
                    </p>
                </Row>
                <Row>
                    <p className='story-h2 text-center my-5'>
                        Working in process ...
                    </p>
                </Row>
            </Container>
            <Footer/>
        </div>
    )
}
export default Toolbox