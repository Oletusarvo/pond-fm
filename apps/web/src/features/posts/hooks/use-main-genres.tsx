import { useQuery } from "@tanstack/react-query";
import { api } from "../../../utils/api/api";
export function useMainGenres() {
  const query = useQuery({
    queryKey: ["main-genres"],
    queryFn: async () => {
      const res = await api.tracks.getMainGenres();
      return res.success ? res.data : null;
    },
  });
  return query;
}
