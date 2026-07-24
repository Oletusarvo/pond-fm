import z from 'zod';

export const paymentSchema = z.object({
  currency: z
    .string()
    .length(3)
    .transform(val => val.toUpperCase()),
  amountInCents: z.coerce.number().pipe(z.int().nonnegative()),
});

export const tipSchema = paymentSchema.extend({
  recipientId: z.uuid(),
});
