import { getRouter } from '../../../utils/get-router';
import { checkAuth } from '../../middleware/check-auth';
import { createTrackHandler } from './handlers/create-track-handler';
import { getDiscoveryFeed } from './handlers/get-discovery-feed';
import { likeTrackHandler } from './handlers/like-track-handler';
import { repostTrackHandler } from './handlers/repost-track-handler';
import { streamTrackHandler } from './handlers/stream-track-handler';
import { unlikeTrackHandler } from './handlers/unlike-track-handler';
import { unrepostTrackHandler } from './handlers/unrepost-track-handler';
import { countPlayHandler } from './handlers/count-play-handler';
import { upload } from '../../../multer-config';
import { getAuthorFeed } from './handlers/get-author-feed-handler';
import { getStreamTokenHandler } from './handlers/get-stream-token-handler';
import { verifyStreamToken } from './middleware/verify-stream-token';
import { getMainFeedHandler } from './handlers/get-main-feed';

const router = getRouter();
router.post(
  '/',
  checkAuth(),
  //createBodyParser(trackSchema),
  upload.single('file'),
  createTrackHandler,
);
router.get('/feed/main', checkAuth(false), getMainFeedHandler);
router.get('/feed/discover', checkAuth(false), getDiscoveryFeed);
router.get('/feed/:authorId', checkAuth(false), getAuthorFeed);

router.post('/like', checkAuth(), likeTrackHandler);
router.delete('/like', checkAuth(), unlikeTrackHandler);

router.post('/repost', checkAuth(), repostTrackHandler);
router.delete('/repost', checkAuth(), unrepostTrackHandler);
router.post('/:trackId/play', verifyStreamToken, countPlayHandler);
router.get('/:trackId/stream/token', getStreamTokenHandler);
router.get('/:trackId/stream', streamTrackHandler);

export { router as tracksRouter };
