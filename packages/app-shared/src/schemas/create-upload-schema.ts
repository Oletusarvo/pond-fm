import z from "zod";
import { uploadSchema } from "./upload-schema.js";
import { trackPublicSchema, trackSchema } from "./track-schema.js";

export const createUploadSchema = z.object({
  upload: uploadSchema
    .pick({
      size_bytes: true,
      mime_type: true,
      filename: true,
    })
    .required(),
  track: trackSchema
    .pick({
      title: true,
    })
    .required()
    .and(
      trackPublicSchema
        .required()
        .pick({
          moods: true,
          genre: true,
        })
        .required(),
    ),
});
