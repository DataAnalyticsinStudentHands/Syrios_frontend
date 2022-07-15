import axios from "axios";

const evidenceRequest = {
    evidenceFind: ()=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/explore-the-evidence`,{
            method:'GET',
        })
    },
    evidenceFindLocal: async()=>{
        return await axios( 'http://localhost:1337/api/explore-the-evidence',{
            method:'GET',
        })
    }
}

export default evidenceRequest