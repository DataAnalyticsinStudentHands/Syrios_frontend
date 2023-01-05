import React, {useState, useEffect, useContext} from 'react'
import "./Coins.scss"
// import coinCollections from 'src/api/coin-collections'
import CoinPaginate from './CoinPaginate'
import { useParams } from "react-router-dom";

import Fuse from 'fuse.js'
import CoinsFiter from './CoinsFilters';
import Search from './Search';
import qs from 'qs';

import { CoinContext } from 'src/context/coinContext';

function getDeepFilterOptions(arr, filter){
  let options = []
  arr.forEach((coin)=>{
      if (!options.includes(coin?.attributes[filter]?.data?.attributes[filter]) && coin?.attributes[filter]?.data?.attributes[filter] !== undefined){
          options.push(coin?.attributes?.[filter]?.data?.attributes[filter])
      }
  })
  return options
}

const Coins = () => {
  const { coinsData, fetchCoinData } = useContext(CoinContext)
  coinsData ?? fetchCoinData()
  const params = qs.parse(useParams().params) 
  const [searchedData, setSearchedData] = useState([])
  const [coinList, setCoinList] = useState([])
  const [coinsPerPage, setCoinsPerPage] = useState(12)

  const [options,setOptions] = useState({})

  const [filters,setFilters] = useState({
    material:[],
    mint:[],
    issuing_authority:[],
    governing_power:[],
    language:[],
    ancient_territory:[],
    from_year:-450,
    to_year:450,
    ...params.tags
  })

  const [searchText, setSearchText] = useState(
    params.pattern || ""
);
  const coinsPerPages = [12,24,48,96]

  useEffect(()=>{
    const searchData = async ()=>{
      const fuseOptions = {
        includeScore: true,
        shouldSort: true,
        includeMatches: true,
        minMatchCharLength: searchText.length,
        threshold: 0.25,               //At what point does the match algorithm give up. A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything
        keys: [
          "attributes",
          "attributes.obverse_type",
          "attributes.reverse_type",
          "attributes.reference",
          "attributes.reverse_legend",
          "attributes.obverse_legend",
          "attributes.material.data.attributes.material",
          "attributes.mint.data.attributes.mint",
          "attributes.issuing_authority.data.attributes.issuing_authority",
          "attributes.governing_power.data.attributes.governing_power",
          "attributes.language.data.attributes.language",
          "attributes.ancient_territory.data.attributes.ancient_territory",
        ]
      };
      // const fuse = new Fuse(result.data.data, fuseOptions);
      const fuse = new Fuse(coinsData, fuseOptions);
      let Searchresults = fuse.search(searchText) 
      let searchedData = searchText ? Searchresults.map(Searchresult => Searchresult.item) : coinsData;
      setSearchedData(searchedData)
      // console.log(searchedData);

      let options = {
        material:getDeepFilterOptions(searchedData, 'material'),
        mint:getDeepFilterOptions(searchedData,'mint'),
        issuing_authority: getDeepFilterOptions(searchedData,'issuing_authority'),
        governing_power: getDeepFilterOptions(searchedData,'governing_power'),
        language: getDeepFilterOptions(searchedData,'language'),
        ancient_territory: getDeepFilterOptions(searchedData,'ancient_territory'),
      }
      setOptions(options)
    }
    console.count('searchData');
    searchData().catch(console.error);


  },[searchText, coinsData])



  useEffect(()=>{
    const getCoinList = async ()=>{
      // console.log(searchedData);
      const filteredCoins = searchedData?.filter( coin =>{
        if( 
          (filters?.material.length === 0 ? true : filters?.material.includes(coin?.attributes?.material?.data?.attributes?.material)) &&
          (filters?.mint.length === 0 ? true : filters?.mint.includes(coin?.attributes?.mint?.data?.attributes?.mint)) &&
          (filters?.issuing_authority.length === 0 ? true : filters?.issuing_authority.includes(coin?.attributes?.issuing_authority?.data?.attributes?.issuing_authority)) &&
          (filters?.governing_power.length === 0 ? true : filters?.governing_power.includes(coin?.attributes?.governing_power?.data?.attributes?.governing_power)) &&
          (filters?.language.length === 0 ? true : filters?.language.includes(coin?.attributes?.language?.data?.attributes?.language)) &&
          (filters?.ancient_territory.length === 0 ? true : filters?.ancient_territory.includes(coin?.attributes?.ancient_territory?.data?.attributes?.ancient_territory)) &&
          (filters?.from_year <= coin?.attributes?.from_year) &&
          (filters?.to_year >= coin?.attributes?.to_year)
        ){return true}
        return false;
      })
      // console.log(filteredCoins);
      setCoinList(filteredCoins)
    }
    console.count('getCoinList');

    getCoinList();  

  },[searchedData, filters])

    return (
    <div className='Coins'>

      <Search coinsLength = {coinList.length} searchText = {searchText} setSearchText={setSearchText}/>

      <CoinsFiter 
        filters = {filters}
        options = {options}
        setFilters = {setFilters}
        setOptions = {setOptions}
      />

              
      <div className='results'>
        Results per page 
        <div className='filter'>
            <div className='filter-trigger'>
              {coinsPerPage} <span className='icon-entypo-arrow-thick-down'/>
            </div>
            <div className='filter-content'>
            {coinsPerPages.map((item)=>{
                return <div className='filter-content-item' onClick={(e)=>{setCoinsPerPage(e.target.innerText)}} key={item}>{item}</div>
              })}
            </div>
          </div>
      </div>
            
      <CoinPaginate coinsPerPage={coinsPerPage} coins ={coinList}/>

    </div>
  )
}

export default Coins