/**
 * MapCoins.jsx - Mapbox foundation for the Coins on a Map experience.
 *
 * This is intentionally a guided opening state. Coin datasets and filters will
 * be layered in later without changing the initial Antioch orientation.
 */

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
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

const MapCoins = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapStatus, setMapStatus] = useState('loading');

  useEffect(() => {
    const accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    if (!accessToken) {
      setMapStatus('missing-token');
      return undefined;
    }

    mapboxgl.accessToken = accessToken;

    let flyToTimer;
    let marker;

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

        const markerElement = document.createElement('button');
        markerElement.type = 'button';
        markerElement.className = 'map-coins__antioch-marker';
        markerElement.setAttribute('aria-label', `View ${ANTIOCH.name}`);

        const popupContent = document.createElement('div');
        popupContent.className = 'map-coins__popup';

        const popupLabel = document.createElement('span');
        popupLabel.className = 'map-coins__popup-label';
        popupLabel.textContent = 'Primary ancient site';

        const popupTitle = document.createElement('strong');
        popupTitle.textContent = ANTIOCH.name;

        const popupCoordinates = document.createElement('span');
        popupCoordinates.textContent = ANTIOCH.formattedCoordinates;

        popupContent.append(popupLabel, popupTitle, popupCoordinates);

        const popup = new mapboxgl.Popup({
          offset: 30,
          closeButton: false,
          closeOnClick: false,
          className: 'map-coins__site-popup',
        }).setDOMContent(popupContent);

        marker = new mapboxgl.Marker({ element: markerElement, anchor: 'center' })
          .setLngLat(ANTIOCH.coordinates)
          .setPopup(popup)
          .addTo(map);

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        flyToTimer = window.setTimeout(() => {
          map.once('moveend', () => marker?.togglePopup());
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
      marker?.remove();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

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
            <span className='map-coins__eyebrow'>Map preview</span>
            <h3 id='antioch-map-title'>{ANTIOCH.name}</h3>
          </div>
          <p>{ANTIOCH.formattedCoordinates}</p>
        </div>

        <div className='map-coins__viewport-wrap'>
          <div
            ref={mapContainerRef}
            className='map-coins__viewport'
            role='region'
            aria-label={`Interactive map centered on ${ANTIOCH.name}`}
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
        </div>

        <p className='map-coins__caption'>
          Begin at Antioch, then explore how its coins moved through the ancient world.
        </p>
      </section>
    </div>
  );
};

export default MapCoins;
