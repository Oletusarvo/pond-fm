import { usePlaybackContext } from '../../audio/providers/playback-provider';

export function MiniPlayer() {
  const {
    audioRef,
    playbackSrc,
    updatePlaybackState,
    resetLastTimeUpdate,
    updateTimeListened,
    reset,
    updatePlaybackPosition,
  } = usePlaybackContext();
  return (
    <audio
      onPlay={() => updatePlaybackState('playing')}
      onPause={() => {
        updatePlaybackState('paused');
        resetLastTimeUpdate();
      }}
      onEnded={() => {
        updatePlaybackState('paused');
      }}
      onLoad={() => updatePlaybackState('buffering')}
      onTimeUpdate={e => {
        updatePlaybackPosition(e.currentTarget.currentTime);
        updateTimeListened();
      }}
      onLoadedMetadata={e => {
        updatePlaybackState('playing');
        reset();
      }}
      ref={audioRef}
      src={playbackSrc}
      controls
    />
  );
}
