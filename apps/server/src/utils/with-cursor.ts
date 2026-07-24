import { encodeCursor } from './cursor';

/**Includes with the given array of data an base64url-encoded cursor pointing at the last element. */
export function withCursor<T extends { id: string; created_at: string }>(data: T[]) {
  const lastItem = data?.at(-1);
  return {
    cursor: lastItem
      ? encodeCursor({
          timestamp: lastItem.created_at,
          id: lastItem.id,
        })
      : null,
    data,
  };
}
