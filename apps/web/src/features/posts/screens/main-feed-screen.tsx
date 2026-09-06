import { Rss } from "lucide-react";

import { PostFeedScreen } from "./feed-screen";
import { api } from "../../../utils/api/api";

export function MainScreenFeed() {
  return (
    <PostFeedScreen
      icon={<Rss />}
      title='New'
      description='Discover the newest tracks to hit the pond.'
      queryFn={async (genres, moods, cursor) =>
        await api.tracks.feed.main(cursor, genres, moods)
      }
      queryKey={["feed", "new"]}
    />
  );
}
