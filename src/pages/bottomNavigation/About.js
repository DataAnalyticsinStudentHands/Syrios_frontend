import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Container,Row, Col} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

import Navbar from 'src/components/Navbar.js';
import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer.js';
import './About.css'
import 'src/components/constants.css'

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
        <div className='AboutMemberPicturesOutline'>
          <div className='AboutMemberPictures'>
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
            <Col className='gray-text' style={{ fontSize: '2em' }}>
              {e.name}
            </Col>
          </Row>
          <Row>
            {/* their role */}
            <Col className='gray-text'>
              {e.role}
            </Col>
          </Row>
          {/* This is the paragraph below. This is the only way to enforce a newline character by making a new row */}                      
          {/* {detailJsxArr} */}
          <div dangerouslySetInnerHTML={createMarkup(e.detail)} className='gray-text CaptionText text-left'/>
        </Container>
      </Col>
    </Row>
  );
}

const About = () => {
  const [isLoading, set_isLoading] = useState(true);
  const [description, setDescription] = useState(undefined)
  const [acknowledgements, setAcknowledgements] = useState(undefined)
  const [digitalMediaAndContentTeam, setDigitalMediaAndContentTeam] = useState(undefined)
  const [logo, setLogo] = useState(undefined)
  const [projectDirectors, setProjectDirectors] = useState(undefined)
  const [pastStudentResearchAssistants, setPastStudentResearchAssigstants]= useState(undefined)

  useEffect(() => {
    if(isLoading) {
      // axios.get(`${process.env.REACT_APP_strapiURL}/about-us`)
      axios.get(`${process.env.REACT_APP_strapiURL}/api/about-us`)
        .then((res) => {
          let data = res.data.data.attributes
          console.log(data)

          setDescription(data.description)
          setLogo(data.logo)
          setPastStudentResearchAssigstants(data.past_student_research_assistants)

          let projectDirectorsJsxArr = [];
          data.project_directors.forEach((e, index) => {
            projectDirectorsJsxArr.push(TeamJsx(e, index));
          });
          setProjectDirectors(projectDirectorsJsxArr)
          console.log(projectDirectors)

          let digitalMediaAndContentTeamJsxArr = [];
          data.media_content_team.forEach((e, index) => {
            digitalMediaAndContentTeamJsxArr.push(TeamJsx(e, index));
          });
          setDigitalMediaAndContentTeam(digitalMediaAndContentTeamJsxArr)

          let acknowledgementsJsxArr = []
          data.acknowledgements.forEach((e,index) => {
            acknowledgementsJsxArr.push(
              <Row 
                className='RowDecreaseToParagraphSize' 
                key={`acknowledgements_${index}`}
              >
                <Col>
                  <div dangerouslySetInnerHTML={createMarkup(e.text)} className='text-center AboutAcknowlegments gray-text'/>
                </Col>
              </Row>
            );
          })
          setAcknowledgements(acknowledgementsJsxArr)
          set_isLoading(false);

        })
    }
  },[]);

  if (isLoading) { // isLoading is true, show loading page, else show real page
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
      <div id='About'>
        <Container>
          <Row>
            <Col>
              <p id='AboutTitle' className='blue-text text-center'>
                {/* {title} */} 
                {/* Why we need call title, no need */}
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
              <div dangerouslySetInnerHTML={createMarkup(description)} className='gray-text'/>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row>
            <Col>
              <p id='AboutMeetTheTeam' className='blue-text text-center'>
                Meet the Team
              </p>
            </Col>
          </Row>

          <Row>
            <Col>
              <p id='AboutProjectDirectors' className='orange-text text-center'>
                Project Directors
              </p>
            </Col>
          </Row>
          {projectDirectors}

          <Row>
            <Col>
              <p id='AboutDigitalTeam' className='orange-text text-center'>
                Digital Team and Media Directors
              </p>
            </Col>
          </Row>
          {digitalMediaAndContentTeam}
          <Row style={{ marginTop: '200px', marginBottom: '50px' }}>
            <Col>
              <p className='gray-text text-center' style={{ fontSize: '4em' }}>
                Past Student Research Assistants
              </p>
            </Col>
          </Row>
          <Row className='light-blue-background'>
            <Col style={{ margin: '20px', marginBottom: '15px' }}>
              <div dangerouslySetInnerHTML={createMarkup(pastStudentResearchAssistants)} className='gray-text CaptionText text-center'/>
            </Col>
          </Row>

          <Row style={{ marginTop: '100px', marginBottom: '40px' }}>
            <Col>
              <p className='orange-text text-center' style={{ fontSize: '4em' }}>
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
