import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import toolboxRequest from 'src/api/toolbox';
import LoadingPage from 'src/components/LoadingPage';
import Footer from 'src/components/Footer';
import { Container, Row, Col} from 'react-bootstrap';
import createMarkup from 'src/utils/Markup';
export const WhiteBGDesign = (props)=>{
    return(
        <Col xs={3}>
            <center>
                <Link to={props.link}>
                    <img
                        alt={'missing alt'}
                        src={`${process.env.REACT_APP_strapiURL}${props.imageSrc}`}
                        style={{
                            height:props.height??"auto",
                            width:props.width??"auto"
                        }}
                        className="bg-white p-3"
                    />
                </Link>
                <h4 className='mt-5'>{props.title}</h4>
                <p className='story-caption' dangerouslySetInnerHTML={createMarkup(props.subtext)} />
            </center>
        </Col>
    )
}
const Toolbox = ()=>{

    const [isLoading, setIsLoading] = useState(true)
    const [toolboxData, setToolboxData] = useState([])

    useEffect(()=>{
        async function fetchData(){
            const result = await toolboxRequest.toolboxFind()
            setToolboxData(result.data.data.attributes)
            setIsLoading(false)
        }
        fetchData()
    },[])
    if (isLoading){
        return(
            <>
                <LoadingPage/>
                <Footer/>
            </>
        )
    }
    return(
        <div id='tool-box' >
            <Container>
                <h1 className='text-center'>The Historian's Tool Box</h1>
                <div className='align-items-center justify-content-center' style={{marginLeft:"5%", marginRight:"5%"}} >
                    <h3 className='text-center my-5 pb-5'>Scholars have many resources available to help them understand both the past and present. 
                        Discover the vocabulary, practices, and the larger historical issues at play when conducting
                        research on coins, Syria, and ancient history.
                    </h3>
                </div>
                <Row className='my-5 d-flex py-5 justify-content-around'>
                    <WhiteBGDesign
                        link='/HowToReadACoin'
                        imageSrc={toolboxData.read_coin.image.data.attributes.url} 
                        title="How To Read A Coin" 
                        subtext={toolboxData.read_coin.caption}
                        height="15vmax"
                        width="15vmax"
                    />
                    <WhiteBGDesign
                        link='/Toolbox/Coin3D'
                        imageSrc='/uploads/3_D_Coins_74ece64c4b.png' 
                        title="COIN IN 3D" 
                        height="15vmax"
                        width="15vmax"
                        subtext='Examine a Syrian coin as a three-dimensional object in a virtual space. 
                        Notice the union of images and text on a
                        single artifact.'
                    />
                    <WhiteBGDesign
                        link='/Toolbox/Glossary/all'
                        imageSrc='/uploads/glossary2_0e2a776a1e.png' 
                        title="GLOSSARY" 
                        height="15vmax"
                        width="15vmax"
                        subtext='Explore the vocabulary related to coins,
                        the ancient world, historical 
                        investigation, and archaeology.'
                    />
                </Row>
                <hr />
                <Row className='d-flex align-items-center justify-content-around my-5 py-5'>
                    <WhiteBGDesign
                        link='/Toolbox/Research'
                        imageSrc='/uploads/research_426c0859b4.png' 
                        title="Research"
                        height="15vmax"
                        width="15vmax" 
                        subtext='Dive into the scholarly research supporting 
                        SYRIOS and the broader fields of ancient
                        history, archaeology, and numismatics.'
                    />
                    <WhiteBGDesign
                        link='/Toolbox/VideoLibrary'
                        imageSrc={toolboxData.video_library?.image.data.attributes.url}
                        title="Video Library" 
                        height="15vmax"
                        width="15vmax"
                        subtext='Watch short informational videos on a
                        wide range of topics related to the study of
                        coins, the ethics of coin collecting, Syrian 
                        cultural heritage, and more.'
                    />
                </Row>
            </Container>
            <Footer/>
        </div>
    )
}
export default Toolbox