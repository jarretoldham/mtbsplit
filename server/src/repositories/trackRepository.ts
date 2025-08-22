import { PrismaClient, Prisma, Track, TrackDetails } from '@prisma/client';

const prisma = new PrismaClient();

export async function get_track_by_id(trackId: number): Promise<Track | null> {
  return await prisma.track.findUnique({ where: { id: trackId } });
}

export async function get_all_tracks(): Promise<Track[]> {
  return await prisma.track.findMany();
}

export async function create_track(
  data: Prisma.TrackCreateInput,
): Promise<Track> {
  return await prisma.track.create({ data });
}

export async function update_track(
  trackId: number,
  data: Prisma.TrackUpdateInput,
): Promise<Track> {
  return await prisma.track.update({ where: { id: trackId }, data });
}

export async function delete_track(trackId: number): Promise<Track> {
  return await prisma.track.delete({ where: { id: trackId } });
}

export async function get_track_with_details(
  trackId: number,
): Promise<Track | null> {
  const track = await prisma.track.findUnique({
    where: { id: trackId },
    include: { trackDetails: true },
  });
  return track;
}

export async function get_track_details_by_id(
  trackId: number,
): Promise<TrackDetails | null> {
  return await prisma.trackDetails.findUnique({ where: { trackId } });
}

export async function create_track_details(
  data: Prisma.TrackDetailsCreateInput,
): Promise<TrackDetails> {
  return await prisma.trackDetails.create({
    data: {
      ...data,
    },
  });
}

export async function update_track_details(
  trackId: number,
  data: Prisma.TrackDetailsUpdateInput,
): Promise<TrackDetails> {
  return await prisma.trackDetails.update({
    where: { trackId },
    data,
  });
}
