import { FastifyInstance } from 'fastify';
import * as athleteRepository from '../repositories/athleteRepository';
import {
  AthleteCreateInputSchema,
  AthleteUpdateInputSchema,
} from '@prisma/generated/zod';
import httpStatusCodes from '../utils/httpStatusCodes';

export async function athletesRoutes(server: FastifyInstance) {
  // Create new athlete
  server.post('/athletes', async (request, reply) => {
    const result = AthleteCreateInputSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(httpStatusCodes.BAD_REQUEST).send(result.error);
    }
    const athlete = await athleteRepository.create_athlete(result.data);
    return reply.status(httpStatusCodes.CREATED).send(athlete);
  });

  // Get athlete by ID
  server.get('/athletes/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const athleteId = parseInt(id, 10);
    if (isNaN(athleteId)) {
      return reply
        .status(httpStatusCodes.BAD_REQUEST)
        .send({ message: 'Invalid athlete ID' });
    }
    const athlete = await athleteRepository.get_athlete_by_id(athleteId);
    if (!athlete) {
      return reply
        .status(httpStatusCodes.NOT_FOUND)
        .send({ message: 'Athlete not found' });
    }
    return athlete;
  });

  // Update athlete
  server.patch('/athletes/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const athleteId = parseInt(id, 10);
    if (isNaN(athleteId)) {
      return reply
        .status(httpStatusCodes.BAD_REQUEST)
        .send({ message: 'Invalid athlete ID' });
    }
    const result = AthleteUpdateInputSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(httpStatusCodes.BAD_REQUEST).send(result.error);
    }
    try {
      const athlete = await athleteRepository.update_athlete(
        athleteId,
        result.data,
      );
      return athlete;
    } catch (error) {
      return reply
        .status(httpStatusCodes.NOT_FOUND)
        .send({ message: 'Athlete not found' });
    }
  });

  // Delete athlete
  server.delete('/athletes/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const athleteId = parseInt(id, 10);
    if (isNaN(athleteId)) {
      return reply
        .status(httpStatusCodes.BAD_REQUEST)
        .send({ message: 'Invalid athlete ID' });
    }
    try {
      await athleteRepository.delete_athlete(athleteId);
      return reply.status(httpStatusCodes.NO_CONTENT).send();
    } catch (error) {
      return reply
        .status(httpStatusCodes.NOT_FOUND)
        .send({ message: 'Athlete not found' });
    }
  });
}

export default athletesRoutes;
