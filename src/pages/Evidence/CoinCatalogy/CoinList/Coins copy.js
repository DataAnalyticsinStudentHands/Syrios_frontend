import React, {useState, useEffect} from 'react'
import "./Coins.scss"
import coinCollections from 'src/api/coin-collections'
import CoinPaginate from './CoinPaginate'
import { useParams } from "react-router-dom";

import Fuse from 'fuse.js'
import CoinsFiter from './CoinsFilters';
import qs from 'qs';
const Coins = () => {

  const pattern = useParams().pattern
  const patternData = qs.parse(pattern)

  const [coins, setCoins] = useState([])
  const [coinList, setCoinList] = useState([])
  const [coinsPerPage, setCoinsPerPage] = useState(12)

  // const [inputText, setInputText] = useState("")
  // const [typesList, setTypesList] = useState({obverse_type:[],reverse_type:[]})

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
    // obverse_type:[],
    // reverse_type:[],
    ancient_territory:[],
  })
  const [refine, setRefine] = useState(false)
  const [collapse, setCollapse] = useState(true)

  const coinsPerPages = [12,24,48,96]


  useEffect(()=>{
    const fetchData = async ()=>{
      const result = await coinCollections.coinCollection()

      // https://fusejs.io/api/options.html
        const fuseOptions = {
        // isCaseSensitive: false,
        includeScore: true,
        shouldSort: true,
        includeMatches: true,
        // findAllMatches: false,
        minMatchCharLength: 3,
        // location: 0,               //Determines approximately where in the text is the pattern expected to be found.
        threshold: 0.6,               //At what point does the match algorithm give up. A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything
        // distance: 100,
        // useExtendedSearch: false,
        // ignoreLocation: false,
        // ignoreFieldNorm: false,
        // fieldNormWeight: 1,
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
        // console.log(pattern)
      var data = fuse.search(patternData?.pattern)
      // console.log(data)
      setCoins(data)
    }
    fetchData().catch(console.error);  
  },[patternData?.pattern])

  useEffect(()=>{
    
    setCoinList(coins)

  },[coins])
  

  useEffect(()=>{
    // function getFilterOptions(filter){
    //   let options = []
    //   coins.forEach((coin)=>{
    //     if (!options.includes(coin?.item?.attributes[filter])){
    //       options.push(coin?.item?.attributes?.[filter])
    //     }
    //   })
    //   return options
    // }
    function getDeepFilterOptions(filter){
      let options = []
      coins.forEach((coin)=>{
        if (
            !options.includes(coin?.item?.attributes[filter]?.data?.attributes[filter])
          ){
          options.push(coin?.item?.attributes?.[filter]?.data?.attributes[filter])
        }
      })
      
      return options
    }
    setOptions({
      material:getDeepFilterOptions('material'),
      mint:getDeepFilterOptions('mint'),
      type_category:getDeepFilterOptions('type_category'),
      issuing_authority: getDeepFilterOptions('issuing_authority'),
      governing_power: getDeepFilterOptions('governing_power'),
      language: getDeepFilterOptions('language'),
      denomination: getDeepFilterOptions('denomination'),
      ancient_territory: getDeepFilterOptions('ancient_territory'),
      // obverse_type:getFilterOptions('obverse_type'),
      // reverse_type:getFilterOptions('reverse_type')
    })
    // function getFilter(filter){
    //   let options = []
    //   patternData?.tags[filter]?.forEach((tag)=>{
    //     if(!options.includes(tag)){
    //       options.push(tag)
    //     }
    //   })
    //   return options
    // }
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

    setCoinList(coins)
  },[coins, refine])

  // useEffect(()=>{
  //   const copyData = async () =>{

  //   }
  //   copyData();
  // },[refine])


  useEffect(()=>{
    var newCoinArray = []
    coins.forEach(coin =>{
      if( (filters.material.length === 0 ? true : filters.material.includes(coin?.item?.attributes?.material?.data?.attributes?.material)) &&
          (filters.mint.length === 0 ? true : filters.mint.includes(coin?.item?.attributes?.mint?.data?.attributes?.mint)) &&
          (filters.issuing_authority.length === 0 ? true : filters.issuing_authority.includes(coin?.item?.attributes?.issuing_authority?.data?.attributes?.issuing_authority)) &&
          (filters.governing_power.length === 0 ? true : filters.governing_power.includes(coin?.item?.attributes?.governing_power?.data?.attributes?.governing_power)) &&
          (filters.language.length === 0 ? true : filters.language.includes(coin?.item?.attributes?.language?.data?.attributes?.language)) &&
          // (filters.denomination.length === 0 ? true : filters.denomination.includes(coin?.attributes?.denomination?.data?.attributes?.denomination)) &&
          // (filters.obverse_type.length === 0 ? true : filters.obverse_type.includes(coin?.item?.attributes?.obverse_type)) &&
          // (filters.reverse_type.length === 0 ? true : filters.reverse_type.includes(coin?.item?.attributes?.reverse_type)) &&
          (filters.ancient_territory.length === 0 ? true : filters.ancient_territory.includes(coin?.item?.attributes?.ancient_territory?.data?.attributes?.ancient_territory)) &&
          (filters.from_year <= coin?.item?.attributes?.from_year) &&
          (filters.to_year >= coin?.item?.attributes?.to_year)
        ){
        newCoinArray.push(coin)
      }
    })
    setCoinList(newCoinArray)
  },[options,filters, coins])
  
  // useEffect(()=>{
  //   let obverse_types = options.obverse_type.filter(item => item.toLowerCase().includes(inputText))
  //   let reverse_types = options.reverse_type.filter(item => item.toLowerCase().includes(inputText))
  //   let filterTypes = {
  //     obverse_type: [...obverse_types], reverse_type:[...reverse_types]
  //   }
  //   // console.log(filterTypes)
  //   // setTypesList(filterTypes)
  // },[options.obverse_type, options.reverse_type])

    return (
    <div className='Coins'>
      <div>
      {patternData?.pattern?.length && <h2>Search results for '{patternData?.pattern}'</h2>}
        {/* <h2>Search results for '{pattern.input}'</h2> */}
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
              {/* <div className='filter-search'>
                <div className='filter-input'>
                  <input type={'text'} name={'types'} onChange={e=>setInputText(e.target.value)} placeholder="Search by Coin types"/>
                  {inputText.length === 0 ? <></> :
                    <div className='filter-content'>
                      {typesList?.obverse_type?.map((item, index)=>{  
                        return <div className='filter-content-item' onClick={(e)=>{handleAddFilters(e,'obverse_type')}} key={item + index}>{item}</div>
                      })}
                      {typesList?.reverse_type?.map((item, index)=>{  
                        return <div className='filter-content-item' onClick={(e)=>{handleAddFilters(e,'reverse_type')}} key={item + index}>{item}</div>
                      })}
                    </div>
                  }
                </div>
                <div className='filterList'>
                  {filters.obverse_type[0] === undefined ? <></> :(
                      filters.obverse_type.map((item, index)=>{
                        return <span className='icon-syrios-x-thin filterList-item' onClick={(e)=>{handleDeleteTag(e, 'obverse_type')}} key={item + index}>{item}</span>
                    }))
                  }
                  {filters.obverse_type[0] === undefined ? <></> :(
                      filters.reverse_type.map((item, index)=>{
                        return <span className='icon-syrios-x-thin filterList-item' onClick={(e)=>{handleDeleteTag(e, 'reverse_type')}} key={item + index}>{item}</span>
                    }))
                  }
                </div>
              </div> */}
              
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