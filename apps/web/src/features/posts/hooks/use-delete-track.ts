import { useAction } from "../../../hooks/use-action";
import { apiService } from "../../../utils/api/api-service"

type UseDeleteTrackProps = Omit<Parameters<typeof useAction>[0], 'fn'>;

export function useDeleteTrack(props: UseDeleteTrackProps) {
  const { action, loading, status } = useAction({
    ...props,
    fn: async (id: string) => {
      return await apiService.deleteTrack(id);
    }
  });
  return { deleteTrack: action, status, loading };
}