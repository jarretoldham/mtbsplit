import { z } from 'zod';

export const LatLngStreamSchema = z.object({
  type: z.enum(['LatLng']),
  data: z.array(z.array(z.number())),
  size: z.number().min(0),
});

export const StreamSchema = z.object({
  type: z.enum(['LatLng', 'Elevation', 'Distance', 'Speed', 'Altitude']),
  data: z.array(z.union([z.number(), z.array(z.number())])),
  size: z.number().min(0),
});

export const StreamsSchema = z.array(
  z.union([LatLngStreamSchema, StreamSchema]),
);

export default StreamsSchema;

export type Stream = z.infer<typeof StreamSchema>;
