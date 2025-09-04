import { z } from 'zod';

export const ActivityCreateInputSchema = z
  .object({
    athleteId: z.number().min(1),
    name: z.string().min(1).max(255),
    type: z.enum(['ride']),
    distance: z.number().min(0), // in meters
    elevationGain: z.number().min(0), // in meters
    elevationLoss: z.number().min(0).optional().nullable(), // in meters
    averageSpeed: z.number().min(0).optional().nullable(), // in meters per second
    maxSpeed: z.number().min(0).optional().nullable(), // in meters per second
    startLatLng: z.array(z.number()).min(2).max(2),
    endLatLng: z.array(z.number()).min(2).max(2),
    polyline: z.string().max(5000), // encoded polyline
    elapsedTime: z.number().min(0), // in seconds
    startDateTime: z.coerce.date(),
    timezone: z.string().max(50),
    source: z.enum(['strava']).default('strava'),
    sourceId: z.string().max(50).optional().nullable(), // ID from the source (e.g., Strava)
    city: z.string().max(100),
  })
  .strict();

export type ActivityCreateInput = z.infer<typeof ActivityCreateInputSchema>;

export const ActivityUpdateInputSchema = ActivityCreateInputSchema.omit({
  athleteId: true,
}).partial();

export type ActivityUpdateInput = z.infer<typeof ActivityUpdateInputSchema>;
