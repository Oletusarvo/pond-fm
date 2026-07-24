import { useClassName } from '../../../hooks/use-class-name';
import { usePlaybackContext } from '../../audio/providers/playback-provider';
import { usePostContext } from '../providers/post-provider';

export function WaveForm() {
  const { currentPlayback } = usePlaybackContext();
  const { post } = usePostContext();
  const isPlaying = post.track.id === currentPlayback?.id;
  const className = useClassName(
    'bg-green-300 rounded-md w-full h-full flex grow items-center px-2 transition-colors duration-500',
    isPlaying ? 'bg-green-300' : 'bg-slate-300',
  );

  return (
    <div className={className}>
      <span>Waveform</span>
    </div>
  );
}
