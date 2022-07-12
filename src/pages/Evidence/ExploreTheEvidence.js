import React, {useEffect, useState} from 'react';
import {
  Container,
  Row,
  Col
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import evidenceRequest from 'src/api/evidence';
import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer.js';
import createMarkup from 'src/utils/Markup';

const ExploreTheEvidence = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [evidenceData, setEvidenceData] = useState([])

  useEffect(() => {
    async function fetchData(){
      const result = await evidenceRequest.evidenceFind()
      setEvidenceData(result.data.data.attributes)
      setIsLoading(false)
    }
    fetchData()
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
      <div id='explore-the-evidence' className='d-flex align-items-center'>
        <Container>
          <Row><Col><p className='story-h1 text-center'>Explore the Evidence</p></Col></Row>
          <Row className='mt-5 d-flex justify-content-around'>
            {/* SORT COINS */}
            <Col xs={4} style={{width:'290px'}}>
              <Link to='/Evidence/CoinSort'>
                {evidenceData.coin_sort.image.data ? (
                <img
                  alt={'missing alt'}
                  src={`${process.env.REACT_APP_strapiURL}${evidenceData.coin_sort.image.data.attributes.url}`}
                  style={{height:'188px'}}
                />
                ):(<b className='image-icon text-center'>&#xe80b;</b>)}
              </Link>
                <p className='story-h4 mt-4'>SORT COINS</p>
                <div className='story-caption' dangerouslySetInnerHTML={createMarkup(evidenceData.coin_sort.caption)} />
            </Col>
            {/* MAP COINS */}
            <Col xs={4} style={{width:'290px'}}>
              <Link to='/Evidence/MapCoins'>
              {evidenceData.coin_sort.image.data ? (
                <img
                  alt={'missing alt'}
                  src={`${process.env.REACT_APP_strapiURL}${evidenceData.coin_map.image.data.attributes.url}`}
                  style={{height:'188px'}}
                />
                ):(<b className='image-icon text-center'>&#xe81b;</b>)}
              </Link>
                <p className='story-h4 mt-4'>MAP COINS</p>
                <div className='story-caption' dangerouslySetInnerHTML={createMarkup(evidenceData.coin_map.caption)} />
            </Col>
            {/* COIN TIMELINE */}
            <Col xs={4} style={{width:'290px'}}>
              <Link to='/Evidence/CoinCatalogy'>
                {evidenceData.coin_catalog.image.data ?(
                  <img
                    alt={'missing alt'}
                    src={`${process.env.REACT_APP_strapiURL}${evidenceData.coin_catalog.image.data.attributes.url}`}
                    style={{height:'188px'}}
                  />
                ):(<b className='image-icon text-center'>&#xe811;</b>)}
              </Link>
                <p className='story-h4 mt-4'>Coin Catalogy</p>
                <div className='story-caption' dangerouslySetInnerHTML={createMarkup(evidenceData.coin_catalog.caption)} />
            </Col>
          </Row>
          <Row><Col><hr /></Col></Row>
          <Row className='d-flex align-items-center justify-content-center'>
            <Col xs={2}>
              <Link to='/Evidence/Download'> {/* I had to split the links because if I made it one big link, it was messing with the row and column math bootstrap was doing */}
                <b className='story-icon ' style={{fontSize:'200px'}}>&#xe810;</b>
              </Link>
            </Col>
            <Col xs={4}>
              <p className='story-h4'>Download Data</p>
              {evidenceData.download.caption?(
              <p className='story-caption' dangerouslySetInnerHTML={createMarkup(evidenceData.download.caption)} />):(<></>)}
            </Col>
          </Row>
        </Container>
      </div>
    <Footer />
    </>
  );
}

export default ExploreTheEvidence;
