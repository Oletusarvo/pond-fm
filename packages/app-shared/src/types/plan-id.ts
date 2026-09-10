import type z from "zod";
import type { planIdSchema } from "../schemas/plan-schema.js";

export type TPlanId = z.infer<typeof planIdSchema>;
