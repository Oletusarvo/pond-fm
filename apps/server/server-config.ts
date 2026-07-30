import { CookieOptions } from 'express';

export const serverConfig = {
  artistAuthString: 'middleman-service-artist-auth',
  accessTokenName: 'amplitune-access-token',
  streamTokenName: 'pondfm-stream-token',
  anonymousSessionCookieName: 'pondfm-anon-token',
  streamCookieSettings: {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 4,
  } as CookieOptions,
  sessionCookieSettings: {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 90,
  } as CookieOptions,
  anonymousSessionCookieSettings: {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  } as CookieOptions,
};
