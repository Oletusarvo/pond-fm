import { usePlaybackContext } from '../../audio/providers/playback-provider';
import { PlayButton } from './play-button';
import { RepostButton } from './repost-button';

export function MiniPlayer() {
  const { currentPlayback, togglePlayback, playbackState } = usePlaybackContext();
  return (
    <div className='w-full py-2 h-pad bg-primary/10 backdrop-blur-sm flex gap-2 items-center'>
      <PlayButton
        size='small'
        state={playbackState}
        onClick={async () => await togglePlayback(currentPlayback)}
      />

      <div className='flex flex-col gap-0'>
        {currentPlayback ? (
          <>
            <h3 className='text-sm font-semibold'>{currentPlayback?.track.author.username}</h3>
            <span className='text-sm leading-3'>{currentPlayback?.track.title}</span>
          </>
        ) : (
          <h3 className='text-sm font-semibold'>No track selected.</h3>
        )}
      </div>
    </div>
  );
}
