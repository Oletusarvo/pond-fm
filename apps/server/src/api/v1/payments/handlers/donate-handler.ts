import { paymentService } from '../../../../container';
import { db } from '../../../../db-config';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';

/**Creates a donation for the platform. */
export const donateHandler = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  const session = req.session;
  const { amountInCents, currency } = req.data;
  await paymentService.donate(
    {
      userId: session?.user.id,
      amountInCents,
      currency,
    },
    db,
  );
  return res.end();
});
