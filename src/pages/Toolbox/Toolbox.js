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
                <Row className='mb-5'>
                    <p className='story-h1 text-center'>
                        Historian's Tool Box
                    </p>
                </Row>
                <Row className='mt-5 d-flex justify-content-around'>
                    <Col xs={4} style={{width:'290px', height:'308px'}}>
                        <Link to='/HowToReadACoin'>
                            {toolboxData.read_coin.image.data ? (
                                <img
                                    alt={'missing alt'}
                                    src={`${process.env.REACT_APP_strapiURL}${toolboxData.read_coin.image.data.attributes.url}`}
                                    style={{height:'188px'}}
                                />
                            ):(<b className='image-icon text-center'>&#xe832;</b>)}
                        </Link>
                        <div >
                            <p className='story-h4 mt-4'>How To Read A Coin</p>
                            <div className='story-caption' dangerouslySetInnerHTML={createMarkup(toolboxData.read_coin.caption)} />
                        </div>
                    </Col>
                    <Col xs={4} style={{width:'290px'}}>
                        <Link to='/Toolbox/VideoLibrary'>
                            {toolboxData.video_library.image.data ? (
                                <img
                                    alt={'missing alt'}
                                    src={`${process.env.REACT_APP_strapiURL}${toolboxData.video_library.image.data.attributes.url}`}
                                    style={{
                                        height:'188px'
                                    }}/>
                            ):(<b className='image-icon text-center'>&#xe81f;</b>)}
                        </Link>
                            <p className='story-h4 mt-4'>Video Library</p>
                            <div className='story-caption' dangerouslySetInnerHTML={createMarkup(toolboxData.video_library.caption)} />
                    </Col>
                    <Col xs={4} style={{width:'290px'}}>
                        <Link to='/Toolbox/Timeline'>
                            {toolboxData.timeline.image.data ? (
                                <img
                                    alt={'missing alt'}
                                    src={`${process.env.REACT_APP_strapiURL}${toolboxData.timeline.image.data.attributes.url}`}
                                    style={{height:'188px', borderStyle:'double', borderColor:'#737271'}}
                                    className="bg-white p-2"
                                />
                            ):(<b className='image-icon text-center'>&#xe81b;</b>)}
                        </Link>
                        <div className='align-items-end'>
                            <p className='story-h4 mt-4'>Timeline</p>
                            <div className='story-caption' dangerouslySetInnerHTML={createMarkup(toolboxData.timeline.caption)} />
                        </div>
                    </Col>
                </Row>
                <Row><Col><hr /></Col></Row>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col xs={2} className="text-center">
                        <Link to='/Toolbox/Glossary'>
                        <b className='story-icon ' style={{fontSize:'200px'}}>&#xe817;</b>
                        </Link>
                    </Col>
                    <Col xs={4}>
                        <p className='story-h4'>Glossary</p>
                        {toolboxData.glossary.caption?(
                        <p className='story-caption' dangerouslySetInnerHTML={createMarkup(toolboxData.glossary.caption)} />):(<></>)}
                    </Col>
                </Row>
            </Container>
            <Footer/>
        </div>
    )
}
export default Toolbox