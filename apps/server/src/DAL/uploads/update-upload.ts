import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { getLookupQuery } from "../util/get-lookup-query";

export async function updateUpload(ctx: DBContext, config: { id: string, status?: string, mimeType?: string; filename?: string }) {
  const rowsAffected = await ctx(tablenames.uploads).where({ id: config.id }).update({
    status: config.status,
    mime_type: config.mimeType,
    filename: config.filename,
  });
  return rowsAffected;
}