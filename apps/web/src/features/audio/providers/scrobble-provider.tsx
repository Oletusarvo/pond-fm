import { createProvider } from '../../../utils/create-provider';
import { useScrobble } from '../hooks/use-scrobble';
import { usePlaybackContext } from './playback-provider';
import { usePlayCountContext } from './playcount-provider';

export const [ScrobbleProvider, useScrobbleContext] = createProvider({
  contextName: 'ScrobbleContext',
  hook: () => {
    const playcountService = usePlayCountContext();
    const playbackService = usePlaybackContext();
    const duration = playbackService.currentPlayback?.duration || 1;
    const service = useScrobble({
      duration,
      threshold: duration <= 30 ? 1 : duration <= 60 ? 30 / duration : duration <= 480 ? 0.5 : null,
      onPlayTimeReached: () => playcountService.countPlay(playbackService.currentPlayback.id),
    });
    return service;
  },
});
