import { TPost, TTrackPublic } from "@pondfm/app-shared";
import { useSubmit } from "../../../hooks/use-submit";
import { apiService } from "../../../utils/api/api-service";
import { usePostStore } from "./use-post";

type UseUpdateTrackProps = Omit<Parameters<typeof useSubmit>[0], 'fetchFn'> & {
  track: Partial<TTrackPublic>;
};

export function useUpdateTrack({ track, ...props }: UseUpdateTrackProps) {
  const postStore = usePostStore();
  const { submit, loading, status } = useSubmit({
    ...props,
    fetchFn: async (payload) => {
      const fdata = Object.fromEntries(payload) as { title: string };
      const udata = {
        track: {
          ...track,
          ...fdata,
        }
      } as Partial<TPost>;

      const res = await apiService.updateTrack(track.id, udata);
      if (res.ok) {
        console.log(track.moods, track.genre, udata)
        postStore.updatePost(track.id, udata);
        return res;
      }
    }
  });
  return { submit, loading, status };
}