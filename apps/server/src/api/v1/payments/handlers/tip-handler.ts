import z from 'zod';
import { createHandler } from '../../../../utils/create-handler';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { paymentService } from '../../../../container';
import { db } from '../../../../db-config';

/**Creates a tip for a user. */
export const tipHandler = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  const session = req.session;
  const { recipientId, amountInCents, currency } = req.data;
  const result = await paymentService.tipUser(
    {
      userId: session?.user.id,
      recipientId,
      amountInCents,
      currency: 'EUR',
    },
    db,
  );

  if (result.success === false) {
    return res.status(409).end();
  }

  return res.end();
});
