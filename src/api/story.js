import axios from "axios";
// import qs from "qs";
const storyRequest = {
    storyHomeFind: ()=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/story-home`,{
            method:'GET',
        })
    },
    storyFind: () => {
        let environment = ""
        // if in production we don't show test stories
        if (process.env.REACT_APP_PRODUCTION === "development")
            environment = "development"
            
        return axios(`${process.env.REACT_APP_strapiURL}/api/stories?env=${environment}`,{
            method:'GET',
        })
    },

    storyFindOne: (id)=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/stories/${id}`,{
            method:'GET',
        })
    },
    // storyCoinsOfDays: ()=>{
    //     let query = qs.stringify({
    //         fields: [
    //             'id',
    //             'name','image','image_caption','abstract',
    //         ],
    //         filters:{
    //             abstract:{
    //                 $notNull: true
    //             }
    //         },
    //         populate: [
    //             'image',
    //         ],
    //     },{encodeValuesOnly: true});
    //     return axios(`${process.env.REACT_APP_API_URL}/stories?${query}`,{
    //         method:'GET',
    //     })
    // },

}
export default storyRequest