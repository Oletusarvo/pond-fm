import { useEffect, useMemo, useRef, useState } from 'react';
import { setupContext } from '../../../utils/setup-context';
import { useAudioPlayer } from '../hooks/use-audio-player';
import { apiService } from '../../../utils/api-service';
import { TPost } from '../../../types/post';
import { useScrobble } from '../hooks/use-scrobble';

const [PlaybackContext, usePlaybackContext] = setupContext<{
  currentPlayback: TPost | null;
  playbackState: string;
  playbackSrc: string;
  togglePlayback: (track: TPost) => Promise<void>;
  updateCurrentPlayback: (track: TPost) => void;
}>({ name: 'PlaybackContext' });

export function PlaybackProvider({ children }: React.PropsWithChildren) {
  const {
    audioRef,
    togglePlayback,
    currentPlayback,
    updateCurrentPlayback,
    updatePlaybackState,
    playbackState,
  } = useAudioPlayer();

  const { updateTimeListened } = useScrobble({
    threshold: 0.5,
    duration: currentPlayback?.track.duration || 0,
    onPlayTimeReached: () => {
      if (currentPlayback) {
        countPlay(currentPlayback.track.id);
      }
    },
  });

  const countPlay = async (trackId: string) => {
    await apiService.countPlay(trackId);
  };

  const playbackSrc = useMemo(
    () =>
      currentPlayback
        ? `http://localhost:3002/api/v1/tracks/stream/${currentPlayback.track.id}`
        : null,
    [currentPlayback?.track.id],
  );

  useEffect(() => {
    if (playbackState === 'playing') {
      countPlay(currentPlayback?.track.id);
    }
  }, [playbackState]);

  return (
    <PlaybackContext.Provider
      value={{
        currentPlayback,
        togglePlayback,
        updateCurrentPlayback,
        playbackState,
        playbackSrc,
      }}>
      <>
        {children}
        <audio
          hidden
          onPlay={() => updatePlaybackState('playing')}
          onPause={() => updatePlaybackState('paused')}
          onEnded={() => updatePlaybackState('paused')}
          onLoad={() => console.log('loading')}
          ref={audioRef}
          src={playbackSrc}
          controls
        />
      </>
    </PlaybackContext.Provider>
  );
}

export { usePlaybackContext };
