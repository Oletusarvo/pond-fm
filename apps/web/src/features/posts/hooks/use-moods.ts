import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../../utils/api-service";

export function useMoods(){
    return useQuery({
        queryKey: ['moods'],
        queryFn: async () => {
            const res  = await apiService.getMoods();
            return res.ok ? await res.json() : null;
        }
    })
}