import { userSchema } from "@pondfm/app-shared";
import z from "zod";

export const signupSchema = userSchema.pick({ email: true, username: true }).extend({
  terms_accepted: z
    .string()
    .transform((val) => val === "on")
    .pipe(z.boolean())
    .refine((val) => val === true, "Terms must be accepted!"),
});
