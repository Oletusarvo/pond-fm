import { Pause, Play } from 'lucide-react';
import { useClassName } from '../../../hooks/use-class-name';
import { usePostContext } from '../providers/post-provider';
import { usePlaybackContext } from '../../audio/providers/playback-provider';

type PlayButtonProps = Pick<React.ComponentProps<'button'>, 'onClick'> & {
  state: ReturnType<typeof usePlaybackContext>['playbackState'];
  size?: 'default' | 'small';
};

export function PlayButton({ onClick, state, size = 'default' }: PlayButtonProps) {
  const className = useClassName(
    state === 'playing' ? 'bg-green-500' : 'bg-primary',
    size === 'small' ? 'p-2' : 'p-3',
    'flex rounded-full aspect-square items-center justify-center active:scale-95 cursor-pointer transform-all duration-100',
  );

  return (
    <button
      className={className}
      onClick={onClick}>
      {state === 'playing' ? (
        <Pause
          color='white'
          size='1.5em'
        />
      ) : (
        <Play
          color='white'
          size='1.5rem'
        />
      )}
    </button>
  );
}
