import { useState } from "react";
import { createProvider } from "../../../utils/create-provider";
import { TrackModal } from "../components/track-modal";

const [UploadProvider, useUploadContext] = createProvider({
  contextName: 'UploadContext',
  hook: () => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const toggleShowUploadModal = (state: boolean) => setShowUploadModal(state);
    return {
      showUploadModal,
      toggleShowUploadModal,
    }
  },
  childComponent: (props) => {
    return props.showUploadModal ? <TrackModal onClose={() => props.toggleShowUploadModal(false)} /> : null;
  }
});

export { UploadProvider, useUploadContext };