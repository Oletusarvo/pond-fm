import { useState } from "react";
import { setupContext } from "../../../utils/setup-context";
import { useEventHandler } from "../../../hooks/use-event-handler";
import { useActionContext } from "../../../providers/action-provider";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { useTrack } from "../hooks/use-post";
import { RepostModal } from "../components/repost-modal";
import { TTrackPublic } from "@pondfm/app-shared";

const [TrackContext, useTrackContext] = setupContext<{
  track: TTrackPublic;
  toggleRepost: (state: boolean) => void;
  toggleEdit: (state: boolean) => void;
}>({ name: "TrackContext" });

type TrackProviderProps = React.PropsWithChildren & {
  trackId: string;
};

export function TrackProvider({ children, trackId: id }: TrackProviderProps) {
  const { track: track, updateTrack: updatePost } = useTrack(id);
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
      if (e.detail.id === track?.track.id) {
        updatePost({
          ...track,
          track: {
            ...track?.track,
            stats: {
              ...track?.track.stats,
              play_count: Number(track?.track.stats.play_count + 1),
            },
          },
        });
      }
    },
  });

  if (!track) {
    return null;
  }

  return (
    <TrackContext.Provider
      value={{
        track: track,
        toggleRepost,
        toggleEdit,
      }}
    >
      {children}
      {showRepostModal ? <RepostModal /> : null}
    </TrackContext.Provider>
  );
}

export { useTrackContext as useTrackContext };
