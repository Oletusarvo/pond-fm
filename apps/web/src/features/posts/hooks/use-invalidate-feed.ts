import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function useInvalidateFeeds() {
  const queryClient = useQueryClient();
  return useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["feed"] });
  }, [queryClient]);
}
