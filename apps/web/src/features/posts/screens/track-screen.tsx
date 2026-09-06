import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Spinner } from "../../../components/spinner";
import { PostProvider } from "../providers/post-provider";
import { useEffect, useState } from "react";
import { usePostStore } from "../hooks/use-post";
import { Post } from "../components/post";
import { api } from "../../../utils/api/api";

export function TrackScreen() {
  const { trackId } = useParams();
  const [postPending, setPostPending] = useState(true);
  const { data, isPending } = useQuery({
    queryKey: ["track", trackId],
    queryFn: async () => {
      const res = await api.tracks.get(trackId);
      return res.success ? res.data : null;
    },
  });
  const postStore = usePostStore();

  useEffect(() => {
    if (!isPending && data) {
      console.log("Ryyppäx");
      postStore.setPosts([data]);
      setPostPending(false);
    }
  }, [data, isPending, setPostPending]);

  if (isPending || postPending) {
    return <Spinner />;
  }
  return (
    <PostProvider trackId={data.track.id}>
      <Post />
    </PostProvider>
  );
}
