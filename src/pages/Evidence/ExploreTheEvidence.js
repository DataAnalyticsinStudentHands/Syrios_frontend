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

  const [title, setTitle] = useState(undefined)

  const [sortCoinsImage, setSortCoinsImage] = useState(undefined)
  const [sortCoinsTitle, setSortCoinsTitle] =useState(undefined)
  const [sortCoinsCaption, setSortCoinsCaption] = useState(undefined)

  const [mapCoinsImage, setMapCoinsImage] = useState(undefined)
  const [mapCoinsTitle, setMapCoinsTitle] =useState(undefined)
  const [mapCoinsCaption, setMapCoinsCaption] = useState(undefined)

  const [coinTimelineImage, setCoinTimelineImage] = useState(undefined)
  const [coinTimelineTitle, setCoinTimelineTitle] =useState(undefined)
  const [coinTimelineCaption, setCoinTimelineCaption] = useState(undefined)

  const [downloadDatasetTitle, setDownloadDatasetTitle] = useState(undefined)
  const [downloadDatasetCaption, setDownloadDatasetCaption] =useState(undefined)

  useEffect(() => {
    if (isLoading) {
      axios.get(process.env.REACT_APP_strapiURL+'/api/explore-the-evidence')
        .then((res, error) => {
          if (error) {
            console.error(error);
          } else {
            let data = res.data.data.attributes
            setTitle(data.title)

            setSortCoinsImage(data.sort.image.data.attributes)
            setSortCoinsTitle(data.sort.title)
            setSortCoinsCaption(data.sort.caption)

            setMapCoinsImage(data.map.image.data.attributes)
            setMapCoinsTitle(data.map.title)
            setMapCoinsCaption(data.map.caption)

            setCoinTimelineImage(data.timeline.image.data.attributes)
            setCoinTimelineTitle(data.timeline.title)
            setCoinTimelineCaption(data.timeline.caption)

            setDownloadDatasetTitle(data.download_title)
            setDownloadDatasetCaption(data.download_caption)

            set_isLoading(false);
          }
        });
    }
  },[]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <LoadingPage />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div id='ExploreTheEvidence'>
                <Container>
                  <Row>
                    <Col>
                      <p className='text-center blue-text' style={{ fontSize: '8em' }}>
                        {title}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    {/* SORT COINS */}
                    <Col xs={4}>
                      <Link to='/Evidence/CoinSort'>
                        <img
                          alt={sortCoinsImage.alternativeText !== undefined ? sortCoinsImage.alternativeText : 'missing alt'}
                          src={process.env.REACT_APP_strapiURL+sortCoinsImage.url}
                          style={{width:'300px'}}
                          />
                        <p className='orange-text ExploreTheEvidenceTextWidthFix ExploreTheEvidenceTitleText'>
                          {sortCoinsTitle}
                        </p>
                        <ReactMarkdown className='gray-text ExploreTheEvidenceTextWidthFix ExploreTheEvidenceCaptionText'>
                          {sortCoinsCaption}
                        </ReactMarkdown>
                      </Link>
                    </Col>
                    {/* MAP COINS */}
                    <Col xs={4}>
                      <Link to='/'>
                        <img
                          alt={mapCoinsImage.alternativeText !== undefined ? mapCoinsImage.alternativeText : 'missing alt'}
                          src={process.env.REACT_APP_strapiURL+mapCoinsImage.url}
                          style={{width:'300px'}}
                        />
                        <p className='orange-text ExploreTheEvidenceTextWidthFix ExploreTheEvidenceTitleText'>
                          {mapCoinsTitle}
                        </p>
                        <ReactMarkdown className='gray-text ExploreTheEvidenceTextWidthFix ExploreTheEvidenceCaptionText'>
                          {mapCoinsCaption}
                        </ReactMarkdown>
                      </Link>
                    </Col>
                    {/* COIN TIMELINE */}
                    <Col xs={4}>
                      <Link to='/Toolbox/Timeline'>
                        <img
                          alt={coinTimelineImage.alternativeText !== undefined ? coinTimelineImage.alternativeText : 'missing alt'}
                          src={process.env.REACT_APP_strapiURL+coinTimelineImage.url}
                          style={{width:'300px'}}
                          />
                        <p className='orange-text ExploreTheEvidenceTextWidthFix ExploreTheEvidenceTitleText'>
                          {coinTimelineTitle}
                        </p>
                        <ReactMarkdown className='gray-text ExploreTheEvidenceTextWidthFix ExploreTheEvidenceCaptionText'>
                          {coinTimelineCaption}
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
                      <Link to='/Download'> {/* I had to split the links because if I made it one big link, it was messing with the row and column math bootstrap was doing */}
                        <i id='ExploreTheEvidenceIconDownload' className='demo-icon icon-donwload'>&#xe810;</i>
                      </Link>
                    </Col>
                    <Col id='ExploreTheEvidenceTextDiv' className='d-flex align-items-center justify-content-start'>
                      <Link to='/Download'>{/* I had to split the links because if I made it one big link, it was messing with the row and column math bootstrap was doing */}
                        <p className='orange-text ExploreTheEvidenceTitleText ExploreTheEvidenceDownloadDatasetTextWidthFix'>
                          {downloadDatasetTitle}
                        </p>
                        <ReactMarkdown className='gray-text ExploreTheEvidenceCaptionText ExploreTheEvidenceDownloadDatasetTextWidthFix'>
                          {downloadDatasetCaption}
                        </ReactMarkdown>
                      </Link>
                    </Col>
                  </Row>
                </Container>
              </div>
      <Footer />
    </>
  );
}

export default ExploreTheEvidence;
