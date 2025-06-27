import Fastify from 'fastify';
import { z } from 'zod';

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
    await server.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server listening on http://localhost:3001');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
