import { useAppContext } from '../../../providers/app-provider';

export function MiniPlayer() {
  const { playbackService, scrobbleService } = useAppContext();
  return (
    <audio
      onPlay={() => playbackService.updatePlaybackState('playing')}
      onPause={() => {
        playbackService.updatePlaybackState('paused');
        scrobbleService.resetLastTimeUpdate();
      }}
      onEnded={() => {
        playbackService.updatePlaybackState('paused');
      }}
      onLoad={() => playbackService.updatePlaybackState('buffering')}
      onTimeUpdate={e => {
        //playbackService.updatePlaybackPosition(e.currentTarget.currentTime);
        scrobbleService.updateTimeListened();
      }}
      onLoadedMetadata={e => {
        playbackService.updatePlaybackState('playing');
        scrobbleService.reset();
      }}
      ref={playbackService.audioRef}
      src={playbackService.playbackSrc}
      controls
    />
  );
}
