import { PrismaClient } from '@prisma/client';
import { beforeAll, afterAll, beforeEach } from 'vitest';
import { execSync } from 'child_process';

// Load test environment
process.env.NODE_ENV = 'test';

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://test_user:test_password@localhost:5433/test_db';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

beforeAll(async () => {
  // Apply latest migrations to test database
  try {
    console.log('🔄 Applying migrations to test database...');
    execSync(`DATABASE_URL="${DATABASE_URL}" npx prisma migrate deploy`, {
      stdio: 'pipe',
      encoding: 'utf8',
    });
    console.log('✅ Migrations applied successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Failed to apply migrations:', errorMessage);
    throw error;
  }

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
