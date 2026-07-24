import { ExpressRequest } from '../types/express';
import { decodeCursor } from './cursor';

export function getCursor(req: ExpressRequest) {
  const { cursor: encodedCursor } = req.query as { cursor: string };
  const cursor = decodeCursor(encodedCursor);
  return cursor;
}
