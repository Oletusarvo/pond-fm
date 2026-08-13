import { NextFunction } from 'express';
import { ExpressRequest, ExpressResponse } from './express.js';

export type THandler<Req extends ExpressRequest = ExpressRequest> = (
  req: Req,
  res: ExpressResponse,
) => Promise<void | ExpressResponse>;

export type TMiddlewareHandler<
  Req extends ExpressRequest = ExpressRequest,
> = (req: Req, res: ExpressResponse, next: NextFunction) => Promise<void | ExpressResponse>;
