import Fastify from 'fastify';
import { z } from 'zod';
import athletesRoutes from './routes/athleteRoutes';
import { trackRoutes } from './routes/trackRoutes';

const server = Fastify();

server.get('/ping', async (request, reply) => {
  return { pong: 'it works!!' };
});

server.post('/echo', async (request, reply) => {
  const schema = z.object({ message: z.string() });
  const result = schema.safeParse(request.body);
  if (!result.success) {
    reply.status(400).send(result.error);
    return;
  }
  return { echo: result.data.message };
});

const start = async () => {
  try {
    console.log('Starting Fastify server...');

    // Register routes
    console.log('Registering athlete routes...');
    await server.register(athletesRoutes);
    console.log('Athlete routes registered successfully');

    console.log('Registering track routes...');
    await server.register(trackRoutes);
    console.log('Track routes registered successfully');

    console.log('Starting server listener...');
    await server.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server listening on http://localhost:3001');
  } catch (err) {
    console.error('Error starting server:', err);
    server.log.error(err);
    process.exit(1);
  }
};

start();
