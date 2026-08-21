import { useSubmit } from "../../../hooks/use-submit";
import { apiService } from "../../../utils/api/api-service";

export function useUpdateTrack(id: string) {
  const { submit, loading, status } = useSubmit({
    fetchFn: async (payload) => {
      const data = Object.fromEntries(payload);
      return await apiService.updateTrack(id, data);
    }
  });
  return { submit, loading, status };
}