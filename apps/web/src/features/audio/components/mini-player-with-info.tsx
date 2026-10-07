import { usePlaybackContext } from "../providers/playback-provider";
import { useScrobbleContext } from "../providers/scrobble-provider";
import { Button } from "../../../components/button";
import { Pause, Play, Volume } from "lucide-react";
import { useCallback, useState } from "react";
import { useEventHandler } from "../../../hooks/use-event-handler";
import { TrackProvider } from "../../posts/providers/post-provider";
import { RepostButton } from "../../posts/components/repost-button";
import { LikeButton } from "../../posts/components/like-button";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { createProvider } from "../../../utils/create-provider";
import { usePostActions } from "../../posts/hooks/use-post-actions";
import { useScrobble } from "../hooks/use-scrobble";

const [PlaybackPositionProvider, usePlaybackPositionContext] = createProvider({
  contextName: "PlaybackPositionContext",
  hook: () => {
    const { audioRef, currentPlayback } = usePlaybackContext();
    const [playbackPosition, setPlaybackPosition] = useState(0);
    useEventHandler({
      type: "timeupdate",
      service: audioRef.current,
      handler: (e: any) => {
        setPlaybackPosition(e.currentTarget.currentTime);
      },
    });

    const updatePlaybackPosition = useCallback(
      (pos: number) => {
        setPlaybackPosition(pos);
      },
      [setPlaybackPosition],
    );

    const convertToTimeString = useCallback((n: number) => {
      const totalSeconds = Math.floor(n);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const positionStr = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
      return positionStr;
    }, []);

    return {
      playbackPosition,
      updatePlaybackPosition,
      convertToTimeString,
    };
  },
});

export function MiniPlayerWithInfo() {
  const playbackService = usePlaybackContext();
  const currentTrack = playbackService.currentPlayback?.track;
  const postActions = usePostActions({ trackId: currentTrack?.id });

  const duration = currentTrack?.duration || 1;
  const scrobbleService = useScrobble({
    duration,
    threshold: 15 / duration,
    onPlayTimeReached: () => postActions.countPlay(),
  });
  const authService = useAuthContext();

  return (
    <div className='flex flex-col w-full bg-slate-900 text-white h-pad py-2' id='main-audio-player'>
      <div className='flex w-full justify-between items-center py-2'>
        <div className='flex flex-col gap-0 leading-3'>
          <h3 className='text-green-100 font-semibold text-sm'>{currentTrack?.title}</h3>
          <small>{currentTrack?.author.username}</small>
        </div>
        {currentTrack ? (
          <TrackProvider trackId={currentTrack.id}>
            <div className='flex items-center gap-4'>
              {authService.session?.user.id !== currentTrack.author.id ? <RepostButton /> : null}
              <LikeButton />
            </div>
          </TrackProvider>
        ) : null}
      </div>

      <audio
        className='bg-transparent w-full'
        onPlay={() => playbackService.updatePlaybackState("playing")}
        onPause={() => {
          playbackService.updatePlaybackState("paused");
          scrobbleService.resetLastTimeUpdate();
        }}
        onEnded={() => {
          playbackService.updatePlaybackState("paused");
          playbackService.updateCurrentPlayback(null);
        }}
        onTimeUpdate={(e) => {
          //playbackService.updatePlaybackPosition(e.currentTarget.currentTime);
          scrobbleService.updateTimeListened();
        }}
        onLoadedMetadata={(e) => {
          playbackService.updatePlaybackState("playing");
          scrobbleService.reset();
        }}
        ref={playbackService.audioRef}
        src={playbackService.playbackSrc}
        controls
      />
    </div>
  );
}
function PlayButton() {
  const { playbackState, togglePlayback } = usePlaybackContext();
  const Icon = playbackState === "playing" ? Pause : Play;
  return (
    <Button variant='ghost' shape='circle' onClick={togglePlayback}>
      <Icon fill='white' color='transparent' size='1.5rem' />
    </Button>
  );
}
function PlaybackTrack() {
  const { currentPlayback, updatePlaybackPosition } = usePlaybackContext();
  const currentTrack = currentPlayback?.track;
  const { playbackPosition } = usePlaybackPositionContext();
  const trackWidth = (currentTrack ? playbackPosition / currentTrack.duration : 0) * 100;

  const onTrackClicked = (e: React.MouseEvent<HTMLDivElement>) => {
    const trackRect = e.currentTarget.getBoundingClientRect();

    // Mouse position inside the track
    const mouseXPos = e.clientX - trackRect.left;

    // Clamp between 0 and 1
    const percentage = Math.max(0, Math.min(1, mouseXPos / trackRect.width));
    updatePlaybackPosition(percentage * currentTrack.duration);
  };

  return (
    <div className='h-2 bg-gray-500 w-full cursor-pointer flex-1' onClick={onTrackClicked}>
      <div
        className='h-full bg-primary transition-all duration-100'
        style={{
          width: `${trackWidth}%`,
        }}
      />
    </div>
  );
}

function PlaybackTime() {
  const { currentPlayback } = usePlaybackContext();
  const { playbackPosition, convertToTimeString } = usePlaybackPositionContext();
  return (
    <div className='flex items-center'>
      <span className='text-sm font-mono'>
        {convertToTimeString(playbackPosition)}/
        {convertToTimeString(currentPlayback?.track.duration || 0)}
      </span>
    </div>
  );
}

function CustomAudio() {
  return (
    <div className='flex flex-col w-full'>
      <div className='flex items-center w-full gap-2'>
        <PlayButton />
        <PlaybackPositionProvider>
          <div className='gap-2 w-full flex items-center'>
            <PlaybackTrack />
            <PlaybackTime />
          </div>
        </PlaybackPositionProvider>
      </div>
      <div className='flex items-center w-full gap-2'>
        <Button variant='ghost' disabled shape='circle'>
          <Volume size='1.5rem' fill='white' color='transparent' />
        </Button>
      </div>
    </div>
  );
}
