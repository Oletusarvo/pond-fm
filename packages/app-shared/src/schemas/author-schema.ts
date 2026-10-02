import { planIdSchema } from "./plan-schema.js";
import { userSchema } from "./user-schema.js";

/**
 * @summary Defines the shapes of an author-object contained in some public object shapes.
 */
export const authorSchema = userSchema.pick({ id: true, username: true }).extend({
  plan_id: planIdSchema,
});
