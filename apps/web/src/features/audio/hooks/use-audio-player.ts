import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TPost } from '../../../types/post';
import { TPlayback } from '../../../types/playback';
import { apiService } from '../../../utils/api-service';

export function useAudioPlayer() {
  const [currentPlayback, setCurrentPlayback] = useState<TPlayback | null>(null);
  const playbackSrc = currentPlayback
    ? `http://localhost:3002/api/v1/tracks/${currentPlayback.id}/stream`
    : null;

  const [playbackState, setPlaybackState] = useState<'playing' | 'paused' | 'buffering'>('paused');
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  /**Updates the current playback if it is different. */
  const updateCurrentPlayback = (playback: TPlayback | null) => {
    //Request a stream token.
    if (currentPlayback?.id !== playback.id) {
      apiService
        .requestStreamToken(playback.id)
        .then(() => {
          setCurrentPlayback(playback);
        })
        .catch(err => {
          console.log('Fetching of stream token failed!', err.message);
        });
    }
  };

  const updatePlaybackState = useCallback((newState: typeof playbackState) => {
    setPlaybackState(newState);
  }, []);

  const updatePlaybackPosition = (pos: number) => {
    //setPlaybackPosition(pos);
    audioRef.current.currentTime = pos;
  };

  /**Toggles the state of the current playback. */
  const togglePlayback = async () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      await onPlay();
    } else {
      onPause();
    }
  };

  const onPlay = useCallback(async () => {
    if (!audioRef.current) return;
    await audioRef.current.play();
  }, [audioRef.current]);

  const onPause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  }, [audioRef.current]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25;
    }
  }, [audioRef.current]);

  //Automatically play tracks when they are selected. Must be done here; the hidden audio-tag must be rendered before play is hit.
  useEffect(() => {
    if (currentPlayback) {
      audioRef.current.currentTime = currentPlayback.start_position || 0;
      onPlay();
    }
  }, [currentPlayback?.id]);

  return {
    currentPlayback,
    playbackState,
    togglePlayback,
    updateCurrentPlayback,
    updatePlaybackState,
    updatePlaybackPosition,
    playbackPosition,
    audioRef,
    playbackSrc,
  };
}
