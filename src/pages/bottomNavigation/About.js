import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Row, 
  Col
} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

import Navbar from 'src/components/Navbar.js';
import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer.js';

import './About.css'
import 'src/components/constants.css'



const About = () => {
  const [page, set_page] = useState(undefined);
  const [isLoading, set_isLoading] = useState(true);

  useEffect(() => {
    if(isLoading) {
      axios.get(`${process.env.REACT_APP_strapiURL}/about-us`)
        .then((res, error) => {
          if (error) {
            console.error(error);
          } else {
            const TeamJsx = (e, index) => { // This function is used to display profile picture, and detail of what the person contributed to the project
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
                      {/* This is the paragraph below. This is the only way to enforce a newline character by making a new row */}                      {detailJsxArr}
                    </Container>
                  </Col>
                </Row>
              );
            }

            let projectDirectorsJsxArr = [];
            res.data.project_directors.forEach((e, index) => {
              projectDirectorsJsxArr.push(
                TeamJsx(e, index)
              );
            });

            let digitalMediaAndContentTeamJsxArr = [];
            res.data.digital_media_and_content_team.forEach((e, index) => {
              digitalMediaAndContentTeamJsxArr.push(TeamJsx(e, index));
            });

            // Magic happens here.
            set_page(
              <div id='About'>
                <Container>
                  <Row>
                    <Col>
                      <p id='AboutTitle' className='BlueText text-center'>
                        {res.data.title}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={3}>
                      <img
                        alt='logo'
                        width='90%'
                        src={process.env.REACT_APP_strapiURL+res.data.logo.url}/>
                    </Col>
                    <Col>
                      <ReactMarkdown className='GrayText'>
                        {res.data.description}
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
                  <Row style={{ marginTop: '-4em' }}>
                    <Col>
                      <p id='AboutProjectDirectors' className='OrangeText text-center'>
                        Project Directors
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                    </Col>
                  </Row>
                  {projectDirectorsJsxArr}
                  <Row>
                    <Col>
                      <p id='AboutDigitalTeam' className='OrangeText text-center'>
                        Digital Team and Media Directors
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                    </Col>
                  </Row>
                  {digitalMediaAndContentTeamJsxArr}
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
                        {res.data.past_student_research_assistants}
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
                  {(() => {
                    let jsxArr = [];
                    res.data.acknowledgements.forEach((e, index) => {
                      jsxArr.push(
                        <Row className='RowDecreaseToParagraphSize' key={`acknowledgements_${index}`}>
                          <Col>
                            <ReactMarkdown className='text-center AboutAcknowlegments GrayText'>
                              {e.text}
                            </ReactMarkdown>
                          </Col>
                        </Row>
                      );
                    });

                    return (
                      <>
                        {jsxArr}
                      </>
                    );
                  })()}
                </Container>
              </div>
            );
            set_isLoading(false);
          }
        });
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
      {page}
      {Footer()}
    </>
  );
}

export default About;
