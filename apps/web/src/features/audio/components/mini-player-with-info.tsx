import { usePlaybackContext } from "../providers/playback-provider";
import { useScrobbleContext } from "../providers/scrobble-provider";
import { Button } from "../../../components/button";
import { Heart } from "lucide-react";

export function MiniPlayerWithInfo() {
  const playbackService = usePlaybackContext();
  const scrobbleService = useScrobbleContext();

  return (
    <div className="flex flex-col w-full bg-slate-900 text-white">
      <div className="flex w-full justify-between items-center px-2 py-4">
        <div className="flex flex-col gap-0 leading-1">
          {playbackService.currentPlayback ? <small className="animate-pulse text-green-100">Now playing</small> : <small className="text-green-100">Nothing playing.</small>}
          <h3 className="text-green-100 font-semibold text-lg">{playbackService.currentPlayback?.title}</h3>
          <small>{playbackService?.currentPlayback?.author.username}</small>
        </div>
        <LikeButton />
      </div>

      <audio
        className="bg-transparent"
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
    </div>

  )
}

function LikeButton() {
  const playbackService = usePlaybackContext();
  const likedByMe = playbackService.currentPlayback?.stats.liked_by_me;
  const fillColor = likedByMe ? 'var(--color-red-500)' : 'transparent';
  const borderColor = likedByMe ? 'transparent' : 'var(--color-red-500)';

  return (
    <Button variant="ghost" shape="circle">
      <Heart fill={fillColor} color={borderColor} />
    </Button>
  );
}