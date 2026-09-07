/**
 * ExploreTheEvidence.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders the "Explore the Evidence" landing page using CMS-driven content.
 *
 * Refactor Summary:
 * 1. Response Normalization Compatibility
 *    - Updated data access from:
 *        result.data.data.attributes
 *      → to:
 *        result.data.data
 *    - Aligns with normalized `evidence.js`
 *
 * 2. Preserved Existing Behavior
 *    - Layout, title rendering, and WhiteBGDesign tiles remain unchanged
 *
 * 3. Improved Safety
 *    - Adds safer array access for `image_icon`
 *    - Prevents runtime crashes if the Strapi response is incomplete
 *
 * Notes:
 * - This component assumes `evidenceRequest.evidenceFind()` returns a normalized
 *   single-entity response
 * - Nested media is still relation-shaped and accessed via `.data.attributes`
 *
 * Future Improvements:
 * - Replace hardcoded tile indexing with `.map()`
 * - Add graceful fallback UI for missing image/icon entries
 * - Extract repeated tile rendering into a helper
 */

import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import evidenceRequest from 'src/api/evidence';
import LoadingPage from 'src/components/loadingPage/LoadingPage';
import { WhiteBGDesign } from 'src/components/constant/WhiteBGDesign';
import PageTitleComponent from 'src/components/constant/pageTitleText';

const ExploreTheEvidence = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [evidenceData, setEvidenceData] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await evidenceRequest.evidenceFind();

        // Updated for normalized response
        setEvidenceData(result?.data?.data || {});
      } catch (error) {
        console.error('Failed to load evidence page data:', error);
        setEvidenceData({});
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) return <LoadingPage />;

  const icons = evidenceData?.image_icon || [];

  return (
    <div id='explore-the-evidence' className='d-flex align-items-center'>
      <Container>
        <PageTitleComponent
          title={evidenceData.title}
          text={evidenceData.text}
          subtext={evidenceData.subtext}
        />

        <Row className='my-5 d-flex py-5 justify-content-around'>
          <Col xs={3}>
            {icons[0] ? (
              <WhiteBGDesign
                link={icons[0].url_path}
                imageSrc={icons[0].image?.data?.attributes?.url}
                title={icons[0].title}
                subtext={icons[0].subtext}
                height="12vmax"
                width="20vmax"
              />
            ) : null}
          </Col>

          <Col xs={3}>
            {icons[1] ? (
              <WhiteBGDesign
                link={icons[1].url_path}
                imageSrc={icons[1].image?.data?.attributes?.url}
                title={icons[1].title}
                subtext={icons[1].subtext}
                height="12vmax"
                width="20vmax"
              />
            ) : null}
          </Col>

          <Col xs={3}>
            {icons[2] ? (
              <WhiteBGDesign
                link={icons[2].url_path}
                imageSrc={icons[2].image?.data?.attributes?.url}
                title={icons[2].title}
                subtext={icons[2].subtext}
                height="12vmax"
                width="20vmax"
              />
            ) : null}
          </Col>
        </Row>

        <hr />

        <Row className='d-flex justify-content-around my-5 py-5'>
          <Col xs={3}>
            {icons[3] ? (
              <WhiteBGDesign
                link={icons[3].url_path}
                imageSrc={icons[3].image?.data?.attributes?.url}
                title={icons[3].title}
                subtext={icons[3].subtext}
                height="12vmax"
                width="20vmax"
              />
            ) : null}
          </Col>

          <Col xs={3}>
            {icons[4] ? (
              <WhiteBGDesign
                link={icons[4].url_path}
                imageSrc={icons[4].image?.data?.attributes?.url}
                title={icons[4].title}
                subtext={icons[4].subtext}
                height="12vmax"
                width="20vmax"
              />
            ) : null}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ExploreTheEvidence;