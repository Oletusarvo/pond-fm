import z from "zod";

export const passwordSchema = z
  .string()
  .min(8)
  .max(16)
  .refine((value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/.test(value), {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  });
