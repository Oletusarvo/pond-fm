import z from "zod";

export const requestRegistrationSchema = z.object({
  email: z.email(),
  username: z.string().min(3),
});