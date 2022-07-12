import React, {useState, useEffect} from 'react';
import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer';
import { Container, Row, Col} from 'react-bootstrap';

import referenceRequest from 'src/api/reference';
import zoteroRequest from 'src/api/zotero';
import createMarkup from 'src/utils/Markup';
const Research = ()=>{
    const [isLoading, setIsLoading] = useState(true)
    const [referencesData, setReferencesData] = useState([])

    useEffect(()=>{
        async function fetchData (){
            const result = await referenceRequest.referenceFind()
            let itemKeys = []
            result.data.data.forEach((itemkey)=>{
                itemKeys.push(itemkey.attributes.item_key)
            })
            let bibArr = []
            for (const itemkey of itemKeys){
                const data = await zoteroRequest.getOneItemBib(itemkey)
                bibArr.push(data.data)
              }
            setReferencesData(bibArr)
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
                    {referencesData.map((ref,index)=>{
                    return(
                        <Row key={index} className='story-text my-3 justify-content-center'>
                            <Col xs={10} className='d-flex justify-content-start'  dangerouslySetInnerHTML={createMarkup(ref)}/>
                        </Row>
                    )})}
                    </>
                )}
            </Container>
            <Footer/>
        </div>
    )
}
export default Research
