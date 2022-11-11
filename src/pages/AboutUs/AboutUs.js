import React, { useState, useEffect } from 'react';
import {Row, Col} from 'react-bootstrap';
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
      "Partner"
  ]
  useEffect(() => {
    async function fetchData (){
      const result = await aboutUsRequest.aboutUsFind()
      const data = result.data.data.attributes
      setAboutUsdata(data)
      setIsLoading(false)
    }
    fetchData().catch(console.error);
  },[]);

	if (isLoading)return (<LoadingPage />);
  return (
      <div id='aboutus-page'>
        <h1 className='text-center'>About Us</h1>

        <div className='aboutus-des my-5 py-5'>
          <div className='aboutus-logo'>
            <img
              src={`${process.env.REACT_APP_strapiURL}${aboutUsData.logo.data.attributes.url}`}
              alt="logoside.png"
              width="90%"
            />
          </div>
          <div className='aboutus-description story-text-bigger' dangerouslySetInnerHTML={createMarkup(aboutUsData?.description)}/>
        </div>

        <div className='aboutus-project_director my-5 py-5'>
          <h2 className='my-5 py-5 text-center'>Project Directors</h2>
          {aboutUsData?.project_directors?.map((director)=>{
            return(
              <Row key={`ProjectDirectors_${director.id}`} className='my-5 py-5 d-flex justify-content-around'>
                <Col xs={3}>
                    <img
                      src={`${process.env.REACT_APP_strapiURL}${director.picture.data.attributes.url}`}
                      alt={director.name} width="100%"
                      className="aboutus-avatar"/>
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
                <div className={`aboutTable_tab ${currentTab === t ? "aboutTable_tab--active":""}`} 
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
                  <Row className='aboutTable-student_leads d-flex justify-content-around' key={s.id}>
                    <Col xs={3}>
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
                <Row className='aboutTable-collaborators p-5 m-5'>
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
            {currentTab === "Humanities Advisors" ? (<div dangerouslySetInnerHTML={createMarkup(aboutUsData.humanities_advisors)} className='p-5 m-5'/>):(<></>)}
            {currentTab === "Grants & Funding" ? (<div dangerouslySetInnerHTML={createMarkup(aboutUsData.grants_and_funding)} className='p-5 m-5'/>):(<></>)}
            {currentTab === "Museums & Organizations" ? (<div dangerouslySetInnerHTML={createMarkup(aboutUsData.museums_and_organizations)} className='p-5 m-5'/>):(<></>)}
            {currentTab === "Partner" ? (<div dangerouslySetInnerHTML={createMarkup(aboutUsData.partner)} className='p-5 m-5'/>):(<></>)}
          </div>
        </div>
      </div>
  );
}

export default About;
