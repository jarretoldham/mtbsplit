import build from 'app';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { prismaMock } from '../db.client.mock';
import { Track } from '@prisma/client';

describe('GET /tracks', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return empty array if none found', async () => {
    const app = await build();

    // Mock the getAllTracks function to return an empty array
    prismaMock.track.findMany.mockResolvedValueOnce([]);

    const response = await app.inject({
      method: 'GET',
      url: '/tracks',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });

  it('should return all tracks', async () => {
    const app = await build();

    const data: Track[] = [
      {
        id: 1,
        name: 'Track 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        activityType: 'Ride',
        distance: 1000,
        elevationGain: 0,
        elevationLoss: null,
        startLatLng: [],
        endLatLng: [],
        polyline: null,
        city: '',
        state: '',
        country: '',
      },
      {
        id: 2,
        name: 'Track 2',
        createdAt: new Date(),
        updatedAt: new Date(),
        activityType: 'Ride',
        distance: 10,
        elevationGain: 0,
        elevationLoss: null,
        startLatLng: [],
        endLatLng: [],
        polyline: null,
        city: '',
        state: '',
        country: '',
      },
    ];
    // Mock the getAllTracks function to return an array of tracks
    prismaMock.track.findMany.mockResolvedValueOnce(data);

    const response = await app.inject({
      method: 'GET',
      url: '/tracks',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject(
      data.map(({ createdAt, updatedAt, ...rest }) => ({
        ...rest,
        createdAt: createdAt.toISOString(),
        updatedAt: createdAt.toISOString(),
      })),
    );
  });
});
