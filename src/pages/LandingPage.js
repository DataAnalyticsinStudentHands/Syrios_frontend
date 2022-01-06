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
import 'src/components/constants.css';
import './LandingPage.css';

function LandingPage() {
  const [loading, set_loading] = useState(true);
  const [page, set_page] = useState(undefined);

  useEffect(() => {
    if (loading) {
      axios.get(process.env.REACT_APP_strapiURL + '/landing-page')
        .then((res) => {
          // This is where the landing page is defined via strapi
          set_page(
            <div id='LandingPage' className='d-flex align-items-center'>
              {/* Container is centered due to the above div classes. Container holds ALL of the information */}
              <Container style={{height: '640px', paddingTop: '1em'}}>
                <Row container='justify-content-md-center'>
                  {/* This is the title text in orage */}
                  <Col>
                    <div className='OrangeText' style={{fontSize: '4em'}}>
                      <ReactMarkdown>
                        {res.data.shortDescription}
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
                          url={res.data.videoLink} />
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
                                  <p className='blandStyle BoldWhiteText LandingButtonsText'>
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
                                  <p className='blandStyle BoldWhiteText LandingButtonsText'>
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
                                  <p className='blandStyle BoldWhiteText LandingButtonsText'>
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
                                  <p className='blandStyle BoldWhiteText LandingButtonsText'>
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
                <Row container='justify-content-md-center'>
                  <Col>
                    <div className='BlueText' style={{fontSize:'1.3em'}}>
                      <ReactMarkdown>
                        {res.data.LandingParagraph}
                      </ReactMarkdown>
                    </div>

                  </Col>
                </Row>
              </Container>
            </div>
          );

          set_loading(false);
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
        {Navbar()}
        {LoadingPage()}
        {Footer()}
      </div>
    );
  }

  return (
    <div>
      {Navbar()}
      {page}
      {Footer()}
    </div>
  );
}

export default LandingPage;
