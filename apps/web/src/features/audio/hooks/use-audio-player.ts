import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TPost } from '../../../types/post';
import { TPlayback } from '../../../types/playback';
import { apiService } from '../../../utils/api/api-service';
import { useEventHandler } from '../../../hooks/use-event-handler';
import { useActionContext } from '../../../providers/action-provider';
import { PlaybackReducerState } from '../reducers/playback-reducer';

export function useAudioPlayer() {
  const [currentPlayback, setCurrentPlayback] = useState<PlaybackReducerState | null>(null);
  const [playbackState, setPlaybackState] = useState<'playing' | 'paused' | 'buffering'>('paused');
  const playbackSrc = currentPlayback?.status === 'ready' ? currentPlayback.streamUrl : null;
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const actionService = useActionContext();

  /**Updates the current playback if it is different. */
  const updateCurrentPlayback = (playback: TPlayback | null) => {
    //Request a stream token.
    if (currentPlayback?.id !== playback.id) {
      apiService
        .requestStreamToken(playback.id)
        .then(async (res) => {
          if (!res.ok) {
            throw new Error("Failed to start stream!");
          }

          const data = await res.json();
          setCurrentPlayback({
            ...playback,
            status: 'ready',
            streamUrl: data.streamUrl,
          });
        })
        .catch(err => {
          console.log('Fetching of stream token failed!', err.message);
          setCurrentPlayback({
            ...playback,
            status: 'error',
          });
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

  const stopPlayback = () => {
    audioRef.current?.pause();
  }

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
    if (currentPlayback?.status === 'ready') {
      audioRef.current.currentTime = currentPlayback.start_position || 0;
      onPlay();
    }
  }, [currentPlayback?.id, currentPlayback?.status]);

  useEventHandler({
    service: actionService,
    type: 'like-toggled',
    handler: (e: CustomEvent) => {
      if (e.detail.id !== currentPlayback?.id) return;
      setCurrentPlayback(prev => {
        return {
          ...prev,
          stats: {
            ...prev.stats,
            liked_by_me: e.detail.state
          }
        }
      })
    }
  })

  return {
    currentPlayback,
    playbackState,
    togglePlayback,
    updateCurrentPlayback,
    updatePlaybackState,
    updatePlaybackPosition,
    stopPlayback,
    playbackPosition,
    audioRef,
    playbackSrc,
  };
}
