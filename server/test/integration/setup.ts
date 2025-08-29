import { PrismaClient } from '@prisma/client';
import { beforeAll, afterAll, beforeEach } from 'vitest';

// Load test environment
process.env.NODE_ENV = 'test';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL ||
        'postgresql://test_user:test_password@localhost:5433/test_db',
    },
  },
});

beforeAll(async () => {
  // Ensure database connection
  await prisma.$connect();
});

beforeEach(async () => {
  // Clean up database before each test
  // Delete in reverse order due to foreign key constraints
  await prisma.trackEffort.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.trackDetails.deleteMany();
  await prisma.track.deleteMany();
  await prisma.athleteToken.deleteMany();
  await prisma.athlete.deleteMany();
});

afterAll(async () => {
  // Clean up and disconnect
  await prisma.trackEffort.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.trackDetails.deleteMany();
  await prisma.track.deleteMany();
  await prisma.athleteToken.deleteMany();
  await prisma.athlete.deleteMany();
  await prisma.$disconnect();
});

export { prisma };
