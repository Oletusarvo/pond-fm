import { useNavigate } from 'react-router-dom';
import { UploadTrackModal } from '../components/upload-track-modal';

export function UploadTrackScreen() {
  const navigate = useNavigate();
  return <UploadTrackModal onClose={() => navigate(-1)} />
}


