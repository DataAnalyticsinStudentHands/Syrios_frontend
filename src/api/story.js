import axios from "axios";

const storyRequest = {

    storyFind: ()=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/stories`,{
            method:'GET',
        })
    },
    storyFindOne: (id)=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/stories/${id}`,{
            method:'GET',
        })
    },
}
export default storyRequest