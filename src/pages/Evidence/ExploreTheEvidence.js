import React, {useEffect, useState} from 'react';
import {
  Container,
  Row,
} from 'react-bootstrap';
import evidenceRequest from 'src/api/evidence';
import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer.js';
import { WhiteBGDesign } from '../Toolbox/Toolbox';
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
          <center>
            <h1>Explore the Evidence</h1>
            <div className='px-5 mx-5'>
              <h3 className='my-5'>
                Coins can be studied as pieces of art, historical artifacts, and as 
                objects that once moved through the hands of different 
                individuals and communities. Most importantly, coins were 
                produced and used within a context of people, systems, space, and 
                time.
              </h3>
              <div className='story-text my-5' >
                <em>Select one of the interfaces below to begin exploring the coin evidence 
                and your own historical applications of the material.</em>
              </div>
            </div>
          </center>
          <Row className='my-5 d-flex py-5 justify-content-around'>
            {/* SORT COINS */}
            <WhiteBGDesign
                link='/Evidence/CoinSort'
                imageSrc={evidenceData.coin_sort.image.data.attributes.url}
                title="COINS IN A PILE" 
                subtext={evidenceData.coin_sort.caption}
                height="12vmax"
                width="20vmax"
            />
            <WhiteBGDesign
                link='/Evidence/MapCoins'
                imageSrc={evidenceData.coin_map.image.data.attributes.url}
                title="COINS ON A MAP" 
                subtext={evidenceData.coin_map.caption}
                height="12vmax"
                width="20vmax"
            />
            <WhiteBGDesign
                link='/Evidence/Timeline'
                imageSrc={evidenceData.timeline.image.data.attributes.url}
                title="COINS IN TIME" 
                subtext={evidenceData.timeline.caption}
                height="12vmax"
                width="20vmax"
            />
          </Row>
          <hr />
          <Row className='d-flex justify-content-around my-5 py-5'>
            <WhiteBGDesign
                  link='/Evidence/CoinCatalog'
                  imageSrc={evidenceData.coin_catalog.image.data.attributes.url}
                  title="Coin Catalog" 
                  subtext={evidenceData.coin_catalog.caption}
                  height="12vmax"
                  width="20vmax"
              />
            <WhiteBGDesign
                  link='/Evidence/Download'
                  imageSrc={evidenceData.download.image.data.attributes.url}
                  title="Coin AS DATA" 
                  subtext={evidenceData.download.caption}
                  height="12vmax"
                  width="20vmax"
              />
          </Row>
        </Container>
      </div>
    <Footer />
    </>
  );
}

export default ExploreTheEvidence;
