import React, {useState, useEffect} from 'react';
import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer';
import { Container, Row, Col} from 'react-bootstrap';
import zoteroRequest from 'src/api/zotero';
import createMarkup from 'src/utils/Markup';
const Research = ()=>{
    const [isLoading, setIsLoading] = useState(true)
    const [referencesData, setReferencesData] = useState([])

    useEffect(()=>{
        async function fetchData (){
            const result = await zoteroRequest.getAllitems()
            setReferencesData(result.data)
            setIsLoading(false)
        }
        fetchData()
    },[])

    

    if(isLoading)return(
    <>
        <LoadingPage/>
        <Footer/>
    </>)

    return(
        <div id='research' >
            <Container>
                <Row className='mb-5'>
                    <p className='story-h1 text-center'>
                        Bibliography
                    </p>
                </Row>
                {referencesData.length===0?(<></>):(
                    <>
                    {referencesData.map((bib)=>{
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
                    )})}
                    </>
                )}
            </Container>
            <Footer/>
        </div>
    )
}
export default Research
