/**
 * LandingPage.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders the main landing page using CMS-driven content from Strapi.
 *
 * Refactor Summary:
 * 1. Response Normalization Compatibility
 *    - Updated data access from:
 *        result.data.data.attributes
 *      → to:
 *        result.data.data
 *    - Aligns with new normalization layer in `client.js`
 *
 * 2. Preserved UI + Behavior
 *    - All layout, rendering, and component structure unchanged
 *    - Only data extraction logic updated
 *
 * 3. Improved Safety
 *    - Added defensive checks for malformed API responses
 *    - Prevents runtime crashes if data is missing
 *
 * Data Shape (Post-Normalization):
 * - result.data.data → flattened Strapi entity
 * - Nested media still accessed via:
 *     image.data.attributes.url
 *
 * Notes:
 * - Image URLs still require manual prefixing with VITE_STRAPI_URL
 * - Nested media is NOT normalized (intentional)
 * - Component expects normalized API responses from landing.js
 *
 * Future Improvements:
 * - Normalize nested media (remove `.data.attributes`)
 * - Create reusable hook for CMS data fetching
 * - Add skeleton loading instead of full-page loader
 */

import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NoFeedBackIcon from 'src/components/constant/NoFeedBackIcon';
import LoadingPage from 'src/components/loadingPage/LoadingPage';
import createMarkup from 'src/utils/Markup';
import landingRequest from 'src/api/landing';

function ImageIcon(props) {
  return (
    <div className='bg-white landing-button-size p-3 m-3'>
      <Link to={props.link}>
        <div
          className='landing-button-img'
          style={{
            backgroundImage: props.imageSrc
              ? `url(${import.meta.env.VITE_STRAPI_URL}${props.imageSrc})`
              : 'none',
          }}
        >
          <div className='on-hover-dim landing-buttons-text p-3'>
            {props.text}
          </div>
        </div>
      </Link>
    </div>
  );
}

function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [landingData, setLandingData] = useState({
    title: '',
    video_link: '',
    text: '',
    image_icons: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await landingRequest.landingdFind();

        // ✅ Updated for normalized response
        const data = result?.data?.data;

        if (data) {
          setLandingData({
            title: data.title || '',
            video_link: data.video_link || '',
            text: data.text || '',
            image_icons: data.image_icons || [],
          });
        } else {
          console.error('Landing data missing or malformed:', result);
        }
      } catch (error) {
        console.error('Failed to load landing page data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) return <LoadingPage />;

  return (
    <>
      <NoFeedBackIcon url="default" />
      <div id='landing-page'>
        <h2 className='text-center'>{landingData.title}</h2>

        <Row className='d-flex justify-content-around mt-5'>
          <Col xs={12} sm={8} id='landing-video' className='p-3'>
            <ReactPlayer
              width="100%"
              height="100%"
              url={landingData.video_link}
              controls={true}
              playing={true}
            />
          </Col>

          <Col xs={12} sm={4}>
            <Row className='align-items-center'>
              {landingData.image_icons.map((icon) => (
                <Col xs={12} sm={6} key={`landing-image-icon-${icon.id}`}>
                  <ImageIcon
                    id={icon.id}
                    link={icon.url_path}
                    imageSrc={icon?.image?.data?.attributes?.url || ''}
                    text={icon.title}
                  />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        <div
          className='justify-content-center mt-5 landing-text'
          dangerouslySetInnerHTML={createMarkup(landingData.text)}
        />
      </div>
    </>
  );
}

export default LandingPage;