import axios from "axios";
import qs from 'qs';
const coinSortRequest = {

    coinFectAll: ()=>{
        let query = qs.stringify({
            filters:{
              catalog_coinsort_set:true
            },
            populate: [
              'obverse_file',
              'governing_power',
              'type_category',
            ],
            pagination: {
              page: 1,
              pageSize: 2147483647,
            }
          });

        return axios(`${process.env.REACT_APP_strapiURL}/api/coins?${query}`,{
            method:'GET',
        })
    },

    coinSortFind: ()=>{
        return axios(`${process.env.REACT_APP_strapiURL}/api/coin-sort`,{
            method:'GET',
        })
    },

}
export default coinSortRequest