import knex from "knex";
import knexfile from "../knexfile";
import { tablenames } from "./tablenames";
const env = process.env.DB_ENVIRONMENT || "development";

export const db = knex(knexfile[env]);
//const bandwidthDb = knex(knexfile[env]);

/*
db.on("query", (query) => {
  const sqlBytes = Buffer.byteLength(query.sql, "utf8");

  const bindingBytes = query.bindings.reduce((total, value) => {
    if (value == null) return total;

    if (Buffer.isBuffer(value)) {
      return total + value.length;
    }

    if (typeof value === "object") {
      return total + Buffer.byteLength(JSON.stringify(value), "utf8");
    }

    return total + Buffer.byteLength(String(value), "utf8");
  }, 0);

  const estimatedBytes = sqlBytes + bindingBytes;

  bandwidthDb(tablenames.bandwidthData)
    .increment("total_estimated_bytes", estimatedBytes)
    .update({
      updated_at: bandwidthDb.fn.now(),
    })
    .catch((err) => {
      console.log("Failed to update bandwidth within db query!", err.message);
    });
});
*/
