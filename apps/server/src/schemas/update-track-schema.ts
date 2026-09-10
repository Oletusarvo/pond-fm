import z from "zod";

export const updateTrackSchema = z.object({
  title: z.string().optional(),
  genre: z.string().optional(),
  moods: z.array(z.string()).min(1).max(3).optional(),
});
