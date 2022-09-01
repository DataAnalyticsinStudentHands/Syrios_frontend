import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import toolboxRequest from 'src/api/toolbox';
import LoadingPage from 'src/components/LoadingPage';
import Footer from 'src/components/Footer';
import { Container, Row, Col} from 'react-bootstrap';
import createMarkup from 'src/utils/Markup';
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
                    <Col xs={3}>
                        <Link to='/HowToReadACoin'>
                            <div className='text-center'>
                                <img
                                    alt={'missing alt'}
                                    src={`${process.env.REACT_APP_strapiURL}${toolboxData.read_coin.image.data.attributes.url}`}
                                    style={{
                                        // borderStyle:'double', borderColor:'#737271', 
                                        height:"15vmax"}}
                                    className="bg-white p-3"
                                />
                            </div>
                        </Link>
                            <h4 className='mt-5 text-center'>How To Read A Coin</h4>
                            <div className='story-caption text-center' dangerouslySetInnerHTML={createMarkup(toolboxData.read_coin.caption)} />
                    </Col>
                    <Col xs={3}>
                        <Link to='/Toolbox/Coin3D'>
                            <div className='text-center'>
                                <img
                                    alt={'missing alt'}
                                    src={`${process.env.REACT_APP_strapiURL}/uploads/3_D_Coins_74ece64c4b.png`}
                                    style={{
                                        // borderStyle:'double', borderColor:'#737271', 
                                        height:"15vmax"}}
                                    className="bg-white p-3"
                                />
                            </div>

                        </Link>
                        <h4 className='mt-5 text-center'>COIN IN 3D</h4>
                        {/* <div className='story-caption text-center' dangerouslySetInnerHTML={createMarkup(toolboxData.video_library?.caption)} /> */}
                        <div className='story-caption text-center'>
                            Examine a Syrian coin as a three-
                            dimensional object in a virtual space. 
                            Notice the union of images and text on a
                            single artifact.</div>
                    </Col>

                    <Col xs={3}>
                        <Link to='/Toolbox/Glossary/all'>
                            <div className='text-center'>
                                <img
                                    alt={'missing alt'}
                                    src={`${process.env.REACT_APP_strapiURL}/uploads/glossary2_0e2a776a1e.png`}
                                    style={{
                                        // borderStyle:'double', borderColor:'#737271', 
                                        height:"15vmax"}}
                                    className="bg-white p-3"
                                />
                            </div>

                        </Link>
                        <h4 className='mt-5 text-center'>GLOSSARY</h4>
                        {/* <div className='story-caption text-center' dangerouslySetInnerHTML={createMarkup(toolboxData.video_library?.caption)} /> */}
                        <div className='story-caption text-center'>
                        Explore the vocabulary related to coins,
                        the ancient world, historical 
                        investigation, and archaeology.
                        </div>
                    </Col>


                </Row>
                <hr />
                <Row className='d-flex align-items-center justify-content-around my-5 py-5'>

                <Col xs={3}>
                    <Link to='/Toolbox/Research'>
                        <div className='text-center'>
                            <img
                                alt={'missing alt'}
                                src={`${process.env.REACT_APP_strapiURL}/uploads/research_426c0859b4.png`}
                                style={{
                                    // borderStyle:'double', borderColor:'#737271', 
                                    height:"15vmax"}}
                                className="bg-white p-3"
                            />
                        </div>
                    </Link>
                    <h4 className='mt-5 text-center'>Research</h4>
                    {/* <div className='story-caption text-center' dangerouslySetInnerHTML={createMarkup(toolboxData.video_library?.caption)} /> */}
                    <div className='story-caption text-center'>
                    Watch short informational videos on a
                    wide range of topics related to the study of
                    coins, the ethics of coin collecting, Syrian 
                    cultural heritage, and more.
                    </div>
                </Col>

                <Col xs={3}>
                        <Link to='/Toolbox/VideoLibrary'>
                            <div className='text-center'>
                                <img
                                    alt={'missing alt'}
                                    src={`${process.env.REACT_APP_strapiURL}${toolboxData.video_library?.image.data.attributes.url}`}
                                    style={{
                                        // borderStyle:'double', borderColor:'#737271', 
                                        height:"15vmax"}}
                                    className="bg-white p-3"
                                />
                            </div>
                        </Link>
                        <h4 className='mt-5 text-center'>Video Library</h4>
                        {/* <div className='story-caption text-center' dangerouslySetInnerHTML={createMarkup(toolboxData.video_library?.caption)} /> */}
                        <div className='story-caption text-center'>
                        Watch short informational videos on a
                        wide range of topics related to the study of
                        coins, the ethics of coin collecting, Syrian 
                        cultural heritage, and more.
                        </div>
                    </Col>

                    {/* <Col xs={2} className="text-center">
                        <Link to='/Toolbox/Glossary/all'>
                        <b className='story-icon ' style={{fontSize:'200px'}}>&#xe817;</b>
                        </Link>
                    </Col>
                    <Col xs={4}>
                        <p className='story-h4'>Glossary</p>
                        {toolboxData.glossary.caption?(
                        <p className='story-caption' dangerouslySetInnerHTML={createMarkup(toolboxData.glossary.caption)} />):(<></>)}
                    </Col> */}
                </Row>
            </Container>
            <Footer/>
        </div>
    )
}
export default Toolbox