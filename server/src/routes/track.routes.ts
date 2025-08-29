import { FastifyInstance } from 'fastify';
import {
  createTrack,
  createTrackDetails,
  getAllTracks,
  getTrackById,
  getTrackDetailsById,
  getTrackWithDetails,
} from 'repositories/track.repository';
import {
  TrackCreateInputSchema,
  TrackDetailsCreateInputSchema,
} from 'schema/track.schema';
import HttpStatus from 'utils/httpStatusCodes';

export default async function trackRoutes(server: FastifyInstance) {
  server.post('/tracks', async (request, reply) => {
    const result = TrackCreateInputSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(HttpStatus.BAD_REQUEST).send(result.error);
    }
    const track = await createTrack(result.data);
    return reply.status(HttpStatus.CREATED).send(track);
  });

  server.get('/tracks', async (request, reply) => {
    const tracks = await getAllTracks();
    return reply.status(HttpStatus.OK).send(tracks);
  });

  server.get('/tracks/:id', async (request, reply) => {
    const { id } = request.params as { id: number };
    const track = await getTrackById(id);
    if (!track) {
      return reply
        .status(HttpStatus.NOT_FOUND)
        .send({ message: 'Track not found' });
    }
    return track;
  });

  server.get('/tracks/:id/details', async (request, reply) => {
    const { id } = request.params as { id: number };
    const details = await getTrackWithDetails(id);
    if (!details) {
      return reply
        .status(HttpStatus.NOT_FOUND)
        .send({ message: 'Track details not found' });
    }
    return details;
  });

  server.get('/tracks/details/:id', async (request, reply) => {
    const { id } = request.params as { id: number };
    const details = await getTrackDetailsById(id);
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
    const track = await getTrackWithDetails(validation.data.trackId);
    if (!track) {
      return reply
        .status(HttpStatus.NOT_FOUND)
        .send({ message: 'Track not found' });
    }
    if (track.trackDetails) {
      return reply
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'Track details already exist for this track' });
    }
    const details = await createTrackDetails(validation.data);
    return reply.status(HttpStatus.CREATED).send(details);
  });
}
