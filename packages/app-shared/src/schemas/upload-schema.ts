import z from "zod";

import { idSchema } from "./defaults.js";

const mimeTypes = ["audio/mpeg", "audio/wav"] as const;
export const mimeTypeSchema = z.enum(mimeTypes);

export const uploadSchema = z.object({
  id: idSchema,
  upload_folder_id: idSchema,
  mime_type: mimeTypeSchema,
  filename: z.string(),
  size_bytes: z.number(),
  created_at: z.coerce.date(),
});
