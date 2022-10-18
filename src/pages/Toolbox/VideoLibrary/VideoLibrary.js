import React, {useState, useEffect} from 'react';

import { Row,Col} from 'react-bootstrap';
import ReactPlayer from 'react-player';
import VideoLibraryRequest from 'src/api/video-library';
import LoadingPage from 'src/components/loadingPage/LoadingPage';
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
            console.log(result.data.data)
            setVideoData(result.data.data)
            setIsLoading(false)
        }
        fetchData()
    },[])

    async function handleOpenModal(url){
        setUrl(url)
        setIsOpen((prev) => !prev)
    }
    
    if(isLoading) return(<LoadingPage />)
    return(
        <div id='video-library' >
            <h1 className='text-center mb-5 pb-5'>Video Library</h1>
            <h3 className='text-center'>Watch short informational videos on a wide range of topics related to the study of coins, the ethics of coin collecting, Syrian cultural heritage, and more.</h3>
            <Player open={isOpen} toggleModal={handleOpenModal} url={url} />
            <Row className='d-flex justify-content-around '>
                {videoData.length === 0? (<></>):(<>
                    {videoData.map((video)=>{
                        return(
                            <Col key={video.id} xs={3} className="mt-5 pt-5 text-center">
                                {video.attributes.video_thumbnail.data
                                ? <img 
                                    src={`${process.env.REACT_APP_strapiURL}${video.attributes.video_thumbnail.data.attributes.url}`} 
                                    alt={video.attributes.video_thumbnail.data.attributes.alternativeText} 
                                    onClick={()=>handleOpenModal(video.attributes.video_url)}
                                    style={{cursor:"pointer", width:"20vmax",height:"15vmax"}}
                                    className="bg-white p-3"/>
                                :<b className='image-icon text-center' style={{cursor:"pointer", fontSize:"10vmax"}} onClick={()=>handleOpenModal(video.attributes.video_url)}>&#xe81f;</b>}
                                <h4 className='mt-4'>{video.attributes.video_title || ""}</h4>
                                <p className='story-caption' dangerouslySetInnerHTML={createMarkup(video.attributes.video_description || "")}/>
                            </Col>
                        )})}
                </>)}
            </Row>
        </div>
    )
}
export default VideoLibrary