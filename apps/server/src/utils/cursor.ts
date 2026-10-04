import { TCursor } from "../types/cursor";

export function encodeCursor(cursor: TCursor) {
  return Buffer.from(JSON.stringify(cursor)).toString("base64url");
}

/**Decodes a given base64url cursor and returns it. Returns null if no encodedCursor is given. */
export function decodeCursor(encodedCursor?: string) {
  return encodedCursor
    ? (JSON.parse(Buffer.from(encodedCursor, "base64url").toString("utf-8")) as TCursor)
    : null;
}

export function createCursor(
  data: any[],
  pageSize: number,
  idColumn: string = "id",
  timestampColumn: string = "created_at",
) {
  const cursorItem = data.length === pageSize + 1 ? data.at(-2) : null;
  const timestampParts = timestampColumn.split(".");
  const extractedTimestampColumn = timestampParts.at(-1);
  return cursorItem
    ? encodeCursor({ id: cursorItem[idColumn], timestamp: cursorItem[extractedTimestampColumn] })
    : null;
}
