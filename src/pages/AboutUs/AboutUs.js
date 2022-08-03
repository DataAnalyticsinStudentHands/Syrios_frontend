import React, { useState, useEffect } from 'react';
import {Container,Row, Col} from 'react-bootstrap';

import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer.js';
import aboutUsRequest from 'src/api/about-us';

function createMarkup(textTran){
  return {__html: textTran};
}

const About = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [aboutUsData, setAboutUsData] = useState([])

  useEffect(() => {
    async function fetchData (){
      const result = await aboutUsRequest.aboutUsFind()
      // console.log(result.data.data.attributes)
      setAboutUsData(result.data.data.attributes)
      setIsLoading(false)
    }
    fetchData().catch(console.error);
  },[]);


  if (isLoading) { 
    return (
      <>
        <LoadingPage />
        <Footer />
      </>
    );
  }
  return (
    <div id='teaching-resources' >
      <Container>
          <Row className='mb-5'>
              <h1 className='story-h1 text-center'>
                  About Us
              </h1>
          </Row>
          <Row className='d-flex justify-content-center'>
              <Col xs={10} className='  text-center my-5 pb-5 red-box'>
                  <h3 className='my-5 pb-5'>
                  The About Us page is currently under development mode.
                  </h3>

                  <p className='story-text my-5'>

                  </p>
              </Col>
          </Row>
      </Container>
      <Footer/>
    </div>
  );
}

export default About;
