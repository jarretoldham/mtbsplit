import fastify from 'fastify';
import authPlugin from './plugins/auth.plugin';
import oauthPlugin from './plugins/oauth.plugin';
import authRoutes from './routes/auth.routes';
import athletesRoutes from './routes/athlete.routes';
import trackRoutes from './routes/track.routes';

async function build(opts = {}) {
  const app = fastify(opts);

  // Register auth plugin (JWT, cookies)
  await app.register(authPlugin);

  // Register OAuth providers
  await app.register(oauthPlugin);

  app.get('/ping', async (request, reply) => {
    return { pong: 'it works!!' };
  });

  // Register routes
  await app.register(authRoutes);
  await app.register(athletesRoutes);
  await app.register(trackRoutes);
  return app;
}

export default build;
