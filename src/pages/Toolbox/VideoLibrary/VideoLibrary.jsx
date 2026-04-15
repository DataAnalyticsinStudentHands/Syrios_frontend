/**
 * VideoLibrary.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders the Video Library page and modal video player.
 *
 * Refactor Summary:
 * 1. Response Normalization Compatibility
 *    - Updated video row access from:
 *        video.attributes.*
 *      → to:
 *        video.*
 *    - Aligns with normalized `video-library.js`
 *
 * 2. Preserved Existing Behavior
 *    - Modal player, thumbnail rendering, and video card layout remain unchanged
 *
 * 3. Improved Safety
 *    - Adds try/catch/finally around async fetch
 *    - Uses safer default state values
 *    - Guards nested thumbnail media access
 *
 * Notes:
 * - Assumes `VideoLibraryRequest.videoFind()` returns normalized rows
 * - Nested media relations remain relation-shaped and still use `.data.attributes`
 *
 * Future Improvements:
 * - Add page title/intro text to CMS if desired
 * - Add search/filtering by topic
 * - Add empty-state UI when no videos are available
 */

import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import VideoLibraryRequest from 'src/api/video-library';
import LoadingPage from 'src/components/loadingPage/LoadingPage';
import createMarkup from 'src/utils/Markup';

import Modal from "react-responsive-modal";
import 'react-responsive-modal/styles.css';

function Player(props) {
  const { open, toggleModal, url } = props;

  return (
    <Modal
      open={open}
      onClose={toggleModal}
      styles={{
        modal: { maxWidth: "unset", width: "80%" },
        overlay: { background: "rgba(0, 0, 0, 0.5)" },
        closeButton: { background: "white" },
      }}
      center
    >
      <ReactPlayer
        url={url}
        width="100%"
        height="calc(100vh - 350px)"
        controls={true}
        playing={true}
      />
    </Modal>
  );
}

const VideoLibrary = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const [videoData, setVideoData] = useState([]);
  const [url, setUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await VideoLibraryRequest.videoFind();

        // Updated for normalized response
        setVideoData(result?.data?.data || []);
      } catch (error) {
        console.error('Failed to load video library:', error);
        setVideoData([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  function handleOpenModal(url) {
    setUrl(url);
    setIsOpen(true);
  }

  function handleCloseModal() {
    setIsOpen(false);
  }

  if (isLoading) return <LoadingPage />;

  return (
    <div id='video-library'>
      <h1 className='text-center mb-5 pb-5'>Video Library</h1>

      <h3 className='text-center'>
        Watch short informational videos on a wide range of topics related to the study of coins, the ethics of coin collecting, Syrian cultural heritage, and more.
      </h3>

      <Player open={isOpen} toggleModal={handleCloseModal} url={url} />

      <Row className='d-flex justify-content-around'>
        {videoData.length === 0 ? null : (
          <>
            {videoData.map((video) => {
              const thumbnail = video?.video_thumbnail?.data?.attributes;

              return (
                <Col key={video.id} xs={3} className="mt-5 pt-5 text-center">
                  {thumbnail ? (
                    <img
                      src={`${import.meta.env.VITE_STRAPI_URL}${thumbnail.url}`}
                      alt={thumbnail.alternativeText || 'Video thumbnail'}
                      onClick={() => handleOpenModal(video.video_url)}
                      style={{ cursor: "pointer", width: "20vmax", height: "15vmax" }}
                      className="bg-white p-3"
                    />
                  ) : (
                    <b
                      className='image-icon text-center'
                      style={{ cursor: "pointer", fontSize: "10vmax" }}
                      onClick={() => handleOpenModal(video.video_url)}
                    >
                      &#xe81f;
                    </b>
                  )}

                  <h4 className='mt-4'>{video.video_title || ""}</h4>

                  <p
                    className='story-caption'
                    dangerouslySetInnerHTML={createMarkup(video.video_description || "")}
                  />
                </Col>
              );
            })}
          </>
        )}
      </Row>
    </div>
  );
};

export default VideoLibrary;