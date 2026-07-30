import { Request, Response } from 'express';
import { TSession } from './session';

type TData = Record<string, unknown>;

export type ExpressRequest<T extends TData = any> = Request & {
  data?: T;
  streamToken?: {
    expires: number;
    trackId: string;
    id: string;
    streamStarted: number;
    countValidAt: number;
  };
  sessionToken: {
    id: string;
  };
};

export type AuthenticatedExpressRequest<T extends TData = any> = ExpressRequest<T> & {
  session: TSession;
};

export type ExpressResponse = Response;
