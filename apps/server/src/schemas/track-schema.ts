import z from 'zod';

export const trackSchema = z.object({
  title: z.string(),
  genre: z.string(),
  moods: z.array(z.string()).max(3).min(0),
  file: z.file(),
});
