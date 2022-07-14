import React from 'react';

import Footer from 'src/components/Footer';
import { Container, Row} from 'react-bootstrap';
const CoinCatalog = ()=>{
    return(
        <div id='coin-catalog' >
            <Container>
                <Row className='mb-5'>
                    <p className='story-h1 text-center'>
                        Coin Catalog
                    </p>
                </Row>
                <Row>
                    <p className='story-h2 text-center my-5'>
                        Coming Soon ...
                    </p>
                </Row>
            </Container>
            <Footer/>
        </div>
    )
}
export default CoinCatalog
