import { useEffect, useMemo, useRef, useState } from 'react';
import { setupContext } from '../../../utils/setup-context';
import { useAudioPlayer } from '../hooks/use-audio-player';
import { apiService } from '../../../utils/api-service';
import { TPost } from '../../../types/post';
import { useScrobble } from '../hooks/use-scrobble';

const [PlaybackContext, usePlaybackContext] = setupContext<{
  audioRef: React.RefObject<HTMLAudioElement>;
  updateTimeListened;
  resetLastTimeUpdate;
  reset;
  playbackPosition;
  updatePlaybackState;
  updatePlaybackPosition;
  currentPlayback: TPost | null;
  playbackState: string;
  playbackSrc: string;
  togglePlayback: (track: TPost) => Promise<void>;
  updateCurrentPlayback: (track: TPost) => void;
}>({ name: 'PlaybackContext' });

/**Provides functionality for selecting a track for; and controlling playback. */
export function PlaybackProvider({ children }: React.PropsWithChildren) {
  const {
    audioRef,
    togglePlayback,
    currentPlayback,
    updateCurrentPlayback,
    updatePlaybackState,
    updatePlaybackPosition,
    playbackState,
    playbackPosition,
  } = useAudioPlayer();
  const duration = currentPlayback?.track.duration || 0;

  const { updateTimeListened, reset, resetLastTimeUpdate } = useScrobble({
    threshold: duration <= 30 ? 1 : duration <= 480 ? 0.5 : null,
    duration: duration,
    onPlayTimeReached: () => {
      if (currentPlayback) {
        console.log('Counting play...');
        apiService.countPlay(currentPlayback?.track.id);
      }
    },
  });

  const playbackSrc = currentPlayback
    ? `http://localhost:3002/api/v1/tracks/stream/${currentPlayback.track.id}`
    : null;

  return (
    <PlaybackContext.Provider
      value={{
        audioRef,
        updateTimeListened,
        reset,
        resetLastTimeUpdate,
        currentPlayback,
        togglePlayback,
        updateCurrentPlayback,
        updatePlaybackState,
        updatePlaybackPosition,
        playbackPosition,
        playbackState,
        playbackSrc,
      }}>
      <>{children}</>
    </PlaybackContext.Provider>
  );
}

export { usePlaybackContext };
