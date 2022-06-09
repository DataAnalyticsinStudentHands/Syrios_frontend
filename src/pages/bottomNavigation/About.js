import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Container,Row, Col} from 'react-bootstrap';

import Navbar from 'src/components/Navbar.js';
import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer.js';

function createMarkup(textTran){
  return {__html: textTran};
}

const TeamJsx = (e, index) => { // This function is used to display profile picture, and detail of what the person contributed to the project
  // The detail for the person's information needs some "special" love for it to work. New lines don't work well, so each new line will be a new row
  // Return profile information
  return (
    <Row key={`ProjectDirectors_${index}`}>
      {/* profile picture */}
      <Col xs={3}>
        <div className='about-member-pictures-outline'>
          <div className='about-member-pictures'>
            <img
              src={`${process.env.REACT_APP_strapiURL}${e.picture.data.attributes.url}`}
              alt={e.name}/>
          </div>
        </div>
      </Col>
      {/* profile information */}
      <Col className='light-blue-background'>
        <Container style={{margin: '20px' }}>
          <Row>
            {/* name and alias */}
            <Col className='story-h3'>
              {e.name}
            </Col>
          </Row>
          <Row>
            {/* their role */}
            <Col className='story-text'>
              {e.role}
            </Col>
          </Row>
          {/* This is the paragraph below. This is the only way to enforce a newline character by making a new row */}                      
          {/* {detailJsxArr} */}
          <div dangerouslySetInnerHTML={createMarkup(e.detail)} className='story-text text-left'/>
        </Container>
      </Col>
    </Row>
  );
}

const About = () => {
  const [is_loading, set_is_loading] = useState(true);
  const [description, set_description] = useState(undefined)
  const [acknowledgements, set_acknowledgements] = useState(undefined)
  const [digital_media_and_content_team, set_digital_media_and_content_team] = useState(undefined)
  const [logo, set_logo] = useState(undefined)
  const [project_directors, set_project_directors] = useState(undefined)
  const [past_student_research_assistants, set_past_student_research_assistants]= useState(undefined)

  useEffect(() => {
    if(is_loading) {
      // axios.get(`${process.env.REACT_APP_strapiURL}/about-us`)
      axios.get(`${process.env.REACT_APP_strapiURL}/api/about-us`)
        .then((res) => {
          let data = res.data.data.attributes

          set_description(data.description)
          set_logo(data.logo)
          set_past_student_research_assistants(data.past_student_research_assistants)

          let project_directors_jsx_arr = [];
          data.project_directors.forEach((e, index) => {
            project_directors_jsx_arr.push(TeamJsx(e, index));
          });
          set_project_directors(project_directors_jsx_arr)

          let digital_media_and_content_teamJsxArr = [];
          data.media_content_team.forEach((e, index) => {
            digital_media_and_content_teamJsxArr.push(TeamJsx(e, index));
          });
          set_digital_media_and_content_team(digital_media_and_content_teamJsxArr)

          let acknowledgements_jsx_arr = []
          data.acknowledgements.forEach((e,index) => {
            acknowledgements_jsx_arr.push(
              <Row 
                className='row-decrease-to-paragraph-size' 
                key={`acknowledgements_${index}`}
              >
                <Col>
                  <div dangerouslySetInnerHTML={createMarkup(e.text)} className='text-center about-acknowlegments gray-text'/>
                </Col>
              </Row>
            );
          })
          set_acknowledgements(acknowledgements_jsx_arr)
          set_is_loading(false);

        })
    }
  });

  if (is_loading) { // is_loading is true, show loading page, else show real page
    return (
      <>
        <Navbar />
        <LoadingPage />
        <Footer />
      </>
    );
  }
  return (
    <>
      <Navbar />
      <div id='about'>
        <Container>
          <Row className='my-5'>
            <Col>
              <p className='story-h1 text-center'>
                About the Syrios Project
              </p>
            </Col>
          </Row>
          <Row className='align-items-center'>
            <Col sm={3}>
              <img
                alt='logo'
                width='90%'
                src={process.env.REACT_APP_strapiURL+logo.data.attributes.url}/>
            </Col>
            <Col>
              <div dangerouslySetInnerHTML={createMarkup(description)} className='story-text'/>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row className='mt-5'>
            <Col>
              <p className='story-h1 text-center'>
                Meet the Team
              </p>
            </Col>
          </Row>

          <Row className='mb-5'>
            <Col>
              <p className='story-h2 text-center'>
                Project Directors
              </p>
            </Col>
          </Row>
          {project_directors}

          <Row className='my-5'> 
            <Col>
              <p className='story-h2 text-center about-digital-team'>
                Digital Team and Media Directors
              </p>
            </Col>
          </Row>
          {digital_media_and_content_team}
          <Row style={{ marginTop: '200px', marginBottom: '50px' }}>
            <Col>
              <p className='story-h3 text-center' >
                Past Student Research Assistants
              </p>
            </Col>
          </Row>
          <Row className='light-blue-background'>
            <Col style={{ margin: '20px', marginBottom: '15px' }}>
              <div dangerouslySetInnerHTML={createMarkup(past_student_research_assistants)} className='gray-text caption-text text-center'/>
            </Col>
          </Row>

          <Row style={{ marginTop: '100px', marginBottom: '40px' }}>
            <Col>
              <p className='story-h2 text-center' >
                Acknowlegments
              </p>
            </Col>
          </Row>
          {acknowledgements}
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default About;
