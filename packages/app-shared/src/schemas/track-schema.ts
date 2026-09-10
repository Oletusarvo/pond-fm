import z from "zod";
import { authorSchema } from "./author-schema.js";
import { uploadSchema } from "./upload-schema.js";
import { idSchema } from "./defaults.js";

export const trackSchema = z.object({
  id: z.uuid(),
  primary_audio_id: idSchema,
  upload_folder_id: idSchema,
  genre_id: z.int(),
  play_count: z.number(),
  unique_listener_count: z.number(),
  title: z.string(),
});

const trackStatsSchema = trackSchema
  .pick({ play_count: true, unique_listener_count: true })
  .extend({
    like_count: z.number(),
    repost_count: z.number(),
    reposted_by_me: z.boolean(),
    liked_by_me: z.boolean(),
  });

export const trackPublicSchema = trackSchema
  .omit({
    primary_audio_id: true,
    upload_folder_id: true,
    play_count: true,
    unique_listener_count: true,
  })
  .extend({
    stats: trackStatsSchema,
    author: authorSchema,
    duration: z.number(),
    size: uploadSchema.shape.size_bytes,
    waveform: z.array(z.number()),
    moods: z.array(z.string()),
    genre: z.string(),
  });
