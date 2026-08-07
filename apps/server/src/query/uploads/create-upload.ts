import { v4 } from "uuid";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { getLookupQuery } from "../util/get-lookup-query";
import path from 'path';

export async function createUpload(ctx: DBContext, config: {
  mimeType?: string;
  filename: string;
  size?: number;
}) {
  const id = v4();
  const extname = path.extname(config.filename);
  const filename = `${id}${extname}`;
  const [upload] = await ctx(tablenames.uploads).insert({
    id,
    mime_type: config?.mimeType,
    filename,
    original_filename: config?.filename,
    status: 'pending',
    size: config?.size,
  }).returning(['id', 'filename']);
  return upload;
}