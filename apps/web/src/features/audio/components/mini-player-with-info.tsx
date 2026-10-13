import { usePlaybackContext } from "../providers/playback-provider";
import { useState } from "react";
import { TrackProvider, useTrackContext } from "../../posts/providers/post-provider";
import { RepostButton } from "../../posts/components/repost-button";
import { LikeButton } from "../../posts/components/like-button";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { usePostActions } from "../../posts/hooks/use-post-actions";
import { useScrobble } from "../hooks/use-scrobble";
import { usePlaylistStore } from "../hooks/use-playlist-store";
import { Pause, Play, Repeat, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useReturnToTrack } from "../../posts/hooks/use-return-to-url";

function MobileRepostButton() {
  const { track: post, toggleRepost } = useTrackContext();
  const { status, session } = useAuthContext();
  const onClick = useReturnToTrack({
    id: post.id,
    action: () => toggleRepost(true),
  });

  const disabled =
    status === "authenticated" &&
    (post?.reposted_by_me || session?.user.id === post.canonical_author.id);

  return (
    <button
      type='button'
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      className='flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40'
      aria-label='Repost track'
    >
      <Repeat
        className='h-4 w-4'
        color={post?.reposted_by_me ? "var(--color-blue-500)" : "currentColor"}
      />
    </button>
  );
}

export function MiniPlayerWithInfo() {
  const playbackService = usePlaybackContext();
  const currentTrack = playbackService.currentPlayback?.track;
  const [currentTime, setCurrentTime] = useState(0);
  const postActions = usePostActions({ trackId: currentTrack?.id });
  const next = usePlaylistStore((state) => state.next);
  const previous = usePlaylistStore((state) => state.previous);
  const duration = currentTrack?.duration || 1;
  const scrobbleService = useScrobble({
    duration,
    threshold: 15 / duration,
    onPlayTimeReached: () => postActions.countPlay(),
  });
  const authService = useAuthContext();
  const currentUserIsAuthor =
    !!currentTrack &&
    !!authService.session &&
    (authService.session.user.id === currentTrack.author?.id ||
      authService.session.user.id === currentTrack.canonical_author?.id);

  const isPlaying = playbackService.currentPlayback?.state === "playing";

  const handlePrimaryAction = async () => {
    if (!currentTrack) return;

    if (isPlaying) {
      playbackService.audioRef.current?.pause();
      playbackService.updatePlaybackState("paused");
      return;
    }

    if (playbackService.currentPlayback?.state === "ready") {
      await playbackService.audioRef.current?.play();
      playbackService.updatePlaybackState("playing");
      return;
    }

    if (playbackService.currentPlayback) {
      await playbackService.audioRef.current?.play();
    }
  };

  const handlePrevious = async () => {
    const previousTrack = previous();
    if (previousTrack) {
      await playbackService.updateCurrentPlayback(previousTrack);
    }
  };

  const handleNext = async () => {
    const nextTrack = next();
    if (nextTrack) {
      await playbackService.updateCurrentPlayback(nextTrack);
    }
  };

  const formatTime = (seconds: number) => {
    const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className='border-t border-slate-200 bg-white/90 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm md:px-6'
      id='main-audio-player'
    >
      <div className='mx-auto flex max-w-7xl items-center gap-3'>
        <div className='flex min-w-0 flex-1 items-center gap-3'>
          {currentTrack ? (
            <img
              src={currentTrack.artwork}
              alt={currentTrack.title}
              className='h-12 w-12 rounded-xl border border-slate-200 object-cover shadow-sm md:h-14 md:w-14'
            />
          ) : (
            <div className='flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-500 md:h-14 md:w-14'>
              <Volume2 className='h-5 w-5' />
            </div>
          )}

          <div className='min-w-0 flex-1'>
            <div className='truncate text-sm font-bold text-slate-900 md:text-base'>
              {currentTrack?.title || "No track selected"}
            </div>
            <div className='truncate text-xs text-slate-500'>
              {currentTrack?.author.username || "Select a track to play"}
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2 md:hidden'>
          <button
            type='button'
            onClick={handlePrimaryAction}
            disabled={!currentTrack}
            className='flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-500/25 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40'
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {playbackService.currentPlayback?.state === "buffering" ? (
              <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
            ) : isPlaying ? (
              <Pause className='h-4 w-4 fill-current' />
            ) : (
              <Play className='ml-0.5 h-4 w-4 fill-current' />
            )}
          </button>
        </div>

        <div className='hidden items-center gap-2 md:flex'>
          <button
            type='button'
            onClick={handlePrevious}
            disabled={!currentTrack}
            className='flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40'
            aria-label='Previous track'
          >
            <SkipBack className='h-4 w-4' />
          </button>

          <button
            type='button'
            onClick={handlePrimaryAction}
            disabled={!currentTrack}
            className='flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-500/25 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40'
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {playbackService.currentPlayback?.state === "buffering" ? (
              <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
            ) : isPlaying ? (
              <Pause className='h-5 w-5 fill-current' />
            ) : (
              <Play className='ml-0.5 h-5 w-5 fill-current' />
            )}
          </button>

          <button
            type='button'
            onClick={handleNext}
            disabled={!currentTrack}
            className='flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40'
            aria-label='Next track'
          >
            <SkipForward className='h-4 w-4' />
          </button>
        </div>

        <div className='hidden flex-1 items-center gap-3 md:flex'>
          <span className='text-[11px] font-medium text-slate-500'>{formatTime(currentTime)}</span>
          <input
            type='range'
            min={0}
            max={duration}
            step='any'
            value={Math.min(currentTime, duration)}
            onChange={(e) => {
              const time = e.currentTarget.valueAsNumber;
              playbackService.updatePlaybackPosition(time);
              setCurrentTime(time);
            }}
            disabled={!currentTrack}
            aria-label='Seek track'
            className='h-5 w-full cursor-pointer accent-emerald-600 disabled:cursor-default'
          />
          <span className='text-[11px] font-medium text-slate-500'>
            {formatTime(duration || currentTime)}
          </span>
        </div>

        {currentTrack ? (
          <TrackProvider trackId={currentTrack.id}>
            <div className='flex items-center gap-2'>
              {!currentUserIsAuthor ? <RepostButton /> : null}
              <LikeButton />
            </div>
          </TrackProvider>
        ) : null}
      </div>

      <audio
        className='hidden'
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
          setCurrentTime(e.currentTarget.currentTime || 0);
          scrobbleService.updateTimeListened();
        }}
        onLoadedMetadata={(e) => {
          setCurrentTime(0);
          playbackService.updatePlaybackState("playing");
          scrobbleService.reset();
          e.currentTarget.currentTime = 0;
        }}
        ref={playbackService.audioRef}
        src={playbackService.playbackSrc}
      />
    </div>
  );
}
