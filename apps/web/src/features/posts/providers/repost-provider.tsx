import { useState } from "react";
import { setupContext } from "../../../utils/setup-context";
import { useStatus } from "../../../hooks/use-status";
import { TTrack } from "@pondfm/app-shared";

const [RepostContext, useRepostContext] = setupContext<{
  repost: () => Promise<void>;
  showRepostModal: () => void;
}>({ name: "TippingContext" });

type RepostProviderProps = React.PropsWithChildren & {
  track: TTrack;
};
/**Provides logic for giving tips for users. @deprecated*/
export function RepostProvider({ children, track }: RepostProviderProps) {
  const { status, setStatus } = useStatus();
  const [showModal, setShowModal] = useState(false);

  const showRepostModal = () => {
    setShowModal(true);
  };

  const repost = async () => {
    setStatus("loading");
  };

  const cancel = () => {
    setStatus("idle");
    setShowModal(false);
  };

  return (
    <RepostContext.Provider value={{ repost, showRepostModal }}>
      {children}
    </RepostContext.Provider>
  );
}

export { useRepostContext };
