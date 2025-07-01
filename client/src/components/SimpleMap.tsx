import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

// Set your Mapbox access token here
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

interface SimpleMapProps {
  style?: 'street' | 'satellite' | 'dark' | 'light' | 'outdoors';
  center?: [number, number];
  zoom?: number;
}

const _styleMap = {
  street: 'mapbox://styles/mapbox/streets-v11',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  dark: 'mapbox://styles/mapbox/dark-v10',
  light: 'mapbox://styles/mapbox/light-v10',
  outdoors: 'mapbox://styles/mapbox/outdoors-v11',
};

const SimpleMap: React.FC<SimpleMapProps> = ({
  style = 'street',
  center = [-74.5, 40],
  zoom = 10,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) {
      console.warn('Map container ref is not attached');
      return;
    }
    if (map.current) {
      console.debug('Cleaning up previous map instance');
      map.current.remove();
      map.current = null;
    }
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: _styleMap[style],
        center,
        zoom,
      });
      map.current.on('load', () => {
        console.debug('Mapbox map loaded');
      });
    } catch (err) {
      console.error('Error initializing Mapbox map:', err);
    }
    return () => {
      if (map.current) {
        console.debug('Unmounting map instance');
        map.current.remove();
        map.current = null;
      }
    };
  }, [style, center, zoom]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-96 rounded shadow"
      style={{ minHeight: 300, minWidth: 300 }}
    />
  );
};

export default SimpleMap;
