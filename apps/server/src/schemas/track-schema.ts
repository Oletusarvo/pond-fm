import z from 'zod';

export const trackSchema = z.object({
  title: z.string(),
  tags: z.array(z.string()).max(5).min(1),
  file: z.file(),
});
