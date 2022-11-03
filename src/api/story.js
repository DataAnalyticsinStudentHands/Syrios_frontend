import axios from "axios";

const storyRequest = {
    storyHomeFind: ()=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/story-home`,{
            method:'GET',
        })
    },
    storyFind: ()=>{
        // let param = process.env.REACT_ENVIRONMENT
        // console.log(param)
        return axios(`${process.env.REACT_APP_strapiURL}/api/stories?env=${process.env.REACT_APP_environment}`,{
            method:'GET',
        })
    },
    storyFindLocal: ()=>{
        return axios(`${process.env.REACT_APP_strapiURLLocal}/api/stories?env=${process.env.REACT_APP_environment}`,{
            method:'GET',
        })
    },
    storyFindOne: (id)=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/stories/${id}`,{
            method:'GET',
        })
    },
    storyFindOneLocal: (id)=>{
        return axios(`${process.env.REACT_APP_strapiURLLocal}/api/stories/${id}`,{
            method:'GET',
        })
    },
}
export default storyRequest