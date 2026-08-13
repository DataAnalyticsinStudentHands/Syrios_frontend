/**
 * CoinsFilters.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Renders catalog filter controls and manages active filter tags.
 *
 * Refactor Summary:
 * 1. Preserved Existing Behavior
 *    - Filter groups, advanced filters, reset behavior, and date range controls remain unchanged
 *
 * 2. Improved Safety
 *    - Adds helper-based filter value access
 *    - Reduces repeated object access and repeated mutation patterns
 *
 * 3. Preserved Raw Collection Compatibility
 *    - Continues using filter state compatible with raw collection rows and CoinContext
 *    - No normalization migration applied yet
 *
 * Notes:
 * - This component does not fetch API data directly
 * - It depends on `Coins.jsx` / `CoinContext` remaining on the raw Strapi collection shape
 *
 * Future Improvements:
 * - Convert filters to reducer-based state updates
 * - Extract reusable dropdown filter component
 * - Add validation/coercion for year inputs
 */

import React, { useState, useContext } from 'react';
import { useParams } from "react-router-dom";
import qs from 'qs';
import { CoinContext } from "src/context/coinContext";

const CoinsFiter = (props) => {
  const [collapse, setCollapse] = useState(true);
  const params = qs.parse(useParams().params);
  const { coinsKeyTerms } = useContext(CoinContext);

  function handleAddFilters(value, filter) {

    const newFilters = { ...props.filters };
    const newOptions = { ...props.options };

    if (!newFilters[filter].includes(value)) {
      newFilters[filter] = [...newFilters[filter], value];
    }

    newOptions[filter] = (newOptions[filter] || []).filter((i) => i !== value);

    props.setFilters(newFilters);
    props.setOptions(newOptions);
  }

  function handleDeleteTag(value, filter) {

    const newFilters = { ...props.filters };
    const newOptions = { ...props.options };

    newFilters[filter] = (newFilters[filter] || []).filter((i) => i !== value);

    if (!(newOptions[filter] || []).includes(value)) {
      newOptions[filter] = [...(newOptions[filter] || []), value];
    }

    props.setFilters(newFilters);
    props.setOptions(newOptions);
  }

  function getFilter(title, value, filterType) {
    return (
      <div className='filter'>
        <label className='filter-select-label'>
          <span>{title}</span>
          <select
            value=''
            aria-label={`Filter coins by ${title}`}
            onChange={(event) => handleAddFilters(event.target.value, filterType)}
          >
            <option value=''>Choose {title.toLowerCase()}</option>
            {value?.map((item, index) => {
              return (
                <option value={item} key={item + index}>
                  {item}
                </option>
              );
            })}
          </select>
        </label>

        <div className='filterList'>
          {(props.filters[filterType] || []).length === 0 ? null : (
            props.filters[filterType].map((item, index) => {
              return (
                <button
                  type='button'
                  className='icon-syrios-x-thin filterList-item'
                  aria-label={`Remove ${item} filter`}
                  onClick={() => handleDeleteTag(item, filterType)}
                  key={item + index}
                >
                  {item}
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="coins-filters">
      <div className='filters'>
        <div className='filter-head'>
          <h1>Filter by</h1>
          <button
            onClick={() => {
              props.setFilters({
                material: [],
                mint: [],
                issuing_authority: [],
                governing_power: [],
                language: [],
                ancient_territory: [],
                from_year: -450,
                to_year: 450,
                ...params.tags
              });

              props.setOptions({ ...coinsKeyTerms });
            }}
          >
            Refine results
          </button>
        </div>

        <div className='filter-body'>
          {getFilter('Material', props.options?.material, 'material')}
          {getFilter('Mint', props.options?.mint, 'mint')}
        </div>
      </div>

      <div className='filters'>
        <div className='filter-head'>
          <h1>Advanced Filters</h1>
          <button onClick={() => setCollapse((prev) => !prev)}>
            {collapse ? 'Expand' : 'Collapse'}
          </button>
        </div>

        {collapse ? null : (
          <>
            <div className='filter-body'>
              {getFilter('Authority', props.options?.issuing_authority, 'issuing_authority')}
              {getFilter('Governing Power', props.options?.governing_power, 'governing_power')}
              {getFilter('Language', props.options?.language, 'language')}
              {getFilter('Ancient Territory', props.options?.ancient_territory, 'ancient_territory')}
            </div>

            <div className='filter-second-body'>
              <div className='filter-year'>
                <div>
                  Date Range:
                </div>

                <div className='filter-from-year'>
                  <label data-unit={props.filters.from_year >= 0 ? 'CE' : 'BCE'}>
                    <input
                      type="number"
                      name="from-year"
                      placeholder="From"
                      step="50"
                      value={props.filters.from_year}
                      min="-450"
                      max="450"
                      onChange={(e) => {
                        const newFilters = { ...props.filters };
                        newFilters.from_year = e.target.value;
                        props.setFilters(newFilters);
                      }}
                    />
                  </label>
                </div>

                <div className='filter-to-year'>
                  <label data-unit={props.filters.to_year >= 0 ? 'CE' : 'BCE'}>
                    <input
                      type="number"
                      name="to-year"
                      placeholder="To"
                      step="50"
                      value={props.filters.to_year}
                      min="-450"
                      max="450"
                      onChange={(e) => {
                        const newFilters = { ...props.filters };
                        newFilters.to_year = e.target.value;
                        props.setFilters(newFilters);
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className='filter-search'>
                {/* Reserved for future type-based filtering */}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CoinsFiter;