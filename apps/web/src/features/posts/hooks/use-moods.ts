import { useQuery } from "@tanstack/react-query";
import { api } from "../../../utils/api/api";

export function useMoods() {
  return useQuery({
    queryKey: ["moods"],
    queryFn: async () => {
      const res = await api.tracks.getMoods();
      return res.success ? res.data : null;
    },
  });
}
