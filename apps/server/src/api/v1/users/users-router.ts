import { getRouter } from '../../../utils/get-router';
import { checkAuth } from '../../middleware/check-auth';
import { updateTrackTagsHandler } from '../tracks/handlers/update-track-tags';
import { updateUserTagsHandler } from './handlers/create-user-tags-handler';
import { getNotificationsHandler } from './handlers/get-notifications-handler';
import { markNotificationsAsSeenHandler } from './handlers/mark-notifications-as-seen-handler';
import { updateUsernameHandler } from './handlers/update-username-handler';

const router = getRouter();

router.put('/username', checkAuth(), updateUsernameHandler);
router.post('/tags', checkAuth(), updateUserTagsHandler);
router.get('/notifications', checkAuth(), getNotificationsHandler);
router.put('/notifications/mark-as-seen', checkAuth(), markNotificationsAsSeenHandler);
export { router as usersRouter };
