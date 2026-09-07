import z from "zod";

export const authorizeByCodeSchema = z.object({
  code: z.base64url(),
});
