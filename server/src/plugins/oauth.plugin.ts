import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import fastifyOauth2 from '@fastify/oauth2';
import { OAUTH_PROVIDERS } from '../config/oauth-providers.config';

declare module 'fastify' {
  interface FastifyInstance {
    strava: any; // OAuth2 namespace for Strava
    // google: any; // Add as needed for other providers
  }
}

async function oauthPlugin(fastify: FastifyInstance) {
  // Register each OAuth provider
  for (const [_, config] of Object.entries(OAUTH_PROVIDERS)) {
    await fastify.register(fastifyOauth2, config);
  }
}

export default fp(oauthPlugin);
