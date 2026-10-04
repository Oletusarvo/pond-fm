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

export function applyTrackCursor(
  query: Knex.QueryBuilder,
  cursor: TCursor,
  options: {
    dir: "desc" | "asc";
    idColumn?: string;
    timestampColumn?: string;
  },
) {
  if (cursor) {
    const { dir, timestampColumn = "created_at", idColumn = "post_id" } = options;
    const comparator = dir === "desc" ? "<" : ">";
    query.where(timestampColumn, comparator, cursor.timestamp).orWhere(function () {
      this.where(timestampColumn, "=", cursor.timestamp).andWhere(idColumn, comparator, cursor.id);
    });
  }
}
