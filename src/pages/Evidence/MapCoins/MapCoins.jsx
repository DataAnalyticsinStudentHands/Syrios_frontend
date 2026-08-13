/**
 * Temporary Coins on a Map preview.
 *
 * Located catalog coins are grouped by their mint coordinates so hundreds of
 * coins sharing Antioch's exact point remain usable. Each location marker uses
 * normalized obverse artwork and exposes every coin in a small popup browser.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import coinCollections from 'src/api/coin-collections';
import { getAltText, getFullMediaUrl } from 'src/utils/Media';
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

const relationAttributes = (relation) => relation?.data?.attributes || {};

const humanizeCoinId = (value) => {
  if (!value) return 'Catalog coin';
  return value.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
};

const formatYear = (year) => {
  if (year == null || year === '') return null;
  const numericYear = Number(year);
  if (!Number.isFinite(numericYear)) return null;
  if (numericYear < 0) return `${Math.abs(numericYear)} BCE`;
  if (numericYear === 0) return null;
  return `${numericYear} CE`;
};

const formatDateRange = (fromYear, toYear) => {
  const from = formatYear(fromYear);
  const to = formatYear(toYear);
  if (from && to && from !== to) return `${from}–${to}`;
  return from || to || 'Date not recorded';
};

export const groupLocatedCoins = (rows = []) => {
  const groups = new Map();

  rows.forEach((row) => {
    const attributes = row?.attributes || {};
    const mint = relationAttributes(attributes.mint);
    if (mint.latitude == null || mint.longitude == null) {
      return;
    }
    const latitude = Number(mint.latitude);
    const longitude = Number(mint.longitude);

    if (
      !Number.isFinite(latitude)
      || !Number.isFinite(longitude)
      || latitude < -90
      || latitude > 90
      || longitude < -180
      || longitude > 180
    ) {
      return;
    }

    const key = `${mint.mint || 'Unknown mint'}|${latitude}|${longitude}`;
    const obverseImage = attributes.obverse_image;
    const modernName = relationAttributes(mint.modern_name).modern_name;
    const modernCountry = relationAttributes(mint.modern_country).modern_country;

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        name: mint.mint || 'Unknown mint',
        coordinates: [longitude, latitude],
        modernName: modernName || '',
        modernCountry: modernCountry || '',
        coins: [],
      });
    }

    groups.get(key).coins.push({
      id: row.id,
      coinId: attributes.coin_id,
      title: attributes.obverse_type || humanizeCoinId(attributes.coin_id),
      dateRange: formatDateRange(attributes.from_year, attributes.to_year),
      imageUrl: getFullMediaUrl(obverseImage),
      imageAlt: getAltText(obverseImage, `Obverse of ${humanizeCoinId(attributes.coin_id)}`),
    });
  });

  return [...groups.values()]
    .map((group) => ({
      ...group,
      coins: group.coins.sort((a, b) => Number(Boolean(b.imageUrl)) - Number(Boolean(a.imageUrl))),
    }))
    .sort((a, b) => b.coins.length - a.coins.length || a.name.localeCompare(b.name));
};

const createCoinPopup = (group) => {
  let activeIndex = 0;
  const routePrefix = window.location.pathname.startsWith('/dev') ? '/dev' : '';
  const content = document.createElement('div');
  content.className = 'map-coins__popup map-coins__popup--coins';

  const label = document.createElement('span');
  label.className = 'map-coins__popup-label';
  label.textContent = `${group.coins.length.toLocaleString()} located ${group.coins.length === 1 ? 'coin' : 'coins'}`;

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
  image.addEventListener('error', () => {
    image.hidden = true;
    imageFallback.hidden = false;
  });
  const imageFallback = document.createElement('span');
  imageFallback.className = 'map-coins__popup-image-fallback';
  imageFallback.textContent = 'No obverse image';
  imageWrap.append(image, imageFallback);

  const coinTitle = document.createElement('span');
  coinTitle.className = 'map-coins__popup-coin-title';
  const coinDate = document.createElement('span');
  coinDate.className = 'map-coins__popup-coin-date';
  const detailLink = document.createElement('a');
  detailLink.className = 'map-coins__popup-link';
  detailLink.textContent = 'View catalog record';

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
    counter.textContent = `${activeIndex + 1} / ${group.coins.length}`;
    detailLink.href = `${routePrefix}/Coin/${coin.id}`;
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
  viewer.append(imageWrap, coinTitle, coinDate, navigation, detailLink);
  content.append(label, title, place, viewer);
  renderActiveCoin();
  return content;
};

const createCoinMarkerElement = (group) => {
  const element = document.createElement('button');
  element.type = 'button';
  element.className = 'map-coins__coin-marker';
  element.setAttribute(
    'aria-label',
    `Browse ${group.coins.length} ${group.coins.length === 1 ? 'coin' : 'coins'} from ${group.name}`,
  );

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

  const count = document.createElement('span');
  count.className = 'map-coins__coin-marker-count';
  count.textContent = group.coins.length.toLocaleString();
  count.setAttribute('aria-hidden', 'true');
  element.append(stack, count);
  return element;
};

const MapCoins = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapStatus, setMapStatus] = useState('loading');
  const [coinStatus, setCoinStatus] = useState('loading');
  const [coinGroups, setCoinGroups] = useState([]);

  const locatedCoinCount = useMemo(
    () => coinGroups.reduce((total, group) => total + group.coins.length, 0),
    [coinGroups],
  );

  const imageCount = useMemo(
    () => coinGroups.reduce(
      (total, group) => total + group.coins.filter((coin) => coin.imageUrl).length,
      0,
    ),
    [coinGroups],
  );

  useEffect(() => {
    let cancelled = false;

    const fetchLocatedCoins = async () => {
      try {
        const response = await coinCollections.fetchLocatedForMap();
        if (cancelled) return;
        setCoinGroups(groupLocatedCoins(response?.data?.data || []));
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
  }, []);

  useEffect(() => {
    if (mapStatus !== 'ready' || coinGroups.length === 0 || !mapRef.current) return undefined;

    const markers = coinGroups.map((group) => {
      const element = createCoinMarkerElement(group);
      const popup = new mapboxgl.Popup({
        offset: 52,
        maxWidth: '32rem',
        closeButton: true,
        className: 'map-coins__site-popup',
      }).setDOMContent(createCoinPopup(group));

      return new mapboxgl.Marker({ element, anchor: 'center' })
        .setLngLat(group.coordinates)
        .setPopup(popup)
        .addTo(mapRef.current);
    });

    return () => markers.forEach((marker) => marker.remove());
  }, [coinGroups, mapStatus]);

  const showAllLocations = () => {
    if (!mapRef.current || coinGroups.length === 0) return;
    const bounds = new mapboxgl.LngLatBounds();
    coinGroups.forEach((group) => bounds.extend(group.coordinates));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    mapRef.current.fitBounds(bounds, {
      padding: { top: 90, right: 90, bottom: 90, left: 90 },
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

      <h2 className='map-coins__coming-soon text-center'>
        Coming Soon...
      </h2>

      <section className='map-coins__frame' aria-labelledby='antioch-map-title'>
        <div className='map-coins__frame-header'>
          <div>
            <span className='map-coins__eyebrow'>Live catalog preview</span>
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
              Show all mint locations
            </button>
          </div>
        </div>

        <div className='map-coins__viewport-wrap'>
          <div
            ref={mapContainerRef}
            className='map-coins__viewport'
            role='region'
            aria-label={`Interactive coin map centered on ${ANTIOCH.name}`}
          />

          {mapStatus === 'loading' && (
            <div className='map-coins__status' role='status'>
              <span className='map-coins__status-mark' aria-hidden='true' />
              Preparing the ancient landscape...
            </div>
          )}

          {(mapStatus === 'missing-token' || mapStatus === 'error') && (
            <div className='map-coins__status map-coins__status--error' role='alert'>
              {unavailableMessage}
            </div>
          )}

          {mapStatus === 'ready' && (
            <aside className={`map-coins__data-summary map-coins__data-summary--${coinStatus}`}>
              {coinStatus === 'loading' && 'Loading located coins…'}
              {coinStatus === 'error' && 'Coin locations are temporarily unavailable.'}
              {coinStatus === 'ready' && (
                <>
                  <strong>{locatedCoinCount.toLocaleString()} located coins</strong>
                  <span>{coinGroups.length} mint locations · {imageCount.toLocaleString()} obverse images</span>
                </>
              )}
            </aside>
          )}
        </div>

        <p className='map-coins__caption'>
          Markers group catalog coins that share a mint location. Select a marker to browse every located record from that mint.
        </p>
      </section>
    </div>
  );
};

export default MapCoins;
