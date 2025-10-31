import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import * as athleteRepository from '../repositories/athlete.repository';
import HttpStatusCodes from '../utils/http.status.codes';
import { AuthTokenPayload } from '../types/oauth.types';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
  interface FastifyRequest {
    athlete?: AuthTokenPayload;
  }
}

async function authPlugin(fastify: FastifyInstance) {
  if (!process.env.JWT_SECRET) {
    throw new Error('Missing JWT secret in environment variables');
  }
  await fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
    cookie: {
      cookieName: 'auth_token',
      signed: true,
    },
  });

  await fastify.register(fastifyCookie);

  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const decoded = (await request.jwtVerify()) as AuthTokenPayload;

        const athlete = await athleteRepository.getAthleteById(
          decoded.athleteId,
        );

        if (!athlete) {
          return reply
            .status(HttpStatusCodes.UNAUTHORIZED)
            .send({ message: 'User not found' });
        }

        request.athlete = {
          athleteId: athlete.id,
          email: athlete.email,
        };
      } catch (error) {
        return reply
          .status(HttpStatusCodes.UNAUTHORIZED)
          .send({ message: 'Invalid or expired token' });
      }
    },
  );
}

export default fp(authPlugin);
