import { Decoder, FitMessages, FitParseResult, Stream } from '@garmin/fitsdk';

export async function parseFitFile(file: File): Promise<FitParseResult> {
  const arrayBuffer = await file.arrayBuffer();
  const stream = Stream.fromArrayBuffer(arrayBuffer);
  const decoder = new Decoder(stream);

  if (!decoder.isFIT()) {
    throw new Error('Not a valid FIT file.');
  }

  if (!decoder.checkIntegrity()) {
    throw new Error('FIT file failed integrity check.');
  }

  const { messages, errors } = decoder.read();
  return { messages, errors };
}

export interface MtbLineString extends GeoJSON.Feature<GeoJSON.LineString> {
  properties: {
    timestamps: Date[];
    altitudes: number[];
    speeds: number[];
    distance: number[];
  };
}

export function fitMessagesToGeoJSON(
  messages: FitMessages,
): MtbLineString | null {
  if (!messages.recordMesgs || messages.recordMesgs.length === 0) return null;
  const json: MtbLineString = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [],
    },
    properties: {
      timestamps: [],
      altitudes: [],
      speeds: [],
      distance: [],
    },
  };
  for (const record of messages.recordMesgs) {
    if (
      typeof record.positionLat === 'number' &&
      typeof record.positionLong === 'number'
    ) {
      json.geometry.coordinates.push([
        _fitFileIntegerToDegrees(record.positionLong as number),
        _fitFileIntegerToDegrees(record.positionLat as number),
      ]);
      if (record.timestamp) {
        json.properties.timestamps.push(record.timestamp);
      }
      // FIT files may have both enhancedAltitude and altitude, prefer enhancedAltitude if available.
      const altitude = record.enhancedAltitude ?? record.altitude;
      if (altitude) {
        json.properties.altitudes.push(altitude);
      }
      // FIT files may have both enhancedSpeed and speed, prefer enhancedSpeed if available.
      // Default to 0 if neither is available - some devises may not include the key if the value is 0,
      // depending on recorder settings.
      const speed = record.enhancedSpeed ?? record.speed ?? 0;
      if (speed || speed === 0) {
        json.properties.speeds.push(speed);
      }
      if (typeof (record.distance ?? 0) === 'number') {
        json.properties.distance.push(record.distance ?? 0);
      }
    }
  }
  return json;
}

function _fitFileIntegerToDegrees(value: number): number {
  // FIT files use a fixed-point representation for latitude and longitude
  // convert to degrees by dividing by 11930465 (2^32 / 360)
  return value / 11930465;
}
