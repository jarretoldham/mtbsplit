import { Prisma, Athlete } from '@prisma/client';
import prisma from './db.client';

export async function get_athlete_by_id(
  athleteId: number,
): Promise<Athlete | null> {
  return await prisma.athlete.findUnique({ where: { id: athleteId } });
}

export async function create_athlete(
  data: Prisma.AthleteCreateInput,
): Promise<Athlete> {
  return await prisma.athlete.create({ data });
}

export async function update_athlete(
  athleteId: number,
  data: Prisma.AthleteUpdateInput,
): Promise<Athlete> {
  return await prisma.athlete.update({ where: { id: athleteId }, data });
}

export async function delete_athlete(athleteId: number): Promise<Athlete> {
  return await prisma.athlete.delete({ where: { id: athleteId } });
}
