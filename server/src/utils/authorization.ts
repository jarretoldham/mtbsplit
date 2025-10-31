// server/src/utils/authorization.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import HttpStatusCodes from './http.status.codes';

/**
 * Checks if the authenticated user is the owner of the resource.
 * If not, sends a 403 Forbidden response.
 */
export function userIsResourceOwner(
  resourceOwnerId: number,
  request: FastifyRequest,
  reply: FastifyReply,
): boolean {
  if (!request.athlete) {
    reply
      .status(HttpStatusCodes.UNAUTHORIZED)
      .send({ message: 'Authentication required' });
    return false;
  }

  if (resourceOwnerId !== request.athlete.athleteId) {
    reply
      .status(HttpStatusCodes.FORBIDDEN)
      .send({ message: 'You do not have permission to access this resource' });
    return false;
  }
  return true;
}
