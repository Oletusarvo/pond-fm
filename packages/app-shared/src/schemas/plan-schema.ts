import z from "zod";

const planIds = ["free", "pro"] as const;

export const planIdSchema = z.enum(planIds);
