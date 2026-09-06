import z from "zod";
import { completeUploadSchema } from "./complete-upload-schema";

const audioMimeTypes = ["audio/mpeg", "audio/wav"] as const;
const audioMimeTypeSchema = z.enum(audioMimeTypes);

export const createUploadSchema = z
  .object({
    upload: z.object({
      mimeType: audioMimeTypeSchema,
      filename: z.string(),
      size: z.coerce.number().pipe(z.int()),
      bitRate: z.int().optional(),
    }),
  })
  .and(completeUploadSchema);
