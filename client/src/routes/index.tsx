import { createFileRoute } from '@tanstack/react-router';
import FitFileUploader from '../components/FitFileUploader';
import SimpleMap from '../components/SimpleMap';
import React from 'react';
import { FitMessages } from '@garmin/fitsdk';
import { fitMessagesToGeoJSON } from '../utils/fitFileUtils';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const [lineString, setLineString] =
    React.useState<GeoJSON.Feature<GeoJSON.LineString> | null>(null);

  const featureCollection: GeoJSON.FeatureCollection | undefined = lineString
    ? {
        type: 'FeatureCollection',
        features: [lineString],
      }
    : undefined;

  return (
    <>
      <FitFileUploader
        onFileParsed={(val: FitMessages) =>
          setLineString(fitMessagesToGeoJSON(val))
        }
      />
      <hr />
      <SimpleMap style="outdoors" geojson={featureCollection} />
    </>
  );
}
