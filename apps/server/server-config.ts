import { CookieOptions } from 'express';

export const serverConfig = {
  artistAuthString: 'middleman-service-artist-auth',
  accessTokenName: 'amplitune-access-token',
  sessionCookieSettings: {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 90,
  } as CookieOptions,
};
