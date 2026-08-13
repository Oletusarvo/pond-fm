import z from "zod";
import { completeUploadSchema } from "./complete-upload-schema";

export const createUploadSchema = z.object({
  mimeType: z.string(),
  filename: z.string(),
  size: z.coerce.number().pipe(z.int()),
  bitRate: z.int().optional(),
})
  .and(completeUploadSchema);