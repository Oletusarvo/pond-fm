import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { apiService } from "../../../utils/api-service";
import { Spinner } from "../../../components/spinner";
import { PostProvider } from "../providers/post-provider";
import { useEffect, useState } from "react";
import { usePostStore } from "../hooks/use-post";
import { Post } from "../components/post";

export function TrackScreen() {
  const { trackId } = useParams();
  const [postPending, setPostPending] = useState(true);
  const { data, isPending } = useQuery({
    queryKey: ['track', trackId],
    queryFn: async () => {
      const res = await apiService.getTrack(trackId);
      return res.ok ? await res.json() : null;
    }
  });
  const postStore = usePostStore();

  useEffect(() => {
    if (!isPending && data) {
      console.log('Ryyppäx')
      postStore.setPosts([data]);
      setPostPending(false);
    }
  }, [data, isPending, setPostPending]);

  if (isPending || postPending) {
    return <Spinner />
  }
  return (
    <PostProvider trackId={data.track.id}>
      <Post />
    </PostProvider>
  );
}