import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import mapboxgl from 'mapbox-gl';

export function getGeoJsonBounds(
  geojson: FeatureCollection<Geometry, GeoJsonProperties>,
): mapboxgl.LngLatBounds | null {
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
