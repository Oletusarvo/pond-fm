import z from "zod";

export const authorizeByAudiusSchema = z.object({
  code: z.string(),
});
