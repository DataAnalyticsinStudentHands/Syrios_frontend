/**
 * StoryReader.jsx — Post Vite + Fullpage Stabilization Upgrade (2026)
 *
 * Purpose:
 * Renders a full interactive story using Strapi story content and Zotero references.
 *
 * Refactor Summary:
 * 1. Fullpage Stability Fix
 *    - Prevents @fullpage/react-fullpage from initializing before valid slides exist
 *    - Ensures anchors and slides are always synchronized
 *    - Filters invalid/null slide renders to prevent runtime crashes
 *
 * 2. Safe Fullpage API Usage
 *    - Moves `setAllowScrolling` and `setKeyboardScrolling` out of render
 *    - Uses `useEffect` with a persistent ref to avoid unsafe lifecycle calls
 *
 * 3. Dual Data Shape Compatibility
 *    - Supports BOTH:
 *        a) Strapi raw response: result.data.data.attributes
 *        b) Normalized response: result.data.data
 *    - Prevents regressions when backend or API client changes
 *
 * 4. Defensive Data Access
 *    - Safely handles missing `zone`, `references`, and nested coin structures
 *    - Supports multiple coin nesting formats (`attributes`, `data`, or direct)
 *
 * 5. Zotero Performance Optimization
 *    - Uses Promise.all for parallel bibliography fetching
 *
 * 6. Preserved Existing Behavior
 *    - Fullpage story navigation
 *    - Footer references and image sourcing
 *    - Bottom drawer toggle behavior
 *
 * Environment Variables Required:
 * - VITE_STRAPI_URL              (string)  → Base API URL
 * - VITE_APP_ENV                 (string)  → Environment flag
 *
 * Notes:
 * - This file contains JSX and must remain `.jsx`
 * - Fullpage requires each slide to render a `.section` element
 * - Anchors MUST match slide count exactly
 *
 * Future Improvements:
 * - Lazy-load story slides for large narratives
 * - Cache Zotero responses
 * - Consider replacing fullpage with a virtualized scroll system
 */

import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Footer from 'src/components/footer/Footer';
import LoadingPage from 'src/components/loadingPage/LoadingPage';
import ReactFullpage from '@fullpage/react-fullpage';
import StoryComponent from './StoryComponents';

import storyRequest from 'src/api/story';
import zoteroRequest from 'src/api/zotero';

const StoryReader = () => {
  const storyId = new URLSearchParams(useLocation().search).get('id');

  const [isLoading, setIsLoading] = useState(true);
  const [storyFrame, setStoryFrame] = useState([]);
  const [storyAnchors, setStoryAnchors] = useState([]);
  const [storyReference, setStoryReference] = useState([]);
  const [storyImageSouce, setStoryImageSouce] = useState([]);
  const [isBottomOpen, setIsBottomOpen] = useState(false);

  const fullpageApiRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const result = await storyRequest.storyFindOne(storyId);

        const rawData = result?.data?.data;
        const data =
          rawData?.attributes && typeof rawData.attributes === 'object'
            ? { ...rawData.attributes, id: rawData.id }
            : rawData || {};

        if (!mounted) return;

        const zone = Array.isArray(data?.zone) ? data.zone : [];
        const anchors = createAnchors(data, zone);

        setStoryFrame(zone);
        setStoryAnchors(anchors);

        await Promise.all([
          createImageReference(data, mounted),
          createZoteroReference(data, mounted),
        ]);
      } catch (error) {
        console.error('Failed to load story reader:', error);
        if (mounted) {
          setStoryFrame([]);
          setStoryAnchors([]);
          setStoryReference([]);
          setStoryImageSouce([]);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
      fullpageApiRef.current = null;
    };
  }, [storyId]);

  useEffect(() => {
    const api = fullpageApiRef.current;
    if (!api) return;

    try {
      api.setAllowScrolling(!isBottomOpen, 'down');
      api.setKeyboardScrolling(!isBottomOpen, 'down');
    } catch (err) {
      console.error('Failed to update fullpage scrolling:', err);
    }
  }, [isBottomOpen]);

  const toggleBottom = (e) => {
    const el = e?.target?.closest?.('button.reference-tag');
    if (el && e.currentTarget?.contains?.(el)) {
      setIsBottomOpen((prev) => !prev);
    }
  };

  async function createImageReference(data, mounted) {
    try {
      let imgRef = [];

      const getAttrs = (obj) => {
        if (!obj) return null;
        if (obj?.data?.attributes) return obj.data.attributes;
        if (obj?.data) return obj.data;
        if (obj?.attributes) return obj.attributes;
        return obj;
      };

      const pushRef = (coinObj) => {
        const coinAttrs = getAttrs(coinObj);
        if (!coinAttrs) return;

        imgRef.push({
          right_holder: coinAttrs?.right_holder,
          source_image: coinAttrs?.source_image,
        });
      };

      (Array.isArray(data?.zone) ? data.zone : []).forEach((frame) => {
        if (!frame) return;

        if (frame.cc_coin) {
          pushRef(frame.cc_coin.coin);
        } else if (frame.scale_coin_left && frame.scale_coin_right) {
          pushRef(frame.scale_coin_left.coin);
          pushRef(frame.scale_coin_right.coin);
        } else if (Array.isArray(frame.fades)) {
          frame.fades.forEach((fade) => {
            pushRef(fade?.coin_left);
            pushRef(fade?.coin_right);
          });
        } else if (frame.flip_coin_left && frame.flip_coin_right) {
          pushRef(frame.flip_coin_left.coin);
          pushRef(frame.flip_coin_right.coin);
        } else if (Array.isArray(frame.images)) {
          frame.images.forEach((image) => {
            pushRef(image?.coin);
          });
        } else if (frame.it_image) {
          pushRef(frame.it_image.coin);
        } else if (frame.iti_image_left && frame.iti_image_right) {
          pushRef(frame.iti_image_left.coin);
          pushRef(frame.iti_image_right.coin);
        }
      });

      imgRef = imgRef
        .filter((obj) => obj?.right_holder && obj.right_holder !== 'NA')
        .sort((a, b) => String(a.right_holder).localeCompare(String(b.right_holder)));

      imgRef = [...new Map(imgRef.map((item) => [item.right_holder, item])).values()];

      if (mounted) setStoryImageSouce(imgRef);
    } catch (err) {
      console.error('Failed to build image references:', err);
      if (mounted) setStoryImageSouce([]);
    }
  }

  async function createZoteroReference(data, mounted) {
    try {
      const refs = Array.isArray(data?.references?.data) ? data.references.data : [];

      const itemkeys = refs
        .map((reference) => reference?.attributes?.item_key || reference?.item_key)
        .filter(Boolean);

      const responses = await Promise.all(
        itemkeys.map((itemkey) => zoteroRequest.getOneItemBib(itemkey))
      );

      const bibArr = responses.map((res) => res.data).filter(Boolean).sort();

      if (mounted) setStoryReference(bibArr);
    } catch (err) {
      console.error('Failed to build Zotero references:', err);
      if (mounted) setStoryReference([]);
    }
  }

  function createAnchors(data, zone) {
    const title = String(data?.name || 'story')
      .replace(/\s/g, '')
      .replace(/[^a-zA-Z0-9-_]/g, '');

    return zone.map((_, i) => `${title || 'story'}-slides-${i}`);
  }

  if (isLoading) {
    return (
      <>
        <LoadingPage variant='story-reader' />
        <Footer />
      </>
    );
  }

  const hasFrames = Array.isArray(storyFrame) && storyFrame.length > 0;
  const hasMatchingAnchors =
    Array.isArray(storyAnchors) && storyAnchors.length === storyFrame.length;

  return (
    <>
      {hasFrames && hasMatchingAnchors ? (
        <ReactFullpage
          licenseKey={'K3HO6-208O9-6QK0J-JZ1VH-RRWIO'}
          navigation={true}
          navigationPosition={'right'}
          anchors={storyAnchors}
          autoScrolling={true}
          responsiveWidth={768}
          padding="5em 0"
          render={({ state, fullpageApi }) => {
            if (fullpageApi && fullpageApiRef.current !== fullpageApi) {
              fullpageApiRef.current = fullpageApi;
            }

            const storyJSX = (storyFrame || [])
              .map((story, i) => {
                try {
                  return StoryComponent(story, i, fullpageApi, state, toggleBottom);
                } catch (err) {
                  console.error(`Failed to render story slide ${i}:`, err);
                  return null;
                }
              })
              .filter(Boolean);

            return (
              <ReactFullpage.Wrapper>
                {storyJSX}
              </ReactFullpage.Wrapper>
            );
          }}
        />
      ) : (
        <div style={{ minHeight: '60vh' }} />
      )}

      <Footer
        references={storyReference}
        imageReference={storyImageSouce}
        toggleBottom={toggleBottom}
        isBottomOpen={isBottomOpen}
      />
    </>
  );
};

export default StoryReader;