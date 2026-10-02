import z from "zod";

export const updateUserSchema = z.object({
  urls: z.array(z.string()),
});
