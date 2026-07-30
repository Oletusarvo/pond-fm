import { usePlaybackContext } from '../providers/playback-provider';
import { useScrobbleContext } from '../providers/scrobble-provider';

export function MiniPlayer() {
  const playbackService = usePlaybackContext();
  const scrobbleService = useScrobbleContext();

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
