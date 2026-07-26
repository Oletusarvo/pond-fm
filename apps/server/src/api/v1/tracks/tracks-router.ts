import { getRouter } from '../../../utils/get-router';
import { checkAuth } from '../../middleware/check-auth';
import { createTrackHandler } from './handlers/create-track-handler';
import { getCuratedTrackFeedHandler } from './handlers/get-curated-track-feed-handler';
import { getTrackByIdHandler } from './handlers/get-track-by-id-handler';
import { getDiscoveryFeed } from './handlers/get-discovery-feed';
import { likeTrackHandler } from './handlers/like-track-handler';
import { repostTrackHandler } from './handlers/repost-track-handler';
import { streamTrackHandler } from './handlers/stream-track-handler';
import { unlikeTrackHandler } from './handlers/unlike-track-handler';
import { unrepostTrackHandler } from './handlers/unrepost-track-handler';
import { updateTrackTagsHandler } from './handlers/update-track-tags';
import { countPlayHandler } from './handlers/count-play-handler';
import { upload } from '../../../multer-config';

const router = getRouter();
router.post('/', checkAuth(), upload.single('file'), createTrackHandler);
router.get('/feed/main', checkAuth(false), getDiscoveryFeed);
router.get('/feed/discover', checkAuth(false), getDiscoveryFeed);
router.post('/tags', checkAuth(), updateTrackTagsHandler);

router.post('/like', checkAuth(), likeTrackHandler);
router.delete('/like', checkAuth(), unlikeTrackHandler);

router.post('/repost', checkAuth(), repostTrackHandler);
router.delete('/repost', checkAuth(), unrepostTrackHandler);
router.post('/play', countPlayHandler);
router.get('/stream/:id', streamTrackHandler);
router.get('/:id', getTrackByIdHandler);

export { router as tracksRouter };
