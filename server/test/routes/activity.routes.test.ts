import { prismaMock } from '../db.client.mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Activity, Track, TrackDetails } from '@prisma/client';
import getTestApp from '../app.mock';
import { FastifyInstance } from 'fastify';

describe('GET /activities', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    // Build a test app with a mocked authenticated user
    app = await getTestApp({
      mockAuth: { athleteId: 1, email: 'test@example.com' },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return a list of activities for the authenticated athlete', async () => {
    // Mock data
    const mockActivities: Activity[] = [
      {
        id: 1,
        name: 'Morning Ride',
        athleteId: 1,
        type: 'ride',
        distance: 25000,
        createdAt: new Date(),
        updatedAt: new Date(),
        elevationGain: 0,
        elevationLoss: null,
        averageSpeed: null,
        maxSpeed: null,
        startLatLng: [],
        endLatLng: [],
        polyline: '',
        elapsedTime: 0,
        startDateTime: new Date(),
        timezone: '',
        source: 'strava',
        sourceId: null,
        city: '',
      },
    ];
    prismaMock.activity.findMany.mockResolvedValue(mockActivities);
    // Mock authentication
    const response = await app.inject({
      method: 'GET',
      url: '/activities',
    });

    expect(response.statusCode).toBe(200);
    const activities = JSON.parse(response.body);
    expect(activities.length).toEqual(1);
  });

  it('should return 401 if not authenticated', async () => {
    // Build a test app without authentication
    const unauthApp = await getTestApp();

    const response = await unauthApp.inject({
      method: 'GET',
      url: '/activities',
    });

    expect(response.statusCode).toBe(401);
  });
});
