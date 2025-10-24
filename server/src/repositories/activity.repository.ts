import { Prisma, Activity, ActivityType } from '@prisma/client';
import prisma from './db.client';
import {
  ActivityCreateInput,
  ActivityUpdateInput,
} from 'schema/activity.schema';

export async function getActivityById(id: number): Promise<Activity | null> {
  return prisma.activity.findUnique({
    where: { id },
  });
}

export async function getActivitiesByAthleteId(
  athleteId: number,
): Promise<Activity[]> {
  return prisma.activity.findMany({
    where: { athleteId },
  });
}

export async function createActivity(
  data: ActivityCreateInput,
): Promise<Activity> {
  return prisma.activity.create({
    data,
  });
}

export async function updateActivity(
  id: number,
  data: ActivityUpdateInput,
): Promise<Activity | null> {
  return prisma.activity.update({
    where: { id },
    data,
  });
}

export async function deleteActivity(id: number): Promise<Activity> {
  return await prisma.activity.delete({
    where: { id },
  });
}
