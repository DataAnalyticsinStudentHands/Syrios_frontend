import axios from "axios";

const glossaryRequest = {
    glossaryFindLocal: async()=>{
        return await axios( 'http://localhost:1337/api/glossaries',{
            method:'GET',
        })
    },

    glossaryFind: ()=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/glossaries`,{
            method:'GET',
        })
    },
    glossaryTagFind: ()=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/glossary-tags`,{
            method:'GET',
        })
    },
    glossaryFindOne: (id)=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/glossaries/${id}`,{
            method:'GET',
        })
    },
    glossaryTagFindOne: (id)=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/glossary-tags/${id}`,{
            method:'GET',
        })
    },
}

export default glossaryRequest