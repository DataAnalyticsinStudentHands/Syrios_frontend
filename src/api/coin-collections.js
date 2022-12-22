import axios from "axios";
import qs from 'qs';

const coinCollections = {
    coinSpotLight: ()=>{
        let query = qs.stringify({
            filters:{
                spotlight:true
            },
            populate: [
                'obverse_image',
                'reverse_image',
                'ancient_territory',
                'mint.modern_name',
                'mint.modern_country',
                'material',

            ],
            pagination: {
                page: 1,
                pageSize: 2147483647,
            }
        });
        return axios(`${process.env.REACT_APP_strapiURL}/api/coin-collections?${query}`,{
            method:'GET',
        })
    },

    coinCollection:(
        material, mint
    )=>{
        let query = qs.stringify({
            filters:{
                appear_catalog_pile:true,
            },
            populate: [
                'obverse_image','reverse_image','denomination',
                'ancient_territory',
                'mint.modern_name',
                'mint.modern_country',
                'governing_power',
                'issuing_authority',
                'material',
                'language'
            ],
            pagination: {page: 1,pageSize: 2147483647}
            // pagination: {page: 1,pageSize: 96}

        },{encodeValuesOnly: true});
        return axios(`${process.env.REACT_APP_strapiURL}/api/coin-collections?${query}`,{
            method:'GET',
        })
    }
}
export default coinCollections