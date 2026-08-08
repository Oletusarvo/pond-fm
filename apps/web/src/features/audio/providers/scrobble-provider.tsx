import { useActionContext } from '../../../providers/action-provider';
import { createProvider } from '../../../utils/create-provider';
import { usePostActions } from '../../posts/hooks/use-post-actions';
import { useScrobble } from '../hooks/use-scrobble';
import { usePlaybackContext } from './playback-provider';
import { usePlayCountContext } from './playcount-provider';

export const [ScrobbleProvider, useScrobbleContext] = createProvider({
  contextName: 'ScrobbleContext',
  hook: () => {
    const playbackService = usePlaybackContext();
    const postActions = usePostActions({ id: playbackService.currentPlayback?.post_id })

    const duration = playbackService.currentPlayback?.duration || 1;
    const service = useScrobble({
      duration,
      threshold:
        duration <= 30 ? 1 : duration <= 60 ? 30 / duration : duration <= 480 ? 0.33 : null,
      onPlayTimeReached: () => postActions.countPlay(),
    });
    return service;
  },
});
