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
          <h1 className='text-center'>Explore the Evidence</h1>
          <div className='align-items-center justify-content-center' style={{marginLeft:"5%", marginRight:"5%"}} >
            {/* <p className='text-center story-text' dangerouslySetInnerHTML={createMarkup(timeline_description)} /> */}
            <h3 className='text-center my-5'>Coins can be studied as pieces of art, historical artifacts, and as 
            objects that once moved through the hands of different 
            individuals and communities. Most importantly, coins were 
            produced and used within a context of people, systems, space, and 
            time.</h3>
            <p className='story-text text-center my-5' >
              <em>Select one of the interfaces below to begin exploring the coin evidence 
              and your own historical applications of the material.</em>
            </p>
          </div>
          <Row className='my-5 d-flex py-5 justify-content-around'>
            {/* SORT COINS */}
            <Col xs={3}>
              <Link to='/Evidence/CoinSort'>
                  <div className='text-center'>
                    <img
                      alt={'missing alt'}
                      src={`${process.env.REACT_APP_strapiURL}${evidenceData.coin_sort.image.data.attributes.url}`}
                      style={{height:"12vmax"}}
                    />
                  </div>
              </Link>
                <h4 className='mt-5 text-center'>COINS IN A PILE</h4>
                <div className='story-caption text-center' dangerouslySetInnerHTML={createMarkup(evidenceData.coin_sort.caption)} />
            </Col>
            {/* MAP COINS */}
            <Col xs={3} >
              <Link to='/Evidence/MapCoins'>
              {evidenceData.coin_sort.image.data ? (
                <div className="text-center">
                <img
                  alt={'missing alt'}
                  src={`${process.env.REACT_APP_strapiURL}${evidenceData.coin_map.image.data.attributes.url}`}
                  style={{borderStyle:'double', borderColor:'#737271', height:"12vmax"}}
                  className="bg-white p-2"
                  />
                </div>
                ):(<b className='image-icon text-center'>&#xe81b;</b>)}
              </Link>
                <h4 className='mt-5 text-center'>COINS ON A MAP</h4>
                <div className='story-caption text-center' dangerouslySetInnerHTML={createMarkup(evidenceData.coin_map.caption)} />
            </Col>
            {/* COIN TIMELINE */}
            <Col xs={3} >
                <Link to='/Evidence/Timeline'>
                    {evidenceData.timeline?.image.data ? (
                      <div className="text-center">
                        <img
                            alt={'missing alt'}
                            src={`${process.env.REACT_APP_strapiURL}${evidenceData.timeline?.image.data.attributes.url}`}
                            style={{borderStyle:'double', borderColor:'#737271', height:"12vmax"}}
                            className="bg-white p-2"/>
                      </div>

                    ):(<b className='image-icon text-center'>&#xe81b;</b>)}
                </Link>
                <div className='align-items-end'>
                    <h4 className='mt-5 text-center'>COINS IN TIME</h4>
                    {evidenceData.timeline?.caption ? 
                    (<div className='story-caption text-center' dangerouslySetInnerHTML={createMarkup(evidenceData.timeline?.caption)} />):(<div className='story-caption'>Travel through time, and follow the journey of these coins for yourself. Find the connections between empires and cultures, and the key events that shaped history.</div>)}
                </div>
            </Col>
          </Row>
          <hr />
          <Row className='d-flex justify-content-around my-5 py-5'>

          <Col xs={4} >
                <Link to='/Evidence/Timeline'>
                  <div className="text-center">
                    <img
                        alt={'missing alt'}
                        src={`${process.env.REACT_APP_strapiURL}${evidenceData.coin_catalog.image.data.attributes.url}`}
                        style={{borderStyle:'double', borderColor:'#737271', height:"12vmax"}}
                        className="bg-white p-2"/>
                  </div>
                </Link>
                <div className='align-items-end'>
                    <h4 className='mt-5 text-center'>Coin Catalog</h4>
                    <div className='story-caption text-center' style={{width:"80%", marginLeft:"10%"}} dangerouslySetInnerHTML={createMarkup(evidenceData.coin_catalog.caption)} />
                </div>
            </Col>

            <Col xs={4} >
                <Link to='/Evidence/Download'>
                  <div className="text-center">
                    <img
                        alt={'missing alt'}
                        src={`${process.env.REACT_APP_strapiURL}${evidenceData.download.image.data.attributes.url}`}
                        style={{borderStyle:'double', borderColor:'#737271', height:"12vmax"}}
                        className="bg-white p-2"/>
                  </div>
                </Link>
                <div className='align-items-end'>
                    <h4 className='mt-5 text-center '>Coin AS DATA</h4>
                    <div className='story-caption text-center'style={{width:"80%", marginLeft:"10%"}} dangerouslySetInnerHTML={createMarkup(evidenceData.download.caption)} />
                </div>
            </Col>

          </Row>
        </Container>
      </div>
    <Footer />
    </>
  );
}

export default ExploreTheEvidence;
