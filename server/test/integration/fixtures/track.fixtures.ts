import { TrackCreate, TrackDetailsCreate } from 'schema/track.schema';

export const validTrackData: TrackCreate = {
  name: 'Mountain Loop Trail',
  activityType: 'ride',
  distance: 15000, // 15km in meters
  elevationGain: 500,
  elevationLoss: 450,
  startLatLng: [47.6062, -122.3321], // Seattle coordinates
  endLatLng: [47.6205, -122.3493],
  polyline: 'u{~vFjbqhVnPVrM@pA|@rGpF`Ca@hBIxAUfCc@`D_AhCeAxAaAx@u@',
  city: 'Seattle',
  state: 'WA',
  country: 'United States',
};

// Data for Prisma create (without trackDetails)
export const validPrismaTrackData = {
  name: 'Mountain Loop Trail',
  activityType: 'ride' as const,
  distance: 15000, // 15km in meters
  elevationGain: 500,
  elevationLoss: 450,
  startLatLng: [47.6062, -122.3321], // Seattle coordinates
  endLatLng: [47.6205, -122.3493],
  polyline: 'u{~vFjbqhVnPVrM@pA|@rGpF`Ca@hBIxAUfCc@`D_AhCeAxAaAx@u@',
  city: 'Seattle',
  state: 'WA',
  country: 'United States',
};

export const validTrackUpdateData = {
  name: 'Updated Mountain Loop Trail',
  distance: 16000,
  elevationGain: 550,
};

export const validTrackDetailsData: Omit<TrackDetailsCreate, 'trackId'> = {
  streams: [
    {
      type: 'LatLng' as const,
      data: [
        [47.6062, -122.3321],
        [47.608, -122.334],
        [47.61, -122.336],
      ],
      size: 3,
    },
    {
      type: 'Elevation' as const,
      data: [100, 120, 150],
      size: 3,
    },
  ],
};

export const invalidTrackData = {
  name: 'X', // Too short
  activityType: 'InvalidType',
  distance: -100, // Negative distance
  elevationGain: -50, // Negative elevation
  startLatLng: [47.6062], // Invalid array length
  endLatLng: [47.6205, -122.3493],
  city: 'Seattle',
  state: 'WA',
  country: 'United States',
};
