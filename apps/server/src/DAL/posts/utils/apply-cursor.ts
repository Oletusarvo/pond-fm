import { Knex } from "knex";
import { TCursor } from "../../../types/cursor";

export function applyCursor(
  query: Knex.QueryBuilder,
  config: {
    dir: "asc" | "desc";
    timestampColumn: string;
    idColumn: string;
    cursor?: TCursor;
  },
) {
  const { cursor } = config;
  if (cursor) {
    const { dir, timestampColumn, idColumn } = config;
    const comparator = dir === "asc" ? ">=" : "<=";

    query.where(timestampColumn, comparator, cursor.timestamp).whereNot(idColumn, cursor.id);
  }
}

export function applyCursorRaw(query: Knex.QueryBuilder, cursor: TCursor, raw: string) {
  if (cursor) {
    query.whereRaw(raw, [cursor.timestamp, cursor.id]);
  }
}
