import z from "zod";
import { planIdSchema } from "./plan-schema.js";
import { userSchema } from "./user-schema.js";

export const authorSchema = userSchema
  .pick({ id: true, username: true })
  .extend({
    plan_id: planIdSchema,
  });
