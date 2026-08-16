import { useStatus } from "../../../hooks/use-status";
import { apiService } from "../../../utils/api-service"

type UseDeleteTrackProps = {
  onSuccess?: (res: Response) => void;
  onFailure?: (res: Response) => void;
}

export function useDeleteTrack({ onSuccess, onFailure }: UseDeleteTrackProps) {
  const { status, loading, setStatus } = useStatus();
  const deleteTrack = async (id: string) => {
    setStatus('loading')
    const res = await apiService.deleteTrack(id);
    if (!res.ok) {
      setStatus('error');
      onFailure?.(res);
    }
    else {
      setStatus('success');
      onSuccess?.(res);
    }
  }
  return { deleteTrack, status, loading };
}