import z from "zod";
import { subscriptionSchema } from "./subscription-schema.js";

const userStatusTypes = [
  "active",
  "pending_verification",
  "pending_review",
  "deleted",
] as const;

export const userSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  username: z.string(),
  bio: z.string(),
  status: z.enum(userStatusTypes),
  subscription: subscriptionSchema,
});
