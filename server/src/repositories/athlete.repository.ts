import { Prisma, Athlete } from '@prisma/client';
import prisma from './db.client';
import { AthleteUpdateInput, AthleteCreateInput } from 'schema/athlete.schema';

export async function getAthleteById(
  athleteId: number,
): Promise<Athlete | null> {
  return await prisma.athlete.findUnique({ where: { id: athleteId } });
}

export async function getAthleteByEmail(
  email: string,
): Promise<Athlete | null> {
  return await prisma.athlete.findUnique({ where: { email } });
}

export async function createAthlete(
  data: AthleteCreateInput,
): Promise<Athlete> {
  const { tokens, ...athleteData } = data;

  return await prisma.athlete.create({
    data: {
      ...athleteData,
      tokens: tokens
        ? {
            create: tokens,
          }
        : undefined,
    },
  });
}

export async function updateAthlete(
  athleteId: number,
  data: AthleteUpdateInput,
): Promise<Athlete> {
  const { tokens, ...athleteData } = data;

  return await prisma.athlete.update({
    where: { id: athleteId },
    data: {
      ...athleteData,
      tokens: tokens
        ? {
            deleteMany: {}, // Delete existing tokens
            create: tokens, // Create new token
          }
        : undefined,
    },
  });
}

export async function delete_athlete(athleteId: number): Promise<Athlete> {
  return await prisma.athlete.delete({ where: { id: athleteId } });
}
