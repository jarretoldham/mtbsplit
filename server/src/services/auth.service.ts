import bcrypt from 'bcrypt';
import { AthleteCreateInput } from '../schema/athlete.schema';
import * as athleteRepository from '../repositories/athlete.repository';
import * as oauthService from './oauth.service';

const SALT_ROUNDS = 10;

interface RegisterWithEmailInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginWithEmailInput {
  email: string;
  password: string;
}

export async function registerWithEmail(
  input: RegisterWithEmailInput,
): Promise<{ athleteId: number; email: string }> {
  // Check if user already exists
  const existingAthlete = await athleteRepository.getAthleteByEmail(
    input.email,
  );
  if (existingAthlete) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  // Create athlete
  const athleteInput: AthleteCreateInput = {
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
    passwordHash,
  };

  const athlete = await athleteRepository.createAthlete(athleteInput);

  return {
    athleteId: athlete.id,
    email: athlete.email,
  };
}

export async function loginWithEmail(
  input: LoginWithEmailInput,
): Promise<{ athleteId: number; email: string }> {
  const athlete = await athleteRepository.getAthleteByEmail(input.email);

  const isValidPassword = await bcrypt.compare(
    input.password,
    athlete?.passwordHash ?? '$2b$10$invalidhashtopreventtimingattack',
  );

  if (!athlete || !athlete.passwordHash || !isValidPassword) {
    throw new Error('Invalid email or password');
  }

  return {
    athleteId: athlete.id,
    email: athlete.email,
  };
}

export async function handleOAuthCallback(
  provider: string,
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
): Promise<{ athleteId: number; email: string }> {
  // Get user info from provider
  const userInfo = await oauthService.getUserInfo(provider, accessToken);

  // Find or create athlete
  let athlete = await athleteRepository.getAthleteByEmail(userInfo.email);

  if (!athlete) {
    const athleteInput: AthleteCreateInput = {
      email: userInfo.email,
      firstName: userInfo.firstName || '',
      lastName: userInfo.lastName || '',
      tokens: {
        provider,
        accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + expiresIn * 1000),
      },
    };
    athlete = await athleteRepository.createAthlete(athleteInput);
  } else {
    // Update tokens if athlete exists
    await athleteRepository.updateAthlete(athlete.id, {
      tokens: {
        provider,
        accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + expiresIn * 1000),
      },
    });
  }

  return {
    athleteId: athlete.id,
    email: athlete.email,
  };
}
