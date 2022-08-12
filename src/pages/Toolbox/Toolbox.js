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
                    <h1 className='text-center'>
                        Historian's Tool Box
                    </h1>
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
                            <h4 className='mt-4'>How To Read A Coin</h4>
                            <div className='story-caption' dangerouslySetInnerHTML={createMarkup(toolboxData.read_coin.caption)} />
                        </div>
                    </Col>
                    <Col xs={4} style={{width:'290px'}}>
                        <Link to='/Toolbox/VideoLibrary'>
                            {toolboxData.video_library?.image.data ? (
                                <img
                                    alt={'missing alt'}
                                    src={`${process.env.REACT_APP_strapiURL}${toolboxData.video_library?.image.data.attributes.url}`}
                                    style={{
                                        height:'188px'
                                    }}/>
                            ):(<b className='image-icon text-center'>&#xe81f;</b>)}
                        </Link>
                            <h4 className='mt-4'>Video Library</h4>
                            <div className='story-caption' dangerouslySetInnerHTML={createMarkup(toolboxData.video_library?.caption)} />
                    </Col>

                </Row>
                <Row><Col><hr /></Col></Row>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col xs={2} className="text-center">
                        <Link to='/Toolbox/Glossary/all'>
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