import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Container,Row, Col} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

import Navbar from 'src/components/Navbar.js';
import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer.js';
import './About.css'
import 'src/components/constants.css'

import TeamJsx from './TeamJsx';

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
      axios.get(`${process.env.REACT_APP_strapiURL}/about-us`)
        .then((res) => {
          // console.log(res.data.data.attributes)
            setDescription(res.data.description)
            setLogo(res.data.logo)
            setPastStudentResearchAssigstants(res.data.past_student_research_assistants)

            let projectDirectorsJsxArr = [];
            res.data.project_directors.forEach((e, index) => {
              projectDirectorsJsxArr.push(TeamJsx(e, index));
            });
            setProjectDirectors(projectDirectorsJsxArr)

            let digitalMediaAndContentTeamJsxArr = [];
            res.data.digital_media_and_content_team.forEach((e, index) => {
              digitalMediaAndContentTeamJsxArr.push(TeamJsx(e, index));
            });
            setDigitalMediaAndContentTeam(digitalMediaAndContentTeamJsxArr)

            let acknowledgementsJsxArr = []
            res.data.acknowledgements.forEach((e, index) => {
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
                  src={process.env.REACT_APP_strapiURL+logo.url}/>
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
