import axios from "axios";

const downloadRequest = {
    downloadFind: ()=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/download`,{
            method:'GET',
        })
    },
    downloadFindLocal: async()=>{
        return await axios( 'http://localhost:1337/api/download',{
            method:'GET',
        })
    }
}

export default downloadRequest