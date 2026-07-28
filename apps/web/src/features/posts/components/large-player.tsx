import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../../../providers/app-provider';
import { postToPlayback } from '../../../utils/post-to-playback';
import { usePostContext } from '../providers/post-provider';
import { PlayButton } from './play-button';
import SoundCloudWaveform from './waveform';
import { useEventHandler } from '../../../hooks/use-event-handler';

export function LargePlayer() {
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const { playbackService } = useAppContext();
  const { playbackState, togglePlayback, currentPlayback, audioRef } = playbackService;
  const { post } = usePostContext();

  const onWaveformClicked = useCallback(
    (currentTime: number) => {
      playbackService.updateCurrentPlayback(postToPlayback(post));
      playbackService.audioRef.current.currentTime = currentTime;
      playbackService.updatePlaybackPosition(currentTime);
    },
    [playbackService.currentPlayback?.id],
  );

  const onPlayButtonClicked = useCallback(async () => {
    await togglePlayback(postToPlayback(post));
  }, [togglePlayback, postToPlayback]);

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
      <SoundCloudWaveform
        waveform={post.track.waveform}
        duration={post.track.duration}
        playbackPosition={playbackPosition}
        onWaveformClicked={onWaveformClicked}
      />
    </div>
  );
}
