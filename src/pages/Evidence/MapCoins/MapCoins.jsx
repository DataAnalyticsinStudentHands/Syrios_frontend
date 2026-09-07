/**
 * Interactive visual showcase for the temporary Coins on a Map page.
 *
 * This uses mint-origin coordinates from the current catalog. It intentionally
 * does not describe the markers as discovery sites, movement, or circulation.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import coinCollections from 'src/api/coin-collections';
import MapControls from './MapControls';
import {
  FILTER_DIMENSIONS,
  MAP_DATE_RANGE,
  filterLocatedCoins,
  formatTimelineYear,
  getCategoryColor,
  getCompositionEntries,
  getDimensionOptions,
  getFilterOptions,
  groupCoinsByMint,
  normalizeLocatedCoins,
} from './mapCoinData';
import 'mapbox-gl/dist/mapbox-gl.css';

const ANTIOCH = {
  name: 'Antioch on the Orontes',
  coordinates: [36.181667, 36.204722],
  formattedCoordinates: '36°12′17″N 36°10′54″E',
};

const INITIAL_VIEW = {
  center: ANTIOCH.coordinates,
  zoom: 4.25,
  pitch: 0,
  bearing: 0,
};

const DESTINATION_VIEW = {
  center: ANTIOCH.coordinates,
  zoom: 12.25,
  pitch: 46,
  bearing: -12,
};

const createEmptyFilters = () => Object.fromEntries(
  FILTER_DIMENSIONS.map((dimension) => [dimension.key, []]),
);

const DEFAULT_COMPARISON = {
  enabled: false,
  dimension: 'material',
  a: '',
  b: '',
};

const markerSize = (count, maximum, min = 48, max = 106) => {
  if (maximum <= 1) return min;
  return min + (max - min) * Math.sqrt(count / maximum);
};

const conicGradient = (entries, total) => {
  if (total === 0) return '#737271';
  let cursor = 0;
  const segments = entries.map((entry) => {
    const start = cursor;
    cursor += (entry.count / total) * 100;
    return `${entry.color} ${start.toFixed(2)}% ${cursor.toFixed(2)}%`;
  });
  return `conic-gradient(${segments.join(', ')})`;
};

const appendTextRow = (list, labelText) => {
  const term = document.createElement('dt');
  term.textContent = labelText;
  const value = document.createElement('dd');
  list.append(term, value);
  return value;
};

const createCoinPopup = (group) => {
  let activeIndex = 0;
  const routePrefix = window.location.pathname.startsWith('/dev') ? '/dev' : '';
  const content = document.createElement('div');
  content.className = 'map-coins__popup map-coins__popup--coins';

  const label = document.createElement('span');
  label.className = 'map-coins__popup-label';
  label.textContent = `${group.coins.length.toLocaleString()} visible ${group.coins.length === 1 ? 'coin' : 'coins'}`;
  const title = document.createElement('strong');
  title.textContent = group.name;
  const place = document.createElement('span');
  place.className = 'map-coins__popup-place';
  place.textContent = [group.modernName, group.modernCountry].filter(Boolean).join(', ') || 'Modern location not recorded';

  const viewer = document.createElement('div');
  viewer.className = 'map-coins__coin-viewer';
  const imageWrap = document.createElement('div');
  imageWrap.className = 'map-coins__popup-image-wrap';
  const image = document.createElement('img');
  image.className = 'map-coins__popup-image';
  image.loading = 'lazy';
  const imageFallback = document.createElement('span');
  imageFallback.className = 'map-coins__popup-image-fallback';
  imageFallback.textContent = 'No obverse image';
  image.addEventListener('error', () => {
    image.hidden = true;
    imageFallback.hidden = false;
  });
  imageWrap.append(image, imageFallback);

  const coinTitle = document.createElement('span');
  coinTitle.className = 'map-coins__popup-coin-title';
  const coinDate = document.createElement('span');
  coinDate.className = 'map-coins__popup-coin-date';

  const metadata = document.createElement('dl');
  metadata.className = 'map-coins__popup-metadata';
  const materialValue = appendTextRow(metadata, 'Material');
  const authorityValue = appendTextRow(metadata, 'Authority');
  const powerValue = appendTextRow(metadata, 'Governing power');
  const denominationValue = appendTextRow(metadata, 'Denomination');
  const languageValue = appendTextRow(metadata, 'Language');

  const reference = document.createElement('p');
  reference.className = 'map-coins__popup-reference';
  const rightsHolder = document.createElement('p');
  rightsHolder.className = 'map-coins__popup-rights';

  const links = document.createElement('div');
  links.className = 'map-coins__popup-links';
  const detailLink = document.createElement('a');
  detailLink.textContent = 'Catalog record';
  const sourceLink = document.createElement('a');
  sourceLink.textContent = 'Image source';
  sourceLink.target = '_blank';
  sourceLink.rel = 'noreferrer';
  links.append(detailLink, sourceLink);

  const navigation = document.createElement('div');
  navigation.className = 'map-coins__popup-navigation';
  const previousButton = document.createElement('button');
  previousButton.type = 'button';
  previousButton.setAttribute('aria-label', 'Previous coin');
  previousButton.textContent = '‹';
  const counter = document.createElement('span');
  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.setAttribute('aria-label', 'Next coin');
  nextButton.textContent = '›';
  navigation.append(previousButton, counter, nextButton);

  const renderActiveCoin = () => {
    const coin = group.coins[activeIndex];
    const hasImage = Boolean(coin?.imageUrl);
    image.hidden = !hasImage;
    imageFallback.hidden = hasImage;
    if (hasImage) {
      image.src = coin.imageUrl;
      image.alt = coin.imageAlt;
    } else {
      image.removeAttribute('src');
      image.alt = '';
    }
    coinTitle.textContent = coin?.title || 'Catalog coin';
    coinDate.textContent = coin?.dateRange || 'Date not recorded';
    materialValue.textContent = coin?.material || 'Not recorded';
    authorityValue.textContent = coin?.authority || 'Not recorded';
    powerValue.textContent = coin?.power || 'Not recorded';
    denominationValue.textContent = coin?.denomination || 'Not recorded';
    languageValue.textContent = coin?.language || 'Not recorded';
    reference.textContent = coin?.reference ? `Reference: ${coin.reference}` : 'Reference not recorded';
    rightsHolder.textContent = coin?.rightHolder ? `Rights holder: ${coin.rightHolder}` : 'Rights holder not recorded';
    counter.textContent = `${activeIndex + 1} / ${group.coins.length}`;
    detailLink.href = `${routePrefix}/Coin/${coin.id}`;
    sourceLink.hidden = !coin?.sourceImage;
    sourceLink.href = coin?.sourceImage || '#';
  };

  previousButton.addEventListener('click', () => {
    activeIndex = (activeIndex - 1 + group.coins.length) % group.coins.length;
    renderActiveCoin();
  });
  nextButton.addEventListener('click', () => {
    activeIndex = (activeIndex + 1) % group.coins.length;
    renderActiveCoin();
  });

  if (group.coins.length < 2) navigation.hidden = true;
  viewer.append(imageWrap, coinTitle, coinDate, metadata, reference, rightsHolder, navigation, links);
  content.append(label, title, place, viewer);
  renderActiveCoin();
  return content;
};

const createPlaceLabel = (group, placeMode) => {
  const label = document.createElement('span');
  label.className = 'map-coins__marker-place';
  const modern = [group.modernName, group.modernCountry].filter(Boolean).join(', ');

  if (placeMode === 'ancient') {
    label.textContent = group.name;
  } else if (placeMode === 'modern') {
    label.textContent = modern || group.name;
  } else {
    const ancientName = document.createElement('strong');
    ancientName.textContent = group.name;
    const modernName = document.createElement('span');
    modernName.textContent = modern || 'Modern location not recorded';
    label.append(ancientName, modernName);
  }
  return label;
};

const createImageVisual = (group) => {
  const stack = document.createElement('span');
  stack.className = 'map-coins__coin-marker-stack';
  const imageCoins = group.coins.filter((coin) => coin.imageUrl).slice(0, 3);

  if (imageCoins.length === 0) {
    const fallback = document.createElement('span');
    fallback.className = 'map-coins__coin-marker-fallback';
    fallback.textContent = '◉';
    stack.append(fallback);
  } else {
    imageCoins.forEach((coin, index) => {
      const image = document.createElement('img');
      image.className = `map-coins__coin-marker-image map-coins__coin-marker-image--${index + 1}`;
      image.src = coin.imageUrl;
      image.alt = '';
      image.loading = 'lazy';
      image.width = 64;
      image.height = 64;
      stack.append(image);
    });
  }
  return stack;
};

const createQuantityVisual = (group, maximum) => {
  const visual = document.createElement('span');
  visual.className = 'map-coins__quantity-marker';
  visual.style.setProperty('--marker-size', `${markerSize(group.coins.length, maximum)}px`);
  visual.textContent = group.coins.length.toLocaleString();
  return visual;
};

const createCompositionVisual = (group, dimension, maximum) => {
  const visual = document.createElement('span');
  const entries = getCompositionEntries(group.coins, dimension);
  visual.className = 'map-coins__composition-marker';
  visual.style.setProperty('--marker-size', `${markerSize(group.coins.length, maximum)}px`);
  visual.style.background = conicGradient(entries, group.coins.length);
  const center = document.createElement('span');
  center.textContent = group.coins.length.toLocaleString();
  visual.append(center);
  return visual;
};

const createComparisonVisual = (group, comparison, maximum) => {
  const visual = document.createElement('span');
  visual.className = 'map-coins__comparison-marker';
  const size = markerSize(group.coins.length, maximum, 38, 70);
  visual.style.setProperty('--comparison-size', `${size}px`);

  [comparison.a, comparison.b].forEach((value, index) => {
    const half = document.createElement('span');
    const count = group.coins.filter((coin) => coin[comparison.dimension] === value).length;
    half.style.background = getCategoryColor(value, index);
    half.textContent = count.toLocaleString();
    half.setAttribute('aria-label', `${value}: ${count} coins`);
    visual.append(half);
  });
  return visual;
};

const createCoinMarkerElement = ({
  group,
  representation,
  compositionDimension,
  placeMode,
  comparison,
  maximum,
}) => {
  const element = document.createElement('button');
  element.type = 'button';
  element.className = `map-coins__coin-marker map-coins__coin-marker--${representation} map-coins__coin-marker--${placeMode}`;
  element.setAttribute(
    'aria-label',
    `Browse ${group.coins.length} ${group.coins.length === 1 ? 'coin' : 'coins'} from ${group.name}`,
  );

  const isComparison = comparison.enabled && comparison.a && comparison.b;
  if (isComparison) {
    element.append(createComparisonVisual(group, comparison, maximum));
  } else if (representation === 'quantity') {
    element.append(createQuantityVisual(group, maximum));
  } else if (representation === 'composition') {
    element.append(createCompositionVisual(group, compositionDimension, maximum));
  } else {
    element.append(createImageVisual(group));
    const count = document.createElement('span');
    count.className = 'map-coins__coin-marker-count';
    count.textContent = group.coins.length.toLocaleString();
    count.setAttribute('aria-hidden', 'true');
    element.append(count);
  }

  element.append(createPlaceLabel(group, placeMode));
  return element;
};

const MapLegend = ({
  representation,
  compositionDimension,
  comparison,
  visibleCoins,
  groups,
}) => {
  const comparisonReady = comparison.enabled && comparison.a && comparison.b;
  const entries = useMemo(
    () => getCompositionEntries(visibleCoins, compositionDimension).slice(0, 7),
    [compositionDimension, visibleCoins],
  );
  const missingImages = visibleCoins.filter((coin) => !coin.imageUrl).length;
  const incompleteMetadata = visibleCoins.filter((coin) => !coin.denomination || !coin.language).length;

  return (
    <aside className='map-coins__legend' aria-label='Map legend'>
      <span className='map-coins__legend-eyebrow'>Live legend</span>
      {comparisonReady ? (
        <>
          <strong>Paired comparison</strong>
          {[comparison.a, comparison.b].map((value, index) => (
            <span className='map-coins__legend-entry' key={value}>
              <i style={{ background: getCategoryColor(value, index) }} />
              {value}
            </span>
          ))}
        </>
      ) : representation === 'composition' ? (
        <>
          <strong>{compositionDimension} composition</strong>
          {entries.map((entry) => (
            <span className='map-coins__legend-entry' key={entry.label}>
              <i style={{ background: entry.color }} />
              {entry.label} <small>{entry.count}</small>
            </span>
          ))}
        </>
      ) : representation === 'quantity' ? (
        <>
          <strong>Coins per mint</strong>
          <span className='map-coins__quantity-key'><i /><i />Marker area follows quantity</span>
        </>
      ) : (
        <>
          <strong>Obverse coin markers</strong>
          <span>Images are normalized to a common marker size.</span>
        </>
      )}
      <div className='map-coins__legend-summary'>
        <strong>{visibleCoins.length.toLocaleString()} coins · {groups.length} mints</strong>
        <span>{missingImages} without obverse image</span>
        <span>{incompleteMetadata} with partial denomination/language data</span>
      </div>
    </aside>
  );
};

const MapLoadingScreen = ({ phase, coinCount = 0 }) => {
  const loadingCatalog = phase === 'catalog';

  return (
    <div className='map-coins__loading-screen' role='status' aria-live='polite'>
      <div className='map-coins__loading-art' aria-hidden='true'>
        <span className='map-coins__loading-coin map-coins__loading-coin--one' />
        <span className='map-coins__loading-coin map-coins__loading-coin--two' />
        <span className='map-coins__loading-coin map-coins__loading-coin--three' />
        <i className='map-coins__loading-orbit' />
      </div>
      <span className='map-coins__loading-eyebrow'>Coins on a Map</span>
      <h4>{loadingCatalog ? 'Gathering the coin catalog' : 'Drawing the ancient landscape'}</h4>
      <p>
        {loadingCatalog
          ? 'Loading locations, obverse images, dates, and classifications from Strapi.'
          : `Positioning ${coinCount.toLocaleString()} located coins and preparing the interactive controls.`}
      </p>
      <div className='map-coins__loading-stages' aria-hidden='true'>
        <span className={loadingCatalog ? 'is-active' : 'is-complete'}>Catalog</span>
        <i><span /></i>
        <span className={loadingCatalog ? '' : 'is-active'}>Map</span>
      </div>
    </div>
  );
};

const MapCoins = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapStatus, setMapStatus] = useState('waiting-data');
  const [coinStatus, setCoinStatus] = useState('loading');
  const [coins, setCoins] = useState([]);
  const [controlsOpen, setControlsOpen] = useState(
    () => typeof window === 'undefined' || !window.matchMedia('(max-width: 767.98px)').matches,
  );
  const [representation, setRepresentation] = useState('images');
  const [compositionDimension, setCompositionDimension] = useState('material');
  const [placeMode, setPlaceMode] = useState('both');
  const [filters, setFilters] = useState(createEmptyFilters);
  const [timeRange, setTimeRange] = useState({ start: MAP_DATE_RANGE.min, end: MAP_DATE_RANGE.max });
  const [playing, setPlaying] = useState(false);
  const [comparison, setComparison] = useState(DEFAULT_COMPARISON);

  const filterOptions = useMemo(() => Object.fromEntries(
    FILTER_DIMENSIONS.map((dimension) => [dimension.key, getFilterOptions(coins, dimension.key)]),
  ), [coins]);

  const comparisonOptions = useMemo(
    () => getDimensionOptions(coins, comparison.dimension),
    [coins, comparison.dimension],
  );

  const visibleCoins = useMemo(() => filterLocatedCoins(coins, {
    filters,
    timeRange,
    comparison,
  }), [coins, comparison, filters, timeRange]);

  const coinGroups = useMemo(() => groupCoinsByMint(visibleCoins), [visibleCoins]);
  const maximumGroupCount = Math.max(1, ...coinGroups.map((group) => group.coins.length));

  useEffect(() => {
    let cancelled = false;
    const fetchLocatedCoins = async () => {
      try {
        const response = await coinCollections.fetchLocatedForMap();
        if (cancelled) return;
        setCoins(normalizeLocatedCoins(response?.data?.data || []));
        setCoinStatus('ready');
      } catch (error) {
        console.error('Unable to load located coins for the map:', error);
        if (!cancelled) setCoinStatus('error');
      }
    };
    fetchLocatedCoins();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => {
      setTimeRange((current) => {
        const width = Math.min(140, Math.max(80, current.end - current.start));
        const nextStart = current.start + 20;
        if (nextStart + width > MAP_DATE_RANGE.max) {
          return { start: MAP_DATE_RANGE.min, end: MAP_DATE_RANGE.min + width };
        }
        return { start: nextStart, end: nextStart + width };
      });
    }, 900);
    return () => window.clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    if (coinStatus !== 'ready' || !mapContainerRef.current) return undefined;
    setMapStatus('loading');

    const accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!accessToken) {
      setMapStatus('missing-token');
      return undefined;
    }

    mapboxgl.accessToken = accessToken;
    let flyToTimer;
    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        ...INITIAL_VIEW,
        attributionControl: false,
        cooperativeGestures: true,
      });
      mapRef.current = map;
      map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right');
      map.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }), 'bottom-left');
      map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

      map.on('load', () => {
        setMapStatus('ready');
        map.setFog({
          color: '#f0e0c0',
          'high-color': '#b8ccd8',
          'horizon-blend': 0.16,
        });
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        flyToTimer = window.setTimeout(() => {
          map.flyTo({
            ...DESTINATION_VIEW,
            duration: reducedMotion ? 0 : 6500,
            curve: 1.35,
            speed: 0.72,
            essential: false,
          });
        }, reducedMotion ? 0 : 650);
      });
    } catch (error) {
      console.error('Unable to initialize the Antioch map:', error);
      setMapStatus('error');
    }

    return () => {
      window.clearTimeout(flyToTimer);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [coinStatus]);

  useEffect(() => {
    if (mapStatus !== 'ready' || !mapRef.current) return undefined;
    const markers = coinGroups.map((group) => {
      const element = createCoinMarkerElement({
        group,
        representation,
        compositionDimension,
        placeMode,
        comparison,
        maximum: maximumGroupCount,
      });
      const popup = new mapboxgl.Popup({
        offset: 62,
        maxWidth: '37rem',
        closeButton: true,
        className: 'map-coins__site-popup',
      }).setDOMContent(createCoinPopup(group));

      return new mapboxgl.Marker({ element, anchor: 'center' })
        .setLngLat(group.coordinates)
        .setPopup(popup)
        .addTo(mapRef.current);
    });
    return () => markers.forEach((marker) => marker.remove());
  }, [coinGroups, comparison, compositionDimension, mapStatus, maximumGroupCount, placeMode, representation]);

  const toggleFilter = (dimension, option) => {
    setFilters((current) => {
      const selected = current[dimension];
      return {
        ...current,
        [dimension]: selected.includes(option)
          ? selected.filter((value) => value !== option)
          : [...selected, option],
      };
    });
  };

  const togglePlayback = () => {
    setPlaying((current) => {
      if (!current && timeRange.end - timeRange.start > 180) {
        setTimeRange({ start: MAP_DATE_RANGE.min, end: MAP_DATE_RANGE.min + 100 });
      }
      return !current;
    });
  };

  const applyPreset = (preset) => {
    setPlaying(false);
    setFilters(createEmptyFilters());
    setTimeRange({ start: MAP_DATE_RANGE.min, end: MAP_DATE_RANGE.max });
    if (preset === 'metals') {
      setComparison({ enabled: true, dimension: 'material', a: 'Gold', b: 'Bronze' });
    } else if (preset === 'authority') {
      setComparison({ enabled: true, dimension: 'authority', a: 'Royal', b: 'Imperial' });
    } else if (preset === 'powers') {
      setComparison({ enabled: true, dimension: 'power', a: 'Seleucid', b: 'Roman Principate' });
    } else if (preset === 'timeline') {
      setComparison(DEFAULT_COMPARISON);
      setRepresentation('quantity');
      setTimeRange({ start: MAP_DATE_RANGE.min, end: MAP_DATE_RANGE.min + 100 });
      setPlaying(true);
    }
  };

  const showAllLocations = () => {
    if (!mapRef.current || coinGroups.length === 0) return;
    const bounds = new mapboxgl.LngLatBounds();
    coinGroups.forEach((group) => bounds.extend(group.coordinates));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobileLayout = window.matchMedia('(max-width: 767.98px)').matches;
    const controlPadding = controlsOpen && !mobileLayout
      ? Math.min(380, Math.max(120, window.innerWidth * 0.55))
      : 90;
    mapRef.current.fitBounds(bounds, {
      padding: mobileLayout
        ? { top: 70, right: 45, bottom: controlsOpen ? 260 : 120, left: 45 }
        : { top: 90, right: 90, bottom: 90, left: controlPadding },
      maxZoom: 7,
      duration: reducedMotion ? 0 : 1800,
      essential: false,
    });
  };

  const unavailableMessage = mapStatus === 'missing-token'
    ? 'Mapbox access is not configured for this environment.'
    : 'The map could not be loaded. Please try again.';

  return (
    <div id='map-coins'>
      <h1 className='text-center'>Coins on a Map</h1>
      <section className='map-coins__frame' aria-labelledby='antioch-map-title'>
        <div className='map-coins__frame-header'>
          <div>
            <span className='map-coins__eyebrow'>Live visual showcase</span>
            <h3 id='antioch-map-title'>{ANTIOCH.name}</h3>
          </div>
          <div className='map-coins__header-actions'>
            <p>{ANTIOCH.formattedCoordinates}</p>
            <button
              type='button'
              className='map-coins__show-all'
              onClick={showAllLocations}
              disabled={coinGroups.length === 0 || mapStatus !== 'ready'}
            >
              Show all visible mints
            </button>
          </div>
        </div>

        <div className='map-coins__viewport-wrap'>
          {coinStatus === 'ready' && (
            <div
              ref={mapContainerRef}
              className={`map-coins__viewport map-coins__viewport--${placeMode}`}
              role='region'
              aria-label={`Interactive coin map centered on ${ANTIOCH.name}`}
            />
          )}

          {coinStatus === 'loading' && <MapLoadingScreen phase='catalog' />}
          {coinStatus === 'ready' && mapStatus === 'loading' && (
            <MapLoadingScreen phase='map' coinCount={coins.length} />
          )}
          {coinStatus === 'error' && (
            <div className='map-coins__status map-coins__status--error' role='alert'>
              <strong>We could not load the coin catalog.</strong>
              <span>Please refresh the page to try the Strapi request again.</span>
            </div>
          )}
          {(mapStatus === 'missing-token' || mapStatus === 'error') && (
            <div className='map-coins__status map-coins__status--error' role='alert'>
              {unavailableMessage}
            </div>
          )}

          {mapStatus === 'ready' && (
            <>
              <MapControls
                open={controlsOpen}
                onToggleOpen={() => setControlsOpen((value) => !value)}
                representation={representation}
                onRepresentationChange={setRepresentation}
                compositionDimension={compositionDimension}
                onCompositionDimensionChange={setCompositionDimension}
                placeMode={placeMode}
                onPlaceModeChange={setPlaceMode}
                filters={filters}
                filterOptions={filterOptions}
                onToggleFilter={toggleFilter}
                onClearFilters={() => setFilters(createEmptyFilters())}
                timeRange={timeRange}
                onTimeRangeChange={(value) => {
                  setPlaying(false);
                  setTimeRange(value);
                }}
                playing={playing}
                onTogglePlayback={togglePlayback}
                comparison={comparison}
                comparisonOptions={comparisonOptions}
                onComparisonChange={setComparison}
                onApplyPreset={applyPreset}
                visibleCount={visibleCoins.length}
                totalCount={coins.length}
              />
              <MapLegend
                representation={representation}
                compositionDimension={compositionDimension}
                comparison={comparison}
                visibleCoins={visibleCoins}
                groups={coinGroups}
              />
            </>
          )}

          {coinStatus === 'ready' && visibleCoins.length === 0 && (
            <div className='map-coins__empty-state'>No coins match these controls.</div>
          )}
        </div>

        <div className='map-coins__caption'>
          <p>Explore mint-origin data with live visual controls. Markers do not represent archaeological discovery sites or circulation.</p>
          <span>{formatTimelineYear(timeRange.start)} – {formatTimelineYear(timeRange.end)}</span>
        </div>
      </section>
    </div>
  );
};

export default MapCoins;
