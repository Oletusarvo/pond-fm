import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { getUploadQuery } from "./get-upload-query";

export async function getUploadById(ctx: DBContext, config: { id: string }) {
  const query = getUploadQuery(ctx);
  return await query.where({
    id: config.id,
  })
    .first();
}