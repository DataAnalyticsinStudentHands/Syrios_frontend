/**
 * Research.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders the Research page, including:
 * - CMS-driven research page content from Strapi
 * - Zotero bibliography entries
 *
 * Refactor Summary:
 * 1. Response Normalization Compatibility
 *    - Updated research page access from:
 *        researchData.data.data.attributes
 *      → to:
 *        researchData.data.data
 *    - Aligns with normalized `research.js`
 *
 * 2. Preserved Existing Behavior
 *    - Bibliography rendering, book cover display, and page layout remain unchanged
 *
 * 3. Improved Safety
 *    - Adds try/catch/finally around async fetches
 *    - Uses safer default state values
 *    - Guards nested media access for `bookcover`
 *
 * Notes:
 * - `zoteroRequest.getAllitems()` remains separate from Strapi normalization
 * - `researchRequest.researchFind()` is assumed to return a normalized singleton response
 *
 * Future Improvements:
 * - Add loading/error UI for bibliography failures separately
 * - Consider moving bibliography transformation into a helper
 * - Add fallback image/content if research CMS fields are missing
 */

import React, { useState, useEffect } from 'react';
import LoadingPage from 'src/components/loadingPage/LoadingPage';
import { Container, Row, Col } from 'react-bootstrap';
import zoteroRequest from 'src/api/zotero';
import researchRequest from 'src/api/research';
import createMarkup from 'src/utils/Markup';
import PageTitleComponent from 'src/components/constant/pageTitleText';

const Research = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [referencesData, setReferencesData] = useState([]);
  const [research, setResearch] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [zoteroResult, researchData] = await Promise.all([
          zoteroRequest.getAllitems(),
          researchRequest.researchFind(),
        ]);

        setReferencesData(zoteroResult?.data || []);

        // Updated for normalized response
        setResearch(researchData?.data?.data || {});
      } catch (error) {
        console.error('Failed to load research page:', error);
        setReferencesData([]);
        setResearch({});
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) return <LoadingPage />;

  return (
    <div id='research'>
      <PageTitleComponent
        title={research.title}
        text={research.text}
      />

      <Row className="d-flex justify-content-around align-items-center my-5 py-5">
        <Col xs={3}>
          <a
            href="https://www.cambridge.org/core/books/abs/antioch-in-syria/antioch-in-syria/CC6531DFF053A8BA29E42CFFC2C2EA68"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              alt={'missing alt'}
              src={`${import.meta.env.VITE_STRAPI_URL}${research?.bookcover?.data?.attributes?.url || ''}`}
              style={{ borderStyle: 'double', borderColor: '#737271', width: "100%" }}
              className="bg-white p-2"
            />
          </a>
        </Col>

        <Col
          xs={8}
          className="story-text"
          dangerouslySetInnerHTML={createMarkup(research.book_description)}
        />
      </Row>

      <h2 className='text-center'>Bibliography</h2>

      <Container>
        {referencesData.length === 0 ? null : (
          referencesData.map((bib) => {
            return (
              <Row key={bib.version} className='story-text-bigger my-5 justify-content-center'>
                {bib.bib.split("http")[1] ? (
                  <Col xs={10}>
                    <a
                      href={`http${bib.bib.split("http")[1].split(".</div>")[0]}`}
                      dangerouslySetInnerHTML={createMarkup(bib.bib.split("http")[0])}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  </Col>
                ) : (
                  <Col
                    xs={10}
                    dangerouslySetInnerHTML={createMarkup(bib.bib.split("http")[0])}
                  />
                )}
              </Row>
            );
          })
        )}
      </Container>
    </div>
  );
};

export default Research;