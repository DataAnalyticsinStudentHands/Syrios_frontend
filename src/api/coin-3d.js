import axios from "axios";

const coin3DRequest = {
    coin3DFind: ()=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/coin-3d`,{
            method:'GET',
        })
    },
    coin3DFindLocal: async()=>{
        return await axios( 'http://localhost:1337/api/coin-3d',{
            method:'GET',
        })
    }
}

export default coin3DRequest