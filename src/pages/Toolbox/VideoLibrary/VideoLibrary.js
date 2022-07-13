import React, {useState, useEffect} from 'react';
import Footer from 'src/components/Footer';
import { Container,Row,Col} from 'react-bootstrap';
import ReactPlayer from 'react-player/lazy';
import VideoLibraryRequest from 'src/api/video-library';
import LoadingPage from 'src/components/LoadingPage';
import createMarkup from 'src/utils/Markup';
const VideoLibrary = ()=>{

    const [isLoading, setIsLoading] = useState(true)
    const [videoData, setVideoData] = useState([])

    useEffect(()=>{
        async function fetchData(){
            const result = await VideoLibraryRequest.videoFind()
            setVideoData(result.data.data)
            setIsLoading(false)
        }
        fetchData()
    },[])
    if(isLoading) return(<><LoadingPage /><Footer /></>)
    return(
        <div id='video-library' >
            <Container>
                <p className='story-h1 text-center'>Video Library</p>
                <p className='story-h2 text-center'>Do we need sub title</p>
                <p className='story-text text-center'>or caption?</p>
                <Row className='d-flex justify-content-around '>
                    {videoData.length === 0? (<></>):(<>
                        {videoData.map((video)=>{
                            return(
                                <Col key={video.id} xs={4} style={{width:'360px' }} className="mt-5">
                                    <ReactPlayer url={video.attributes.video_url} width="100%" height="240px"/>
                                    <p className='story-h4 mt-4'>{video.attributes.video_title}</p>
                                    <p className='story-caption' dangerouslySetInnerHTML={createMarkup(video.attributes.video_description)}/>
                                </Col>
                            )})}
                    </>)}
                </Row>
            </Container>
            <Footer/>
        </div>
    )
}
export default VideoLibrary