import { createProvider } from '../../../utils/create-provider';
import { usePostActions } from '../../posts/hooks/use-post-actions';
import { useScrobble } from '../hooks/use-scrobble';
import { usePlaybackContext } from './playback-provider';

export const [ScrobbleProvider, useScrobbleContext] = createProvider({
  contextName: 'ScrobbleContext',
  hook: () => {
    const playbackService = usePlaybackContext();
    const currentTrack = playbackService.currentPlayback?.track;
    const postActions = usePostActions({ trackId: currentTrack?.id })

    const duration = currentTrack?.duration || 1;
    const service = useScrobble({
      duration,
      threshold:
        duration <= 30 ? 1 : duration <= 60 ? 30 / duration : duration <= 480 ? 0.33 : null,
      onPlayTimeReached: () => postActions.countPlay(),
    });
    return service;
  },
});
