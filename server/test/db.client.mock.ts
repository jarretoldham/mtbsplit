import { PrismaClient } from '@prisma/client';
import { vi, beforeEach } from 'vitest';
import { mockDeep, mockReset, type DeepMockProxy } from 'vitest-mock-extended';

// Create the mock instance
export const prismaMock =
  mockDeep<PrismaClient>() as DeepMockProxy<PrismaClient>;

// Mock the db.client module with correct path
vi.mock('../src/repositories/db.client', () => ({
  default: prismaMock,
}));

beforeEach(() => {
  mockReset(prismaMock);
});
