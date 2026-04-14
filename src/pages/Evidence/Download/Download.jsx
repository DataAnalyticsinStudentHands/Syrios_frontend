/**
 * Download.jsx — Vite Migration Refactor (2026)
 *
 * Changes:
 * - `.js` → `.jsx`
 * - removed `.js` extension from JSX/util imports
 * - `process.env.REACT_APP_strapiURL` → `import.meta.env.VITE_STRAPI_URL`
 *
 * All logic, structure, and comments preserved exactly.
 */

import React, {useEffect, useState} from 'react';
import { Row, Col} from 'react-bootstrap';

import LoadingPage from 'src/components/loadingPage/LoadingPage';
import createMarkup from 'src/utils/Markup';

import downloadRequest from 'src/api/download';
import DownloadForm from './DownloadForm';

const baseURL = import.meta.env.VITE_STRAPI_URL;

function Download(){
  const [isLoading, setIsLoading] = useState(true);
  const [downloadPageData, setDownloadPageData] = useState([])

  useEffect(() => {
    async function fetchData(){
      const result = await downloadRequest.downloadFind();
      setDownloadPageData(result.data.data.attributes)
      setIsLoading(false)
    }
    fetchData()
  },[]);

  if (isLoading) {return(<LoadingPage />);}

  return(
      <div id='download-page'>
          <h1>Download the Data</h1>
          <Row className='d-flex justify-content-between align-items-center'>
            <Col sm={12} md={8}>
                <Row className='d-flex justify-content-around'>
                  <Col xs={3} className='text-center story-icon download-icon'>&#xe810;</Col>
                  <Col xs={9} className='story-text' dangerouslySetInnerHTML={createMarkup(downloadPageData.text) } />
                </Row>
                <Row>
                  <img alt={'Download'} src={`${baseURL}/uploads/Image_47_89dc6433d0.png?updated_at=2022-04-14T13:41:55.091Z`}/>
                </Row>
            </Col>
            <Col sm={12} md={3} >
              <DownloadForm url={downloadPageData.coinData.data.attributes.url}/>
            </Col>
          </Row>
      </div>
  );
}

export default Download;