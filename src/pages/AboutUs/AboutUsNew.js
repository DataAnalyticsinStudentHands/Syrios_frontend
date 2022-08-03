import React, { useState, useEffect } from 'react';
import {Container,Row, Col} from 'react-bootstrap';

import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer.js';
import aboutUsRequest from 'src/api/about-us';

function createMarkup(textTran){
  return {__html: textTran};
}

const About = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [aboutUsData, setAboutUsData] = useState([])

  useEffect(() => {
    async function fetchData (){
      const result = await aboutUsRequest.aboutUsFind()
      // console.log(result.data.data.attributes)
      setAboutUsData(result.data.data.attributes)
      setIsLoading(false)
    }
    fetchData().catch(console.error);
  },[]);


  if (isLoading) { 
    return (
      <>
        <LoadingPage />
        <Footer />
      </>
    );
  }
  return (
    <>
      <div id='about'>
        <Container>
          <Row className='my-5'><Col className='story-h1 text-center'>About Us</Col></Row>
          <Row className='align-items-center'>
            <Col sm={3}><img alt='logo' width='50%' src={process.env.REACT_APP_strapiURL+aboutUsData.logo.data.attributes.url}/></Col>
            <Col dangerouslySetInnerHTML={createMarkup(aboutUsData.description)} className='story-text-bigger'/>
          </Row>
        </Container>
        <Container>
          <Row className='my-5'><Col className=' story-h1 text-center'>Meet the Team</Col></Row>
          {aboutUsData.project_directors.length === 0 ?(<></>):(
          <>
            <Row className='my-5'><Col className='story-h2 text-center'>Project Directors</Col></Row>
            {aboutUsData.project_directors.map((director)=>{
              return(
                <Row key={`ProjectDirectors_${director.id}`} className='my-5'>
                  <Col xs={3} className='d-flex align-items-center'>
                    <div className='about-member-pictures-outline'>
                      <div className='about-member-pictures'>
                        <img
                          src={`${process.env.REACT_APP_strapiURL}${director.picture.data.attributes.url}`}
                          alt={director.name}/>
                      </div>
                    </div>
                  </Col>
                  <Col className='light-blue-background p-5'>
                    <Row className='story-h3 mb-3'><Col>{director.name}</Col></Row>
                    <Row className='story-text mb-3'><Col>{director.role}</Col></Row>
                    <Row dangerouslySetInnerHTML={createMarkup(director.detail)} className='story-text text-left'/>
                  </Col>
                </Row>
              )
            })}
          </>)}
          
          {aboutUsData.media_content_team.length === 0 ? (<></>):(<>
            <Row className='my-5'> <Col className='story-h2 my-5 text-center about-digital-team'>Digital Team and Media Directors</Col></Row>
            {aboutUsData.media_content_team.map((team)=>{
              return(
                <Row key={`media_content_team_${team.id}`} className='my-5'>
                  <Col xs={3} className='d-flex align-items-center'>
                    <div className='about-member-pictures-outline'>
                      <div className='about-member-pictures'>
                        <img
                          src={`${process.env.REACT_APP_strapiURL}${team.picture.data.attributes.url}`}
                          alt={team.name}/>
                      </div>
                    </div>
                  </Col>
                  <Col className='light-blue-background p-5'>
                    <Row className='story-h3 mb-3'><Col>{team.name}</Col></Row>
                    <Row className='story-text mb-3'><Col>{team.role}</Col></Row>
                    <Row dangerouslySetInnerHTML={createMarkup(team.detail)} className='story-text text-left'/>
                  </Col>
                </Row>
              )
            })}
          </>)}

          {aboutUsData.past_student_research_assistants.length===0 ?(<></>):(<>
              <Row className='my-5'><Col className='story-h3 my-5 text-center'>Past Student Research Assistants</Col></Row>
              <Row className='light-blue-background p-5'>
                {aboutUsData.past_student_research_assistants.map((student)=>{
                  return(
                    <Col xs={12} key={`student_${student.id}`}
                    dangerouslySetInnerHTML={createMarkup(student.student)} 
                    className='story-text mb-3' />
                  )
                })}
              </Row>
          </>)}

          {/* <Row style={{ marginTop: '100px', marginBottom: '40px' }}> */}
          <Row className='my-5'><Col className='story-h2 my-5 text-center'>Acknowlegments</Col></Row>
          <Row>
            <Col>
              {aboutUsData.acknowledgment_left ? (<>
                <Row dangerouslySetInnerHTML={createMarkup(aboutUsData.acknowledgment_left)} className='story-text'/>
              </>):(<></>)}
              <Row className='my-3'>
                {aboutUsData.acknowledgment_left_link.length === 0 ?(<></>):(<>
                  {aboutUsData.acknowledgment_left_link.map((o)=>{
                    return(
                        <Col xs={12}  key={`link_left_${o.id}`} className='story-text'>
                          {o.link?(<a href={`${o.link}`} target="_blank" rel="noopener noreferrer">{o.name}</a>):(<>{o.name}</>)}
                        </Col>)  
                      })}
                </>)}
              </Row>
            </Col>
            <Col>
              <Row dangerouslySetInnerHTML={createMarkup(aboutUsData.acknowledgment_right)} className='story-text' />
              <Row className='my-3'>
                {aboutUsData.acknowledgment_right_link.length === 0 ?(<></>):(<>
                    {aboutUsData.acknowledgment_right_link.map((o)=>{
                      return(
                          <Col xs={12}  key={`link_right_${o.id}`} className='story-text'>
                            {o.link?(
                              <a href={`${o.link}`} target="_blank" rel="noopener noreferrer">
                              {o.name}
                            </a>
                            ):(<>{o.name}</>)}
                          </Col>)
                      })}
                  </>)}
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default About;
