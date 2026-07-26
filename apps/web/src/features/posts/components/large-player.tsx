import { useCallback, useMemo } from 'react';
import { useAppContext } from '../../../providers/app-provider';
import { postToPlayback } from '../../../utils/post-to-playback';
import { usePostContext } from '../providers/post-provider';
import { PlayButton } from './play-button';
import SoundCloudWaveform from './waveform';

export function LargePlayer() {
  const { playbackService } = useAppContext();
  const { playbackState, togglePlayback, currentPlayback } = playbackService;
  const { post } = usePostContext();

  const playbackPosition = useMemo(() => {
    return currentPlayback?.id === post.track.id ? playbackService.playbackPosition : null;
  }, [currentPlayback?.id, playbackService.playbackPosition]);

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
