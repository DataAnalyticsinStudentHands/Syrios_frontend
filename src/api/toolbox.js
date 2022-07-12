import axios from "axios";

const toolboxRequest = {
    toolboxFind: ()=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/tool-box`,{
            method:'GET',
        })
    },
    toolboxFindLocal: async()=>{
        return await axios( 'http://localhost:1337/api/tool-box',{
            method:'GET',
        })
    }
}

export default toolboxRequest