import { TPost, TTrackPublic } from "@pondfm/app-shared";
import { useSubmit } from "../../../hooks/use-submit";
import { usePostStore } from "./use-post";
import { api } from "../../../utils/api/api";

type UseUpdateTrackProps = Omit<Parameters<typeof useSubmit>[0], "fetchFn"> & {
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
        },
      } as Partial<TPost>;

      const res = await api.tracks.update(track.id, udata);
      if (res.success) {
        postStore.updatePost(track.id, udata);
      }
      return res;
    },
  });
  return { submit, loading, status };
}
