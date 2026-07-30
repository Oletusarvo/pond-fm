import { getRouter } from '../../../utils/get-router';
import { checkAuth } from '../../middleware/check-auth';
import { updateTrackTagsHandler } from '../tracks/handlers/update-track-tags';
import { updateUserTagsHandler } from './handlers/create-user-tags-handler';
import { getNotificationsHandler } from './handlers/get-notifications-handler';

const router = getRouter();

router.post('/tags', checkAuth(), updateUserTagsHandler);
router.get('/notifications', checkAuth(), getNotificationsHandler);
export { router as usersRouter };
