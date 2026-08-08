import { updateUserSchema } from '../../../schemas/update-user-schema';
import { createBodyParser } from '../../../utils/create-body-parser';
import { getRouter } from '../../../utils/get-router';
import { checkAuth } from '../../middleware/check-auth';
import { followUserHandler } from './handlers/follow-user-handler';
import { getNotificationsHandler } from './handlers/get-notifications-handler';
import { getUserFollowers } from './handlers/get-user-followers';
import { getUserFollowing } from './handlers/get-user-following';
import { getUserHandler } from './handlers/get-user-handler';
import { markNotificationsAsSeenHandler } from './handlers/mark-notifications-as-seen-handler';
import { unfollowUserHandler } from './handlers/unfollow-user-handler';
import { updateUserHandler } from './handlers/update-user-handler';

const router = getRouter();

router.put('/', checkAuth(), createBodyParser(updateUserSchema), updateUserHandler);
router.get('/notifications', checkAuth(), getNotificationsHandler);
router.put('/notifications/mark-as-seen', checkAuth(), markNotificationsAsSeenHandler);
router.post('/follow/:userId', checkAuth(), followUserHandler);
router.post('/unfollow/:userId', checkAuth(), unfollowUserHandler);
router.get('/followers/:userId', getUserFollowers);
router.get('/following/:userId', getUserFollowing);
router.get('/:userId', checkAuth(false), getUserHandler);
router.put('/:userId', checkAuth(), createBodyParser(updateUserSchema), updateUserHandler);

export { router as usersRouter };
