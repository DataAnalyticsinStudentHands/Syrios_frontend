import axios from "axios";

const aboutUsRequest = {
    aboutUsFind: ()=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/about-us`,{
            method:'GET',
        })
    },
    aboutUsFindLocal: async()=>{
        return await axios( 'http://localhost:1337/api/about-us',{
            method:'GET',
        })
    }
}

export default aboutUsRequest