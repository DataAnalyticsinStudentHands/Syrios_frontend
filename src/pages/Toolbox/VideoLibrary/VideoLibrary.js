import React, {useState, useEffect} from 'react';
import Footer from 'src/components/Footer';
import { Container,Row,Col} from 'react-bootstrap';
import ReactPlayer from 'react-player/lazy';
import VideoLibraryRequest from 'src/api/video-library';
import LoadingPage from 'src/components/LoadingPage';
import createMarkup from 'src/utils/Markup';

import Modal from "react-responsive-modal";
import 'react-responsive-modal/styles.css';

function Player(props){
    const { open, toggleModal, url } = props;
    return (
        <Modal
        open={open}
        onClose={toggleModal}
        styles={{
          modal: {maxWidth: "unset",width: "80%",},
          overlay: {background: "rgba(0, 0, 0, 0.5)"},
          closeButton: {background: "white"},
        }}
        center>
        <ReactPlayer 
            url={url}
            width="100%"
            height="calc(100vh - 350px)"
            controls={true}
            playing={true}
            />
      </Modal>
    );
}

const VideoLibrary = ()=>{

    const [isLoading, setIsLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)

    const [videoData, setVideoData] = useState([])
    const [url, setUrl] = useState("")

    useEffect(()=>{
        async function fetchData(){
            const result = await VideoLibraryRequest.videoFind()
            setVideoData(result.data.data)
            setIsLoading(false)
        }
        fetchData()
    },[])

    async function handleOpenModal(url){
        setUrl(url)
        setIsOpen((prev) => !prev)
    }
    if(isLoading) return(<><LoadingPage /><Footer /></>)
    return(
        <div id='video-library' >
            <Container>
                <p className='story-h1 text-center'>Video Library</p>
                <p className='story-h2 text-center'>Do we need sub title</p>
                <p className='story-text text-center'>or caption?</p>
                <Player open={isOpen} toggleModal={handleOpenModal} url={url} />

                <Row className='d-flex justify-content-around '>
                    {videoData.length === 0? (<></>):(<>
                        {videoData.map((video)=>{
                            return(
                                <Col key={video.id} xs={4} style={{width:'420px' }} className="mt-5">
                                    <ReactPlayer 
                                        url={video.attributes.video_url}
                                        light={true}
                                        width="100%" 
                                        height="240px"
                                        onClick={()=>handleOpenModal(video.attributes.video_url)}/>
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