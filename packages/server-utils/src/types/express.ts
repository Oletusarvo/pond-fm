import { Request, Response } from "express";

export type ExpressRequest<T = unknown> = Omit<Request, "body"> & {
  body?: T;
};
export type ExpressResponse = Response;
