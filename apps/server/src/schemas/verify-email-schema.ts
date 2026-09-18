import { userSchema } from "@pondfm/app-shared";
import z from "zod";

export const verifyEmailSchema = z.object({
  token: z.jwt(),
});
