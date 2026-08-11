import { v4 } from "uuid";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { getLookupQuery } from "../util/get-lookup-query";
import path from 'path';

export async function createUpload(ctx: DBContext, config: {
  id: string;
  mimeType?: string;
  filename: string;
  originalFilename: string;
  size?: number;
  key: string;
}) {
  const [upload] = await ctx(tablenames.uploads).insert({
    id: config.id,
    mime_type: config.mimeType,
    original_filename: config.originalFilename,
    filename: config.filename,
    status: 'pending',
    size: config?.size,
    key: config.key
  }).returning(['id', 'filename']);
  return upload;
}