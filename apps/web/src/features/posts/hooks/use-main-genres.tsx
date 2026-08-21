import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../../utils/api/api-service";

export function useMainGenres() {
    const query = useQuery({
        queryKey: ['main-genres'],
        queryFn: async () => {
            const res = await apiService.getMainGenres();
            return res.ok ? await res.json() : null;
        }
    });
    return query;
}