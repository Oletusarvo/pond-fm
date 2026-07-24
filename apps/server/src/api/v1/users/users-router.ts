import { getRouter } from '../../../utils/get-router';
import { checkAuth } from '../../middleware/check-auth';
import { updateTrackTagsHandler } from '../tracks/handlers/update-track-tags';
import { updateUserTagsHandler } from './handlers/create-user-tags-handler';

const router = getRouter();

router.post('/tags', checkAuth(), updateUserTagsHandler);

export { router as usersRouter };
