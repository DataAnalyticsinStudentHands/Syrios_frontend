import {Container, Row, Col} from 'react-bootstrap'
import ReactMarkdown from 'react-markdown';

const TeamJsx = (e, index) => { // This function is used to display profile picture, and detail of what the person contributed to the project
    // The detail for the person's information needs some "special" love for it to work. New lines don't work well, so each new line will be a new row
    let detailJsxArr = [];
    e.detail.split("\n").forEach((e) => {
      detailJsxArr.push(
        <Row key={e} className='RowDecreaseToParagraphSize'>
          {/* The detailed information needs to force newline with new row */}
          <Col>
            <ReactMarkdown className='GrayText'>
              {e}
            </ReactMarkdown>
          </Col>
        </Row>
      );
    });

    // Return profile information
    return (
      <Row key={`ProjectDirectors_${index}`}>
        {/* profile picture */}
        <Col xs={3}>
          <div className='AboutMemberPicturesOutline'>
            <div className='AboutMemberPictures'>
              <img
                src={`${process.env.REACT_APP_strapiURL}${e.picture.url}`}
                alt={e.name}/>
            </div>
          </div>
        </Col>
        {/* profile information */}
        <Col className='LightBlueBackground'>
          <Container style={{margin: '20px' }}>
            <Row>
              {/* name and alias */}
              <Col>
                <p className='GrayText' style={{ fontSize: '2em' }}>
                  {e.name}
                </p>
              </Col>
            </Row>
            <Row>
              {/* their role */}
              <Col>
                <ReactMarkdown className='GrayText'>
                  {e.role}
                </ReactMarkdown>
              </Col>
            </Row>
            {/* This is the paragraph below. This is the only way to enforce a newline character by making a new row */}                      
            {detailJsxArr}
          </Container>
        </Col>
      </Row>
    );
  }
  export default TeamJsx