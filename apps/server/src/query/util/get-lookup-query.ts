import { db } from "../../db-config";
import { tablenames } from "../../tablenames";

export function getLookupQuery(tablename: string, label: string) {
  return db.select('id').from(tablename).where({ label }).limit(1)
}