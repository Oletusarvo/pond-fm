import { useAppContext } from '../../../providers/app-provider';
import { postToPlayback } from '../../../utils/post-to-playback';
import { usePostContext } from '../providers/post-provider';
import { PlayButton } from './play-button';
import SoundCloudWaveform from './player';

export function PlayerArea() {
  const { playbackService } = useAppContext();
  const { playbackState, togglePlayback, currentPlayback } = playbackService;
  const { post } = usePostContext();
  return (
    <div className='flex gap-2 w-full h-full items-center'>
      <PlayButton
        state={currentPlayback?.id === post.track.id ? playbackState : 'paused'}
        onClick={async () => {
          await togglePlayback(postToPlayback(post));
        }}
      />
      <SoundCloudWaveform />
    </div>
  );
}
