/**
 * About.jsx — Vite Migration Refactor (2026)
 *
 * Changes:
 * - `.js` → `.jsx`
 * - `process.env.REACT_APP_strapiURL` → `import.meta.env.VITE_STRAPI_URL`
 *
 * Everything else is intentionally preserved.
 */

import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import aboutUsRequest from 'src/api/about-us';
import allenMartinPortrait from 'src/assets/pages/AboutUs/allen-martin.jpg';
import LoadingPage from 'src/components/loadingPage/LoadingPage';
import { buildStudentCollaborators, buildStudentLeads } from './aboutUsTeamData';

const baseURL = import.meta.env.VITE_STRAPI_URL;

function createMarkup(textTran){
  return {__html: textTran};
}

const About = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [aboutUsData, setAboutUsdata] = useState([])
  const [currentTab, setCurrentTab] = useState("Student Leads")

  const tableTab = [
      "Student Leads",
      "Student Collaborators",
      "Humanities Advisors",
      "Grants & Funding",
      "Museums & Organizations",
      "Partner"
  ]

useEffect(() => {
  async function fetchData (){
    const result = await aboutUsRequest.aboutUsFind()

    // NEW normalized shape
    const data = result.data.data

    setAboutUsdata(data)
    setIsLoading(false)
  }
  fetchData().catch(console.error);
},[]);

	if (isLoading) return (<LoadingPage />);

  const studentLeads = buildStudentLeads(aboutUsData?.student_lead || []);
  const studentCollaborators = buildStudentCollaborators(aboutUsData?.student_collaborators || []);

  return (
    <div id='aboutus-page'>
      <h1 className='text-center'>About Us</h1>

      <div className='aboutus-des my-5 py-5'>
        <div className='aboutus-logo'>
          <img
            src={`${baseURL}${aboutUsData.logo.data.attributes.url}`}
            alt="logoside.png"
            width="90%"
          />
        </div>
        <div
          className='aboutus-description story-text-bigger'
          dangerouslySetInnerHTML={createMarkup(aboutUsData?.description)}
        />
      </div>

      <div className='aboutus-project_director my-5 py-5'>
        <h2 className='my-5 py-5 text-center'>Project Directors</h2>

        {aboutUsData?.project_directors?.map((director)=>(
          <Row key={`ProjectDirectors_${director.id}`} className='my-5 py-5 d-flex justify-content-around'>
            <Col xs={3}>
              <img
                src={`${baseURL}${director.picture.data.attributes.url}`}
                alt={director.name}
                width="100%"
                className="aboutus-avatar"
              />
            </Col>

            <Col xs={8} className='story-text light-blue-background p-5'>
              <h3 className='mb-3'>{director.name}</h3>
              <em>{director.role}</em>
              <p
                dangerouslySetInnerHTML={createMarkup(director.detail)}
                className='story-text text-left mt-3'
              />
            </Col>
          </Row>
        ))}
      </div>

      <h2 id='about-acknowledgments' className='my-5 py-5 text-center'>Acknowledgments</h2>

      <section className='aboutTable' aria-labelledby='about-acknowledgments'>
        <div className='aboutTable_tabs'>
          {tableTab.map((t,index)=>(
            <button
              type='button'
              className={`aboutTable_tab ${currentTab === t ? "aboutTable_tab--active":""}`}
              key={index}
              aria-pressed={currentTab === t}
              onClick={()=> setCurrentTab(t)}
            >
              <span>{t}</span>
            </button>
          ))}
        </div>

        <div className='aboutTable_entries'>

          {currentTab === "Student Leads" && (
            studentLeads.map(s=>(
              <Row
                className={'aboutTable-student_leads d-flex justify-content-around' + (s.isLocalProfile ? ' aboutTable-student_leads--featured' : '')}
                key={s.id}
              >
                <Col xs={3} className='aboutTable-student_leads__portrait'>
                  {s.isLocalProfile || s.picture?.data?.attributes?.url ? (
                    <img
                      src={s.isLocalProfile ? allenMartinPortrait : `${baseURL}${s.picture.data.attributes.url}`}
                      alt={s.isLocalProfile ? 'Allen Martin' : (s.picture?.data?.attributes?.alternativeText || s.name || '')}
                      width="100%"
                      className={'aboutus-avatar' + (s.isLocalProfile ? ' aboutus-avatar--portrait' : '')}
                      loading='lazy'
                      decoding='async'
                    />
                  ) : (
                    <div
                      className='aboutus-avatar aboutus-avatar--placeholder'
                      role='img'
                      aria-label={`${s.name || 'Student lead'} portrait unavailable`}
                    >
                      <span aria-hidden='true'>?</span>
                    </div>
                  )}
                </Col>

                <Col xs={8} className="story-text aboutTable-student_leads__details">
                  <p className='story-text-bigger'><strong>{s.name}</strong></p>
                  {s.isLocalProfile ? (
                    <p className='aboutTable-student_leads__position'><em>{s.detail}</em></p>
                  ) : (
                    <em dangerouslySetInnerHTML={createMarkup(s.detail)}/>
                  )}
                  <p>{s.role}</p>
                  {s.affiliation ? <p className='aboutTable-student_leads__affiliation'>{s.affiliation}</p> : null}
                </Col>
              </Row>
            ))
          )}

          {currentTab === "Student Collaborators" && (
            <Row className='aboutTable-collaborators p-5 m-5'>
              {studentCollaborators.map(s=>(
                <Col xs={6} className="story-text mb-5" key={s.id}>
                  <p className='story-text-bigger'><strong>{s.caption}</strong></p>
                  <em>{s.subcaption}</em>
                  <p dangerouslySetInnerHTML={createMarkup(s.descriotion)} />
                </Col>
              ))}
            </Row>
          )}

          {currentTab === "Humanities Advisors" && (
            <div dangerouslySetInnerHTML={createMarkup(aboutUsData.humanities_advisors)} className='p-5 m-5'/>
          )}

          {currentTab === "Grants & Funding" && (
            <div dangerouslySetInnerHTML={createMarkup(aboutUsData.grants_and_funding)} className='p-5 m-5'/>
          )}

          {currentTab === "Museums & Organizations" && (
            <div dangerouslySetInnerHTML={createMarkup(aboutUsData.museums_and_organizations)} className='p-5 m-5'/>
          )}

          {currentTab === "Partner" && (
            <div dangerouslySetInnerHTML={createMarkup(aboutUsData.partner)} className='p-5 m-5'/>
          )}

        </div>
      </section>
    </div>
  );
}

export default About;
