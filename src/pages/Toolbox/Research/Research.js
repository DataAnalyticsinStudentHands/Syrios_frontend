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
            console.log(result)
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
            <h1 className='text-center'>Research</h1>
            <h3 className='text-center my-5' style={{width:"70%", marginLeft:"15%"}}>SYRIOS is grounded in the scholarship and public work of many researchers, historians, 
archaeologists, and numismatists. Check out these amazing resources to learn more. </h3>

            <Row style={{width:"80%", marginLeft:"10%"}} className="d-flex justify-content-around align-items-center my-5 py-5">
                <Col xs={3}>
                    <a href="https://www.cambridge.org/core/books/abs/antioch-in-syria/antioch-in-syria/CC6531DFF053A8BA29E42CFFC2C2EA68"
                    target="_blank" rel="noopener noreferrer">
                        <img
                            alt={'missing alt'}
                            src={`${process.env.REACT_APP_strapiURL}/uploads/Antioch_Book_Cover_a41561be88.jpg`}
                            style={{borderStyle:'double', borderColor:'#737271', width:"100%"}}
                            className="bg-white p-2"
                        />
                    </a>

                </Col>
                <Col xs={8} className="story-text  ">
                Antioch in Syria critically reassesses this ancient city from its Seleucid foundation into Late 
Antiquity. Although Antioch's prominence is famous, Kristina M. Neumann newly exposes 
the gradations of imperial power and local agency mediated within its walls through a 
comprehensive study of the coins minted there and excavated throughout the Mediterranean 
and Middle East. Patterns revealed through digital mapping and Exploratory Data Analysis 
serve as a signi"cant index of spatial politics and the policies of the different authorities 
making use of the city. Evaluating the coins against other historical material reveals that 
Antioch's status was not "xed, nor the people passive pawns for external powers. Instead, as 
imperial governments capitalized upon Antioch's location and amenities, the citizens 
developed in their own distinct identities and agency. Antioch of the Antiochians must 
therefore be elevated from traditional narratives and static characterizations, being studied 
and celebrated for the dynamic polis it was.
                </Col>
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
            <Footer/>
        </div>
    )
}
export default Research
