import { useAudioPlayer } from '../features/audio/hooks/use-audio-player';
import { usePlayCount } from '../features/audio/hooks/use-play-count';
import { useScrobble } from '../features/audio/hooks/use-scrobble';
import { useAuth } from '../features/auth/hooks/use-auth';
import { createProvider } from '../utils/create-provider';

const [
  /**@deprecated */
  AppProvider,
  /**@deprecated */
  useAppContext,
] = createProvider({
  hook: () => {
    const playcountService = usePlayCount();
    const playbackService = useAudioPlayer();
    const duration = playbackService.currentPlayback?.duration || 1;
    const scrobbleService = useScrobble({
      duration,
      threshold: duration <= 30 ? 1 : duration <= 60 ? 30 / duration : duration <= 480 ? 0.5 : null,
      onPlayTimeReached: () => playcountService.countPlay(playbackService.currentPlayback.id),
    });
    const authService = useAuth();
    return { playcountService, playbackService, scrobbleService, authService };
  },
  contextName: 'AppContext',
});

export { AppProvider, useAppContext };
