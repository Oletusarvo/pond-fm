import z from "zod";
import { authorSchema } from "./author-schema.js";
import { trackPublicSchema } from "./track-schema.js";

export const postSchema = z.object({
  id: z.uuid(),
  author_id: z.uuid(),
  track_id: z.uuid(),
  created_at: z.coerce.date(),
});

export const postPublicSchema = postSchema
  .pick({
    id: true,
    created_at: true,
  })
  .extend({
    author: authorSchema,
    track: trackPublicSchema,
  });
