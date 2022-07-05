import axios from "axios";

const referenceRequest = {
    referenceFind: async ()=>{
        return await axios('http://localhost:1337/api/references',{
            method:'GET',
        })
    },

    referenceFindone: async (id)=>{
        return await axios(`http://localhost:1337/api/references/${id}`,{
            method:'GET',
        })
    },

}
export default referenceRequest