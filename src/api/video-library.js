import axios from "axios";

const VideoLibraryRequest = {
    videoFind: ()=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/videos`,{
            method:'GET',
        })
    },
    videoFindLocal: async()=>{
        return await axios( 'http://localhost:1337/api/videos',{
            method:'GET',
        })
    }

}
export default VideoLibraryRequest