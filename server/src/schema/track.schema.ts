import { z } from 'zod';
import StreamsSchema from './stream.schema';

export const TrackCreateInputSchema = z.object({
  name: z.string().min(2).max(100),
  activityType: z.enum(['ride']),
  distance: z.number().min(0),
  elevationGain: z.number().min(0),
  elevationLoss: z.number().min(0).nullable(),
  startLatLng: z.array(z.number()).min(2).max(2),
  endLatLng: z.array(z.number()).min(2).max(2),
  polyline: z.string().max(1000).nullable(),
  city: z.string().max(100),
  state: z.string().max(2),
  country: z.string().max(100),
  trackDetails: z.object({ streams: StreamsSchema }).optional(),
});

export type TrackCreate = z.infer<typeof TrackCreateInputSchema>;

export const TrackUpdateInputSchema = TrackCreateInputSchema.partial();

export type TrackUpdate = z.infer<typeof TrackUpdateInputSchema>;

export const TrackDetailsCreateInputSchema = z.object({
  trackId: z.number().min(1),
  streams: StreamsSchema,
});

export type TrackDetailsCreate = z.infer<typeof TrackDetailsCreateInputSchema>;

export const TrackDetailsUpdateSchema = z.object({
  streams: StreamsSchema,
});

export type TrackDetailsUpdate = z.infer<typeof TrackDetailsUpdateSchema>;
