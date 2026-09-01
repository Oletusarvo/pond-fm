import { useQueryClient } from "@tanstack/react-query";
import { useAction } from "../../../hooks/use-action";
import { apiService } from "../../../utils/api/api-service"
import { usePostStore } from "./use-post";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { TTrackPublic } from "@pondfm/app-shared";

type UseDeleteTrackProps = Omit<Parameters<typeof useAction>[0], 'fn'>;


export function useDeleteTrack(props: UseDeleteTrackProps) {
  const postStore = usePostStore();
  const queryClient = useQueryClient();
  const authService = useAuthContext();
  const { action, loading, status } = useAction({
    ...props,
    fn: async (track: TTrackPublic) => {
      const res = await apiService.deleteTrack(track.id);
      if (res.ok) {
        postStore.deletePost(track.id);
        queryClient.invalidateQueries({ queryKey: ['feed'] });
        const newQuotaConsumed = Number(authService.session.user.subscription.storage_quota_consumed) - Number(track.size);
        await authService.refreshSession({
          user: {
            subscription: {
              storage_quota_consumed: newQuotaConsumed,
            }
          }
        })
      }
      return res;
    },
  });
  return { deleteTrack: action, status, loading };
}