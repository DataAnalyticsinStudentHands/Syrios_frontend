import React, {useEffect, useState} from 'react';
import {
  Container,
  Row,
  Col
} from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer.js';

const ExploreTheEvidence = () => {
  const [is_loading, set_is_loading] = useState(true);

  const [title, set_title] = useState(undefined)

  const [sort_coins_image, set_sort_coins_image] = useState(undefined)
  const [sort_coins_title, set_sort_coins_title] =useState(undefined)
  const [sort_coins_caption, set_sort_coins_caption] = useState(undefined)

  const [map_coins_image, set_map_coins_image] = useState(undefined)
  const [map_coins_title, set_map_coins_title] =useState(undefined)
  const [map_coins_caption, set_map_coins_caption] = useState(undefined)

  const [coin_timeline_image, set_coin_timeline_image] = useState(undefined)
  const [coin_timeline_title, set_coin_timeline_title] =useState(undefined)
  const [coin_timeline_caption, set_coin_timeline_caption] = useState(undefined)

  const [download_dataset_title, set_download_dataset_title] = useState(undefined)
  const [downlaod_dataset_caption, set_download_dataset_caption] =useState(undefined)

  useEffect(() => {
    if (is_loading) {
      axios.get(process.env.REACT_APP_strapiURL+'/api/explore-the-evidence')
        .then((res, error) => {
          if (error) {
            console.error(error);
          } else {
            let data = res.data.data.attributes
            set_title(data.title)

            set_sort_coins_image(data.sort.image.data.attributes)
            set_sort_coins_title(data.sort.title)
            set_sort_coins_caption(data.sort.caption)

            set_map_coins_image(data.map.image.data.attributes)
            set_map_coins_title(data.map.title)
            set_map_coins_caption(data.map.caption)

            set_coin_timeline_image(data.timeline.image.data.attributes)
            set_coin_timeline_title(data.timeline.title)
            set_coin_timeline_caption(data.timeline.caption)

            set_download_dataset_title(data.download_title)
            set_download_dataset_caption(data.download_caption)

            set_is_loading(false);
          }
        });
    }
  });

  if (is_loading) {
    return (
      <>
        <LoadingPage />
        <Footer />
      </>
    );
  }

  return (
    <>
      <div id='explore-the-evidence' className='d-flex align-items-center'>
        <Container>
          <Row>
            <Col>
              <p className='text-center story-h1'>
                {title}
              </p>
            </Col>
          </Row>
          <Row className='mt-5'>
            {/* SORT COINS */}
            <Col xs={4}>
              <Link to='/Evidence/CoinSort'>
                <img
                  alt={sort_coins_image.alternativeText !== undefined ? sort_coins_image.alternativeText : 'missing alt'}
                  src={process.env.REACT_APP_strapiURL+sort_coins_image.url}
                  style={{width:'300px'}}
                  />
                <p className='story-h4 explore-the-evidence-text-width-fix explore-the-evidence-title-text'>
                  {sort_coins_title}
                </p>
                <ReactMarkdown className='story-caption explore-the-evidence-text-width-fix explore-the-evidence-caption-text'>
                  {sort_coins_caption}
                </ReactMarkdown>
              </Link>
            </Col>
            {/* MAP COINS */}
            <Col xs={4}>
              <Link to='/'>
                <img
                  alt={map_coins_image.alternativeText !== undefined ? map_coins_image.alternativeText : 'missing alt'}
                  src={process.env.REACT_APP_strapiURL+map_coins_image.url}
                  className="bg-white p-2 explore-the-evidence-image"
                />
                <p className='story-h4 explore-the-evidence-text-width-fix explore-the-evidence-title-text'>
                  {map_coins_title}
                </p>
                <ReactMarkdown className='story-caption explore-the-evidence-text-width-fix explore-the-evidence-caption-text'>
                  {map_coins_caption}
                </ReactMarkdown>
              </Link>
            </Col>
            {/* COIN TIMELINE */}
            <Col xs={4}>
              <Link to='/Toolbox/Timeline'>
                <img
                  alt={coin_timeline_image.alternativeText !== undefined ? coin_timeline_image.alternativeText : 'missing alt'}
                  src={process.env.REACT_APP_strapiURL+coin_timeline_image.url}
                  className="bg-white p-2 explore-the-evidence-image"
                  />
                <p className='story-h4 explore-the-evidence-text-width-fix explore-the-evidence-title-text'>
                  {coin_timeline_title}
                </p>
                <ReactMarkdown className='story-caption explore-the-evidence-text-width-fix explore-the-evidence-caption-text'>
                  {coin_timeline_caption}
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
            <Col id='explore-the-evidence-icon-download-div'>
              <Link to='/Download'> {/* I had to split the links because if I made it one big link, it was messing with the row and column math bootstrap was doing */}
                <i id='explore-the-evidence-icon-download' className='demo-icon icon-donwload'>&#xe810;</i>
              </Link>
            </Col>
            <Col id='explore-the-evidence-text-div' className='d-flex align-items-center justify-content-start'>
              <Link to='/Download'>{/* I had to split the links because if I made it one big link, it was messing with the row and column math bootstrap was doing */}
                <p className='story-h4 explore-the-evidence-title-text explore-the-evidence-download-dataset-text-width-fix'>
                  {download_dataset_title}
                </p>
                <ReactMarkdown className='story-caption explore-the-evidence-caption-text explore-the-evidence-download-dataset-text-width-fix'>
                  {downlaod_dataset_caption}
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
