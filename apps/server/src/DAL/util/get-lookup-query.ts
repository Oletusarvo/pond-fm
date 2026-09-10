import { db } from "../../db-config";
import { tablenames } from "../../tablenames";

/**Returns a query for fetching the id of a record with the provided label in a database lookup-table. */
export function getLookupQuery(tablename: string, label: string) {
  return db.select("id").from(tablename).where({ label }).limit(1);
}
