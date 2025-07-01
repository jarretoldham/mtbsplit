import { Decoder, FitParseResult, Stream } from '@garmin/fitsdk';

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
