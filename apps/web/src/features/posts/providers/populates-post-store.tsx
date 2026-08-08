import React from "react";
import { FeedProvider, useFeedContext } from "../../../providers/feed-provider";
import { useUpdateStore } from "../hooks/use-update-store";
import { usePostStore } from "../hooks/use-post";

export function PopulatePostStore({ children }) {
  const postStore = usePostStore();
  const { data, isPending } = useFeedContext();
  useUpdateStore({ data, isPending, onData: data => postStore.setPosts(data) })
  return children;
}