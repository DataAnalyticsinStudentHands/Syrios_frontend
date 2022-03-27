import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Container,Row, Col} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

import Navbar from 'src/components/Navbar.js';
import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer.js';
import './About.css'
import 'src/components/constants.css'



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
              src={`${process.env.REACT_APP_strapiURL}${e.picture.data.attributes.url}`}
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

const About = () => {
  const [isLoading, set_isLoading] = useState(true);
  const [description, setDescription] = useState(undefined)
  const [acknowledgements, setAcknowledgements] = useState(undefined)
  const [digital_media_and_content_team, setDigitalMediaAndContentTeam] = useState(undefined)
  const [logo, setLogo] = useState(undefined)
  const [project_directors, setProjectDirectors] = useState(undefined)
  const [past_student_research_assistants, setPastStudentResearchAssigstants]= useState(undefined)

  useEffect(() => {
    if(isLoading) {
      // axios.get(`${process.env.REACT_APP_strapiURL}/about-us`)
      axios.get(`${process.env.REACT_APP_strapiURL}/api/about-us?populate=project_directors.picture,digital_media_and_content_team.picture,logo,acknowledgements`)
        .then((res) => {
          let data = res.data.data.attributes

          let projectDirectorsJsxArr = [];
          data.project_directors.forEach((e, index) => {
            projectDirectorsJsxArr.push(TeamJsx(e, index));
          });
          setProjectDirectors(projectDirectorsJsxArr)

          let digitalMediaAndContentTeamJsxArr = [];
          data.digital_media_and_content_team.forEach((e, index) => {
            digitalMediaAndContentTeamJsxArr.push(TeamJsx(e, index));
          });
          setDigitalMediaAndContentTeam(digitalMediaAndContentTeamJsxArr)

          let acknowledgementsJsxArr = []
          data.acknowledgements.forEach((e, index) => {
            acknowledgementsJsxArr.push(
              <Row className='RowDecreaseToParagraphSize' key={`acknowledgements_${index}`}>
                <Col>
                  <ReactMarkdown className='text-center AboutAcknowlegments GrayText'>
                    {e.text}
                  </ReactMarkdown>
                </Col>
              </Row>
            );
          })
          setAcknowledgements(acknowledgementsJsxArr)
          setDescription(data.description)
          setLogo(data.logo)
          setPastStudentResearchAssigstants(data.past_student_research_assistants)
          set_isLoading(false);

        })
    }
  });

  if (isLoading) { // isLoading is true, show loading page, else show real page
    return (
      <>
        {Navbar()}
        {LoadingPage()}
        {Footer()}
      </>
    );
  }
  return (
    <>
      {Navbar()}
      <div id='About'>
        <Container>
          <Row>
            <Col>
              <p id='AboutTitle' className='BlueText text-center'>
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
                src={process.env.REACT_APP_strapiURL+logo.data[0].attributes.url}/>
            </Col>
            <Col>
              <ReactMarkdown className='GrayText'>
                {description}
              </ReactMarkdown>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row>
            <Col>
              <p id='AboutMeetTheTeam' className='BlueText text-center'>
                Meet the Team
              </p>
            </Col>
          </Row>

          <Row>
            <Col>
              <p id='AboutProjectDirectors' className='OrangeText text-center'>
                Project Directors
              </p>
            </Col>
          </Row>
          {project_directors}

          <Row>
            <Col>
              <p id='AboutDigitalTeam' className='OrangeText text-center'>
                Digital Team and Media Directors
              </p>
            </Col>
          </Row>
          {digital_media_and_content_team}

          <Row style={{ marginTop: '200px', marginBottom: '50px' }}>
            <Col>
              <p className='GrayText text-center' style={{ fontSize: '4em' }}>
                Past Student Research Assistants
              </p>
            </Col>
          </Row>
          <Row className='LightBlueBackground'>
            <Col style={{ margin: '20px', marginBottom: '15px' }}>
              <ReactMarkdown className='GrayText'>
                {past_student_research_assistants}
              </ReactMarkdown>
            </Col>
          </Row>

          <Row style={{ marginTop: '100px', marginBottom: '40px' }}>
            <Col>
              <p className='OrangeText text-center' style={{ fontSize: '4em' }}>
                Acknowlegments
              </p>
            </Col>
          </Row>
          {acknowledgements}

        </Container>
      </div>
      {Footer()}
    </>
  );
}

export default About;
