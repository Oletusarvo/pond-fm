import { useFeedContext } from "../../../providers/feed-provider";
import { useTrackStore } from "./use-track";
import { useUpdateStore } from "./use-update-store";

export function usePopulateTrackFeed() {
  const postStore = useTrackStore();
  const { data, isPending } = useFeedContext();
  useUpdateStore({ data, isPending, onData: (data) => postStore.setTracks(data) });
}
