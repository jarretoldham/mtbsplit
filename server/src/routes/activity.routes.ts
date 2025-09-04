import { FastifyInstance } from 'fastify';
import { ID_PARAM_SCHEMA } from './route.parameters';
import { getActivityById } from 'repositories/activity.repository';
import HttpStatusCodes from 'utils/http.status.codes';

export async function activityRoutes(server: FastifyInstance) {
  server.get('/activities', async (request, reply) => {
    //TODO: Athlete authorization
    return { message: 'List of activities' };
  });

  server.get('/activities/:id', ID_PARAM_SCHEMA, async (request, reply) => {
    const { id } = request.params as { id: number };
    const activity = await getActivityById(id);
    if (!activity) {
      return reply
        .status(HttpStatusCodes.NOT_FOUND)
        .send({ message: 'Activity not found' });
    }
    return activity;
  });
}
