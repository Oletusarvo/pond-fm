import { useState } from "react";
import { setupContext } from "../../../utils/setup-context";
import { useEventHandler } from "../../../hooks/use-event-handler";
import { useActionContext } from "../../../providers/action-provider";
import { UploadTrackModal } from "../components/upload-track-modal";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { usePost } from "../hooks/use-post";
import { RepostModal } from "../components/repost-modal";
import { TPost, TPostPublic } from "@pondfm/app-shared";

const [PostContext, usePostContext] = setupContext<{
  post: TPostPublic;
  toggleRepost: (state: boolean) => void;
  toggleEdit: (state: boolean) => void;
}>({ name: "PostContext" });

type PostProviderProps = React.PropsWithChildren & {
  trackId: string;
};

export function PostProvider({ children, trackId: id }: PostProviderProps) {
  const { post, updatePost } = usePost(id);
  const [showRepostModal, setShowRepostModal] = useState(false);
  const authService = useAuthContext();
  const [showEditModal, setShowEditModal] = useState(false);
  const actionService = useActionContext();

  const toggleRepost = (state: boolean) => {
    setShowRepostModal(state);
  };

  const toggleEdit = (state: boolean) => setShowEditModal(state);

  useEventHandler({
    type: "track-played",
    service: actionService,
    handler: (e: CustomEvent) => {
      if (e.detail.id === post?.track.id) {
        updatePost({
          ...post,
          track: {
            ...post?.track,
            stats: {
              ...post?.track.stats,
              play_count: Number(post?.track.stats.play_count + 1),
            },
          },
        });
      }
    },
  });

  if (!post) {
    return null;
  }

  return (
    <PostContext.Provider value={{ post, toggleRepost, toggleEdit }}>
      {children}
      {showRepostModal ? <RepostModal /> : null}
    </PostContext.Provider>
  );
}

export { usePostContext };
