import React, {useState, useEffect} from 'react'
import "./Coins.scss"
import coinCollections from 'src/api/coin-collections'
import CoinPaginate from './CoinPaginate'

const Coins = () => {
  const [coins, setCoins] = useState([])
  const [coinList, setCoinList] = useState([])
  const [coinsPerPage, setCoinsPerPage] = useState(12)

  const [inputText, setInputText] = useState("")
  const [typesList, setTypesList] = useState({obverse_type:[],reverse_type:[]})

  const [filters,setFilters] = useState({
    material:[],
    mint:[],
    // type_category:[],
    issuing_authority:[],
    governing_power:[],
    language:[],
    // denomination:[],
    obverse_type:[],
    reverse_type:[],
    ancient_territory:[],
    from_year:-450,
    to_year:450
  })
  const [options,setOptions] = useState({
    material:[],
    mint:[],
    // type_category:[],
    issuing_authority:[],
    governing_power:[],
    language:[],
    // denomination:[],
    obverse_type:[],
    reverse_type:[],
    ancient_territory:[],
  })
  const [refine, setRefine] = useState(false)
  const [collapse, setCollapse] = useState(true)
  const coinsPerPages = [12,24,48,96]

  useEffect(()=>{
    const fetchData = async ()=>{
      const result = await coinCollections.coinCollection()
      setCoins(result.data.data)
      setCoinList(result.data.data)
    }
    fetchData().catch(console.error);  
  },[])

  useEffect(()=>{
    function getFilterOptions(filter){
      let options = []
      coins.forEach((coin)=>{
        if (!options.includes(coin?.attributes[filter])){
          options.push(coin?.attributes?.[filter])
        }
      })
      return options
    }
    function getDeepFilterOptions(filter){
      let options = []
      coins.forEach((coin)=>{
        if (!options.includes(coin?.attributes[filter]?.data?.attributes[filter])){
          options.push(coin?.attributes?.[filter]?.data?.attributes[filter])
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
      obverse_type:getFilterOptions('obverse_type'),
      reverse_type:getFilterOptions('reverse_type')
    })
  },[coins])

  useEffect(()=>{
    setFilters({
      material:[],
      mint:[],
      // type_category:[],
      issuing_authority:[],
      governing_power:[],
      language:[],
      // denomination:[],
      obverse_type:[],
      reverse_type:[],
      ancient_territory:[],
      from_year:-450,
      to_year:450
    })
    setCoinList(coins)
  },[refine, coins])

  useEffect(()=>{
    var newCoinArray = []
    coins.forEach(coin =>{
      if( (filters.material.length === 0 ? true : filters.material.includes(coin?.attributes?.material?.data?.attributes?.material)) &&
          (filters.mint.length === 0 ? true : filters.mint.includes(coin?.attributes?.mint?.data?.attributes?.mint)) &&
          (filters.issuing_authority.length === 0 ? true : filters.issuing_authority.includes(coin?.attributes?.issuing_authority?.data?.attributes?.issuing_authority)) &&
          (filters.governing_power.length === 0 ? true : filters.governing_power.includes(coin?.attributes?.governing_power?.data?.attributes?.governing_power)) &&
          (filters.language.length === 0 ? true : filters.language.includes(coin?.attributes?.language?.data?.attributes?.language)) &&
          // (filters.denomination.length === 0 ? true : filters.denomination.includes(coin?.attributes?.denomination?.data?.attributes?.denomination)) &&
          (filters.obverse_type.length === 0 ? true : filters.obverse_type.includes(coin?.attributes?.obverse_type)) &&
          (filters.reverse_type.length === 0 ? true : filters.reverse_type.includes(coin?.attributes?.reverse_type)) &&
          (filters.ancient_territory.length === 0 ? true : filters.ancient_territory.includes(coin?.attributes?.ancient_territory?.data?.attributes?.ancient_territory)) &&
          (filters.from_year <= coin?.attributes?.from_year) &&
          (filters.to_year >= coin?.attributes?.to_year)
        ){
        newCoinArray.push(coin)
      }
    })
    setCoinList(newCoinArray)
  },[options,filters, coins])
  
  useEffect(()=>{
    let obverse_types = options.obverse_type.filter(item => item.toLowerCase().includes(inputText))
    let reverse_types = options.reverse_type.filter(item => item.toLowerCase().includes(inputText))
    let filterTypes = {
      obverse_type: [...obverse_types], reverse_type:[...reverse_types]
    }
    // console.log(filterTypes)
    setTypesList(filterTypes)
  },[inputText,options.obverse_type, options.reverse_type])

  function handleAddFilters(e, filter){
    let newFilters= {...filters}
    let newOptions= {...options}

    if(!newFilters[filter].includes(e.target.innerText)){
      newFilters[filter].push(e.target.innerText)
    }
    newOptions[filter] = newOptions[filter].filter(i =>i !== e.target.innerText)
    setInputText("")
    setFilters(newFilters)
    setOptions(newOptions)
  }

  function handleDeleteTag(e, filter){
    let newFilters= {...filters}
    let newOptions= {...options}

    newFilters[filter] = newFilters[filter].filter(i =>i !== e.target.innerText)
    if(!newOptions[filter].includes(e.target.innerText)){
      newOptions[filter].push(e.target.innerText)
    }
    setFilters(newFilters)
    setOptions(newOptions)
  }
  function getFilter(title,value,filterType){
    return(
      <div className='filter'>
        <div className='filter-trigger'>
          {title}
          <span className='icon-entypo-arrow-thick-down'/>
          <div className='filter-content'>
            {value?.map((item, index)=>{  
              return <div className='filter-content-item' onClick={(e)=>{handleAddFilters(e,filterType)}} key={item + index}>{item}</div>
            })}
          </div>
        </div>
        <div className='filterList'>
          {
            filters[filterType][0] === undefined ? <></> :(
              filters[filterType].map((item, index)=>{
                return <span className='icon-syrios-x-thin filterList-item' onClick={(e)=>{handleDeleteTag(e, filterType)}} key={item + index}>{item}</span>
            }))
          }
        </div>
      </div> 
    )
  }

    return (
    <div className='Coins'>
      <div>
        {/* <h2>Search results for 'Coins'</h2> */}
        <h3>Coins total: {coinList.length}</h3>
      </div>

      <div className='filters'>
        <div className='filter-head'>
          <h1>Filter by</h1>
          <button onClick={()=>setRefine(!refine)}> Refine results</button>
        </div>

        <div className='filter-body'>

          {getFilter('Material', options.material, 'material')}
          {getFilter('Mint', options.mint, 'mint')}
          {/* {getFilter('Type Category', options.type_category, 'type_category')} */}
        </div>



      </div>
      <div className='filters'>
        <div className='filter-head'>
          <h1>Advanced Filters</h1>
          <button onClick={()=>setCollapse(!collapse)}> {collapse ? 'Expand' : 'Collapse'}</button>
        </div>
          {collapse ? <></> :
          <>
            <div className='filter-body'>
              {getFilter('Authority', options.issuing_authority, 'issuing_authority')}
              {getFilter('Governing Power', options.governing_power, 'governing_power')}
              {getFilter('Language', options.language, 'language')}
              {/* {getFilter('Denomination', options.denomination, 'denomination')} */}
              {getFilter('Ancient Territory', options.ancient_territory, 'ancient_territory')}
            </div>
            <div className='filter-second-body'>
              <div className='filter-year'>
                <div style={{width:""}}>
                Date Range: 
                </div>
                <div className='filter-from-year'>
                  {/* <span> BCE</span> */}
                  <label data-unit={filters.from_year >= 0 ? 'CE' : 'BCE'}>
                  <input type="number" name="from-year" placeholder="From" step="50" value={filters.from_year} min="-450" max="450" onChange={ e =>{
                    let newFilters= {...filters}
                    newFilters.from_year = e.target.value
                    setFilters(newFilters)
                  }} />  
                  </label>
                </div>

                <div className='filter-to-year'>
                  <label data-unit={filters.to_year >= 0 ? 'CE' : 'BCE'}>
                    <input type="number" name="to-year" placeholder="To" step="50" value={filters.to_year} min="-450" max="450" onChange={ e =>{
                      let newFilters= {...filters}
                      newFilters.to_year = e.target.value
                      setFilters(newFilters)
                    }}/>  
                  </label>
                </div>

              </div>

              <div className='filter-search'>
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
              </div>
              

        </div>

          </>

          }
      </div>

      {/* {
        (coinList.length === 0 && Object.values(filters).flat(Infinity).length ===0) ? (
          <div id='no-coins-return'>
            No coins match
          </div>
        ):(
          <> */}
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