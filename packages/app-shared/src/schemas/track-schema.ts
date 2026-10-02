import z from "zod";
import { authorSchema } from "./author-schema.js";
import { uploadSchema } from "./upload-schema.js";
import { idSchema } from "./defaults.js";

export const trackStatusSchema = z.enum(["active", "deleted", "pending_review"]);

export const trackSchema = z.object({
  id: z.string(),
  author_id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  duration: z.number(),
  play_count: z.number(),
  like_count: z.number(),
  repost_count: z.number(),
  liked_by_me: z.boolean(),
  reposted_by_me: z.boolean(),
  unique_play_count: z.number(),
  required_unique_listeners: z.number(),
  status: trackStatusSchema,
  deleted_at: z.date().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const trackPublicSchema = trackSchema
  .omit({
    id: true,
    author_id: true,
  })
  .extend({
    id: z.string(),
    author: authorSchema,
    canonical_author: authorSchema,
    genre: z.string(),
    moods: z.array(z.string()),
    is_canonical: z.boolean(),
    is_discovered: z.boolean(),
  });
