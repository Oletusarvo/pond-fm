import { useAudioPlayer } from '../../audio/hooks/use-audio-player';
import { usePlaybackContext } from '../../audio/providers/playback-provider';
import { usePostContext } from '../providers/post-provider';
import { PlayButton } from './play-button';
import SoundCloudWaveform from './player';
import { WaveForm } from './waveform';

export function PlayerArea() {
  const { togglePlayback, currentPlayback, playbackState } = usePlaybackContext();
  const { post } = usePostContext();
  return (
    <div className='flex gap-2 w-full h-full items-center'>
      <PlayButton
        state={currentPlayback?.track.id === post.track.id ? playbackState : 'paused'}
        onClick={async () => {
          await togglePlayback(post);
        }}
      />
      <SoundCloudWaveform />
    </div>
  );
}
