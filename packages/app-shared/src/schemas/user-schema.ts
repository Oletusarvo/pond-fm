import z from "zod";
import { subscriptionSchema } from "./subscription-schema.js";

const userStatusTypes = ["active", "pending_verification", "pending_review", "deleted"] as const;

export const userSchema = z.object({
  audius_user_id: z.string(),
  username: z.string(),
  handle: z.string(),
  status: z.enum(userStatusTypes),
  subscription: subscriptionSchema,
  urls: z.array(z.url()),
});
