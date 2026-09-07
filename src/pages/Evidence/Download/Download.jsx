/**
 * Download.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders the download page and provides access to the dataset download form.
 *
 * Refactor Summary:
 * 1. Response Normalization Compatibility
 *    - Updated data access from:
 *        result.data.data.attributes
 *      → to:
 *        result.data.data
 *    - Aligns with normalized `download.js`
 *
 * 2. Preserved Existing Behavior
 *    - Layout, descriptive text, static image, and form rendering remain unchanged
 *
 * 3. Improved Safety
 *    - Adds safer nested media access for downloadable file URL
 *    - Prevents runtime crashes if the media relation is missing
 *
 * Notes:
 * - This component assumes `downloadRequest.downloadFind()` now returns
 *   a normalized single-entity Strapi response
 * - Nested media relations remain relation-shaped and still use `.data.attributes`
 *
 * Future Improvements:
 * - Move the static image into CMS-managed content
 * - Add error UI state if the download page request fails
 * - Add loading/error handling for missing downloadable asset
 */

import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import LoadingPage from 'src/components/loadingPage/LoadingPage';
import createMarkup from 'src/utils/Markup';

import downloadRequest from 'src/api/download';
import DownloadForm from './DownloadForm';

const baseURL = import.meta.env.VITE_STRAPI_URL;

function Download() {
  const [isLoading, setIsLoading] = useState(true);
  const [downloadPageData, setDownloadPageData] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await downloadRequest.downloadFind();

        // Updated for normalized response
        setDownloadPageData(result?.data?.data || {});
      } catch (error) {
        console.error('Failed to load download page data:', error);
        setDownloadPageData({});
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div id='download-page'>
      <h1>Download the Data</h1>

      <Row className='d-flex justify-content-between align-items-center'>
        <Col sm={12} md={8}>
          <Row className='d-flex justify-content-around'>
            <Col xs={3} className='text-center story-icon download-icon'>
              &#xe810;
            </Col>
            <Col
              xs={9}
              className='story-text'
              dangerouslySetInnerHTML={createMarkup(downloadPageData?.text)}
            />
          </Row>

          <Row>
            <img
              alt='Download'
              src={`${baseURL}/uploads/Image_47_89dc6433d0.png?updated_at=2022-04-14T13:41:55.091Z`}
            />
          </Row>
        </Col>

        <Col sm={12} md={3}>
          <DownloadForm
            url={downloadPageData?.coinData?.data?.attributes?.url || ''}
          />
        </Col>
      </Row>
    </div>
  );
}

export default Download;