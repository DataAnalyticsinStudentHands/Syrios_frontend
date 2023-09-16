import axios from "axios";
import qs from 'qs';

const coinCollections = {
    coinCollectionPage:()=>{
        let query = qs.stringify({
            populate: [
                'contents',
                'coin_of_the_day',
                'coin_of_the_day.image',
                'spotlight',
                'spotlight.obverse_image',
                'spotlight.reverse_image',
                'spotlight.denomination',
                'spotlight.ancient_territory',
                'spotlight.mint.modern_name',
                'spotlight.mint.modern_country',
                'spotlight.governing_power',
                'spotlight.issuing_authority',
            ],
            pagination: {page: 1,pageSize: 2147483647}
        },{encodeValuesOnly: true});
        return axios(`${process.env.REACT_APP_API_URL}/coin-collection-page?${query}`,{
            method:'GET',
        })
    },

    coinCollection:()=>{
        let query = qs.stringify({
            filters:{
                appear_catalog_pile:true,
            },
            populate: [
                'obverse_image','reverse_image',
                'denomination',
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
        return axios(`${process.env.REACT_APP_API_URL}/coin-collections?${query}`,{
            method:'GET',
        })
    },
    coinSearch:()=>{
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
        },{encodeValuesOnly: true});
        return axios(`${process.env.REACT_APP_API_URL}/coin-collections?${query}`,{
            method:'GET',
        })
    },

}
export default coinCollections