import axios from "axios";
import qs from "qs";
const evidenceRequest = {
    evidenceFind: ()=>{
        let query = qs.stringify({
            populate: [
                'image_icon',
                'image_icon.image',
              ],
        })
        return axios(`${process.env.REACT_APP_strapiURL}/api/explore-the-evidence?${query}`,{
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