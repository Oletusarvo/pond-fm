import { useFeedContext } from "../../../providers/feed-provider";
import { useUpdateStore } from "../../posts/hooks/use-update-store";
import { usePlaylistStore } from "./use-playlist-store";

export function usePopulatePlaylistStore() {
  const { data, isPending } = useFeedContext();
  const setPlaylistTracks = usePlaylistStore((state) => state.update);
  useUpdateStore({ data, isPending, onData: (data) => setPlaylistTracks(data) });
}
