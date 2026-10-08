import { usePlaybackContext } from "../providers/playback-provider";
import { useCallback, useState } from "react";
import { useEventHandler } from "../../../hooks/use-event-handler";
import { TrackProvider } from "../../posts/providers/post-provider";
import { RepostButton } from "../../posts/components/repost-button";
import { LikeButton } from "../../posts/components/like-button";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { createProvider } from "../../../utils/create-provider";
import { usePostActions } from "../../posts/hooks/use-post-actions";
import { useScrobble } from "../hooks/use-scrobble";
import { usePlaylistStore } from "../hooks/use-playlist-store";

const [PlaybackPositionProvider, usePlaybackPositionContext] = createProvider({
  contextName: "PlaybackPositionContext",
  hook: () => {
    const { audioRef } = usePlaybackContext();
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
  const next = usePlaylistStore((state) => state.next);
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
        onPlay={() => {
          playbackService.updatePlaybackState("playing");
        }}
        onPause={() => {
          playbackService.updatePlaybackState("paused");
          scrobbleService.resetLastTimeUpdate();
        }}
        onEnded={() => {
          const nextTrack = next();

          playbackService.updateCurrentPlayback(nextTrack);
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
