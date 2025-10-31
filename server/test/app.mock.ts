import build from 'app';
import { FastifyInstance } from 'fastify';
import { prismaMock } from './db.client.mock';
import { AuthTokenPayload } from 'types/oauth.types';

type TestAppOptions = {
  // When provided, authenticate will be effectively bypassed by stubbing jwtVerify
  // and returning this payload. Also stubs athleteRepository.getAthleteById to succeed.
  mockAuth?: AuthTokenPayload | null;
};

/**
 * Generates a FastifyInstance for testing.
 */
const getTestApp = async (
  options?: TestAppOptions,
): Promise<FastifyInstance> => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key';

  const app = await build();

  if (!options?.mockAuth) {
    return app;
  }

  //Stub request.jwtVerify to return a valid payload so the real authenticate hook passes
  app.addHook('onRequest', async (req) => {
    (req as any).jwtVerify = async () => ({
      athleteId: options.mockAuth!.athleteId,
      email: options.mockAuth!.email,
    });
  });

  // 2) Ensure athlete lookup via Prisma succeeds
  prismaMock.athlete.findUnique.mockResolvedValue({
    id: options.mockAuth.athleteId,
    email: options.mockAuth.email,
    firstName: 'Test',
    lastName: 'User',
    createdAt: new Date(),
    updatedAt: new Date(),
    passwordHash: null,
    stravaAthleteId: null,
    provider: 'test',
  } as any);
  return app;
};

export default getTestApp;
