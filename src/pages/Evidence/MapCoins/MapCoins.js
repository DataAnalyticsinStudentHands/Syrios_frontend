import React from 'react';

import Footer from 'src/components/Footer';
import { Container, Row} from 'react-bootstrap';
import baskMap from 'src/assets/base-map.png'
const MapCoins = ()=>{
    return(
        <div id='map-coins' >
            <Container>
                <Row className='mb-5'>
                    <p className='story-h1 text-center'>
                        Map Coins
                    </p>
                </Row>
                <Row>
                    <p className='story-h2 text-center my-5'>
                        Coming Soon ...
                    </p>
                </Row>
                <Row className='d-flex justify-content-center'><img src={`${baskMap}`} alt={'base-map'} className="map-image " /></Row>

            </Container>
            <Footer/>
        </div>
    )
}
export default MapCoins
