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
 *    - Existing Strapi-managed cards remain in CMS order
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
 * The HIST 2303 learning studios are local routes, so they are intentionally
 * defined in code rather than represented as nonexistent Strapi media records.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toolboxRequest from 'src/api/toolbox';
import LoadingPage from 'src/components/loadingPage/LoadingPage';
import { Container, Row, Col } from 'react-bootstrap';
import { WhiteBGDesign } from 'src/components/constant/WhiteBGDesign';
import PageTitleComponent from 'src/components/constant/pageTitleText';
import { TOOLBOX_LEARNING_TOOLS } from './toolboxLearningTools';

const TOOLBOX_FALLBACK = Object.freeze({
  title: 'Toolbox',
  text: 'Explore the SYRIOS collection through guided historical inquiry, reference tools, and interactive evidence.',
  subtext: '',
});

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

  const icons = Array.isArray(toolboxData?.image_icons) ? toolboxData.image_icons : [];

  return (
    <div id='tool-box'>
      <Container>
        <PageTitleComponent
          title={toolboxData.title || TOOLBOX_FALLBACK.title}
          text={toolboxData.text || TOOLBOX_FALLBACK.text}
          subtext={toolboxData.subtext || TOOLBOX_FALLBACK.subtext}
        />

        <section className='toolbox-learning-labs' aria-labelledby='toolbox-learning-labs-title'>
          <header className='toolbox-section-heading'>
            <p className='toolbox-section-heading__eyebrow'>HIST 2303 · Learning studios</p>
            <h2 id='toolbox-learning-labs-title'>Practice the historian&apos;s craft</h2>
            <p>
              Investigate objects, build an argument, and test what the catalog can—and cannot—support.
              Each studio creates work that can be downloaded as a PDF.
            </p>
          </header>

          <nav className='toolbox-learning-labs__grid' aria-label='Historian&apos;s Craft learning studios'>
            {TOOLBOX_LEARNING_TOOLS.map((tool) => (
              <Link
                className={'toolbox-learning-card toolbox-learning-card--' + tool.id}
                key={tool.id}
                to={tool.path}
              >
                <div className='toolbox-learning-card__topline'>
                  <span className='toolbox-learning-card__step'>{tool.step}</span>
                  <span className='toolbox-learning-card__phase'>{tool.phase}</span>
                </div>
                <span className='toolbox-learning-card__emblem' aria-hidden='true'>{tool.glyph}</span>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
                <ul className='toolbox-learning-card__highlights' aria-label={tool.title + ' features'}>
                  {tool.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                </ul>
                <span className='toolbox-learning-card__cta'>
                  {tool.cta}
                  <span aria-hidden='true'>→</span>
                </span>
              </Link>
            ))}
          </nav>
        </section>

        {icons.length ? (
          <section className='toolbox-reference-tools' aria-labelledby='toolbox-reference-tools-title'>
            <header className='toolbox-section-heading toolbox-section-heading--compact'>
              <p className='toolbox-section-heading__eyebrow'>Reference · Explore · Learn</p>
              <h2 id='toolbox-reference-tools-title'>More ways to work with SYRIOS</h2>
            </header>

            <Row className='toolbox-grid justify-content-center'>
              {icons.map((icon, index) => (
                <Col
                  className='toolbox-grid__column'
                  key={icon.id ?? icon.url_path ?? index}
                  xs={12}
                  md={6}
                  lg={4}
                >
                  <WhiteBGDesign
                    link={icon.url_path}
                    imageSrc={icon.image?.data?.attributes?.url}
                    altText={icon.image?.data?.attributes?.alternativeText || icon.title}
                    title={icon.title}
                    subtext={icon.subtext}
                    height='clamp(9rem, 15vmax, 15rem)'
                    width='clamp(9rem, 15vmax, 15rem)'
                  />
                </Col>
              ))}
            </Row>
          </section>
        ) : null}
      </Container>
    </div>
  );
};

export default Toolbox;
