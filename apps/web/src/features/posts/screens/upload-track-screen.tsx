import { useNavigate } from 'react-router-dom';
import { TrackModal } from '../components/track-modal';

export function UploadTrackScreen() {
  const navigate = useNavigate();
  return <TrackModal onClose={() => navigate(-1)} />
}


