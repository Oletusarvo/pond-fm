import z from "zod";
import { passwordSchema } from "./password-schema";

export const resetPasswordCredentialsSchema = z.object({
  token: z.jwt(),
  password: passwordSchema,
});
