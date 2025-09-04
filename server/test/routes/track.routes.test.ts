import { prismaMock } from '../db.client.mock';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Track, TrackDetails } from '@prisma/client';
import getTestApp from '../app.mock';
import { TrackDetailsCreate } from 'schema/track.schema';

describe('GET /tracks', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return empty array if none found', async () => {
    const app = await getTestApp();

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
    const app = await getTestApp();

    const data: Track[] = [
      {
        id: 1,
        name: 'Track 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        activityType: 'ride',
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
        activityType: 'ride',
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

  it('should return empty array if none found', async () => {
    const app = await getTestApp();

    // Mock the getAllTracks function to return an empty array
    prismaMock.track.findMany.mockResolvedValueOnce([]);

    const response = await app.inject({
      method: 'GET',
      url: '/tracks',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });
});

describe('POST /tracks', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates track without details', async () => {
    const app = await getTestApp();

    const input = {
      name: 'test',
      activityType: 'ride',
      distance: 0,
      elevationGain: 0,
      elevationLoss: 0,
      startLatLng: [90, 90],
      endLatLng: [90, 90],
      polyline: null,
      city: '',
      state: '',
      country: '',
    };

    const response = await app.inject({
      method: 'POST',
      url: '/tracks',
      payload: input,
    });

    expect(response.statusCode).toBe(201);
    expect(prismaMock.track.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.track.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining(input),
      }),
    );
  });

  it('creates track with details', async () => {
    const app = await getTestApp();

    const input = {
      name: 'test',
      activityType: 'ride',
      distance: 0,
      elevationGain: 0,
      elevationLoss: 0,
      startLatLng: [90, 90],
      endLatLng: [90, 90],
      polyline: null,
      city: '',
      state: '',
      country: '',
      trackDetails: {
        streams: [
          {
            type: 'LatLng',
            data: [
              [1, 2],
              [1, 3],
            ],
            size: 2,
          },
          {
            type: 'Distance',
            data: [1, 2, 3],
            size: 3,
          },
        ],
      },
    };

    const response = await app.inject({
      method: 'POST',
      url: '/tracks',
      payload: input,
    });

    if (response.statusCode !== 201) {
      console.log(response.json());
    }

    expect(response.statusCode).toBe(201);
    expect(prismaMock.track.create).toHaveBeenCalledTimes(1);
  });

  it('returns bad request on invalid track details', async () => {
    const app = await getTestApp();

    const input = {
      name: 'test',
      activityType: 'Ride',
      distance: 0,
      elevationGain: 0,
      elevationLoss: 0,
      startLatLng: [90, 90],
      endLatLng: [90, 90],
      polyline: null,
      city: '',
      state: '',
      country: '',
      trackDetails: {
        streams: [
          {
            type: 'InvalidType',
            data: [1, 2, 3],
            size: 3,
          },
        ],
      },
    };

    const response = await app.inject({
      method: 'POST',
      url: '/tracks',
      payload: input,
    });

    expect(response.statusCode).toBe(400);
    expect(prismaMock.track.create).not.toHaveBeenCalled();
  });
});

describe('GET /tracks/:id', () => {
  it('returns track details for a valid id', async () => {
    const app = await getTestApp();

    const trackId = 1;
    const data: Track = {
      id: 1,
      name: 'test',
      activityType: 'ride',
      distance: 10,
      elevationGain: 0,
      elevationLoss: null,
      startLatLng: [],
      endLatLng: [],
      polyline: null,
      city: '',
      state: '',
      country: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock the getTrackById function to return a track
    prismaMock.track.findUnique.mockResolvedValueOnce(data);

    const response = await app.inject({
      method: 'GET',
      url: `/tracks/${trackId}`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().name).toBe(data.name);
  });

  it('returns 404 for an invalid id', async () => {
    const app = await getTestApp();

    const trackId = 1;

    // Mock the getTrackById function to return null
    prismaMock.track.findUnique.mockResolvedValueOnce(null);

    const response = await app.inject({
      method: 'GET',
      url: `/tracks/${trackId}`,
    });

    expect(response.statusCode).toBe(404);
  });

  it('returns 400 for a non-numeric id', async () => {
    const app = await getTestApp();

    const trackId = 'non-numeric-id';

    const response = await app.inject({
      method: 'GET',
      url: `/tracks/${trackId}`,
    });

    expect(response.statusCode).toBe(400);
  });
});

describe('PATCH /tracks/:id', () => {
  it('returns 404 if track does not exist', async () => {
    const app = await getTestApp();

    const trackId = 1;

    prismaMock.track.findUnique.mockResolvedValueOnce(null);

    const response = await app.inject({
      method: 'PATCH',
      url: `/tracks/${trackId}`,
      payload: { name: 'updated name' },
    });

    expect(response.statusCode).toBe(404);
  });

  it('returns 400 if invalid schema', async () => {
    const app = await getTestApp();

    const response = await app.inject({
      method: 'PATCH',
      url: `/tracks/1`,
      payload: {
        activityType: 'foo',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('updates track without details in payload', async () => {
    const app = await getTestApp();

    const trackId = 1;
    const track: Track = {
      id: trackId,
      name: 'test',
      activityType: 'ride',
      distance: 10,
      elevationGain: 0,
      elevationLoss: null,
      startLatLng: [],
      endLatLng: [],
      polyline: null,
      city: '',
      state: '',
      country: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prismaMock.track.findUnique.mockResolvedValueOnce(track);

    const payload = {
      name: 'updated test',
      activityType: 'ride',
      distance: 20,
    };
    const response = await app.inject({
      method: 'PATCH',
      url: `/tracks/${trackId}`,
      payload,
    });

    expect(response.statusCode).toBe(200);
    expect(prismaMock.track.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: trackId },
        data: expect.objectContaining(payload),
      }),
    );
  });
});

describe('DELETE /tracks/:id', () => {
  it('deletes track for a valid id', async () => {
    const app = await getTestApp();

    const trackId = 1;

    const track: Track = {
      id: trackId,
      name: 'test',
      activityType: 'ride',
      distance: 10,
      elevationGain: 0,
      elevationLoss: null,
      startLatLng: [],
      endLatLng: [],
      polyline: null,
      city: '',
      state: '',
      country: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prismaMock.track.findUnique.mockResolvedValueOnce(track);

    const response = await app.inject({
      method: 'DELETE',
      url: `/tracks/${trackId}`,
    });

    expect(response.statusCode).toBe(204);
    expect(prismaMock.track.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: trackId },
      }),
    );
  });

  it('returns 404 for an invalid id', async () => {
    const app = await getTestApp();

    const trackId = 1;

    // Mock the getTrackById function to return null
    prismaMock.track.findUnique.mockResolvedValueOnce(null);

    const response = await app.inject({
      method: 'DELETE',
      url: `/tracks/${trackId}`,
    });

    expect(response.statusCode).toBe(404);
  });
});

describe('GET /tracks/:id/details', () => {
  it('returns track details for a valid id', async () => {
    const app = await getTestApp();

    const trackId = 1;
    const data = {
      id: 1,
      name: 'test',
      activityType: 'ride' as const,
      distance: 10,
      elevationGain: 0,
      elevationLoss: null,
      startLatLng: [],
      endLatLng: [],
      polyline: null,
      city: '',
      state: '',
      country: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      trackDetails: [
        {
          type: 'LatLng',
          data: [
            [1, 2],
            [1, 3],
          ],
          size: 2,
        },
        {
          type: 'Distance',
          data: [1, 2, 3],
          size: 3,
        },
      ],
    };

    // Mock the getTrackById function to return a track
    prismaMock.track.findUnique.mockResolvedValueOnce(data);

    const response = await app.inject({
      method: 'GET',
      url: `/tracks/${trackId}/details`,
    });

    if (response.statusCode !== 200) {
      console.error(response.json());
    }

    expect(response.statusCode).toBe(200);
    var track = response.json();
    expect(track.name).toBe(data.name);
    expect(track.trackDetails).toEqual(data.trackDetails);
    expect(prismaMock.track.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        include: { trackDetails: true },
      }),
    );
  });

  it('returns 404 for an invalid id', async () => {
    const app = await getTestApp();

    const trackId = 1;

    // Mock the getTrackById function to return null
    prismaMock.track.findUnique.mockResolvedValueOnce(null);

    const response = await app.inject({
      method: 'GET',
      url: `/tracks/${trackId}/details`,
    });

    expect(response.statusCode).toBe(404);
  });
});

describe('POST /tracks/details', () => {
  it('creates track details for a valid track', async () => {
    const app = await getTestApp();

    const trackId = 1;
    const input: TrackDetailsCreate = {
      trackId,
      streams: [
        {
          type: 'LatLng',
          data: [
            [1, 2],
            [1, 3],
          ],
          size: 2,
        },
        {
          type: 'Distance',
          data: [1, 2, 3],
          size: 3,
        },
      ],
    };

    const track: Track & { trackDetails: TrackDetails | null } = {
      id: trackId,
      name: 'test',
      activityType: 'ride',
      distance: 10,
      elevationGain: 0,
      elevationLoss: null,
      startLatLng: [],
      endLatLng: [],
      polyline: null,
      city: '',
      state: '',
      country: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      trackDetails: null,
    };

    // Mock the createTrackDetails function to return the created track details
    prismaMock.track.findUnique.mockResolvedValueOnce(track);

    const response = await app.inject({
      method: 'POST',
      url: `/tracks/details`,
      payload: input,
    });

    expect(response.statusCode).toBe(201);
    expect(prismaMock.trackDetails.create).toHaveBeenCalledTimes(1);
  });

  it('should return 404 if track not found', async () => {
    const app = await getTestApp();

    const trackId = 1;
    const input: TrackDetailsCreate = {
      trackId,
      streams: [
        {
          type: 'Distance',
          data: [1, 2, 3],
          size: 3,
        },
      ],
    };

    // Mock the getTrackById function to return null
    prismaMock.track.findUnique.mockResolvedValueOnce(null);

    const response = await app.inject({
      method: 'POST',
      url: `/tracks/details`,
      payload: input,
    });

    expect(response.statusCode).toBe(404);
  });

  it('request body requires a track id', async () => {
    const app = await getTestApp();

    const response = await app.inject({
      method: 'POST',
      url: `/tracks/details`,
      payload: {
        streams: [
          {
            type: 'Distance',
            data: [1, 2, 3],
            size: 3,
          },
        ],
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('request body requires valid streams', async () => {
    const app = await getTestApp();

    const trackId = 1;

    const response = await app.inject({
      method: 'POST',
      url: `/tracks/details`,
      payload: {
        trackId,
        streams: [
          {
            type: 'InvalidType',
            data: [1, 2, 3],
            size: 3,
          },
        ],
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("doesn't allow creating details if they already exist", async () => {
    const app = await getTestApp();

    const trackId = 1;
    const input: TrackDetailsCreate = {
      trackId,
      streams: [
        {
          type: 'Distance',
          data: [1, 2, 3],
          size: 3,
        },
      ],
    };

    const track: Track & { trackDetails: any } = {
      id: trackId,
      name: 'test',
      activityType: 'ride',
      distance: 10,
      elevationGain: 0,
      elevationLoss: null,
      startLatLng: [],
      endLatLng: [],
      polyline: null,
      city: '',
      state: '',
      country: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      trackDetails: {
        id: 1,
        trackId,
        streams: null,
      },
    };

    // Mock the getTrackById function to return the track with existing details
    prismaMock.track.findUnique.mockResolvedValueOnce(track);

    const response = await app.inject({
      method: 'POST',
      url: `/tracks/details`,
      payload: input,
    });

    expect(response.statusCode).toBe(400);
    expect(prismaMock.trackDetails.create).not.toHaveBeenCalled();
  });
});

describe('GET /track/details/:id', () => {
  it('returns track details if found', async () => {
    const app = await getTestApp();

    const detailsId = 1;
    const trackDetails: TrackDetails = {
      id: detailsId,
      trackId: 99,
      streams: [
        {
          type: 'Distance',
          data: [1, 2, 3],
          size: 3,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock the getTrackDetailsById function to return the track details
    prismaMock.trackDetails.findUnique.mockResolvedValueOnce(trackDetails);

    const response = await app.inject({
      method: 'GET',
      url: `/tracks/details/${detailsId}`,
    });

    expect(response.statusCode).toBe(200);
    const details = response.json();
    expect(details.id).toBe(trackDetails.id);
    expect(details.streams).toEqual(trackDetails.streams);
  });

  it('returns 404 when no results returned', async () => {
    const app = await getTestApp();

    const detailsId = 1;

    // Mock the getTrackDetailsById function to return null
    prismaMock.trackDetails.findUnique.mockResolvedValueOnce(null);

    const response = await app.inject({
      method: 'GET',
      url: `/tracks/details/${detailsId}`,
    });

    expect(response.statusCode).toBe(404);
  });
});

describe('PATCH /tracks/details/:id', () => {
  it('updates track details', async () => {
    const app = await getTestApp();

    const detailsId = 1;
    prismaMock.trackDetails.findUnique.mockResolvedValueOnce({
      id: detailsId,
      trackId: 1,
      streams: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await app.inject({
      method: 'PATCH',
      url: `/tracks/details/${detailsId}`,
      payload: {
        streams: [
          {
            type: 'Distance',
            data: [1, 2, 3],
            size: 3,
          },
        ],
      },
    });

    if (response.statusCode !== 200) {
      console.log(response.json());
    }

    expect(response.statusCode).toBe(200);
    expect(prismaMock.trackDetails.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: detailsId },
        data: {
          streams: [
            {
              type: 'Distance',
              data: [1, 2, 3],
              size: 3,
            },
          ],
        },
      }),
    );
  });

  it('returns 404 when details does not exist', async () => {
    const app = await getTestApp();

    const detailsId = 1;

    // Mock the getTrackDetailsById function to return null
    prismaMock.trackDetails.findUnique.mockResolvedValueOnce(null);

    const response = await app.inject({
      method: 'PATCH',
      url: `/tracks/details/${detailsId}`,
      body: {
        streams: [
          {
            type: 'Distance',
            data: [1, 2, 3],
            size: 3,
          },
        ],
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it('returns 400 when invalid data is provided', async () => {
    const app = await getTestApp();

    const detailsId = 1;

    // Mock the getTrackDetailsById function to return null
    prismaMock.trackDetails.findUnique.mockResolvedValueOnce(null);

    const response = await app.inject({
      method: 'PATCH',
      url: `/tracks/details/${detailsId}`,
      body: {
        streams: [
          {
            type: 'InvalidStream',
            data: [1, 2, 3],
            size: 3,
          },
        ],
      },
    });

    expect(response.statusCode).toBe(400);
    expect(prismaMock.trackDetails.update).not.toHaveBeenCalled();
  });
});
