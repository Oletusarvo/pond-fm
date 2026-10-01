import { useQueryClient } from "@tanstack/react-query";

export function useInvalidateFeeds() {
  const queryClient = useQueryClient();
  return async () => {
    await queryClient.invalidateQueries({ queryKey: ["feed"] });
  };
}
