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
      axios.get(process.env.REACT_APP_strapiURL+'/explore-the-evidence')
        .then((res, error) => {
          if (error) {
            console.error(error);
          } else {
            let data = res.data
            // console.log(data)

            setTitle(data.title)

            setSortCoinsImage(data.sort_coins_image)
            setSortCoinsTitle(data.sort_coins_title)
            setSortCoinsCaption(data.sort_coins_caption)

            setMapCoinsImage(data.map_coins_image)
            setMapCoinsTitle(data.map_coins_title)
            setMapCoinsCaption(data.map_coins_caption)

            setCoinTimelineImage(data.coin_timeline_image)
            setCoinTimelineTitle(data.coin_timeline_title)
            setCoinTimelineCaption(data.coin_timeline_caption)

            setDownloadDatasetTitle(data.download_dataset_title)
            setDownloadDatasetCaption(data.download_dataset_caption)

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
      {/* {page} */}
      <div id='ExploreTheEvidence'>
                <Container>
                  <Row>
                    <Col>
                      <p className='text-center BlueText' style={{ fontSize: '8em' }}>
                        {title}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    {/* SORT COINS */}
                    <Col>
                      <Link to='/Evidence/CoinSort'>
                        <img
                          alt={sortCoinsImage.alternativeText !== undefined ? sortCoinsImage.alternativeText : 'missing alt'}
                          src={process.env.REACT_APP_strapiURL+sortCoinsImage.url}/>
                        <p className='OrangeText ExploreTheEvidenceTextWidthFix ExploreTheEvidenceTitleText'>
                          {sortCoinsTitle}
                        </p>
                        <ReactMarkdown className='GrayText ExploreTheEvidenceTextWidthFix ExploreTheEvidenceCaptionText'>
                          {sortCoinsCaption}
                        </ReactMarkdown>
                      </Link>
                    </Col>
                    {/* MAP COINS */}
                    <Col>
                      <Link to='/'>
                        <img
                          alt={mapCoinsImage.alternativeText !== undefined ? mapCoinsImage.alternativeText : 'missing alt'}
                          src={process.env.REACT_APP_strapiURL+mapCoinsImage.url}/>
                        <p className='OrangeText ExploreTheEvidenceTextWidthFix ExploreTheEvidenceTitleText'>
                          {mapCoinsTitle}
                        </p>
                        <ReactMarkdown className='GrayText ExploreTheEvidenceTextWidthFix ExploreTheEvidenceCaptionText'>
                          {mapCoinsCaption}
                        </ReactMarkdown>
                      </Link>
                    </Col>
                    {/* COIN TIMELINE */}
                    <Col>
                      <Link to='/Toolbox/Timeline'>
                        <img
                          alt={coinTimelineImage.alternativeText !== undefined ? coinTimelineImage.alternativeText : 'missing alt'}
                          src={process.env.REACT_APP_strapiURL+coinTimelineImage.url}/>
                        <p className='OrangeText ExploreTheEvidenceTextWidthFix ExploreTheEvidenceTitleText'>
                          {coinTimelineTitle}
                        </p>
                        <ReactMarkdown className='GrayText ExploreTheEvidenceTextWidthFix ExploreTheEvidenceCaptionText'>
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
                        <p className='OrangeText ExploreTheEvidenceTitleText ExploreTheEvidenceDownloadDatasetTextWidthFix'>
                          {downloadDatasetTitle}
                        </p>
                        <ReactMarkdown className='GrayText ExploreTheEvidenceCaptionText ExploreTheEvidenceDownloadDatasetTextWidthFix'>
                          {downloadDatasetCaption}
                        </ReactMarkdown>
                      </Link>
                    </Col>
                  </Row>
                </Container>
              </div>
      {Footer()}
    </>
  );
}

export default ExploreTheEvidence;
