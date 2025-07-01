import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

// Set your Mapbox access token here
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

interface SimpleMapProps {
  style?: 'street' | 'satellite' | 'dark' | 'light' | 'outdoors';
  center?: [number, number];
  zoom?: number;
  geojson?: FeatureCollection;
}

const _styleMap = {
  street: 'mapbox://styles/mapbox/streets-v11',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  dark: 'mapbox://styles/mapbox/dark-v10',
  light: 'mapbox://styles/mapbox/light-v10',
  outdoors: 'mapbox://styles/mapbox/outdoors-v11',
};

const GEOJSON_SOURCE_ID = 'fit-geojson';
const GEOJSON_LAYER_ID = 'fit-geojson-line';

const SimpleMap: React.FC<SimpleMapProps> = ({
  style = 'street',
  center = [-74.5, 40],
  zoom = 10,
  geojson,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const addLayer = (json: FeatureCollection) => {
    if (!map.current || !json) return;
    if (map.current.getSource(GEOJSON_SOURCE_ID)) {
      map.current.removeLayer(GEOJSON_LAYER_ID);
      map.current.removeSource(GEOJSON_SOURCE_ID);
    }
    map.current.addSource(GEOJSON_SOURCE_ID, {
      type: 'geojson',
      data: json,
      lineMetrics: true,
    });
    map.current.addLayer({
      id: GEOJSON_LAYER_ID,
      type: 'line',
      source: GEOJSON_SOURCE_ID,
      paint: {
        'line-color': '#FF0000',
        'line-width': 2,
        'line-opacity': 0.8,
      },
    });
  };

  const fitBounds = (json: FeatureCollection) => {
    if (!map.current || !json) return;
    const bounds = getGeoJsonBounds(json);
    if (bounds) {
      map.current.fitBounds(bounds, { padding: 20 });
    }
  };

  const removeLayer = () => {
    if (!map.current) return;
    if (map.current.getLayer(GEOJSON_LAYER_ID)) {
      map.current.removeLayer(GEOJSON_LAYER_ID);
    }
    if (map.current.getSource(GEOJSON_SOURCE_ID)) {
      map.current.removeSource(GEOJSON_SOURCE_ID);
    }
  };

  // Map initialization and cleanup
  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: _styleMap[style],
      center,
      zoom,
    });
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [style, center, zoom]);

  // GeoJSON layer management
  useEffect(() => {
    const addLayerCallback = () => {
      if (!geojson) return;
      addLayer(geojson);
      fitBounds(geojson); // Fit bounds to the geojson layer
    };
    if (!map.current || !geojson || geojson.features.length === 0) return;
    if (map.current.isStyleLoaded()) {
      addLayerCallback();
    } else {
      map.current.once('styledata', addLayerCallback);
      return () => {
        map.current?.off('styledata', addLayerCallback);
      };
    }
    // Cleanup layer/source on geojson change
    return () => {
      removeLayer();
    };
  }, [geojson]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-96 rounded shadow"
      style={{ minHeight: 300, minWidth: 300 }}
    />
  );
};

export default SimpleMap;

function getGeoJsonBounds(
  geojson: FeatureCollection<Geometry, GeoJsonProperties>,
) {
  if (!geojson || !geojson.features || geojson.features.length === 0)
    return null;
  const bounds = new mapboxgl.LngLatBounds();
  geojson.features.forEach((feature) => {
    if (feature.geometry && feature.geometry.type === 'LineString') {
      feature.geometry.coordinates.forEach((coord) => {
        bounds.extend([coord[0], coord[1]]);
      });
    } else if (feature.geometry && feature.geometry.type === 'Point') {
      bounds.extend([
        feature.geometry.coordinates[0],
        feature.geometry.coordinates[1],
      ]);
    }
  });
  return bounds;
}
