import { useQuery } from "@tanstack/react-query";
import { api } from "../../../utils/api/api";

export function usePlayData(interval: "week" | "month" | "year") {
  const { data, isLoading } = useQuery({
    queryKey: ["statistics", interval],
    queryFn: async () => {
      const res = await api.users.getStatistics(interval);
      return res.success ? res.data : [];
    },
  });
  return { data, isLoading };
}
