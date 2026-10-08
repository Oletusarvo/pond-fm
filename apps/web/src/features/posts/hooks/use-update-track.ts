import { TTrackPublic } from "@pondfm/app-shared";
import { useSubmit } from "../../../hooks/use-submit";
import { useTrackStore } from "./use-track";
import { api } from "../../../utils/api/api";

type UseUpdateTrackProps = Omit<Parameters<typeof useSubmit>[0], "fetchFn"> & {
  track: Partial<TTrackPublic>;
};

export function useUpdateTrack({ track, ...props }: UseUpdateTrackProps) {
  const postStore = useTrackStore();
  const { submit, loading, status } = useSubmit({
    ...props,
    fetchFn: async (payload) => {
      const udata = {
        ...track,
      };

      const res = await api.tracks.update(track.id, udata);
      if (res.success) {
        postStore.updateTrack(track.id, udata);
      }
      return res;
    },
  });
  return { submit, loading, status };
}
