import fastify from 'fastify';
import athletesRoutes from './routes/athleteRoutes';
import trackRoutes from './routes/trackRoutes';

async function build(opts = {}) {
  const app = fastify(opts);

  app.get('/ping', async (request, reply) => {
    return { pong: 'it works!!' };
  });

  console.log('Registering routes...');
  await app.register(athletesRoutes);
  await app.register(trackRoutes);
  console.log('Routes registered.');

  return app;
}

export default build;
