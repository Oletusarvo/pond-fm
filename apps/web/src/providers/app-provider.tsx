import { useAudioPlayer } from '../features/audio/hooks/use-audio-player';
import { usePlayCount } from '../features/audio/hooks/use-play-count';
import { useScrobble } from '../features/audio/hooks/use-scrobble';
import { useAuth } from '../features/auth/hooks/use-auth';
import { setupContext } from '../utils/setup-context';

const [AppContext, useAppContext] = setupContext<{
  playcountService: ReturnType<typeof usePlayCount>;
  playbackService: ReturnType<typeof useAudioPlayer>;
  scrobbleService: ReturnType<typeof useScrobble>;
  authService: ReturnType<typeof useAuth>;
}>({ name: 'AppContext' });

export function AppProvider({ children }: React.PropsWithChildren) {
  const playcountService = usePlayCount();
  const playbackService = useAudioPlayer();
  const duration = playbackService.currentPlayback?.duration || 1;
  const scrobbleService = useScrobble({
    duration,
    threshold: duration <= 30 ? 1 : duration <= 480 ? 0.5 : 240 / duration,
    onPlayTimeReached: () => playcountService.countPlay(playbackService.currentPlayback.id),
  });
  const authService = useAuth();
  return (
    <AppContext.Provider
      value={{ playcountService, playbackService, scrobbleService, authService }}>
      {children}
    </AppContext.Provider>
  );
}

export { useAppContext };
