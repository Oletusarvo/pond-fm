import { usePlaybackContext } from "../providers/playback-provider";
import { useScrobbleContext } from "../providers/scrobble-provider";
import { Button } from "../../../components/button";
import { Heart } from "lucide-react";
import { useActionContext } from "../../../providers/action-provider";
import { useState } from "react";
import { useEventHandler } from "../../../hooks/use-event-handler";
import { PostProvider } from "../../posts/providers/post-provider";
import { usePost } from "../../posts/hooks/use-post";
import { usePostActions } from "../../posts/hooks/use-post-actions";
import { RepostButton } from "../../posts/components/repost-button";
import { LikeButton } from "../../posts/components/like-button";
import { useAuthContext } from "../../auth/providers/auth-provider";

export function MiniPlayerWithInfo() {
  const playbackService = usePlaybackContext();
  const scrobbleService = useScrobbleContext();
  const authService = useAuthContext();
  return (
    <div className="flex flex-col w-full bg-slate-900 text-white h-pad">
      <div className="flex w-full justify-between items-center py-4">
        <div className="flex flex-col gap-0 leading-1">
          {playbackService.currentPlayback ? <small className="animate-pulse text-green-100">Now playing</small> : <small className="text-green-100">Nothing playing.</small>}
          <h3 className="text-green-100 font-semibold text-lg">{playbackService.currentPlayback?.title}</h3>
          <small>{playbackService?.currentPlayback?.author.username}</small>
        </div>
        {
          playbackService.currentPlayback ? (
            <PostProvider trackId={playbackService.currentPlayback.id}>
              <div className="flex items-center gap-4">
                {
                  authService.session?.user.id !== playbackService.currentPlayback.author.id ? (
                    <RepostButton />
                  ) : null
                }
                <LikeButton />
              </div>
            </PostProvider>
          ) : null
        }

      </div>

      <audio
        className="bg-transparent w-full"
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

function LikeButton2() {
  const playbackService = usePlaybackContext();
  const postId = playbackService.currentPlayback.post_id;

  const { toggleLike } = usePostActions({ trackId: postId });
  const { post } = usePost(postId);

  const likedByMe = post.liked_by_me;
  const fillColor = likedByMe ? 'var(--color-red-500)' : 'transparent';
  const borderColor = likedByMe ? 'transparent' : 'var(--color-red-500)';

  return (
    <Button
      disabled={!playbackService.currentPlayback}
      variant="ghost"
      shape="circle"
      onClick={() => toggleLike()}>
      <Heart fill={fillColor} color={borderColor} />
    </Button>
  );
}