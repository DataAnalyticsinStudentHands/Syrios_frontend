import React, {useState, useEffect} from 'react'
import "./Coins.scss"
import coinCollections from 'src/api/coin-collections'
import CoinPaginate from './CoinPaginate'
import { useParams } from "react-router-dom";

import Fuse from 'fuse.js'
import CoinsFiter from './CoinsFilters';
import qs from 'qs';
const Coins = () => {

  const params = qs.parse(useParams().params)  
  const [coins, setCoins] = useState([])
  const [coinList, setCoinList] = useState([])
  const [coinsPerPage, setCoinsPerPage] = useState(12)

  const [preOption, setPreOption] = useState({})
  const [options,setOptions] = useState({
    material:[],
    mint:[],
    issuing_authority:[],
    governing_power:[],
    language:[],
    ancient_territory:[],
  })

  const [filters,setFilters] = useState({
    material:[],
    mint:[],
    issuing_authority:[],
    governing_power:[],
    language:[],
    ancient_territory:[],
    from_year:-450,
    to_year:450,
  })
  const [refine, setRefine] = useState(false)
  const [collapse, setCollapse] = useState(true)
  const coinsPerPages = [12,24,48,96]

  useEffect(()=>{
    const fetchData = async ()=>{
      const result = await coinCollections.coinSearch()
      const fuseOptions = {
        includeScore: true,
        shouldSort: true,
        includeMatches: true,
        minMatchCharLength: params?.pattern?.length,
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
      const fuse = new Fuse(result.data.data, fuseOptions);
      let Searchresults = fuse.search(params.pattern)
      // console.log(Searchresults)
      let CoinData = params.pattern ? Searchresults.map(Searchresult => Searchresult.item) : result.data.data;
      // console.log(CoinData)
      setCoins(CoinData)
      setCoinList(CoinData)
  }
    fetchData().catch(console.error);  
  },[params.pattern])

  useEffect(()=>{
    const getFilters = async ()=>{
      let PreTags = {...params.tags}
      let newFiler = {
        material:[],
        mint:[],
        issuing_authority:[],
        governing_power:[],
        language:[],
        ancient_territory:[],
        from_year:-450,
        to_year:450,
        ...PreTags
      }
      setFilters(newFiler)
    }
    getFilters();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])


  useEffect(()=>{
    function getDeepFilterOptions(filter){
      let options = []
      coins.forEach((coin)=>{
        if (
            !options.includes(coin?.attributes[filter]?.data?.attributes[filter]) &&
            coin?.attributes[filter]?.data?.attributes[filter] !== undefined
          ){
          options.push(coin?.attributes?.[filter]?.data?.attributes[filter])
        }
      })
      
      return options
    }
    const getOptions = async ()=>{
      let options = {
        material:getDeepFilterOptions('material'),
        mint:getDeepFilterOptions('mint'),
        issuing_authority: getDeepFilterOptions('issuing_authority'),
        governing_power: getDeepFilterOptions('governing_power'),
        language: getDeepFilterOptions('language'),
        ancient_territory: getDeepFilterOptions('ancient_territory'),
      }
      setOptions(options)
      setPreOption(options)
    }
    getOptions();
    
  },[coins])



  useEffect(()=>{
    const getOptionsAndFilter = async ()=>{
      setOptions(preOption)
      let PreTags = {...params.tags}
      let newFiler = {
        material:[],
        mint:[],
        issuing_authority:[],
        governing_power:[],
        language:[],
        ancient_territory:[],
        from_year:-450,
        to_year:450,
        ...PreTags
      }
      setFilters(newFiler)
    
    }
    getOptionsAndFilter();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[refine, preOption])



  useEffect(()=>{

    const getCoinList = async ()=>{
      const filteredCoins = coins?.filter( coin =>{
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
      setCoinList(filteredCoins)
    }
    getCoinList();  

  },[coins, filters])
  
  
    return (
    <div className='Coins'>
      <div>
        {params.pattern ? <h2>Search results for '{params.pattern}'</h2> : <></>}
        <h3>Coins total: {coinList.length}</h3>
      </div>

      <CoinsFiter 
        filters = {filters}
        options = {options}
        refine = {refine}
        collapse = {collapse}
        setFilters = {setFilters}
        setOptions = {setOptions}
        setRefine = {setRefine}
        setCollapse = {setCollapse}
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
            
          <CoinPaginate coinsPerPage={coinsPerPage} coins = {coinList}/>
          {/* </>
        )
      } */}
    </div>
  )
}

export default Coins