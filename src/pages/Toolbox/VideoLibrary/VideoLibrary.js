import React from 'react';

import Footer from 'src/components/Footer';
import { Container, Row} from 'react-bootstrap';

const VideoLibrary = ()=>{
    return(
        <div id='video-library' >
            <Container>
                <Row className='mb-5'>
                    <p className='story-h1 text-center'>
                        Video Library
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
export default VideoLibrary