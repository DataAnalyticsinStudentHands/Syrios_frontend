import React, {useState, useEffect} from 'react';
import LoadingPage from 'src/components/loadingPage/LoadingPage.js';
import Footer from 'src/components/footer/Footer';
import { Container, Row, Col} from 'react-bootstrap';
import zoteroRequest from 'src/api/zotero';
import researchRequest from 'src/api/research';
import createMarkup from 'src/utils/Markup';
import PageTitleComponent from 'src/components/constant/pageTitleText';
const Research = ()=>{
    const [isLoading, setIsLoading] = useState(true)
    const [referencesData, setReferencesData] = useState([])
    const [research, setResearch] = useState([])

    useEffect(()=>{
        async function fetchData (){
            const result = await zoteroRequest.getAllitems()
            setReferencesData(result.data)
            const researchData = await researchRequest.researchFind()
            setResearch(researchData.data.data.attributes)
            setIsLoading(false)
        }
        fetchData()
    },[])

	if (isLoading)return (<><LoadingPage /><Footer /></>);
    return(
        <>
        <div id='research' >
            <PageTitleComponent
                title={research.title}
                text={research.text}
            />
            <Row className="d-flex justify-content-around align-items-center my-5 py-5">
                <Col xs={3}>
                    <a 
                    href="https://www.cambridge.org/core/books/abs/antioch-in-syria/antioch-in-syria/CC6531DFF053A8BA29E42CFFC2C2EA68"
                    target="_blank" rel="noopener noreferrer">
                        <img
                            alt={'missing alt'}
                            src={`${process.env.REACT_APP_strapiURL}${research.bookcover.data.attributes.url}`}
                            style={{borderStyle:'double', borderColor:'#737271', width:"100%"}}
                            className="bg-white p-2"
                        />
                    </a>
                </Col>
                <Col xs={8} className="story-text" dangerouslySetInnerHTML={createMarkup(research.book_description)}/>
            </Row>

            <h2 className='text-center'>Bibliography</h2>
            <Container>
                {referencesData.length===0?(<></>):(
                    referencesData.map((bib)=>{
                    return(
                        <Row key={bib.version} className='story-text-bigger my-5 justify-content-center'>
                        {bib.bib.split("http")[1] ? (
                            <Col xs={10} >
                                <a 
                                    href={`http${bib.bib.split("http")[1].split(".</div>")[0]}`} 
                                    dangerouslySetInnerHTML={createMarkup(bib.bib.split("http")[0])}
                                    target="_blank" rel="noopener noreferrer"/>
                            </Col>
                            ):(<Col xs={10} dangerouslySetInnerHTML={createMarkup(bib.bib.split("http")[0])}/>)}
                        </Row >
                    )})
                    
                )}
            </Container>
        </div>
        <Footer/>
        </>
    )
}
export default Research
