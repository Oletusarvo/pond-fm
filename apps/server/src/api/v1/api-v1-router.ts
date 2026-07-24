import { getRouter } from '../../utils/get-router';
import { authRouter } from './auth/auth-router';
import { budgetRouter } from './budget/budget-router';
import { paymentsRouter } from './payments/payments-router';
import { tracksRouter } from './tracks/tracks-router';
import { usersRouter } from './users/users-router';

const router = getRouter();
router.use('/auth', authRouter);
router.use('/tracks', tracksRouter);
router.use('/payments', paymentsRouter);
router.use('/budget', budgetRouter);
router.use('/users', usersRouter);

export { router as apiV1Router };
