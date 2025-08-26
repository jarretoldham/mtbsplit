import app from './app';

const options = {
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
    },
  },
};

(async () => {
  const server = await app(options);

  const start = async () => {
    try {
      console.log('Starting Fastify server...');
      await server.listen({ port: 3001, host: '0.0.0.0' });
      console.log('Server listening on http://localhost:3001');
    } catch (err) {
      console.error('Error starting server:', err);
      server.log.error(err);
      process.exit(1);
    }
  };

  start();
})();
