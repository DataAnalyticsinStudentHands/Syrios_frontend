/**
 * Stories.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders the Stories landing page, including:
 * - story homepage CMS content
 * - story card grid
 *
 * Refactor Summary:
 * 1. Mixed Response Compatibility
 *    - `storyHomeFind()` now uses normalized access:
 *        textresult.data.data
 *    - `storyFind()` remains raw:
 *        result.data.data[] with `story.attributes`
 *
 * 2. Preserved Existing Behavior
 *    - Story filtering, layout, and image card rendering remain unchanged
 *
 * 3. Improved Safety
 *    - Adds basic error handling and safer default state values
 *
 * Notes:
 * - This component intentionally supports both normalized and raw story endpoints
 * - `storyFind()` should not be flattened until all story list consumers are updated
 *
 * Future Improvements:
 * - Normalize `storyFind()` and migrate story list consumers
 * - Replace hardcoded Zotero filter (`id !== 1`) with backend/content flag
 * - Add empty-state UI when no stories are available
 */

import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import storyRequest from 'src/api/story';
import LoadingPage from 'src/components/loadingPage/LoadingPage';
import Footer from 'src/components/footerv2/Footer2';
import PageTitleComponent from 'src/components/constant/pageTitleText';

const Stories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const [storyContent, setStoryContent] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [result, textresult] = await Promise.all([
          storyRequest.storyFind(),
          storyRequest.storyHomeFind(),
        ]);

        // storyHomeFind() is normalized
        setStoryContent(textresult?.data?.data || {});

        // storyFind() remains raw
        const rawStories = result?.data?.data || [];

        function filterOutZotero(item) {
          return item.id !== 1;
        }

        setStories(rawStories.filter(filterOutZotero));
      } catch (error) {
        console.error('Failed to load stories page:', error);
        setStories([]);
        setStoryContent({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchData().catch(console.error);
  }, []);

  if (isLoading) {
    return (
      <>
        <LoadingPage />
        <Footer />
      </>
    );
  }

  return (
    <div id='stories-page'>
      <PageTitleComponent
        title={storyContent.head}
        text={storyContent.text}
        subtext={storyContent.sub_text}
      />

      <Row className="py-5 my-5 align-items-end">
        {stories.map((story) => {
          return (
            <Col key={`StoryReader-${story.id}`}>
              <Link to={`/StoryReader?id=${story.id}`}>
                <div className='select-story-div'>
                  <img
                    src={`${import.meta.env.VITE_STRAPI_URL}${story?.attributes?.image?.data?.attributes?.url || ''}`}
                    alt="Story_Image"
                    width="100%"
                    className="text-center"
                  />
                  <p className='text-center select-story-text mt-5'>
                    {story?.attributes?.name}
                  </p>
                </div>
              </Link>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Stories;