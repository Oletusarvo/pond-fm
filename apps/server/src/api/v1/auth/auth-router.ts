import { getRouter } from '../../../utils/get-router';
import { checkAuth } from '../../middleware/check-auth';
import { authorizeByCodeHandler } from './handlers/authorize-by-code-handler';
import { requestAuthorizationHandler } from './handlers/request-authorization-handler';
import { getSessionInfoHandler } from './handlers/get-session-info-handler';
import { logoutHandler } from './handlers/logout-handler';
import { createBodyParser } from '../../../utils/create-body-parser';
import { requestAuthorizationSchema } from '../../../schemas/request-authorization-schema';
import { authorizeByCodeSchema } from '../../../schemas/authorize-by-code-schema';
import { refreshSessionHandler } from './handlers/refresh-session-handler';

const router = getRouter();

router.post(
  '/request-authorization',
  createBodyParser(requestAuthorizationSchema),
  requestAuthorizationHandler,
);
router.post('/authorize', createBodyParser(authorizeByCodeSchema), authorizeByCodeHandler);
router.post('/logout', checkAuth(), logoutHandler);
router.get('/me', checkAuth(), getSessionInfoHandler);
router.post('/me/refresh', checkAuth(), refreshSessionHandler);
export { router as authRouter };
