import { getRouter } from '../../../utils/get-router';
import { checkAuth } from '../../middleware/check-auth';
import { authorizeByCodeHandler } from './handlers/authorize-by-code-handler';
import { requestAuthorizationHandler } from './handlers/request-authorization-handler';
import { getSessionInfoHandler } from './handlers/get-session-info-handler';
import { logoutHandler } from './handlers/logout-handler';

const router = getRouter();

router.post('/request-authorization', requestAuthorizationHandler);
router.post('/authorize', authorizeByCodeHandler);
router.post('/logout', checkAuth(), logoutHandler);
router.get('/me', checkAuth(), getSessionInfoHandler);
export { router as authRouter };
