import { z } from 'zod';
import { FastifyInstance } from 'fastify';
import rateLimit from '@fastify/rate-limit';
import HttpStatusCodes from '../utils/http.status.codes';
import * as authService from '../services/auth.service';
import { getAllOAuthProviders } from '../config/oauth-providers.config';
import { LoginSchema, RegisterSchema } from '../schema/auth.schema';

export async function authRoutes(server: FastifyInstance) {
  await server.register(rateLimit, {
    max: 20,
    timeWindow: 1000 * 60 * 15, // 15 minutes
  });

  // Get available OAuth providers
  server.get('providers', async (request, reply) => {
    return {
      oauth: getAllOAuthProviders(),
      emailPassword: true,
    };
  });

  // Email/Password Registration
  server.post('register', async (request, reply) => {
    try {
      const result = RegisterSchema.safeParse(request.body);
      if (!result.success) {
        return reply.status(HttpStatusCodes.BAD_REQUEST).send(result.error);
      }

      const user = await authService.registerWithEmail(result.data);

      const token = server.jwt.sign(user, { expiresIn: '7d' });

      reply.setCookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      return { message: 'Registration successful', user };
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'User with this email already exists'
      ) {
        // Don't reveal if email exists - be vague
        return reply
          .status(HttpStatusCodes.BAD_REQUEST)
          .send({ message: 'Registration failed. Please try again.' });
      }
      server.log.error(error);
      return reply
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'Registration failed' });
    }
  });

  // Email/Password Login
  server.post('login', async (request, reply) => {
    try {
      const result = LoginSchema.safeParse(request.body);
      if (!result.success) {
        return reply.status(HttpStatusCodes.BAD_REQUEST).send(result.error);
      }

      const user = await authService.loginWithEmail(result.data);

      const token = server.jwt.sign(user, { expiresIn: '7d' });

      reply.setCookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      return { message: 'Login successful', user };
    } catch (error) {
      if (error instanceof Error) {
        return reply
          .status(HttpStatusCodes.UNAUTHORIZED)
          .send({ message: error.message });
      }
      server.log.error(error);
      return reply
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'Login failed' });
    }
  });

  // OAuth Strava
  // The /auth/strava route is auto-registered by @fastify/oauth2

  // OAuth Callback - Strava
  server.get('/strava/callback', async (request, reply) => {
    try {
      // @fastify/oauth2 handles the code exchange automatically!
      const token =
        await server.strava.getAccessTokenFromAuthorizationCodeFlow(request);

      const user = await authService.handleOAuthCallback(
        'strava',
        token.access_token,
        token.refresh_token || '',
        token.expires_in || 3600,
      );

      const jwtToken = server.jwt.sign(user, { expiresIn: '7d' });

      reply.setCookie('auth_token', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      return reply.redirect(`${process.env.CLIENT_URL}/`);
    } catch (error) {
      server.log.error(error);
      return reply.redirect(
        `${process.env.CLIENT_URL}/login?error=authentication_failed`,
      );
    }
  });

  // For additional providers, add similar callback handlers:
  // server.get('/auth/google/callback', async (request, reply) => {
  //   const token = await server.google.getAccessTokenFromAuthorizationCodeFlow(request);
  //   const user = await authService.handleOAuthCallback(
  //     'google',
  //     token.access_token,
  //     token.refresh_token || '',
  //     token.expires_in || 3600,
  //   );
  //   // ... same JWT and cookie logic
  // });

  // Logout
  server.post('/logout', async (request, reply) => {
    reply.clearCookie('auth_token');
    return { message: 'Logged out successfully' };
  });

  // Get current user
  server.get(
    'me',
    { preHandler: [server.authenticate] },
    async (request, reply) => {
      return request.athlete;
    },
  );
}

export default authRoutes;
