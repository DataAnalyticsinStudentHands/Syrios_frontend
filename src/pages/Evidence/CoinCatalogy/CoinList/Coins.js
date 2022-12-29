import React, {useState, useEffect} from 'react'
import "./Coins.scss"
import coinCollections from 'src/api/coin-collections'
import CoinPaginate from './CoinPaginate'
import { useParams } from "react-router-dom";

import Fuse from 'fuse.js'
import CoinsFiter from './CoinsFilters';

const Coins = () => {


  const pattern = useParams().pattern
  
  const [coins, setCoins] = useState([])
  const [coinList, setCoinList] = useState([])
  const [coinsPerPage, setCoinsPerPage] = useState(12)


  const [filters,setFilters] = useState({
    material:[],
    mint:[],
    issuing_authority:[],
    governing_power:[],
    language:[],
    ancient_territory:[],
    from_year:-450,
    to_year:450
  })
  const [options,setOptions] = useState({
    material:[],
    mint:[],
    issuing_authority:[],
    governing_power:[],
    language:[],
    ancient_territory:[],
    // obverse_type:[],
    // reverse_type:[],
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
          minMatchCharLength: 3,
          threshold: 0.6,               //At what point does the match algorithm give up. A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything
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
        let data =fuse.search(pattern)
        setCoins(data)
        setCoinList(data)
    }
    fetchData().catch(console.error);  
},[pattern])

  


  useEffect(()=>{
    function getDeepFilterOptions(filter){
      let options = []
      coins.forEach((coin)=>{
        if (
            !options.includes(coin?.item?.attributes[filter]?.data?.attributes[filter]) &&
            coin?.item?.attributes[filter]?.data?.attributes[filter] !== undefined
          ){
          options.push(coin?.item?.attributes?.[filter]?.data?.attributes[filter])
        }
      })
      
      return options
    }
    const getOptionsAndFilter = async ()=>{
      let options = {
        material:getDeepFilterOptions('material'),
        mint:getDeepFilterOptions('mint'),
        issuing_authority: getDeepFilterOptions('issuing_authority'),
        governing_power: getDeepFilterOptions('governing_power'),
        language: getDeepFilterOptions('language'),
        ancient_territory: getDeepFilterOptions('ancient_territory'),
      }
      setOptions(options)

      setFilters({
        material:[],
        mint:[],
        issuing_authority:[],
        governing_power:[],
        language:[],
        ancient_territory:[],
        from_year:-450,
        to_year:450
      })
    }
    getOptionsAndFilter();

    
  },[coins, refine])



  useEffect(()=>{

    const coinList = async ()=>{
      const filteredCoins = coins?.filter( coin =>{
        if( 
          (filters.material.length === 0 ? true : filters.material.includes(coin?.item?.attributes?.material?.data?.attributes?.material)) &&
          (filters.mint.length === 0 ? true : filters.mint.includes(coin?.item?.attributes?.mint?.data?.attributes?.mint)) &&
          (filters.issuing_authority.length === 0 ? true : filters.issuing_authority.includes(coin?.item?.attributes?.issuing_authority?.data?.attributes?.issuing_authority)) &&
          (filters.governing_power.length === 0 ? true : filters.governing_power.includes(coin?.item?.attributes?.governing_power?.data?.attributes?.governing_power)) &&
          (filters.language.length === 0 ? true : filters.language.includes(coin?.item?.attributes?.language?.data?.attributes?.language)) &&
          (filters.ancient_territory.length === 0 ? true : filters.ancient_territory.includes(coin?.item?.attributes?.ancient_territory?.data?.attributes?.ancient_territory)) &&
          (filters.from_year <= coin?.item?.attributes?.from_year) &&
          (filters.to_year >= coin?.item?.attributes?.to_year)
        ){
          return true
        }
        return false;
      })
      setCoinList(filteredCoins)
    }
    coinList();  

  },[coins, filters])
  
  
    return (
    <div className='Coins'>
      <div>
      {/* {patternData?.pattern?.length && <h2>Search results for '{patternData?.pattern}'</h2>} */}
        <h2>Search results for '{pattern}'</h2>
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
            
          <CoinPaginate coinsPerPage={coinsPerPage} coins = {coinList} filters = {filters}/>
          {/* </>
        )
      } */}
    </div>
  )
}

export default Coins