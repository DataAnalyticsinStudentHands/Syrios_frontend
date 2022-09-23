import React, {useEffect, useState} from 'react';
import ReactPlayer from 'react-player';
// import ReactMarkdown from 'react-markdown';
import {Container,Row,Col} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FeedBackicon from 'src/components/constant/FeedBackIcon';
import LoadingPage from 'src/components/loadingPage/LoadingPage.js';
import Footer from 'src/components/footer/Footer.js';

import createMarkup from 'src/utils/Markup.js';
import landingRequest from 'src/api/landing';

function ImageIcon(props){
  return(
    <div className='bg-white landing-button-size p-3 m-3'>
        <Link to={props.link}>
          <div className='landing-button-img ' style={{ backgroundImage: `url(${process.env.REACT_APP_strapiURL}${props.imageSrc})` }}>
            <div className='on-hover-dim landing-buttons-text p-3'>
                {props.text}
            </div>
          </div>
        </Link>
    </div>
  )
}

function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [landingData, setLandingData] = useState([])

  useEffect(() => {
    async function fectchData(){
      const result = await landingRequest.landingdFind()
      setLandingData(result.data.data.attributes)
      setIsLoading(false)
    }
    fectchData()
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
    <>
    <FeedBackicon url="default"/>
      <div id='landing-page'>
        {/* Container is centered due to the above div classes. Container holds ALL of the information */}
        <center>
          <div className='story-text landing-green-paragraph'>
            Welcome to the prototype exhibit of SYRIOS, a digital humanities project of the University of Houston. This live site is not the finished exhibit, but rather an ongoing experiment exploring the intersection of historical material, usability/user-experience research, and web technology. 
           <br/> We welcome your feedback as we continue to develop new content, data, and digital interfaces for the study of ancient Syria and coins.
          </div>
        </center>

        <Container>
          <h2 className='text-center'>{landingData.title}</h2>
          <Row className='d-flex justify-content-around mt-5'>
            <Col xs={12} sm={8} id='landing-video' className='p-3'>
              <ReactPlayer width="100%" height="100%" url={landingData.video_link} />
            </Col>
            <Col xs={12} sm={4}>
                <Row className='align-items-center'>
                  {landingData.image_icons.map((icon)=>{
                    return(
                      <Col xs={12} sm={6} key={`landing-image-icon-${icon.id}`}>
                        <ImageIcon
                          id={icon.id}
                          link={icon.url_path}
                          imageSrc={icon.image.data.attributes.url}
                          text={icon.title}
                        />
                      </Col>
                    )
                  })}
                </Row>
            </Col>
          </Row>
          {/* Landing paragraph */}
          <Row className='justify-content-md-center mt-5'>
            <Col dangerouslySetInnerHTML={createMarkup(landingData.text)} className='landing-text'/>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default LandingPage;
