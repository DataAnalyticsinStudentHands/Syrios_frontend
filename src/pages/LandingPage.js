import React, {useEffect, useState} from 'react';
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown';
import {
  Container,
  Row,
  Col
} from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Navbar from 'src/components/Navbar.js';
import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer.js';
import EvidenceBgPic from 'src/assets/pages/LandingPageAssets/Evidence.jpg';
import HistoriansToolboxBgPic from 'src/assets/pages/LandingPageAssets/HistoriansToolbox.jpg';
import HowToReadBgPic from 'src/assets/pages/LandingPageAssets/HowToRead.jpg';
import StoriesBgPic from 'src/assets/pages/LandingPageAssets/Stories.jpg';
import createMarkup from 'src/utils/markup.js';
import 'src/components/constants.css';
import './LandingPage.css';

function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [videoLink, setVideoLink] = useState(undefined);
  const [shortDescription, setShortDescription] = useState(undefined);
  const [LandingParagraph, setLandingParagraph] = useState(undefined);

  useEffect(() => {
    if (loading) {
      axios.get(process.env.REACT_APP_strapiURL + '/api/landing-page')
        .then((res, err) => {
          if (err) {
            console.error(err);
            return;
          }
          // This is where the landing page is defined via strapi
          let data = res.data.data.attributes;
          setVideoLink(data.video_link);
          setShortDescription(data.title);
          setLandingParagraph(data.text);
          setLoading(false);
        });
    }
  });


  // Render components here
  //
  // if loading is true, then display loading page
  // else display page with navbar and footer
  if (loading) {
    return (
      <div>
        <Navbar />
        <LoadingPage />
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div id='LandingPage' className='d-flex align-items-center'>
        {/* Container is centered due to the above div classes. Container holds ALL of the information */}
        <Container style={{height: '640px', paddingTop: '1em'}}>
          <Row container='justify-content-md-center'>
            {/* This is the title text in orage */}
            <Col>
              <div className='orange-text' style={{fontSize: '4em'}}>
                <ReactMarkdown>
                  {shortDescription}
                </ReactMarkdown>
              </div>
            </Col>
          </Row>
          <Row container='justify-content-md-center'>
            {/* This is the video */}
            <Col>
              <div id='LandingVideo'>
                <div id='LandingVideoSize'>
                  <ReactPlayer 
                    width='100%'
                    url={videoLink} />
                </div>
              </div>
            </Col>
            <Col>
              {/* Introduced a new container for the 4 buttons that way I can easily split the 4 buttons and have them spaced from eachother well*/}
              <Container style={{position: 'relative', left: '-20px', top: '-5px'}}>
                <Row>
                  {/* How to Read a Coin */}
                  <Col>
                    <div className='bg-white LandingButtonSize'>
                      <Link to='/HowToReadACoin'>
                        <div className='LandingButtonImg' style={{ backgroundImage: `url(${HowToReadBgPic})` }}>
                          <div className='OnHoverDim'>
                            <p className='bland-style bold-white-text LandingButtonsText'>
                              How to Read a Coin
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </Col>
                  {/* Discover Stories from Coins */}
                  <Col>
                    <div className='bg-white LandingButtonSize'>
                      <Link to='/Stories'>
                        <div className='LandingButtonImg' style={{ backgroundImage: `url(${StoriesBgPic})` }}>
                          <div className='OnHoverDim'>
                            <p className='bland-style bold-white-text LandingButtonsText'>
                              Discover Stories from Coins
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </Col>
                </Row>
                <Row>
                  {/* Explore the Evidence */}
                  <Col>
                    <div className='bg-white LandingButtonSize'>
                      <Link to='/Evidence/ExploreTheEvidence'>
                        <div className='LandingButtonImg' style={{ backgroundImage: `url(${EvidenceBgPic})` }}>
                          <div className='OnHoverDim'>
                            <p className='bland-style bold-white-text LandingButtonsText'>
                              Explore the Evidence
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </Col>
                  {/* Open the Historian's Toolbox */}
                  <Col>
                    <div className='bg-white LandingButtonSize'>
                      <Link to='/'>
                        <div className='LandingButtonImg' style={{ backgroundImage: `url(${HistoriansToolboxBgPic})` }}>
                          <div className='OnHoverDim'>
                            <p className='bland-style bold-white-text LandingButtonsText'>
                              Open the Historian's Toolbox
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
          {/* Landing paragraph */}
          <Row className='justify-content-md-center mt-5'>
            <Col>
                <div 
                  dangerouslySetInnerHTML={createMarkup(LandingParagraph)} 
                  className='blue-text' style={{fontSize:'1.3em'}}
                />
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
}

export default LandingPage;
