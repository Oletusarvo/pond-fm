import { paymentSchema, tipSchema } from '../../../schemas/payment-schema';
import { createBodyParser } from '../../../utils/create-body-parser';
import { getRouter } from '../../../utils/get-router';
import { checkAuth } from '../../middleware/check-auth';
import { donateHandler } from './handlers/donate-handler';
import { tipHandler } from './handlers/tip-handler';

const router = getRouter();

router.post('/tip', checkAuth(false), createBodyParser(tipSchema), tipHandler);
router.post('/donate', checkAuth(false), createBodyParser(paymentSchema), donateHandler);
export { router as paymentsRouter };
