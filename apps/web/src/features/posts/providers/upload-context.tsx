import { useState } from "react";
import { createProvider } from "../../../utils/create-provider";
import { UploadTrackModal } from "../components/upload-track-modal";

const [
  /**@deprecated */
  UploadProvider,
  useUploadContext,
] = createProvider({
  contextName: "UploadContext",
  hook: () => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const toggleShowUploadModal = (state: boolean) => setShowUploadModal(state);
    return {
      showUploadModal,
      toggleShowUploadModal,
    };
  },
  childComponent: (props) => {
    return props.showUploadModal ? <UploadTrackModal /> : null;
  },
});

export {
  /**@deprecated */
  UploadProvider,
  /**@deprecated */
  useUploadContext,
};
