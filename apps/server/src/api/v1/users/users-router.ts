import { updateUserSchema } from '../../../schemas/update-user-schema';
import { createBodyParser } from '../../../utils/create-body-parser';
import { getRouter } from '../../../utils/get-router';
import { checkAuth } from '../../middleware/check-auth';
import { getNotificationsHandler } from './handlers/get-notifications-handler';
import { getUserHandler } from './handlers/get-user-handler';
import { markNotificationsAsSeenHandler } from './handlers/mark-notifications-as-seen-handler';
import { updateUserHandler } from './handlers/update-user-handler';

const router = getRouter();

router.put('/', checkAuth(), createBodyParser(updateUserSchema), updateUserHandler);
router.get('/notifications', checkAuth(), getNotificationsHandler);
router.put('/notifications/mark-as-seen', checkAuth(), markNotificationsAsSeenHandler);
router.get('/:userId', getUserHandler)
export { router as usersRouter };
