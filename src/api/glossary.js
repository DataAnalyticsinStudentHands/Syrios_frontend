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
        const query = qs.stringify({
            fields: ["term"],
        });
        return axios(`${process.env.REACT_APP_strapiURL}/api/glossaries?${query}`,{
            method:'GET',
        })
    },
    glossarySearch: (text)=>{
        const query = qs.stringify({
            fields: ["term"],
            filters: {
                term: {
                    $startsWithi: text,
                },
            }
        });
        return axios(`${process.env.REACT_APP_strapiURL}/api/glossaries?${query}`,{
            method:'GET',
        })
    },
    glossaryFindByTerm: (term)=>{
        const query = qs.stringify({
            filters:{
                term:{
                    $eqi:term
                }
            }
        });
        return axios(`${process.env.REACT_APP_strapiURL}/api/glossaries?${query}`,{
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