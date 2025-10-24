import { FastifyInstance } from 'fastify';
import { ID_PARAM_SCHEMA } from './route.parameters';
import {
  getActivityById,
  createActivity,
} from 'repositories/activity.repository';
import HttpStatusCodes from 'utils/http.status.codes';
import { ActivityCreateInputSchema } from 'schema/activity.schema';

export async function activityRoutes(server: FastifyInstance) {
  server.get('/activities', async (request, reply) => {
    //TODO: Athlete authorization
    return []; // Placeholder for fetching all activities
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

  server.post('/activities', async (request, reply) => {
    const validation = ActivityCreateInputSchema.safeParse(request.body);
    if (!validation.success) {
      return reply.status(HttpStatusCodes.BAD_REQUEST).send(validation.error);
    }
    const activity = await createActivity(validation.data);
    //TODO: kick off background jobs for processing activity data into TrackEfforts
    return reply.status(HttpStatusCodes.CREATED).send(activity);
  });

  server.delete('/activities/:id', ID_PARAM_SCHEMA, async (request, reply) => {
    const { id } = request.params as { id: number };
    const activity = await getActivityById(id);
    if (!activity) { 
      return reply.status(HttpStatusCodes.NOT_FOUND).send();
    }
    await deleteActivity(id);
}
