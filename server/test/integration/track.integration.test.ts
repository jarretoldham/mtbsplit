import { describe, it, expect, beforeEach } from 'vitest';
import build from 'app';
import { prisma } from './setup';
import {
  validTrackData,
  validPrismaTrackData,
  validTrackUpdateData,
  validTrackDetailsData,
  invalidTrackData,
} from './fixtures/track.fixtures';

describe('Track Routes Integration Tests', () => {
  let app: Awaited<ReturnType<typeof build>>;
  let createdTrackId: number;

  beforeEach(async () => {
    app = await build({ logger: false });
  });

  describe('POST /tracks', () => {
    it('should create a new track with valid data', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/tracks',
        payload: validTrackData,
      });

      expect(response.statusCode).toBe(201);
      const track = JSON.parse(response.body);

      expect(track).toMatchObject({
        id: expect.any(Number),
        name: validTrackData.name,
        activityType: validTrackData.activityType,
        distance: validTrackData.distance,
        elevationGain: validTrackData.elevationGain,
        city: validTrackData.city,
        state: validTrackData.state,
        country: validTrackData.country,
      });

      createdTrackId = track.id;

      // Verify in database
      const dbTrack = await prisma.track.findUnique({
        where: { id: track.id },
      });
      expect(dbTrack).not.toBeNull();
      expect(dbTrack?.name).toBe(validTrackData.name);
    });

    it('should return 400 for invalid track data', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/tracks',
        payload: { name: 123 }, // Invalid: name should be string
      });

      expect(response.statusCode).toBe(400);
      const error = JSON.parse(response.body);
      expect(error.statusCode).toBe(400);
      expect(error.error).toBe('Bad Request');
      expect(error.message).toContain('invalid_type');
      expect(error.message).toContain('Expected string, received number');
    });
  });

  describe('GET /tracks', () => {
    beforeEach(async () => {
      // Create test tracks
      await prisma.track.createMany({
        data: [
          { ...validPrismaTrackData, name: 'Track 1' },
          { ...validPrismaTrackData, name: 'Track 2' },
        ],
      });
    });

    it('should return all tracks', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/tracks',
      });

      expect(response.statusCode).toBe(200);
      const tracks = JSON.parse(response.body);

      expect(Array.isArray(tracks)).toBe(true);
      expect(tracks.length).toBe(2);
      expect(tracks[0]).toMatchObject({
        id: expect.any(Number),
        name: 'Track 1',
      });
      expect(tracks[1]).toMatchObject({
        id: expect.any(Number),
        name: 'Track 2',
      });
    });

    it('should return empty array when no tracks exist', async () => {
      // Clear all tracks
      await prisma.track.deleteMany();

      const response = await app.inject({
        method: 'GET',
        url: '/tracks',
      });

      expect(response.statusCode).toBe(200);
      const tracks = JSON.parse(response.body);
      expect(tracks).toEqual([]);
    });
  });

  describe('GET /tracks/:id', () => {
    beforeEach(async () => {
      const track = await prisma.track.create({
        data: validPrismaTrackData,
      });
      createdTrackId = track.id;
    });

    it('should return track by valid ID', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/tracks/${createdTrackId}`,
      });

      expect(response.statusCode).toBe(200);
      const track = JSON.parse(response.body);

      expect(track).toMatchObject({
        id: createdTrackId,
        name: validTrackData.name,
        activityType: validTrackData.activityType,
      });
    });

    it('should return 404 for non-existent track', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/tracks/999999',
      });

      expect(response.statusCode).toBe(404);
      const error = JSON.parse(response.body);
      expect(error.message).toBe('Track not found');
    });
  });

  describe('PATCH /tracks/:id', () => {
    beforeEach(async () => {
      const track = await prisma.track.create({
        data: validPrismaTrackData,
      });
      createdTrackId = track.id;
    });

    it('should update track with valid data', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: `/tracks/${createdTrackId}`,
        payload: validTrackUpdateData,
      });

      expect(response.statusCode).toBe(200);
      const updatedTrack = JSON.parse(response.body);

      expect(updatedTrack).toMatchObject({
        id: createdTrackId,
        name: validTrackUpdateData.name,
        distance: validTrackUpdateData.distance,
        elevationGain: validTrackUpdateData.elevationGain,
      });

      // Verify in database
      const dbTrack = await prisma.track.findUnique({
        where: { id: createdTrackId },
      });
      expect(dbTrack?.name).toBe(validTrackUpdateData.name);
      expect(dbTrack?.distance).toBe(validTrackUpdateData.distance);
    });

    it('should return 404 for non-existent track', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/tracks/999999',
        payload: validTrackUpdateData,
      });

      expect(response.statusCode).toBe(404);
      const error = JSON.parse(response.body);
      expect(error.message).toBe('Track not found');
    });

    it('should return 400 for invalid update data', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: `/tracks/${createdTrackId}`,
        payload: { distance: -100 }, // Invalid negative distance
      });

      expect(response.statusCode).toBe(400);
      const error = JSON.parse(response.body);
      expect(error.statusCode).toBe(400);
      expect(error.error).toBe('Bad Request');
      expect(error.message).toContain('too_small');
    });
  });

  describe('DELETE /tracks/:id', () => {
    beforeEach(async () => {
      const track = await prisma.track.create({
        data: validPrismaTrackData,
      });
      createdTrackId = track.id;
    });

    it('should delete existing track', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/tracks/${createdTrackId}`,
      });

      expect(response.statusCode).toBe(204);
      expect(response.body).toBe('');

      // Verify deletion in database
      const dbTrack = await prisma.track.findUnique({
        where: { id: createdTrackId },
      });
      expect(dbTrack).toBeNull();
    });

    it('should return 404 for non-existent track', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/tracks/999999',
      });

      expect(response.statusCode).toBe(404);
      const error = JSON.parse(response.body);
      expect(error.message).toBe('Track not found');
    });
  });

  describe('Track Details Operations', () => {
    beforeEach(async () => {
      const track = await prisma.track.create({
        data: validPrismaTrackData,
      });
      createdTrackId = track.id;
    });

    describe('POST /tracks/details', () => {
      it('should create track details for existing track', async () => {
        const trackDetailsData = {
          ...validTrackDetailsData,
          trackId: createdTrackId,
        };

        const response = await app.inject({
          method: 'POST',
          url: '/tracks/details',
          payload: trackDetailsData,
        });

        expect(response.statusCode).toBe(201);
        const details = JSON.parse(response.body);

        expect(details).toMatchObject({
          id: expect.any(Number),
          trackId: createdTrackId,
          streams: trackDetailsData.streams,
        });

        // Verify in database
        const dbDetails = await prisma.trackDetails.findUnique({
          where: { trackId: createdTrackId },
        });
        expect(dbDetails).not.toBeNull();
      });

      it('should return 404 for non-existent track', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/tracks/details',
          payload: {
            ...validTrackDetailsData,
            trackId: 999999,
          },
        });

        expect(response.statusCode).toBe(404);
        const error = JSON.parse(response.body);
        expect(error.message).toBe('Track not found');
      });

      it('should return 400 when track details already exist', async () => {
        // Create initial track details
        await prisma.trackDetails.create({
          data: {
            trackId: createdTrackId,
            streams: validTrackDetailsData.streams,
          },
        });

        const response = await app.inject({
          method: 'POST',
          url: '/tracks/details',
          payload: {
            ...validTrackDetailsData,
            trackId: createdTrackId,
          },
        });

        expect(response.statusCode).toBe(400);
        const error = JSON.parse(response.body);
        expect(error.message).toBe(
          'Track details already exist for this track',
        );
      });
    });

    describe('GET /tracks/:id/details', () => {
      it('should return track with details', async () => {
        await prisma.trackDetails.create({
          data: {
            trackId: createdTrackId,
            streams: validTrackDetailsData.streams,
          },
        });

        const response = await app.inject({
          method: 'GET',
          url: `/tracks/${createdTrackId}/details`,
        });

        expect(response.statusCode).toBe(200);
        const trackWithDetails = JSON.parse(response.body);

        expect(trackWithDetails).toMatchObject({
          id: createdTrackId,
          name: validTrackData.name,
          trackDetails: {
            id: expect.any(Number),
            trackId: createdTrackId,
            streams: validTrackDetailsData.streams,
          },
        });
      });

      it('should return 404 for track without details', async () => {
        const response = await app.inject({
          method: 'GET',
          url: `/tracks/${createdTrackId}/details`,
        });

        expect(response.statusCode).toBe(404);
        const error = JSON.parse(response.body);
        expect(error.message).toBe('Track details not found');
      });
    });
  });
});
