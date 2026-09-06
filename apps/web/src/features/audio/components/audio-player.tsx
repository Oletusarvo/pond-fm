import { useCallback, useState } from 'react';
import { postToPlayback } from '../../../utils/post-to-playback';
import { usePostContext } from '../../posts/providers/post-provider';
import { PlayButton } from '../../posts/components/play-button';
import { Waveform } from '../../posts/components/waveform';
import { useEventHandler } from '../../../hooks/use-event-handler';
import { usePlaybackContext } from '../providers/playback-provider';

export function AudioPlayer() {
  const { playbackState, togglePlayback, currentPlayback, audioRef, updateCurrentPlayback } =
    usePlaybackContext();
  const playbackTrackId = currentPlayback?.track.id;
  const { post } = usePostContext();
  const postTrackId = post?.track.id;
  const [playbackPosition, setPlaybackPosition] = useState(() =>
    currentPlayback?.track.id === post?.track.id ? audioRef.current?.currentTime : 0,
  );

  const onWaveformClicked = useCallback(
    (currentTime: number) => {
      if (playbackTrackId === postTrackId) {
        audioRef.current.currentTime = currentTime;
      } else {
        updateCurrentPlayback({ ...postToPlayback(post), start_position: currentTime });
      }
    },
    [postTrackId, playbackTrackId, updateCurrentPlayback],
  );

  const onPlayButtonClicked = useCallback(async () => {
    if (playbackTrackId === postTrackId) {
      togglePlayback();
    } else {
      updateCurrentPlayback({ ...postToPlayback(post) });
    }
  }, [playbackTrackId, postTrackId, togglePlayback, updateCurrentPlayback]);

  useEventHandler({
    type: 'timeupdate',
    service: audioRef.current,
    handler: (e: any) => {
      if (playbackTrackId === postTrackId) {
        setPlaybackPosition(e.currentTarget.currentTime);
      }
    },
  });

  const playbuttonState = currentPlayback && playbackTrackId === postTrackId ? currentPlayback.status === 'ready' ? playbackState : currentPlayback.status : 'paused';
  return (
    <div className='flex gap-2 w-full h-full items-center'>
      <PlayButton
        state={playbuttonState}
        onClick={onPlayButtonClicked}
      />
      <Waveform
        waveform={post?.track.waveform}
        duration={post?.track.duration}
        playbackPosition={playbackPosition}
        onWaveformClicked={onWaveformClicked}
      />
    </div>
  );
}
