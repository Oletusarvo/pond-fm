import React from "react";
import { FeedProvider, useFeedContext } from "../../../providers/feed-provider";
import { useUpdateStore } from "../hooks/use-update-store";
import { useTrackStore } from "../hooks/use-track";

/**Adds the current feed items into the track-store. */
export function PopulateTrackStore() {
  const postStore = useTrackStore();
  const { data, isPending } = useFeedContext();
  useUpdateStore({ data, isPending, onData: (data) => postStore.setTracks(data) });
  return null;
}
