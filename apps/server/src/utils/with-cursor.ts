import { encodeCursor } from './cursor';

/**Includes with the given array of data an base64url-encoded cursor pointing at the last element. */
export function withCursor<T extends { id: string; created_at: string }>(
  data: T[],
  pageSize: number,
) {
  const cursorItem = data.length === pageSize + 1 ? data.at(-2) : null;
  return {
    cursor: cursorItem
      ? encodeCursor({
          timestamp: cursorItem.created_at,
          id: cursorItem.id,
        })
      : null,
    data,
  };
}
