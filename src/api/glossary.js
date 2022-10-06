import axios from "axios";
import qs from "qs";
const glossaryRequest = {
    glossaryFindLocal: async()=>{
        let query = qs.stringify({
            pagination: {
              page: 1,
              pageSize: 2147483647,
            }
          });
        return await axios( `http://localhost:1337/api/glossaries?${query}`,{
            method:'GET',
        })
    },
    glossaryHomeFind: ()=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/glossary-home`,{
            method:'GET',
        })
    },

    glossaryFind: ()=>{
        let query = qs.stringify({
            pagination: {
              page: 1,
              pageSize: 2147483647,
            }
          });
        return axios(`${process.env.REACT_APP_strapiURL}/api/glossaries?${query}`,{
            method:'GET',
        })
    },

    glossaryFindStartWIth: (alphabet)=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/glossry/start-with/${alphabet}`,{
            method:'GET',
        })
    },
    glossaryFindByTerm: (term)=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/glossry/by-term/${term}`,{
            method:'GET',
        })
    },
    glossaryFindByTermLocal: (term)=>{
        return axios(`${process.env.REACT_APP_strapiURLLocal}/api/glossry/by-term/${term}`,{
            method:'GET',
        })
    },
}

export default glossaryRequest