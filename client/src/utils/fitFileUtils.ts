import {
  Decoder,
  FitMessages,
  FitParseResult,
  RecordMesg,
  Stream,
} from '@garmin/fitsdk';

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

export function fitMessagesToGeoJSON(
  messages: FitMessages,
): GeoJSON.Feature<GeoJSON.LineString> | null {
  if (!messages.recordMesgs || messages.recordMesgs.length === 0) return null;
  const coordinates: [number, number][] = messages.recordMesgs
    .filter(
      (r: RecordMesg) =>
        typeof r.positionLat === 'number' && typeof r.positionLong === 'number',
    )
    .map((r: RecordMesg) => [
      _fitFileIntegerToDegrees(r.positionLong as number),
      _fitFileIntegerToDegrees(r.positionLat as number),
    ]);
  if (coordinates.length < 2) return null;
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates,
    },
    properties: {},
  };
}

function _fitFileIntegerToDegrees(value: number): number {
  // FIT files use a fixed-point representation for latitude and longitude
  // convert to degrees by dividing by 11930465 (2^32 / 360)
  return value / 11930465;
}
