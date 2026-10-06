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
}>({ name: "TrackContext" });

type TrackProviderProps = React.PropsWithChildren & {
  trackId: string;
};

export function TrackProvider({ children, trackId: id }: TrackProviderProps) {
  const { track: track } = useTrack(id);
  const [showRepostModal, setShowRepostModal] = useState(false);

  const toggleRepost = (state: boolean) => {
    setShowRepostModal(state);
  };

  if (!track) {
    return null;
  }

  return (
    <TrackContext.Provider
      value={{
        track: track,
        toggleRepost,
      }}
    >
      {children}
      {showRepostModal ? <RepostModal /> : null}
    </TrackContext.Provider>
  );
}

export { useTrackContext as useTrackContext };
