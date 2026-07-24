import rateLimit from 'express-rate-limit';
import { getRouter } from '../utils/get-router';
import { apiV1Router } from './v1/api-v1-router';

const rateLimiter = rateLimit({
  windowMs: 1000 * 60 * 10,
  limit: 500,
});

const router = getRouter();
router.use(rateLimiter);
router.use('/v1', apiV1Router);
export { router as apiRouter };
