import React, {useEffect, useState} from 'react';
import {Container,Row,Col} from 'react-bootstrap';
import evidenceRequest from 'src/api/evidence';
import LoadingPage from 'src/components/loadingPage/LoadingPage.js';
import Footer from 'src/components/footer/Footer.js';
import { WhiteBGDesign } from 'src/components/constant/WhiteBGDesign';
import PageTitleComponent from 'src/components/constant/pageTitleText';
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

  if (isLoading)return (<><LoadingPage /><Footer /></>);
  return (
    <>
      <div id='explore-the-evidence' className='d-flex align-items-center'>
        <Container>
          <PageTitleComponent
            title={evidenceData.title}
            text={evidenceData.text}
            subtext={evidenceData.subtext}
          />
          <Row className='my-5 d-flex py-5 justify-content-around'>

            {/* I need to figured out how to deal with the <hr/> later*/}

            {/* {evidenceData.image_icon.map((ctx)=>{
              return(
                <Col xs={4}>
                  <WhiteBGDesign
                    link={ctx.url_path}
                    imageSrc={ctx.image.data.attributes.url}
                    title={ctx.title}
                    subtext={ctx.subtext}
                    height="12vmax"
                    width="20vmax"
                  />
                </Col>
              )
            })} */}
            <Col xs={3}>
            <WhiteBGDesign
                link={evidenceData.image_icon[0].url_path}
                imageSrc={evidenceData.image_icon[0].image.data.attributes.url}
                title={evidenceData.image_icon[0].title}
                subtext={evidenceData.image_icon[0].subtext}
                height="12vmax"
                width="20vmax"
            />
            </Col>
            <Col xs={3}>
            <WhiteBGDesign
                link={evidenceData.image_icon[1].url_path}
                imageSrc={evidenceData.image_icon[1].image.data.attributes.url}
                title={evidenceData.image_icon[1].title}
                subtext={evidenceData.image_icon[1].subtext}
                height="12vmax"
                width="20vmax"
            />
            </Col>
            <Col xs={3}>
            <WhiteBGDesign
                link={evidenceData.image_icon[2].url_path}
                imageSrc={evidenceData.image_icon[2].image.data.attributes.url}
                title={evidenceData.image_icon[2].title}
                subtext={evidenceData.image_icon[2].subtext}
                height="12vmax"
                width="20vmax"
            />
            </Col>
          </Row>
          <hr />
          <Row className='d-flex justify-content-around my-5 py-5'>
          <Col xs={3}>
            <WhiteBGDesign
                link={evidenceData.image_icon[3].url_path}
                imageSrc={evidenceData.image_icon[3].image.data.attributes.url}
                title={evidenceData.image_icon[3].title}
                subtext={evidenceData.image_icon[3].subtext}
                height="12vmax"
                width="20vmax"
            />
            </Col>
            <Col xs={3}>
            <WhiteBGDesign
                link={evidenceData.image_icon[4].url_path}
                imageSrc={evidenceData.image_icon[4].image.data.attributes.url}
                title={evidenceData.image_icon[4].title}
                subtext={evidenceData.image_icon[4].subtext}
                height="12vmax"
                width="20vmax"
            />
            </Col>
          </Row>
          </Container>
      </div>
    <Footer />
    </>
  );
}

export default ExploreTheEvidence;
