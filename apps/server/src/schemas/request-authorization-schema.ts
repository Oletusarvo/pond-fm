import z from 'zod';

export const requestAuthorizationSchema = z.object({
  email: z.email(),
});
