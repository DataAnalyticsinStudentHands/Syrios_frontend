import React, {useEffect, useState} from 'react';
import {
  Container,
  Row,
  Col
} from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import Navbar from 'src/components/Navbar.js';
import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer.js';

import './ExploreTheEvidence.css';



const ExploreTheEvidence = () => {
  const [isLoading, set_isLoading] = useState(true);
  const [page, set_page] = useState(undefined);

  useEffect(() => {
    if (isLoading) {
      axios.get(process.env.REACT_APP_strapiURL+'/explore-the-evidence')
        .then((res, error) => {
          if (error) {
            console.error(error);
          } else {
            console.log(res.data);
            set_page(
              <div id='ExploreTheEvidence'>
                <Container>
                  <Row>
                    <Col>
                      <p className='text-center BlueText' style={{ fontSize: '8em' }}>
                        {res.data.title}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    {/* SORT COINS */}
                    <Col>
                      <Link to='/'>
                        <img
                          alt={res.data.sort_coins_image.alternativeText !== undefined ? res.data.sort_coins_image.alternativeText : 'missing alt'}
                          src={process.env.REACT_APP_strapiURL+res.data.sort_coins_image.url}/>
                        <p className='OrangeText ExploreTheEvidenceTextWidthFix ExploreTheEvidenceTitleText'>
                          {res.data.sort_coins_title}
                        </p>
                        <ReactMarkdown className='GrayText ExploreTheEvidenceTextWidthFix ExploreTheEvidenceCaptionText'>
                          {res.data.sort_coins_caption}
                        </ReactMarkdown>
                      </Link>
                    </Col>
                    {/* MAP COINS */}
                    <Col>
                      <Link to='/'>
                        <img
                          alt={res.data.map_coins_image.alternativeText !== undefined ? res.data.map_coins_image.alternativeText : 'missing alt'}
                          src={process.env.REACT_APP_strapiURL+res.data.map_coins_image.url}/>
                        <p className='OrangeText ExploreTheEvidenceTextWidthFix ExploreTheEvidenceTitleText'>
                          {res.data.map_coins_title}
                        </p>
                        <ReactMarkdown className='GrayText ExploreTheEvidenceTextWidthFix ExploreTheEvidenceCaptionText'>
                          {res.data.map_coins_caption}
                        </ReactMarkdown>
                      </Link>
                    </Col>
                    {/* COIN TIMELINE */}
                    <Col>
                      <Link to='/Toolbox/Timeline'>
                        <img
                          alt={res.data.coin_timeline_image.alternativeText !== undefined ? res.data.coin_timeline_image.alternativeText : 'missing alt'}
                          src={process.env.REACT_APP_strapiURL+res.data.coin_timeline_image.url}/>
                        <p className='OrangeText ExploreTheEvidenceTextWidthFix ExploreTheEvidenceTitleText'>
                          {res.data.coin_timeline_title}
                        </p>
                        <ReactMarkdown className='GrayText ExploreTheEvidenceTextWidthFix ExploreTheEvidenceCaptionText'>
                          {res.data.coin_timeline_caption}
                        </ReactMarkdown>
                      </Link>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <hr />
                    </Col>
                  </Row>
                  {/* Download Dataset */}
                  <Row>
                    <Col id='ExploreTheEvidenceIconDownloadDiv'>
                      <Link to='/'> {/* I had to split the links because if I made it one big link, it was messing with the row and column math bootstrap was doing */}
                        <i id='ExploreTheEvidenceIconDownload' class='demo-icon icon-donwload'>&#xe810;</i>
                      </Link>
                    </Col>
                    <Col id='ExploreTheEvidenceTextDiv' className='d-flex align-items-center justify-content-start'>
                      <Link to='/'>{/* I had to split the links because if I made it one big link, it was messing with the row and column math bootstrap was doing */}
                        <p className='OrangeText ExploreTheEvidenceTitleText ExploreTheEvidenceDownloadDatasetTextWidthFix'>
                          {res.data.download_dataset_title}
                        </p>
                        <ReactMarkdown className='GrayText ExploreTheEvidenceCaptionText ExploreTheEvidenceDownloadDatasetTextWidthFix'>
                          {res.data.download_dataset_caption}
                        </ReactMarkdown>
                      </Link>
                    </Col>
                  </Row>
                </Container>
              </div>
            );
            set_isLoading(false);
          }
        });
    }
  });

  if (isLoading) {
    return (
      <>
        {Navbar()}
        {LoadingPage()}
        {Footer()}
      </>
    );
  }

  return (
    <>
      {Navbar()}
      {page}
      {Footer()}
    </>
  );
}

export default ExploreTheEvidence;
