import React, { useState } from 'react';
import {
  COMPOSITION_DIMENSIONS,
  FILTER_DIMENSIONS,
  MAP_DATE_RANGE,
  formatTimelineYear,
} from './mapCoinData';

const SegmentedControl = ({ label, options, value, onChange }) => (
  <fieldset className='map-coins__segmented-fieldset'>
    <legend>{label}</legend>
    <div className='map-coins__segmented'>
      {options.map((option) => (
        <label key={option.value} className={value === option.value ? 'is-active' : ''}>
          <input
            type='radio'
            name={label}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  </fieldset>
);

const MapControls = ({
  open,
  onToggleOpen,
  representation,
  onRepresentationChange,
  compositionDimension,
  onCompositionDimensionChange,
  placeMode,
  onPlaceModeChange,
  filters,
  filterOptions,
  onToggleFilter,
  onClearFilters,
  timeRange,
  onTimeRangeChange,
  playing,
  onTogglePlayback,
  comparison,
  comparisonOptions,
  onComparisonChange,
  onApplyPreset,
  visibleCount,
  totalCount,
}) => {
  const activeFilterCount = Object.values(filters).reduce((total, selected) => total + selected.length, 0);
  const [expandedFilters, setExpandedFilters] = useState(() => new Set(
    FILTER_DIMENSIONS.slice(0, 3).map((dimension) => dimension.key),
  ));

  return (
    <aside className={`map-coins__controls ${open ? 'is-open' : 'is-collapsed'}`} aria-label='Map controls'>
      <button
        type='button'
        className='map-coins__controls-toggle'
        onClick={onToggleOpen}
        aria-expanded={open}
      >
        <span aria-hidden='true'>{open ? '‹' : '›'}</span>
        <span className='map-coins__controls-toggle-label'>{open ? 'Hide controls' : 'Map controls'}</span>
      </button>

      {open && (
        <div className='map-coins__controls-body'>
          <div className='map-coins__controls-heading'>
            <div>
              <span>Interactive preview</span>
              <h4>Map controls</h4>
            </div>
            <strong>{visibleCount.toLocaleString()} / {totalCount.toLocaleString()}</strong>
          </div>

          <section className='map-coins__control-section'>
            <h5>Coin representation</h5>
            <SegmentedControl
              label='Marker style'
              value={representation}
              onChange={onRepresentationChange}
              options={[
                { value: 'images', label: 'Coin images' },
                { value: 'quantity', label: 'Quantity' },
                { value: 'composition', label: 'Composition' },
              ]}
            />
            {representation === 'composition' && (
              <label className='map-coins__select-label'>
                Divide markers by
                <select
                  value={compositionDimension}
                  onChange={(event) => onCompositionDimensionChange(event.target.value)}
                >
                  {COMPOSITION_DIMENSIONS.map((dimension) => (
                    <option key={dimension.key} value={dimension.key}>{dimension.label}</option>
                  ))}
                </select>
              </label>
            )}
          </section>

          <section className='map-coins__control-section'>
            <h5>Ancient and modern labels</h5>
            <SegmentedControl
              label='Place labels'
              value={placeMode}
              onChange={onPlaceModeChange}
              options={[
                { value: 'ancient', label: 'Ancient' },
                { value: 'modern', label: 'Modern' },
                { value: 'both', label: 'Both' },
              ]}
            />
          </section>

          <section className='map-coins__control-section map-coins__timeline-controls'>
            <div className='map-coins__section-title-row'>
              <h5>Time period</h5>
              <button type='button' onClick={onTogglePlayback} className={playing ? 'is-playing' : ''}>
                <span aria-hidden='true'>{playing ? '■' : '▶'}</span>
                {playing ? 'Stop' : 'Play'}
              </button>
            </div>
            <div className='map-coins__time-readout'>
              <strong>{formatTimelineYear(timeRange.start)}</strong>
              <span>to</span>
              <strong>{formatTimelineYear(timeRange.end)}</strong>
            </div>
            <label>
              From
              <input
                type='range'
                min={MAP_DATE_RANGE.min}
                max={MAP_DATE_RANGE.max}
                value={timeRange.start}
                onChange={(event) => onTimeRangeChange({
                  ...timeRange,
                  start: Math.min(Number(event.target.value), timeRange.end),
                })}
              />
            </label>
            <label>
              Through
              <input
                type='range'
                min={MAP_DATE_RANGE.min}
                max={MAP_DATE_RANGE.max}
                value={timeRange.end}
                onChange={(event) => onTimeRangeChange({
                  ...timeRange,
                  end: Math.max(Number(event.target.value), timeRange.start),
                })}
              />
            </label>
          </section>

          <section className='map-coins__control-section'>
            <div className='map-coins__section-title-row'>
              <h5>Coin filters</h5>
              <button type='button' onClick={onClearFilters} disabled={activeFilterCount === 0}>
                Clear {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
              </button>
            </div>
            <div className='map-coins__filter-groups'>
              {FILTER_DIMENSIONS.map((dimension) => (
                <details
                  key={dimension.key}
                  open={expandedFilters.has(dimension.key)}
                  onToggle={(event) => {
                    const isOpen = event.currentTarget.open;
                    setExpandedFilters((current) => {
                      if (current.has(dimension.key) === isOpen) return current;
                      const next = new Set(current);
                      if (isOpen) next.add(dimension.key);
                      else next.delete(dimension.key);
                      return next;
                    });
                  }}
                >
                  <summary>
                    {dimension.label}
                    {filters[dimension.key].length > 0 && <span>{filters[dimension.key].length}</span>}
                  </summary>
                  <div className='map-coins__filter-chips'>
                    {filterOptions[dimension.key].map((option) => {
                      const selected = filters[dimension.key].includes(option);
                      return (
                        <button
                          type='button'
                          key={option}
                          className={selected ? 'is-selected' : ''}
                          onClick={() => onToggleFilter(dimension.key, option)}
                          aria-pressed={selected}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section className='map-coins__control-section map-coins__comparison-controls'>
            <div className='map-coins__section-title-row'>
              <h5>Comparison mode</h5>
              <label className='map-coins__switch'>
                <input
                  type='checkbox'
                  checked={comparison.enabled}
                  onChange={(event) => onComparisonChange({ ...comparison, enabled: event.target.checked })}
                />
                <span aria-hidden='true' />
                {comparison.enabled ? 'On' : 'Off'}
              </label>
            </div>
            {comparison.enabled && (
              <>
                <label className='map-coins__select-label'>
                  Compare by
                  <select
                    value={comparison.dimension}
                    onChange={(event) => onComparisonChange({
                      ...comparison,
                      dimension: event.target.value,
                      a: '',
                      b: '',
                    })}
                  >
                    {COMPOSITION_DIMENSIONS.map((dimension) => (
                      <option key={dimension.key} value={dimension.key}>{dimension.label}</option>
                    ))}
                  </select>
                </label>
                <div className='map-coins__compare-selects'>
                  <label>
                    A
                    <select
                      value={comparison.a}
                      onChange={(event) => onComparisonChange({ ...comparison, a: event.target.value })}
                    >
                      <option value=''>Choose…</option>
                      {comparisonOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </label>
                  <label>
                    B
                    <select
                      value={comparison.b}
                      onChange={(event) => onComparisonChange({ ...comparison, b: event.target.value })}
                    >
                      <option value=''>Choose…</option>
                      {comparisonOptions.filter((option) => option !== comparison.a).map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </>
            )}
          </section>

          <section className='map-coins__control-section'>
            <h5>Try a guided question</h5>
            <div className='map-coins__guided-questions'>
              <button type='button' onClick={() => onApplyPreset('metals')}>Gold vs. bronze</button>
              <button type='button' onClick={() => onApplyPreset('authority')}>Royal vs. imperial</button>
              <button type='button' onClick={() => onApplyPreset('powers')}>Seleucid vs. Roman</button>
              <button type='button' onClick={() => onApplyPreset('timeline')}>Watch coins through time</button>
            </div>
          </section>
        </div>
      )}
    </aside>
  );
};

export default MapControls;
