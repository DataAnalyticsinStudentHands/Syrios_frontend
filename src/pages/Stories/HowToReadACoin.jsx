/**
 * HowToReadACoin.jsx — Post Vite + Fullpage Stabilization Upgrade (2026)
 *
 * Purpose:
 * Renders interactive story experience using Strapi + Zotero data.
 *
 * Refactor Summary:
 * 1. Response Compatibility
 *    - Supports BOTH:
 *        a) raw Strapi entity access: result.data.data.attributes
 *        b) normalized entity access: result.data.data
 *    - Prevents regressions across mixed migration states
 *
 * 2. Fullpage Stability Fix
 *    - Prevents @fullpage/react-fullpage from initializing before valid slides exist
 *    - Ensures anchors and slides are synchronized before mount
 *    - Prevents render-time fullpage side effects
 *
 * 3. Safe Async Handling
 *    - Adds mounted guard to prevent state updates after unmount
 *    - Wraps all async pipelines in try/catch
 *
 * 4. Zotero Performance Upgrade
 *    - Uses Promise.all for parallel bibliography requests
 *
 * 5. Defensive Data Access
 *    - Handles missing `zone`, `references`, and nested coin data safely
 *    - Supports partially normalized nested Strapi relations
 *
 * 6. Preserved Existing Behavior
 *    - Fullpage story navigation
 *    - Footer references and image sourcing
 *    - Bottom drawer toggle behavior
 *
 * Notes:
 * - This file contains JSX and must remain `.jsx`
 * - Fullpage requires valid section children before initialization
 * - Anchors MUST match the number of rendered story slides
 *
 * Future Improvements:
 * - Add caching for Zotero responses
 * - Move heavy parsing (image refs) to backend
 * - Normalize story structure further (remove deep nesting)
 */

import { useEffect, useRef, useState } from 'react';

import LoadingPage from 'src/components/loadingPage/LoadingPage';
import ReactFullpage from '@fullpage/react-fullpage';
import StoryComponent from 'src/pages/Stories/StoryComponents';
import storyRequest from 'src/api/story';
import zoteroRequest from 'src/api/zotero';
import Footer from 'src/components/footer/Footer';

const HowToReadACoin = () => {
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
        const result = await storyRequest.storyFindOne('1');

        // Support BOTH shapes:
        // 1) Strapi raw:        result.data.data.attributes
        // 2) normalized/newer:  result.data.data
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
        console.error('Failed to load story:', error);
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
  }, []);

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
        const coinData = getAttrs(coinObj);
        if (!coinData) return;

        imgRef.push({
          right_holder: coinData?.right_holder,
          source_image: coinData?.source_image,
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
          frame.images.forEach((img) => {
            pushRef(img?.coin);
          });
        } else if (frame.it_image) {
          pushRef(frame.it_image.coin);
        } else if (frame.iti_image_left && frame.iti_image_right) {
          pushRef(frame.iti_image_left.coin);
          pushRef(frame.iti_image_right.coin);
        }
      });

      imgRef = imgRef
        .filter((r) => r?.right_holder && r.right_holder !== 'NA')
        .sort((a, b) => String(a.right_holder).localeCompare(String(b.right_holder)));

      imgRef = [...new Map(imgRef.map((item) => [item.right_holder, item])).values()];

      if (mounted) setStoryImageSouce(imgRef);
    } catch (err) {
      console.error('Image reference build failed:', err);
      if (mounted) setStoryImageSouce([]);
    }
  }

  async function createZoteroReference(data, mounted) {
    try {
      const refs = Array.isArray(data?.references?.data) ? data.references.data : [];

      const itemkeys = refs
        .map((ref) => ref?.attributes?.item_key || ref?.item_key)
        .filter(Boolean);

      const responses = await Promise.all(
        itemkeys.map((key) => zoteroRequest.getOneItemBib(key))
      );

      const bibArr = responses
        .map((res) => res?.data)
        .filter(Boolean)
        .sort();

      if (mounted) setStoryReference(bibArr);
    } catch (err) {
      console.error('Zotero reference build failed:', err);
      if (mounted) setStoryReference([]);
    }
  }

  function createAnchors(data, zone) {
    const base = String(data?.name || 'HowToReadACoin')
      .replace(/\s/g, '')
      .replace(/[^a-zA-Z0-9-_]/g, '');

    return zone.map((_, i) => `${base || 'HowToReadACoin'}-slides-${i}`);
  }

  if (isLoading) {
    return <LoadingPage />;
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
          navigationPosition="right"
          anchors={storyAnchors}
          autoScrolling={true}
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

export default HowToReadACoin;