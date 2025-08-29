import fastify from 'fastify';
import athletesRoutes from './routes/athlete.routes';
import trackRoutes from './routes/track.routes';

async function build(opts = {}) {
  const app = fastify(opts);

  app.get('/ping', async (request, reply) => {
    return { pong: 'it works!!' };
  });

  await app.register(athletesRoutes);
  await app.register(trackRoutes);
  return app;
}

export default build;
