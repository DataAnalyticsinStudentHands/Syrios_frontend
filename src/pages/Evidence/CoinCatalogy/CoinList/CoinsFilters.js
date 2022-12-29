import React from 'react'

const CoinsFiter = (props) =>{

    // const [collapse, setCollapse] = useState(true)

      function handleAddFilters(e, filter){
        let newFilters= {...props.filters}
        let newOptions= {...props.options}
    
        if(!newFilters[filter].includes(e.target.innerText)){
          newFilters[filter].push(e.target.innerText)
        }
        newOptions[filter] = newOptions[filter].filter(i =>i !== e.target.innerText)
        props.setFilters(newFilters)
        props.setOptions(newOptions)
      }
    
      function handleDeleteTag(e, filter){
        let newFilters= {...props.filters}
        let newOptions= {...props.options}
    
        newFilters[filter] = newFilters[filter].filter(i =>i !== e.target.innerText)
        if(!newOptions[filter].includes(e.target.innerText)){
          newOptions[filter].push(e.target.innerText)
        }
        props.setFilters(newFilters)
        props.setOptions(newOptions)
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
                props.filters[filterType][0] === undefined ? <></> :(
                    props.filters[filterType].map((item, index)=>{
                    return <span className='icon-syrios-x-thin filterList-item' onClick={(e)=>{handleDeleteTag(e, filterType)}} key={item + index}>{item}</span>
                }))
              }
            </div>
          </div> 
        )
      }

    return(
        <div className="coins-filters">
      <div className='filters'>
        <div className='filter-head'>
          <h1>Filter by</h1>
          <button onClick={()=>props.setRefine(!props.refine)}> Refine results</button>
        </div>
        <div className='filter-body'>
          {getFilter('Material', props.options.material, 'material')}
          {getFilter('Mint', props.options.mint, 'mint')}
        </div>
      </div>
      <div className='filters'>
        <div className='filter-head'>
          <h1>Advanced Filters</h1>
          <button onClick={()=>props.setCollapse(!props.collapse)}> {props.collapse ? 'Expand' : 'Collapse'}</button>
        </div>
          {props.collapse ? <></> :
          <>
            <div className='filter-body'>
              {getFilter('Authority', props.options.issuing_authority, 'issuing_authority')}
              {getFilter('Governing Power', props.options.governing_power, 'governing_power')}
              {getFilter('Language', props.options.language, 'language')}
              {getFilter('Ancient Territory', props.options.ancient_territory, 'ancient_territory')}
            </div>
            <div className='filter-second-body'>
              <div className='filter-year'>
                <div style={{width:""}}>
                Date Range: 
                </div>
                <div className='filter-from-year'>
                  <label data-unit={props.filters.from_year >= 0 ? 'CE' : 'BCE'}>
                  <input type="number" name="from-year" placeholder="From" step="50" value={props.filters.from_year} min="-450" max="450" onChange={ e =>{
                    let newFilters= {...props.filters}
                    newFilters.from_year = e.target.value
                    props.setFilters(newFilters)
                  }} />  
                  </label>
                </div>

                <div className='filter-to-year'>
                  <label data-unit={props.filters.to_year >= 0 ? 'CE' : 'BCE'}>
                    <input type="number" name="to-year" placeholder="To" step="50" value={props.filters.to_year} min="-450" max="450" onChange={ e =>{
                      let newFilters= {...props.filters}
                      newFilters.to_year = e.target.value
                      props.setFilters(newFilters)
                    }}/>  
                  </label>
                </div>

              </div>

              <div className='filter-search'>
                {/* <div className='filter-input'>
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
                </div> */}
                {/* <div className='filterList'>
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
                </div> */}
              </div>
              

        </div>

          </>

          }
      </div>
        </div>
    )

}
export default CoinsFiter