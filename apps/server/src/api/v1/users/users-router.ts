import { getRouter } from '../../../utils/get-router';
import { checkAuth } from '../../middleware/check-auth';
import { getNotificationsHandler } from './handlers/get-notifications-handler';
import { getUserHandler } from './handlers/get-user-handler';
import { markNotificationsAsSeenHandler } from './handlers/mark-notifications-as-seen-handler';
import { updateUsernameHandler } from './handlers/update-username-handler';

const router = getRouter();

router.put('/username', checkAuth(), updateUsernameHandler);
router.get('/notifications', checkAuth(), getNotificationsHandler);
router.put('/notifications/mark-as-seen', checkAuth(), markNotificationsAsSeenHandler);
router.get('/:userId', getUserHandler)
export { router as usersRouter };
