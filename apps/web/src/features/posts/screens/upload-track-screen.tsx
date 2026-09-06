import { useNavigate } from "react-router-dom";
import { UploadTrackModal } from "../components/upload-track-modal";

/**@deprecated */
export function UploadTrackScreen() {
  const navigate = useNavigate();
  return <UploadTrackModal />;
}
