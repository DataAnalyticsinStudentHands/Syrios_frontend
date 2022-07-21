import React from 'react';

import Footer from 'src/components/Footer';
import { Container, Row, Col} from 'react-bootstrap';
// import baskMap from 'src/assets/base-map.png'
const MapCoins = ()=>{
    return(
        <div id='map-coins' >
            <Container>
                <Row className='mb-5'>
                    <p className='story-h1 text-center'>
                        Map Coins
                    </p>
                </Row>
                <Row className='d-flex justify-content-center'>
                    <Col xs={10} className='  text-center my-5 pb-5 red-box'>
                        <p className='story-h3 my-5 pb-5'>
                        The Map Coins Functionality is still under development.
                        </p>

                        <p className='story-text my-5'>

                        </p>
                    </Col>
                </Row>
                {/* <Row className='d-flex justify-content-center'><img src={`${baskMap}`} alt={'base-map'} className="map-image " /></Row> */}

            </Container>
            <Footer/>
        </div>
    )
}
export default MapCoins
