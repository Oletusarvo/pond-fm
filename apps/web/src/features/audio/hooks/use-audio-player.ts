import { useEffect, useRef, useState } from 'react';
import { TPost } from '../../../types/post';

export function useAudioPlayer() {
  const [currentPlayback, setCurrentPlayback] = useState<TPost | null>(null);
  const [playbackState, setPlaybackState] = useState<'playing' | 'paused' | 'buffering'>('paused');
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const updateCurrentPlayback = (post: TPost | null) => {
    setCurrentPlayback(post);
  };

  const updatePlaybackState = (newState: typeof playbackState) => {
    setPlaybackState(newState);
  };

  const updatePlaybackPosition = (pos: number) => {
    setPlaybackPosition(pos);
  };

  const togglePlayback = async (post: TPost) => {
    if (!audioRef.current) return;

    if (currentPlayback?.track.id === post.track.id) {
      //Toggle the playback state of a track if the track.id matches.
      if (audioRef.current.paused) {
        await onPlay();
      } else {
        onPause();
      }
    } else {
      setCurrentPlayback(post);
    }
  };

  const onPlay = async () => {
    if (!audioRef.current) return;
    await audioRef.current.play();
  };

  const onPause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25;
    }
  }, [audioRef.current]);

  //Automatically play tracks when they are selected. Must be done here; the hidden audio-tag must be rendered before play is hit.
  useEffect(() => {
    if (currentPlayback) {
      onPlay();
    }
  }, [currentPlayback?.track.id]);

  return {
    currentPlayback,
    playbackState,
    togglePlayback,
    updateCurrentPlayback,
    updatePlaybackState,
    updatePlaybackPosition,
    playbackPosition,
    audioRef,
  };
}
