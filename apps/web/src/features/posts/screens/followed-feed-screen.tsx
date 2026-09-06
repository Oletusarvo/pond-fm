import { Network } from "lucide-react";
import { PostFeedScreen } from "./feed-screen";
import { api } from "../../../utils/api/api";

export function FollowedFeedScreen() {
  return (
    <PostFeedScreen
      icon={<Network />}
      title='Followed'
      description='Discover the newest tracks by users you follow.'
      queryFn={async (genres, moods, cursor) =>
        await api.tracks.feed.byFollowed(cursor, genres, moods)
      }
      queryKey={["feed", "followed"]}
    />
  );
}
