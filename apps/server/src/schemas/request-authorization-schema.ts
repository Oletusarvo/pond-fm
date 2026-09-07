import { userSchema } from "@pondfm/app-shared";
import z from "zod";

export const requestAuthorizationSchema = z.object({
  email: userSchema.shape.email,
});
