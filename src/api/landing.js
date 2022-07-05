import axios from "axios";

const landingRequest = {
    landingdFind: ()=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/landing-page`,{
            method:'GET',
        })
    },
    landingFindLocal: async()=>{
        return await axios( 'http://localhost:1337/api/landing-page',{
            method:'GET',
        })
    }

}
export default landingRequest