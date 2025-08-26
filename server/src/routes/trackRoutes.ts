import { FastifyInstance } from 'fastify';
import {
  create_track,
  create_track_details,
  get_all_tracks,
  get_track_by_id,
  get_track_details_by_id,
  get_track_with_details,
} from '../repositories/trackRepository';
import {
  TrackCreateInputSchema,
  TrackDetailsCreateInputSchema,
} from '@prisma/generated/zod';
import HttpStatus from '../utils/httpStatusCodes';
import StreamsSchema from '../schema/streamSchema';

export default async function trackRoutes(server: FastifyInstance) {
  server.post('/tracks', async (request, reply) => {
    const result = TrackCreateInputSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(HttpStatus.BAD_REQUEST).send(result.error);
    }
    const track = await create_track(result.data);
    return reply.status(HttpStatus.CREATED).send(track);
  });

  server.get('/tracks', async (request, reply) => {
    const tracks = await get_all_tracks();
    return reply.status(HttpStatus.OK).send(tracks);
  });

  server.get('/tracks/:id', async (request, reply) => {
    const { id } = request.params as { id: number };
    const track = await get_track_by_id(id);
    if (!track) {
      return reply
        .status(HttpStatus.NOT_FOUND)
        .send({ message: 'Track not found' });
    }
    return track;
  });

  server.get('/tracks/:id/details', async (request, reply) => {
    const { id } = request.params as { id: number };
    const details = await get_track_with_details(id);
    if (!details) {
      return reply
        .status(HttpStatus.NOT_FOUND)
        .send({ message: 'Track details not found' });
    }
    return details;
  });

  server.get('/tracks/details/:id', async (request, reply) => {
    const { id } = request.params as { id: number };
    const details = await get_track_details_by_id(id);
    if (!details) {
      return reply
        .status(HttpStatus.NOT_FOUND)
        .send({ message: 'Track details not found' });
    }
    return details;
  });

  server.post('/tracks/details', async (request, reply) => {
    const validation = TrackDetailsCreateInputSchema.safeParse(request.body);
    if (!validation.success) {
      return reply.status(HttpStatus.BAD_REQUEST).send(validation.error);
    }
    const streamValidation = StreamsSchema.safeParse(validation.data.streams);
    if (!streamValidation.success) {
      return reply.status(HttpStatus.BAD_REQUEST).send(validation.error);
    }
    const details = await create_track_details(validation.data);
    return reply.status(HttpStatus.CREATED).send(details);
  });
}
