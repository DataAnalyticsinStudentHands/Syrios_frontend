import React, { useState, useEffect } from 'react';
import {Row, Col} from 'react-bootstrap';
import Footer from 'src/components/footer/Footer.js';
import aboutUsRequest from 'src/api/about-us';
import LoadingPage from 'src/components/loadingPage/LoadingPage';
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
  ]
  useEffect(() => {
    async function fetchData (){
      const result = await aboutUsRequest.aboutUsFind()
      const data = result.data.data.attributes
      console.log(data)
      setAboutUsdata(data)
      setIsLoading(false)
    }
    fetchData().catch(console.error);
  },[]);

	if (isLoading)return (<><LoadingPage /><Footer /></>);
  return (
    <>
      <div id='aboutus-page'>
        <h1 className='text-center'>About Us</h1>
        <div className='aboutus-des my-5 py-5'>
          <div className='aboutus-logo'>
            <img
              src={`${process.env.REACT_APP_strapiURL}${aboutUsData.logo.data.attributes.url}`}
              alt="logoside.png"
              width="100%"
            />
          </div>
          <div className='aboutus-description story-text-bigger' dangerouslySetInnerHTML={createMarkup(aboutUsData?.description)}/>

        </div>
        <div className='aboutus-project_director my-5'>
          <h2 className='my-5 py-5 text-center'>Project Directors</h2>
          {aboutUsData?.project_directors?.map((director)=>{
            return(
              <Row key={`ProjectDirectors_${director.id}`} className='my-5 d-flex justify-content-around'>
                <Col xs={3} className=''>
                    <img
                      src={`${process.env.REACT_APP_strapiURL}${director.picture.data.attributes.url}`}
                      alt={director.name}
                      width="100%"
                      className="aboutus-avatar"
                    />
                </Col>
                <Col xs={8} className='story-text light-blue-background p-5'>
                  <h3 className='mb-3'>{director.name}</h3>
                  <em>{director.role}</em>
                  <p dangerouslySetInnerHTML={createMarkup(director.detail)} className='story-text text-left mt-3'/>
                </Col>
              </Row>
            )
          })}
        </div>

        <h2 className='my-5 py-5 text-center '>Acknowledgments</h2>
        <div className='aboutTable'>
          <div className='aboutTable_tabs'>
            {tableTab.map((t,index)=>{
              return(
                <div 
                  className={`aboutTable_tab mb-5 ${currentTab === t ? "aboutTable_tab--active":""}`} 
                  key={index} onClick={e=> setCurrentTab(t)}>
                    <p>{t}</p>
                </div>
              )
            })}
          </div>
          <div className='aboutTable_entries'>
            {
              currentTab === "Student Leads" ? (
              aboutUsData?.student_lead?.map(s=>{
                return(
                  <Row className='aboutTable-student_leads' key={s.id}>
                    <Col xs={3} className="d-flex justify-content-center">
                          <img 
                          src={ `${process.env.REACT_APP_strapiURL}${s.picture.data?.attributes.url}`}            
                          alt={s.picture.data?.attributes.alternativeText ?? ""}
                          // width={"100px"}
                          width="100%"
                          className="aboutus-avatar"
                        />                      
                    </Col>

                    <Col xs={8} className="story-text">
                        <p className='story-text-bigger'><strong>{s.name}</strong></p>
                        <em dangerouslySetInnerHTML={createMarkup(s.detail)}/>
                        <p>{s.role}</p>
                    </Col>
                  </Row>
                )
              })
              ):(<></>)
            }

            {
              currentTab === "Student Collaborators" ? (
                <Row className='aboutTable-collaborators p-5'>
                  {              
                  aboutUsData?.student_collaborators?.map(s=>{
                  return(
                    <Col xs={6} className="story-text mb-5" key={s.id}>
                      <p className='story-text-bigger'><strong>{s.caption}</strong></p>
                      <em>{s.subcaption}</em>
                      <p dangerouslySetInnerHTML={createMarkup(s.descriotion)} />
                    </Col>
                    )
                  })}
                </Row>
              ):(<></>)
            }

            {
              currentTab === "Humanities Advisors" ? (
                <div className='p-5'>
                <h3>SYRIOS is grateful to the following panel of experts, who helped advise on the prototype’s content, design, accessibility, and usability.</h3>
                {aboutUsData?.humanities_advisors?.map(s=>{
                return(
                  <div className='aboutTable-humanities_advisors my-3' key={s.id}>
                    <div className="story-text">
                      <p className='story-text-bigger'><strong>{s.caption}</strong></p>
                      <em>{s.subcaption}</em>
                      <p dangerouslySetInnerHTML={createMarkup(s.descriotion)} />
                    </div>
                  </div>
                )
              })}
                </div>
              ):(<></>)
            }

            
            {currentTab === "Grants & Funding" ? (
                <div className='p-5'>
                <h3>SYRIOS is made possible through the generous support of the several grants and organizations.</h3>
                <p className='story-text-bigger mt-5'><strong>External Funding</strong></p>
                {aboutUsData?.grants_and_funding?.map(s=>{
                  return(
                    s.external_or_internal ?(<></>):(
                      <div className='aboutTable-grants_funding story-text' key={s.id}>
                      {s.year} <span>{s.organization}</span>
                      </div>)
                  )
                })}
                <p className='story-text-bigger mt-5'><strong>Internal Funding through the University of Houston</strong></p>
                {aboutUsData?.grants_and_funding?.map(s=>{
                  return(
                    s.external_or_internal ? (
                      <div className='aboutTable-grants_funding story-text' key={s.id}>
                      {s.external_or_internal ? (<>{s.year} <span>{s.organization}</span></>):(<></>)}
                      </div>):(<></>))
                })}
                </div>
              ):(<></>)
            }

            {
              currentTab === "Museums & Organizations" ? (
                <div className='p-5'>
                  <h3>All photographs of coins featured on SYRIOS are courtesy of the following museums and organizations:</h3>
                  <div className='my-3 py-3'>
                    {aboutUsData?.museums_and_organizations?.map(s=>{
                      return(s.coin_souce ? (<div className='aboutTable-grants_funding story-text-bigger' key={s.id} dangerouslySetInnerHTML={createMarkup(s.coin_souce)}/>):(<></>))
                    })}
                  </div>
                  <h3>We are grateful to the following organizations for the opportunity to present the research and development of SYRIOS:</h3>
                  <div className='my-3 py-3'>
                    {aboutUsData?.museums_and_organizations?.map(s=>{
                      return(
                        s.coin_souce ? (<></>):(
                          <div className='aboutTable-grants_funding story-text' key={s.id}>
                          {s.coin_souce ? (<></>):(<>{s.year} <span>{s.organization}</span></>)}
                          </div>))
                    })}
                  </div>
                </div>
              ):(<></>)
            }
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default About;
