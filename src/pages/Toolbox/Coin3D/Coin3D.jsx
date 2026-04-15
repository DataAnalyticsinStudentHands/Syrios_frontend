/**
 * Coin3D.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders the 3D coin page using CMS-driven content from Strapi.
 *
 * Refactor Summary:
 * 1. Response Normalization Compatibility
 *    - Uses normalized API response shape:
 *        result.data.data
 *
 * 2. Preserved UI + Behavior
 *    - Existing page structure, Sketchfab embed, and title rendering unchanged
 *
 * 3. Improved Safety
 *    - Adds try/catch/finally around async fetch
 *    - Uses object default state for CMS content
 *
 * Data Shape (Post-Normalization):
 * - result.data.data → flattened Strapi entity
 *
 * Notes:
 * - This component assumes `coin-3d.js` enables normalization
 * - The Sketchfab embed URL is still hardcoded
 *
 * Future Improvements:
 * - Move fetch logic into reusable CMS hook
 * - Replace hardcoded Sketchfab URL with CMS-driven embed field
 * - Add error fallback UI if the CMS request fails
 */

import React, { useEffect, useState } from 'react';
import LoadingPage from 'src/components/loadingPage/LoadingPage';
import coin3DRequest from 'src/api/coin-3d';
import PageTitleComponent from 'src/components/constant/pageTitleText';

const Coin3D = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [coin3D, setCoin3D] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await coin3DRequest.coin3DFind();
        setCoin3D(result?.data?.data || {});
      } catch (error) {
        console.error('Failed to load 3D coin page:', error);
        setCoin3D({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <LoadingPage />;

  return (
    <div id='coin3d-page'>
      <PageTitleComponent
        title={coin3D.title}
        text={coin3D.text}
        subtext={coin3D.sub_text}
      />
      <center>
        <div className='sketchfab-embed-wrapper my-5 py-5'>
          <iframe
            title="Eastern King's Coin"
            width="720"
            height="540"
            frameBorder="0"
            allowFullScreen
            mozallowfullscreen="true"
            webkitallowfullscreen="true"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            xr-spatial-tracking="true"
            execution-while-out-of-viewport="true"
            execution-while-not-rendered="true"
            web-share="true"
            src="https://sketchfab.com/models/033a5ed32de347e1be254042555ad0c4/embed"
          />
        </div>
      </center>
    </div>
  );
};

export default Coin3D;