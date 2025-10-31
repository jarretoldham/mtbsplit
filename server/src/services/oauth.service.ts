import { OAuthUserInfo } from '../types/oauth.types';

export async function getUserInfo(
  provider: string,
  accessToken: string,
): Promise<OAuthUserInfo> {
  const userInfoUrls: Record<string, string> = {
    strava: 'https://www.strava.com/api/v3/athlete',
    // google: 'https://www.googleapis.com/oauth2/v2/userinfo',
  };

  const url = userInfoUrls[provider.toLowerCase()];
  if (!url) {
    throw new Error(`User info URL not configured for ${provider}`);
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user info from ${provider}`);
  }

  const data = await response.json();
  return mapProviderUserInfo(provider, data);
}

function mapProviderUserInfo(provider: string, data: any): OAuthUserInfo {
  switch (provider.toLowerCase()) {
    case 'strava':
      return {
        providerId: String(data.id),
        email: data.email,
        firstName: data.firstname,
        lastName: data.lastname,
        profilePicture: data.profile,
      };
    // case 'google':
    //   return {
    //     providerId: data.id,
    //     email: data.email,
    //     firstName: data.given_name,
    //     lastName: data.family_name,
    //     profilePicture: data.picture,
    //   };
    default:
      throw new Error(`User info mapping not implemented for ${provider}`);
  }
}
