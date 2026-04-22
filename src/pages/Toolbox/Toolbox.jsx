/**
 * Toolbox.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders the Toolbox landing page using CMS-driven content from Strapi.
 *
 * Refactor Summary:
 * 1. Response Normalization Compatibility
 *    - Updated data access from:
 *        result.data.data.attributes
 *      → to:
 *        result.data.data
 *    - Aligns with normalized `toolbox.js`
 *
 * 2. Preserved Existing Behavior
 *    - Layout, page title, and toolbox card rendering remain unchanged
 *
 * 3. Improved Safety
 *    - Adds try/catch/finally around async fetch
 *    - Uses safer default state values
 *    - Guards nested image/icon access
 *
 * Notes:
 * - Assumes `toolboxRequest.toolboxFind()` returns a normalized singleton response
 * - Nested media relations remain relation-shaped and still use `.data.attributes`
 *
 * Future Improvements:
 * - Replace hardcoded tile indexing with `.map()`
 * - Add empty/error state UI
 * - Move icon grid config into reusable helper if needed
 */

import React, { useState, useEffect } from 'react';
import toolboxRequest from 'src/api/toolbox';
import LoadingPage from 'src/components/loadingPage/LoadingPage';
import { Container, Row, Col } from 'react-bootstrap';
import { WhiteBGDesign } from 'src/components/constant/WhiteBGDesign';
import PageTitleComponent from 'src/components/constant/pageTitleText';

const Toolbox = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [toolboxData, setToolboxData] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await toolboxRequest.toolboxFind();

        // Updated for normalized response
        setToolboxData(result?.data?.data || {});
      } catch (error) {
        console.error('Failed to load toolbox page:', error);
        setToolboxData({});
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  const icons = toolboxData?.image_icons || [];

  return (
    <div id='tool-box'>
      <Container>
        <PageTitleComponent
          title={toolboxData.title}
          text={toolboxData.text}
          subtext={toolboxData.subtext}
        />

        <Row className='my-5 d-flex py-5 justify-content-around'>
          <Col xs={3}>
            {icons[0] ? (
              <WhiteBGDesign
                link={icons[0].url_path}
                imageSrc={icons[0].image?.data?.attributes?.url}
                title={icons[0].title}
                subtext={icons[0].subtext}
                height="15vmax"
                width="15vmax"
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
                height="15vmax"
                width="15vmax"
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
                height="15vmax"
                width="15vmax"
              />
            ) : null}
          </Col>
        </Row>

        <hr />

        <Row className='d-flex align-items-center justify-content-around my-5 py-5'>
          <Col xs={3}>
            {icons[3] ? (
              <WhiteBGDesign
                link={icons[3].url_path}
                imageSrc={icons[3].image?.data?.attributes?.url}
                title={icons[3].title}
                subtext={icons[3].subtext}
                height="15vmax"
                width="15vmax"
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
                height="15vmax"
                width="15vmax"
              />
            ) : null}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Toolbox;