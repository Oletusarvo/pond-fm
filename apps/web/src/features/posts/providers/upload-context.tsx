import { useState } from "react";
import { createProvider } from "../../../utils/create-provider";
import { UploadTrackModal } from "../components/upload-track-modal";

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
    return props.showUploadModal ? <UploadTrackModal onClose={() => props.toggleShowUploadModal(false)} /> : null;
  }
});

export { UploadProvider, useUploadContext };