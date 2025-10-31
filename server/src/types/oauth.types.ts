export interface OAuthProvider {
  name: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl?: string;
  scopes: string[];
}

export interface OAuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  provider: string;
}

export interface OAuthUserInfo {
  providerId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

export interface AuthTokenPayload {
  athleteId: number;
  email: string;
}
