import React from "react";
import './search.scss'

function Search(props) {

    const handleClick = (e) => {
        e.preventDefault();
        console.log(e.target.nextSibling.value);
        props.setSearchText(e.target.nextSibling.value)
    }

  return (
    <div className='info'>
        {props.searchText ? <h2>Search results for '{props.searchText}'</h2> : <></>}
        <div className='sub-info'>

          <span>Similar in catalog: {props.coinsLength}</span>

          <div className='search'>
            <span className="icon-entypo-search" onClick={handleClick}/>
            <input
              type='text'
              name='search'
              placeholder="Search by coin name, type, date, and more."
              onFocus={(e)=>{
                e.target.addEventListener('keypress', e => {
                    if (e.key === 'Enter') {
                        props.setSearchText(e.target.value)
                    }
                })
              }}
              />
          </div>
        </div>
    </div> 
  )
  }

export default Search;
