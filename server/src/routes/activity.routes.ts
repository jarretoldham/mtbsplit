import { FastifyInstance } from 'fastify';
import { ID_PARAM_SCHEMA } from './route.parameters';
import {
  getActivityById,
  getActivitiesByAthleteId,
  createActivity,
  deleteActivity,
} from 'repositories/activity.repository';
import HttpStatusCodes from 'utils/http.status.codes';
import { ActivityCreateInputSchemaPublic } from 'schema/activity.schema';
import { userIsResourceOwner } from 'utils/authorization';

export async function activityRoutes(server: FastifyInstance) {
  server.addHook('preHandler', server.authenticate);

  server.get('/activities', async (request, reply) => {
    const activities = await getActivitiesByAthleteId(
      request.athlete!.athleteId,
    );
    return reply.status(HttpStatusCodes.OK).send(activities);
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
    const validation = ActivityCreateInputSchemaPublic.safeParse(request.body);
    if (!validation.success) {
      return reply.status(HttpStatusCodes.BAD_REQUEST).send(validation.error);
    }
    const activity = await createActivity({
      ...validation.data,
      athleteId: request.athlete!.athleteId,
    });
    //TODO: kick off background jobs for processing activity data into TrackEfforts
    return reply.status(HttpStatusCodes.CREATED).send(activity);
  });

  server.delete('/activities/:id', ID_PARAM_SCHEMA, async (request, reply) => {
    const { id } = request.params as { id: number };
    const activity = await getActivityById(id);
    if (!activity) {
      return reply.status(HttpStatusCodes.NOT_FOUND).send();
    }
    if (!userIsResourceOwner(activity.athleteId, request, reply)) {
      //response is already sent
      return;
    }
    await deleteActivity(id);
    return reply.status(HttpStatusCodes.NO_CONTENT).send();
  });
}

export default activityRoutes;
