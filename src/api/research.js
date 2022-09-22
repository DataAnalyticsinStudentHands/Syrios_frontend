import axios from "axios";

const researchRequest = {
    researchFind: ()=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/research-home`,{
            method:'GET',
        })
    },
    researchFindLocal: async()=>{
        return await axios( 'http://localhost:1337/api/research-home',{
            method:'GET',
        })
    }
}

export default researchRequest