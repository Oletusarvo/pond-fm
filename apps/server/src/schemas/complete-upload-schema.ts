import z from "zod";

export const completeUploadSchema = z.object({
  title: z.string(),
  moods: z.array(z.string()).min(1).max(3),
  genre: z.string(),
});