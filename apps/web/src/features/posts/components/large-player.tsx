import { useCallback, useState } from 'react';
import { postToPlayback } from '../../../utils/post-to-playback';
import { usePostContext } from '../providers/post-provider';
import { PlayButton } from './play-button';
import { Waveform } from './waveform';
import { useEventHandler } from '../../../hooks/use-event-handler';
import { usePlaybackContext } from '../../audio/providers/playback-provider';

export function LargePlayer() {
  const { playbackState, togglePlayback, currentPlayback, audioRef, updateCurrentPlayback } =
    usePlaybackContext();
  const [playbackPosition, setPlaybackPosition] = useState(
    () => audioRef.current?.currentTime || 0,
  );
  const { post } = usePostContext();

  const onWaveformClicked = useCallback(
    (currentTime: number) => {
      if (currentPlayback?.id === post.track.id) {
        audioRef.current.currentTime = currentTime;
      } else {
        updateCurrentPlayback({ ...postToPlayback(post), start_position: currentTime });
      }
    },
    [post.track.id, currentPlayback?.id, updateCurrentPlayback],
  );

  const onPlayButtonClicked = useCallback(async () => {
    if (currentPlayback?.id === post.track.id) {
      togglePlayback();
    } else {
      updateCurrentPlayback({ ...postToPlayback(post) });
    }
  }, [currentPlayback?.id, post.track.id, togglePlayback, updateCurrentPlayback]);

  useEventHandler({
    type: 'timeupdate',
    service: audioRef.current,
    handler: (e: any) => {
      if (currentPlayback?.id === post.track.id) {
        setPlaybackPosition(e.currentTarget.currentTime);
      }
    },
  });

  return (
    <div className='flex gap-2 w-full h-full items-center'>
      <PlayButton
        state={currentPlayback?.id === post.track.id ? playbackState : 'paused'}
        onClick={onPlayButtonClicked}
      />
      <Waveform
        waveform={post.track.waveform}
        duration={post.track.duration}
        playbackPosition={playbackPosition}
        onWaveformClicked={onWaveformClicked}
      />
    </div>
  );
}
