import { PrismaClient } from '@prisma/client';
import { vi, beforeEach } from 'vitest';
import { mockDeep, mockReset, type DeepMockProxy } from 'vitest-mock-extended';

import prisma from '../src/repositories/db.client';

// Mock the db.client module with deep mocking
vi.mock('./db.client', () => ({
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
