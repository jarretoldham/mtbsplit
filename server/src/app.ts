import fastify from 'fastify';
import rateLimit from '@fastify/rate-limit';
import authPlugin from './plugins/auth.plugin';
import oauthPlugin from './plugins/oauth.plugin';
import authRoutes from './routes/auth.routes';
import athletesRoutes from './routes/athlete.routes';
import trackRoutes from './routes/track.routes';
import activityRoutes from 'routes/activity.routes';

async function build(opts = {}) {
  const app = fastify(opts);

  // Register auth plugin (JWT, cookies)
  await app.register(authPlugin);

  // Register OAuth providers
  await app.register(oauthPlugin);

  // apply rate limiting to Not Found endpoints globally
  await app.register(rateLimit, { global: true, max: 2, timeWindow: 1000 });
  // app.setNotFoundHandler(
  //   {
  //     preHandler: app.rateLimit(),
  //   },
  //   function (request, reply) {
  //     reply.code(404).send();
  //   },
  // );

  app.get('/ping', async (request, reply) => {
    return { pong: 'it works!!' };
  });

  // Register routes
  await app.register(authRoutes, { prefix: '/auth' });
  await app.register(athletesRoutes);
  await app.register(trackRoutes);
  await app.register(activityRoutes);
  return app;
}

export default build;
