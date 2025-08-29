import { Prisma, Track, TrackDetails } from '@prisma/client';
import prisma from './db.client';
import { TrackCreate, TrackDetailsCreate } from 'schema/track.schema';

export async function getTrackById(trackId: number): Promise<Track | null> {
  return await prisma.track.findUnique({ where: { id: trackId } });
}

export async function getAllTracks(): Promise<Track[]> {
  return await prisma.track.findMany();
}

export async function createTrack(data: TrackCreate): Promise<Track> {
  return await prisma.track.create({ data });
}

export async function updateTrack(
  trackId: number,
  data: Prisma.TrackUpdateInput,
): Promise<Track> {
  return await prisma.track.update({ where: { id: trackId }, data });
}

export async function deleteTrack(trackId: number): Promise<Track> {
  return await prisma.track.delete({ where: { id: trackId } });
}

export async function getTrackWithDetails(
  trackId: number,
): Promise<(Track & { trackDetails: TrackDetails | null }) | null> {
  const track = await prisma.track.findUnique({
    where: { id: trackId },
    include: { trackDetails: true },
  });
  return track;
}

export async function getTrackDetailsById(
  trackId: number,
): Promise<TrackDetails | null> {
  return await prisma.trackDetails.findUnique({ where: { trackId } });
}

export async function createTrackDetails(
  data: TrackDetailsCreate,
): Promise<TrackDetails> {
  return await prisma.trackDetails.create({
    data: {
      ...data,
    },
  });
}

export async function updateTrackDetails(
  trackId: number,
  data: Prisma.TrackDetailsUpdateInput,
): Promise<TrackDetails> {
  return await prisma.trackDetails.update({
    where: { trackId },
    data,
  });
}
