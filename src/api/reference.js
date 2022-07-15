import axios from "axios";

const referenceRequest = {
    referenceFind: async ()=>{
        return await axios(`${process.env.REACT_APP_strapiURL}/api/references`,{
            method:'GET',
        })
    },

    referenceFindone: async (id)=>{
        return await axios(`${process.env.REACT_APP_strapiURL}/api/references/${id}`,{
            method:'GET',
        })
    },

}
export default referenceRequest