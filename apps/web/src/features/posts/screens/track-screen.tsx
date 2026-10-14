import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Spinner } from "../../../components/spinner";
import { TrackProvider } from "../providers/post-provider";
import { useEffect, useState } from "react";
import { useTrackStore } from "../hooks/use-track";
import { Post } from "../components/post";
import { api } from "../../../utils/api/api";
import { UserProvider, useUserContext } from "../../users/providers/user-proivder";
import { UserHeader } from "../../users/components/user-header";
import { Separator } from "../../../components/separator";

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
  const postStore = useTrackStore();

  useEffect(() => {
    if (!isPending && data) {
      postStore.setTracks([data]);
      setPostPending(false);
    }
  }, [data, isPending, setPostPending]);

  if (isPending || postPending) {
    return <Spinner />;
  }

  return (
    <UserProvider id={data.author.id}>
      <Content trackId={trackId} />
    </UserProvider>
  );
}

function Content({ trackId }) {
  const { isPending: userIdPending } = useUserContext();
  if (userIdPending) return <Spinner />;

  return (
    <div className='flex flex-col w-full gap-2'>
      <UserHeader />

      <TrackProvider trackId={trackId}>
        <Post />
      </TrackProvider>
    </div>
  );
}
