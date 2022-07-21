import React from 'react';

import Footer from 'src/components/Footer';
import { Container, Row, Col} from 'react-bootstrap';
const CoinCatalog = ()=>{
    return(
        <div id='coin-catalog' >
            <Container>
                <Row className='mb-5'><p className='story-h1 text-center'>Coin Catalog</p></Row>
                <Row className='d-flex justify-content-center'>
                    <Col xs={10} className='  text-center my-5 pb-5 red-box'>
                        <p className='story-h3 my-5 pb-5'>The Coin Catalog Functionality is still under development.</p>
                        <p className='story-text my-5'>
                            
                        </p>
                    </Col>
                </Row>
            </Container>
            <Footer/>
        </div>
    )
}
export default CoinCatalog
