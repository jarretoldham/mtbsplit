interface FastifyOAuth2Config {
  name: string;
  credentials: {
    client: {
      id: string;
      secret: string;
    };
    auth: {
      authorizeHost: string;
      authorizePath: string;
      tokenHost: string;
      tokenPath: string;
    };
  };
  scope: string[];
  startRedirectPath: string;
  callbackUri: string;
}

export const OAUTH_PROVIDERS: Record<string, FastifyOAuth2Config> = {
  strava: {
    name: 'strava',
    credentials: {
      client: {
        id: process.env.STRAVA_CLIENT_ID || '',
        secret: process.env.STRAVA_CLIENT_SECRET || '',
      },
      auth: {
        authorizeHost: 'https://www.strava.com',
        authorizePath: '/oauth/authorize',
        tokenHost: 'https://www.strava.com',
        tokenPath: '/oauth/token',
      },
    },
    scope: ['activity:read_all', 'profile:read_all'],
    startRedirectPath: '/auth/strava',
    callbackUri: `${process.env.SERVER_URL}/auth/strava/callback`,
  },
  // Add more providers as needed
  // google: {
  //   name: 'google',
  //   credentials: {
  //     client: {
  //       id: process.env.GOOGLE_CLIENT_ID || '',
  //       secret: process.env.GOOGLE_CLIENT_SECRET || '',
  //     },
  //     auth: {
  //       authorizeHost: 'https://accounts.google.com',
  //       authorizePath: '/o/oauth2/v2/auth',
  //       tokenHost: 'https://oauth2.googleapis.com',
  //       tokenPath: '/token',
  //     },
  //   },
  //   scope: ['profile', 'email'],
  //   startRedirectPath: '/auth/google',
  //   callbackUri: `${process.env.SERVER_URL}/auth/google/callback`,
  // },
};

export function getAllOAuthProviders(): string[] {
  return Object.keys(OAUTH_PROVIDERS);
}

export default OAUTH_PROVIDERS;
